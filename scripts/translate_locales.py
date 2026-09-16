#!/usr/bin/env python3
"""
translate_locales.py — Traduz automaticamente locales/pt.json para en.json e es.json

Como funciona:
  1. Le locales/pt.json (idioma fonte)
  2. Le locales/en.json e locales/es.json (idiomas alvo, se existirem)
  3. Para cada chave em pt.json:
     - Se o alvo JA tem a chave com conteudo nao-vazio -> MANTÉM (nao sobrescreve traducao manual)
     - Se o alvo NAO tem a chave ou esta vazia -> traduz automaticamente PT->alvo
  4. Escreve en.json e es.json com 2 espacos de indentacao (mesmo formato do pt.json)

API de traducao:
  Usa MyMemory API (gratuita, sem API key)
  - Limite: ~5000 chars/dia por IP (suficiente para este site)
  - Sem custo, sem cadastro, sem dependencias externas
  - Fallback: se a API falhar, mantém o valor existente ou usa o texto em PT

Uso:
  python3 scripts/translate_locales.py           # traduz tudo que falta
  python3 scripts/translate_locales.py --force    # traduz tudo (sobrescreve manual)
  python3 scripts/translate_locales.py --dry-run  # mostra o que faria sem escrever

No GitHub Actions:
  Roda automaticamente quando locales/pt.json e alterado
  (ver .github/workflows/translate-locales.yml)
"""

import json
import sys
import os
import time
import urllib.request
import urllib.parse
import argparse
import re

# --- Config ---
LOCALES_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'locales')
SOURCE_LANG = 'pt'
TARGET_LANGS = ['en', 'es']

# MyMemory API (gratuita, sem API key)
# Limite de 5000 chars/dia por IP e 500 chars por requisicao
MYMEMORY_URL = 'https://api.mymemory.translated.net/get'


def translate_mymemory(text, source='pt', target='en'):
    """Traduz usando MyMemory API (gratuita, sem API key)."""
    if not text or not text.strip():
        return text
    # Pula textos que sao so simbolos, numeros, URLs ou marcadores
    if re.match(r'^[\s\d\W]+$', text):
        return text
    # MyMemory tem limite de 500 chars por requisicao — trunca se necessario
    # (mas registra aviso)
    if len(text) > 500:
        text = text[:500]

    try:
        params = urllib.parse.urlencode({
            'q': text,
            'langpair': '{}|{}'.format(source, target)
        })
        url = MYMEMORY_URL + '?' + params
        req = urllib.request.Request(url, headers={
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36'
        })
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode('utf-8'))
        if data.get('responseStatus') == 200:
            result = data.get('responseData', {}).get('translatedText', '').strip()
            return result if result else None
        return None
    except Exception as e:
        print('  MyMemory falhou para "{}...": {}'.format(text[:40], e), file=sys.stderr)
        return None


def translate(text, source='pt', target='en'):
    """Traduz texto de source para target usando MyMemory."""
    result = translate_mymemory(text, source, target)
    if result and result.strip():
        return result
    # Se falhou, mantém o texto original (melhor que vazio)
    print('  Ambas as APIs falharam — mantendo texto em PT: "{}..."'.format(text[:40]), file=sys.stderr)
    return text


def load_json(filepath):
    """Carrega JSON com tratamento de erro."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return {}
    except json.JSONDecodeError as e:
        print('  Erro ao ler {}: {}'.format(filepath, e), file=sys.stderr)
        return {}


def save_json(filepath, data):
    """Salva JSON com indentacao de 2 espacos e preserva ordem das chaves."""
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write('\n')


def main():
    parser = argparse.ArgumentParser(description='Traduz pt.json para en.json e es.json automaticamente')
    parser.add_argument('--force', action='store_true', help='Sobrescreve traducoes manuais existentes')
    parser.add_argument('--dry-run', action='store_true', help='Mostra o que faria sem escrever arquivos')
    args = parser.parse_args()

    pt_path = os.path.join(LOCALES_DIR, '{}.json'.format(SOURCE_LANG))
    pt_data = load_json(pt_path)

    if not pt_data:
        print('Nao foi possivel ler {}'.format(pt_path), file=sys.stderr)
        sys.exit(1)

    print('Carregado {} chaves de pt.json'.format(len(pt_data)))

    stats = {}
    for target_lang in TARGET_LANGS:
        target_path = os.path.join(LOCALES_DIR, '{}.json'.format(target_lang))
        target_data = load_json(target_path)

        translated_count = 0
        kept_count = 0
        new_data = {}

        for key in pt_data:
            pt_value = pt_data[key]
            existing = target_data.get(key, '')

            if existing and existing.strip() and not args.force:
                # Ja tem traducao manual — manter
                new_data[key] = existing
                kept_count += 1
            else:
                # Precisa traduzir
                translated = translate(pt_value, SOURCE_LANG, target_lang)
                new_data[key] = translated
                translated_count += 1
                status = 'NEW' if not existing else 'UPD'
                print('  [{}] [{}] {} -> {}'.format(status, target_lang, pt_value[:50], translated[:50]))
                # Rate limit: 1s entre requisicoes (MyMemory tem limite agressivo)
                time.sleep(1)

        # Adicionar chaves que existem no alvo mas nao no PT (extras)
        for key in target_data:
            if key not in new_data:
                new_data[key] = target_data[key]

        stats[target_lang] = {
            'translated': translated_count,
            'kept': kept_count,
            'total': len(new_data)
        }

        if not args.dry_run:
            save_json(target_path, new_data)
            print('{}.json: {} traduzidas, {} mantidas, {} total'.format(
                target_lang, translated_count, kept_count, len(new_data)))
        else:
            print('[DRY-RUN] {}.json: {} seriam traduzidas, {} mantidas'.format(
                target_lang, translated_count, kept_count))

    print('\nResumo:')
    for lang, s in stats.items():
        print('  {}: {} traduzidas, {} mantidas, {} total'.format(
            lang, s['translated'], s['kept'], s['total']))

    if args.dry_run:
        print('\nDry-run: nenhum arquivo foi modificado.')


if __name__ == '__main__':
    main()