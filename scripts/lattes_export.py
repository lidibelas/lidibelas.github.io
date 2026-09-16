#!/usr/bin/env python3
"""
============================================
 scripts/lattes_export.py
 Exporta dados do Currículo Lattes para o site
============================================

 COMO FUNCIONA:
 1. Abre o Lattes no navegador (com Selenium)
 2. Você resolve o CAPTCHA manualmente
 3. O script extrai: formação, atuação, projetos, produções
 4. Gera data/lattes_cache.json
 5. Você faz commit e push — o site atualiza

 PRÉ-REQUISITOS:
 - Python 3.8+
 - Selenium: pip install selenium
 - Chrome ou Firefox instalado

 USO:
     python3 scripts/lattes_export.py

 REGRAS:
 - NUNCA apaga dados existentes se a extração falhar
 - NUNCA publica resultado vazio em caso de erro
 - Mantém cópia local do último cache válido
 - Se o cache já existe e a nova extração falha, o cache antigo é preservado

 ALTERNATIVA SEM SELENIUM:
 Se não tiver Selenium, você pode exportar o Lattes
 manualmente (Download > XML) e rodar:
     python3 scripts/lattes_parse_xml.py arquivo.xml
============================================
"""

import json
import os
import sys
from datetime import datetime

# Config
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(SCRIPT_DIR)
CACHE_FILE = os.path.join(PROJECT_DIR, "data", "lattes_cache.json")
LATTES_ID = "5758630474226047"
LATTES_URL = f"http://lattes.cnpq.br/{LATTES_ID}"


def load_existing_cache():
    """Carrega cache existente. NUNCA apaga."""
    if os.path.exists(CACHE_FILE):
        try:
            with open(CACHE_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"  ⚠ Cache existente corrompido: {e}")
    return None


def save_cache(data):
    """Salva novo cache. Só sobrescreve se os dados forem válidos."""
    if not data or not isinstance(data, dict):
        print("  ✗ Dados inválidos — não salvando cache.")
        return False

    # Validar: nunca salvar cache vazio
    if not any(data.get(k) for k in ["education", "projects", "publications", "trajectory"]):
        print("  ✗ Cache vazio — não salvando (preserva cache anterior).")
        return False

    data["_meta"] = {
        "exported_at": datetime.now().isoformat(),
        "lattes_id": LATTES_ID,
        "source": "lattes_export.py"
    }

    os.makedirs(os.path.dirname(CACHE_FILE), exist_ok=True)
    with open(CACHE_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"  ✓ Cache salvo em {CACHE_FILE}")
    return True


def try_selenium():
    """Tenta extrair via Selenium (requer navegador)."""
    try:
        from selenium import webdriver
        from selenium.webdriver.common.by import By
        from selenium.webdriver.support.ui import WebDriverWait
        from selenium.webdriver.support import expected_conditions as EC
    except ImportError:
        print("\n  Selenium não instalado.")
        print("  Instale com: pip install selenium")
        print("  Ou use a alternativa manual (ver final do script).\n")
        return None

    print(f"\n  Abrindo Lattes: {LATTES_URL}")
    print("  Resolva o CAPTCHA no navegador quando aparecer.")
    print("  O script vai esperar você terminar.\n")

    # Tentar Chrome
    try:
        options = webdriver.ChromeOptions()
        driver = webdriver.Chrome(options=options)
    except Exception:
        try:
            options = webdriver.FirefoxOptions()
            driver = webdriver.Firefox(options=options)
        except Exception as e:
            print(f"  ✗ Não consegui abrir navegador: {e}")
            return None

    try:
        driver.get(LATTES_URL)

        # Esperar o usuário resolver o CAPTCHA
        input("  [ENTER] quando o currículo carregar completamente...")

        data = extract_from_page(driver)
        return data

    finally:
        driver.quit()


def extract_from_page(driver):
    """Extrai dados da página do Lattes já carregada."""
    data = {
        "education": [],
        "trajectory": [],
        "projects": [],
        "publications": []
    }

    try:
        body_text = driver.find_element(By.TAG_NAME, "body").text
    except Exception as e:
        print(f"  ✗ Erro ao ler página: {e}")
        return None

    # --- Formação Acadêmica ---
    # O Lattes tem seções com títulos específicos
    sections = body_text.split("\n")

    # Procurar "Formação Acadêmica/Titulação"
    in_education = False
    for line in sections:
        if "Formação" in line and "Acadêmica" in line:
            in_education = True
            continue
        if in_education and line.strip() == "":
            in_education = False
        if in_education and line.strip():
            data["education"].append(line.strip())

    # Procurar "Atuação Profissional"
    in_prof = False
    for line in sections:
        if "Atuação Profissional" in line:
            in_prof = True
            continue
        if in_prof and "Produção" in line:
            in_prof = False
        if in_prof and line.strip():
            data["trajectory"].append(line.strip())

    # Procurar "Projetos de pesquisa"
    in_proj = False
    for line in sections:
        if "Projetos de pesquisa" in line:
            in_proj = True
            continue
        if in_proj and ("Produção" in line or "Idiomas" in line):
            in_proj = False
        if in_proj and line.strip():
            data["projects"].append(line.strip())

    # Procurar "Produção Bibliográfica"
    in_pub = False
    for line in sections:
        if "Produção Bibliográfica" in line or "Artigos completos" in line:
            in_pub = True
            continue
        if in_pub and ("Produção Técnica" in line or "Eventos" in line):
            in_pub = False
        if in_pub and line.strip():
            data["publications"].append(line.strip())

    return data


