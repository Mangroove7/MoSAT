"""
MoSAT - College Board & SAT Question Bank Scraper
Fetches authentic Digital SAT questions directly from College Board's QBank API and formats them for MoSAT.
"""

import urllib.request
import json
import re
import time
import os
import html

BASE_URL = "https://qbank-api.collegeboard.org/msreportingquestionbank-prod/questionbank"
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Content-Type': 'application/json',
    'Origin': 'https://satsuiteeducatorquestionbank.collegeboard.org',
    'Referer': 'https://satsuiteeducatorquestionbank.collegeboard.org/'
}

DOMAIN_NAMES = {
    'INI': 'Information and Ideas',
    'CAS': 'Craft and Structure',
    'EOI': 'Expression of Ideas',
    'SEC': 'Standard English Conventions',
    'H': 'Algebra',
    'P': 'Advanced Math',
    'Q': 'Problem-Solving and Data Analysis',
    'S': 'Geometry and Trigonometry'
}

DIFFICULTY_MAP = {
    'E': 'Easy',
    'M': 'Medium',
    'H': 'Hard'
}

def clean_mathml(text):
    """Clean MathML into readable math or LaTeX notation where applicable."""
    if not text:
        return ""
    # Extract alttext if available
    text = re.sub(r'<math[^>]*alttext="([^"]*)"[^>]*>.*?</math>', r'$\1$', text, flags=re.DOTALL)
    # If any remaining math tags, simplify
    text = re.sub(r'<math[^>]*>(.*?)</math>', r'\1', text, flags=re.DOTALL)
    text = re.sub(r'<mrow>(.*?)</mrow>', r'\1', text, flags=re.DOTALL)
    text = re.sub(r'<mi>(.*?)</mi>', r'\1', text, flags=re.DOTALL)
    text = re.sub(r'<mn>(.*?)</mn>', r'\1', text, flags=re.DOTALL)
    text = re.sub(r'<mo>(.*?)</mo>', r'\1', text, flags=re.DOTALL)
    text = re.sub(r'<msup><mi>([a-zA-Z0-9])</mi><mn>([0-9])</mn></msup>', r'\1^\2', text, flags=re.DOTALL)
    text = re.sub(r'<msup>(.*?)<mn>([0-9])</mn></msup>', r'(\1)^\2', text, flags=re.DOTALL)
    return text

def fetch_question_list(test_id, domain_codes):
    """Fetch question summaries for given test and domains."""
    url = f"{BASE_URL}/digital/get-questions"
    payload = {
        "asmtEventId": 99, # SAT
        "test": test_id,   # 1 = RW, 2 = Math
        "domain": domain_codes
    }
    req = urllib.request.Request(url, headers=HEADERS, data=json.dumps(payload).encode('utf-8'))
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode('utf-8'))

def fetch_question_detail(external_id):
    """Fetch full question detail by external UUID."""
    url = f"{BASE_URL}/digital/get-question"
    payload = {"external_id": external_id}
    req = urllib.request.Request(url, headers=HEADERS, data=json.dumps(payload).encode('utf-8'))
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode('utf-8'))