def try_xml_import(xml_path):
    """Importa a partir de um arquivo XML exportado do Lattes."""
    import xml.etree.ElementTree as ET

    if not os.path.exists(xml_path):
        print(f"  ✗ Arquivo não encontrado: {xml_path}")
        return None

    try:
        tree = ET.parse(xml_path)
        root = tree.getroot()
    except Exception as e:
        print(f"  ✗ Erro ao ler XML: {e}")
        return None

    data = {
        "education": [],
        "trajectory": [],
        "projects": [],
        "publications": []
    }

    # --- Formação ---
    for form in root.findall(".//DADOS-GERAIS/FORMACAO-ACADEMICA-TITULACAO"):
        for grad in form.findall(".//GRADUACAO"):
            seq = grad.attrib
            entry = {
                "course": seq.get("NOME-CURSO", ""),
                "institution": seq.get("NOME-INSTITUICAO", ""),
                "year_start": seq.get("ANO-DE-INICIO", ""),
                "year_end": seq.get("ANO-DE-CONCLUSAO", ""),
                "status": seq.get("STATUS-DO-CURSO", "")
            }
            data["education"].append(entry)

    # --- Atuação Profissional ---
    for act in root.findall(".//DADOS-GERAIS/ATUACOES-PROFISSIONAIS"):
        for prof in act.findall(".//ATUACAO-PROFISSIONAL"):
            entry = {
                "institution": prof.attrib.get("NOME-INSTITUICAO", ""),
                "year_start": prof.attrib.get("ANO-DE-INICIO", ""),
                "year_end": prof.attrib.get("ANO-DE-FIM", ""),
            }
            data["trajectory"].append(entry)

    # --- Projetos ---
    for proj in root.findall(".//DADOS-GERAIS//PROJETO-DE-PESQUISA"):
        entry = {
            "name": proj.attrib.get("NOME-DO-PROJETO", ""),
            "year_start": proj.attrib.get("ANO-INICIO", ""),
            "year_end": proj.attrib.get("ANO-FIM", ""),
            "situation": proj.attrib.get("SITUACAO", "")
        }
        data["projects"].append(entry)

    # --- Produções ---
    for art in root.findall(".//PRODUCAO-BIBLIOGRAFICA//ARTIGO-PUBLICADO"):
        basic = art.find(".//DADOS-BASICOS-DO-ARTIGO")
        detail = art.find(".//DETALHAMENTO-DO-ARTIGO")
        if basic is not None:
            entry = {
                "title": basic.attrib.get("TITULO-DO-ARTIGO", ""),
                "year": basic.attrib.get("ANO-DO-ARTIGO", ""),
                "venue": detail.attrib.get("TITULO-DO-PERIODICO-OU-REVISTA", "") if detail is not None else "",
                "authors": "",  # autores vêm em outro nó
                "doi": basic.attrib.get("DOI", "") if basic.attrib.get("DOI") else ""
            }
            data["publications"].append(entry)

    return data


def main():
    print("=" * 50)
    print("  Exportador de Dados do Lattes")
    print(f"  ID Lattes: {LATTES_ID}")
    print("=" * 50)

    existing = load_existing_cache()

    if len(sys.argv) > 1:
        # Modo: importar XML
        xml_path = sys.argv[1]
        print(f"\n  Importando XML: {xml_path}")
        data = try_xml_import(xml_path)
    else:
        # Modo: Selenium
        print("\n  Modo automático (Selenium).")
        data = try_selenium()

    if data:
        if save_cache(data):
            print("\n  ✓ Extração concluída com sucesso!")
            print(f"  Cache: {CACHE_FILE}")
            print("\n  Próximo passo:")
            print("  1. Revise data/lattes_cache.json")
            print("  2. git add data/lattes_cache.json")
            print("  3. git commit -m 'atualiza cache Lattes'")
            print("  4. git push origin main")
            return 0
    else:
        print("\n  ✗ Extração falhou.")
        if existing:
            print("  ✓ Cache anterior preservado.")
            print(f"  Última atualização: {existing.get('_meta', {}).get('exported_at', 'desconhecida')}")
        else:
            print("  Nenhum cache anterior existe.")
        print("\n  Alternativa manual:")
        print("  1. Acesse seu Lattes no navegador")
        print("  2. Clique em 'Imprimir Currículo' > 'Exportar XML'")
        print(f"  3. Rode: python3 {sys.argv[0]} arquivo.xml")
        return 1


if __name__ == "__main__":
    sys.exit(main())