def scrape_curated_sample(limit_per_domain=5, output_file="scraped_questions.json"):
    """Scrape a balanced dataset across all domains with focus on Medium & Hard questions."""
    print("=" * 60)
    print("Starting MoSAT Question Bank Ingestion...")
    print("=" * 60)
    
    all_questions = []
    
    # 1. Reading & Writing
    rw_domains = [('INI', 'Information and Ideas'), ('CAS', 'Craft and Structure'), 
                  ('EOI', 'Expression of Ideas'), ('SEC', 'Standard English Conventions')]
    print("\n[1/2] Fetching Reading and Writing questions index...")
    rw_list = fetch_question_list(1, "INI,CAS,SEC,EOI")
    print(f"Total Reading & Writing questions available: {len(rw_list)}")
    
    # 2. Math
    math_domains = [('H', 'Algebra'), ('P', 'Advanced Math'), 
                    ('Q', 'Problem-Solving and Data Analysis'), ('S', 'Geometry and Trigonometry')]
    print("\n[2/2] Fetching Math questions index...")
    math_list = fetch_question_list(2, "H,P,Q,S")
    print(f"Total Math questions available: {len(math_list)}")
    
    # Select balanced sample prioritizing Hard ('H') and Medium ('M') for 1500-1600 prep
    selected_summaries = []
    
    for code, d_name in rw_domains:
        domain_items = [q for q in rw_list if q.get('primary_class_cd') == code]
        # Prioritize Hard, then Medium
        sorted_items = sorted(domain_items, key=lambda x: 0 if x.get('difficulty') == 'H' else (1 if x.get('difficulty') == 'M' else 2))
        selected = sorted_items[:limit_per_domain]
        selected_summaries.extend([(s, 'Reading and Writing') for s in selected])
        print(f"  Selected {len(selected)} RW questions for domain: {d_name}")
        
    for code, d_name in math_domains:
        domain_items = [q for q in math_list if q.get('primary_class_cd') == code]
        sorted_items = sorted(domain_items, key=lambda x: 0 if x.get('difficulty') == 'H' else (1 if x.get('difficulty') == 'M' else 2))
        selected = sorted_items[:limit_per_domain]
        selected_summaries.extend([(s, 'Math') for s in selected])
        print(f"  Selected {len(selected)} Math questions for domain: {d_name}")
        
    print(f"\nTotal selected to fetch details: {len(selected_summaries)}")
    
    for i, (summary, section) in enumerate(selected_summaries):
        ext_id = summary.get('external_id') or summary.get('uId')
        qid = summary.get('questionId') or (ext_id[:8] if ext_id else f"q_{i+1}")
        if not ext_id:
            ext_id = qid
        dom_code = summary.get('primary_class_cd', '')
        domain = DOMAIN_NAMES.get(dom_code, summary.get('primary_class_cd_desc', 'Unknown'))
        skill = summary.get('skill_desc', '')
        diff = DIFFICULTY_MAP.get(summary.get('difficulty'), 'Medium')
        score_band = summary.get('score_band_range_cd', 5)
        
        print(f"[{i+1}/{len(selected_summaries)}] Fetching {qid} ({section} - {diff})...")
        try:
            detail = fetch_question_detail(ext_id)
            
            q_type = detail.get('type', 'mcq')
            stem = clean_mathml(detail.get('stem', ''))
            stimulus = clean_mathml(detail.get('stimulus', ''))
            rationale = clean_mathml(detail.get('rationale', ''))
            
            options = []
            letter_map = ['A', 'B', 'C', 'D']
            raw_options = detail.get('answerOptions', [])
            correct_keys = detail.get('keys', [])
            correct_answer = ""
            
            if q_type == 'mcq' and raw_options:
                for idx, opt in enumerate(raw_options):
                    letter = letter_map[idx] if idx < len(letter_map) else str(idx)
                    opt_id = opt.get('id', '')
                    content = clean_mathml(opt.get('content', ''))
                    options.append({
                        'id': opt_id,
                        'letter': letter,
                        'content': content
                    })
                    if opt_id in correct_keys:
                        correct_answer = letter
            elif q_type == 'spr':
                correct_answer = correct_keys[0] if correct_keys else detail.get('correct_answer', [''])[0]
                
            formatted = {
                'id': qid,
                'externalId': ext_id,
                'section': section,
                'domain': domain,
                'domainCode': dom_code,
                'skill': skill,
                'difficulty': diff,
                'scoreBand': score_band,
                'type': q_type,
                'stimulus': stimulus if stimulus else None,
                'stem': stem,
                'options': options if options else None,
                'correctAnswer': correct_answer,
                'rationale': rationale,
            }
            all_questions.append(formatted)
            time.sleep(0.15) # Polite delay
        except Exception as e:
            print(f"  Error fetching {qid}: {e}")
            
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_questions, f, indent=2, ensure_ascii=False)
        
    print("\n" + "=" * 60)
    print(f"Successfully saved {len(all_questions)} questions to {output_file}")
    print("=" * 60)
    return all_questions

if __name__ == '__main__':
    # 8 questions per domain = 64 high quality live questions across RW and Math
    scrape_curated_sample(limit_per_domain=8, output_file="scraped_questions.json")
