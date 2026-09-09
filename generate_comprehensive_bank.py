import json

with open("scraped_questions.json", "r", encoding="utf-8") as f:
    base_questions = json.load(f)

# Comprehensive high-yield questions for 1500-1600 prep
additional_high_yield = [
    # 1. Advanced Math - Equivalent Expressions
    {
        "id": "adv-eq-2",
        "externalId": "sat-am-011",
        "section": "Math",
        "domain": "Advanced Math",
        "domainCode": "P",
        "skill": "Equivalent expressions",
        "difficulty": "Hard",
        "scoreBand": 7,
        "type": "mcq",
        "stimulus": None,
        "stem": "<p style=\"text-align: center;\">$\\frac{2x + 6}{(x + 3)^2} - \\frac{1}{x + 3}$</p><p>Which of the following is equivalent to the expression above for all $x \\neq -3$?</p>",
        "options": [
            { "id": "eq2-a", "letter": "A", "content": "<p>$\\frac{1}{x + 3}$</p>" },
            { "id": "eq2-b", "letter": "B", "content": "<p>$\\frac{x + 3}{(x + 3)^2}$</p>" },
            { "id": "eq2-c", "letter": "C", "content": "<p>$\\frac{2x + 5}{(x + 3)^2}$</p>" },
            { "id": "eq2-d", "letter": "D", "content": "<p>$\\frac{1}{(x + 3)^2}$</p>" }
        ],
        "correctAnswer": "A",
        "rationale": "<p>Choice A is correct. Notice that the numerator of the first fraction can be factored: $2x + 6 = 2(x + 3)$. Thus, $\\frac{2(x + 3)}{(x + 3)^2} = \\frac{2}{x + 3}$. Then we have $\\frac{2}{x + 3} - \\frac{1}{x + 3} = \\frac{2 - 1}{x + 3} = \\frac{1}{x + 3}$.</p>",
        "trapAnalysis": "Jebakan: Langsung menyamakan penyebut tanpa menyederhanakan pecahan pertama, yang sering berujung salah hitung aljabar.",
        "desmosTip": "Uji dengan angka sembarang di Desmos, misal x = 2. Hitung nilai ekspresi awal, lalu hitung nilai tiap opsi. Opsi A menghasilkan nilai desimal yang identik!"
    },
    # 2. Geometry - Area & Volume
    {
        "id": "geom-vol-2",
        "externalId": "sat-gt-012",
        "section": "Math",
        "domain": "Geometry and Trigonometry",
        "domainCode": "S",
        "skill": "Area and volume",
        "difficulty": "Hard",
        "scoreBand": 7,
        "type": "spr",
        "stimulus": None,
        "stem": "<p>Right circular cylinder A has a radius of $r$ and a height of $h$. Right circular cylinder B has a radius of $2r$ and a height of $\\frac{1}{2}h$. If the volume of cylinder A is $45\\pi$, what is the volume of cylinder B, in terms of $\\pi$?</p>",
        "options": None,
        "correctAnswer": "90",
        "rationale": "<p>The volume of cylinder A is $V_A = \\pi r^2 h = 45\\pi$. The volume of cylinder B is $V_B = \\pi (2r)^2 (\\frac{1}{2}h) = \\pi (4r^2)(\\frac{1}{2}h) = 2\\pi r^2 h$. Since $\\pi r^2 h = 45\\pi$, we have $V_B = 2(45\\pi) = 90\\pi$. The question asks for the volume in terms of $\\pi$, so the coefficient is 90.</p>",
        "trapAnalysis": "Lupa mengkuadratkan angka 2 pada (2r)^2! Ingat radius dikuadratkan, sehingga faktor pengali radius menjadi 4, bukan 2.",
        "desmosTip": "Gunakan perbandingan aljabar: V_B / V_A = [ (2)^2 * (0.5) ] / [ 1^2 * 1 ] = 4 * 0.5 = 2. Jadi volume B = 2 * 45 = 90."
    },
    # 3. Reading & Writing - Cross-Text Connections
    {
        "id": "cas-cross-1",
        "externalId": "sat-rw-013",
        "section": "Reading and Writing",
        "domain": "Craft and Structure",
        "domainCode": "CAS",
        "skill": "Cross-Text Connections",
        "difficulty": "Hard",
        "scoreBand": 7,
        "type": "mcq",
        "stimulus": "<p><strong>Text 1</strong><br/>Many evolutionary biologists argue that bioluminescence in deep-sea cephalopods arose primarily as a camouflage strategy known as counterillumination, where downward-directed photophores emit light matching the intensity of downwelling sunlight to conceal the animal from predators below.</p><p><strong>Text 2</strong><br/>Marine biologist Maya Tanaka and colleagues observed that several bathypelagic squid species exhibit rapid, coordinated pulses of photophore emission during courtship encounters in total darkness. Tanaka notes that while counterillumination may explain bioluminescence in mesopelagic zones, it fails to account for photophore diversity in bathypelagic depths where sunlight never penetrates.</p>",
        "stem": "<p>Based on the texts, how would Tanaka (Text 2) most likely respond to the biologists discussed in Text 1?</p>",
        "options": [
            { "id": "cross-a", "letter": "A", "content": "<p>By pointing out that counterillumination cannot be the universal explanation for cephalopod bioluminescence across all ocean depth zones.</p>" },
            { "id": "cross-b", "letter": "B", "content": "<p>By demonstrating that cephalopods use bioluminescence exclusively for intraspecific courtship displays.</p>" },
            { "id": "cross-c", "letter": "C", "content": "<p>By disputing the claim that downwelling sunlight reaches mesopelagic depths.</p>" },
            { "id": "cross-d", "letter": "D", "content": "<p>By arguing that photophores in bathypelagic species are vestigial structures with no active communicative function.</p>" }
        ],
        "correctAnswer": "A",
        "rationale": "<p>Choice A is the best answer. Text 1 presents counterillumination as the primary evolutionary origin. Text 2 points out that while counterillumination may work where downwelling light reaches, it cannot explain bathypelagic species where no sunlight reaches, thus qualifying and limiting the scope of Text 1's claim.</p>",
        "trapAnalysis": "Jebakan: Opsi B menggunakan kata ekstrem 'exclusively' padahal Tanaka mengakui counterillumination mungkin berlaku di zona mesopelagik.",
        "desmosTip": None
    },
    # 4. Standard English Conventions - Form, Structure, and Sense
    {
        "id": "sec-verb-1",
        "externalId": "sat-rw-014",
        "section": "Reading and Writing",
        "domain": "Standard English Conventions",
        "domainCode": "SEC",
        "skill": "Form, Structure, and Sense",
        "difficulty": "Hard",
        "scoreBand": 7,
        "type": "mcq",
        "stimulus": "<p>Neither the lead climatologist nor the computational statisticians analyzing the oceanic sensor network <span aria-hidden=\"true\">______</span> able to explain the anomalous thermal spike observed along the Mid-Atlantic Ridge.</p>",
        "stem": "<p>Which choice completes the text so that it conforms to the conventions of Standard English?</p>",
        "options": [
            { "id": "verb-a", "letter": "A", "content": "<p>was</p>" },
            { "id": "verb-b", "letter": "B", "content": "<p>were</p>" },
            { "id": "verb-c", "letter": "C", "content": "<p>is</p>" },
            { "id": "verb-d", "letter": "D", "content": "<p>has been</p>" }
        ],
        "correctAnswer": "B",
        "rationale": "<p>Choice B is the best answer. In a 'neither... nor...' construction, the verb must agree with the subject closest to it (proximity rule). The subject closest to the blank is 'the computational statisticians,' which is plural. Therefore, the plural past tense verb 'were' is grammatically required.</p>",
        "trapAnalysis": "Aturan Proximity pada 'Neither... nor' dan 'Either... or': Kata kerja harus cocok dengan subjek yang paling dekat dengannya (statisticians = plural -> were).",
        "desmosTip": None
    },
    # 5. Algebra - Linear Functions
    {
        "id": "alg-func-2",
        "externalId": "sat-math-015",
        "section": "Math",
        "domain": "Algebra",
        "domainCode": "H",
        "skill": "Linear functions",
        "difficulty": "Medium",
        "scoreBand": 6,
        "type": "mcq",
        "stimulus": None,
        "stem": "<p>For a linear function $g$, $g(0) = 14$ and $g(4) = 2$. What is the value of $g(-3)$?</p>",
        "options": [
            { "id": "lf-a", "letter": "A", "content": "<p>$5$</p>" },
            { "id": "lf-b", "letter": "B", "content": "<p>$17$</p>" },
            { "id": "lf-c", "letter": "C", "content": "<p>$23$</p>" },
            { "id": "lf-d", "letter": "D", "content": "<p>$-5$</p>" }
        ],
        "correctAnswer": "C",
        "rationale": "<p>Choice C is correct. The y-intercept is $(0, 14)$, so $b = 14$. The slope is $m = \\frac{2 - 14}{4 - 0} = \\frac{-12}{4} = -3$. Thus, $g(x) = -3x + 14$. Evaluating at $x = -3$: $g(-3) = -3(-3) + 14 = 9 + 14 = 23$.</p>",
        "trapAnalysis": "Sering salah tanda minus: -3 * -3 = +9, bukan -9!",
        "desmosTip": "Buat tabel di Desmos: (0, 14), (4, 2). Masukkan y1 ~ mx1 + b. Lalu di baris berikutnya ketik g(x) = mx + b, lalu g(-3). Desmos langsung memberi angka 23!"
    },
    # 6. Problem Solving - Statistics & Margin of Error
    {
        "id": "psda-stat-1",
        "externalId": "sat-math-016",
        "section": "Math",
        "domain": "Problem-Solving and Data Analysis",
        "domainCode": "Q",
        "skill": "Inference from sample statistics and margin of error",
        "difficulty": "Hard",
        "scoreBand": 7,
        "type": "mcq",
        "stimulus": "<p>A random sample of 850 registered voters in a municipality found that 58% supported an urban transit bond proposal, with an associated margin of error of 3.4% at a 95% confidence level.</p>",
        "stem": "<p>Which of the following is the most appropriate conclusion based on the survey results?</p>",
        "options": [
            { "id": "stat-a", "letter": "A", "content": "<p>Exactly 58% of all registered voters in the municipality support the bond proposal.</p>" },
            { "id": "stat-b", "letter": "B", "content": "<p>It is plausible that between 54.6% and 61.4% of all registered voters in the municipality support the bond proposal.</p>" },
            { "id": "stat-c", "letter": "C", "content": "<p>Increasing the sample size to 1,500 would increase the margin of error.</p>" },
            { "id": "stat-d", "letter": "D", "content": "<p>Every voter surveyed had an opinion between 54.6% and 61.4% favorable toward transit bonds.</p>" }
        ],
        "correctAnswer": "B",
        "rationale": "<p>Choice B is correct. The confidence interval is $58\\% \\pm 3.4\\%$, which yields the range $[54.6\\%, 61.4\\%]$. This means it is plausible that the true population proportion lies within this plausible interval.</p>",
        "trapAnalysis": "Di SAT Statistics, kata 'plausible' atau 'likely' adalah indikator kesimpulan statistik yang benar. Hindari kata absolut seperti 'exactly' atau 'proves 100%'.",
        "desmosTip": None
    },
    # 7. Geometry - Special Right Triangles & Trigonometry
    {
        "id": "geom-trig-2",
        "externalId": "sat-gt-017",
        "section": "Math",
        "domain": "Geometry and Trigonometry",
        "domainCode": "S",
        "skill": "Right triangles and trigonometry",
        "difficulty": "Hard",
        "scoreBand": 7,
        "type": "spr",
        "stimulus": None,
        "stem": "<p>In right triangle $ABC$, angle $C$ is the right angle. If $\\cos(A) = \\frac{7}{25}$, what is the value of $\\sin(B)$?</p>",
        "options": None,
        "correctAnswer": "7/25",
        "rationale": "<p>In any right triangle where $C = 90^\\circ$, angles $A$ and $B$ are complementary ($A + B = 90^\\circ$). By the cofunction identity, $\\cos(A) = \\sin(90^\\circ - A) = \\sin(B)$. Since $\\cos(A) = \\frac{7}{25}$, $\\sin(B) = \\frac{7}{25}$ (or 0.28).</p>",
        "trapAnalysis": "Identitas komplementer penting: cos(A) = sin(B) selalu sama pada segitiga siku-siku! Tidak perlu menghitung sisi ketiga atau sudutnya.",
        "desmosTip": "Cofunction identity SAT: cos(A) = sin(90 - A) = sin(B). Langsung salin nilainya: 7/25."
    },
    # 8. Expression of Ideas - Rhetorical Synthesis
    {
        "id": "eoi-rhet-2",
        "externalId": "sat-rw-018",
        "section": "Reading and Writing",
        "domain": "Expression of Ideas",
        "domainCode": "EOI",
        "skill": "Rhetorical Synthesis",
        "difficulty": "Medium",
        "scoreBand": 6,
        "type": "mcq",
        "stimulus": "<p>While researching a topic, a student has taken the following notes:<br/>• Maya Lin is an American architect and sculptor.<br/>• In 1981, as a 21-year-old undergraduate at Yale University, she won a public design competition for the Vietnam Veterans Memorial.<br/>• Her design featured a V-shaped wall of polished black granite inscribed with the names of fallen service members.<br/>• The memorial was dedicated on the National Mall in Washington, D.C., in November 1982.</p>",
        "stem": "<p>The student wants to emphasize when Maya Lin achieved national recognition for her design. Which choice most effectively uses the relevant information from the notes to accomplish this goal?</p>",
        "options": [
            { "id": "ml-a", "letter": "A", "content": "<p>Maya Lin's Vietnam Veterans Memorial consists of a V-shaped wall of polished black granite.</p>" },
            { "id": "ml-b", "letter": "B", "content": "<p>In 1981, while still a 21-year-old undergraduate, Maya Lin gained national prominence by winning the design competition for the Vietnam Veterans Memorial.</p>" },
            { "id": "ml-c", "letter": "C", "content": "<p>The Vietnam Veterans Memorial was dedicated in November 1982 on the National Mall in Washington, D.C.</p>" },
            { "id": "ml-d", "letter": "D", "content": "<p>Architect and sculptor Maya Lin studied at Yale University before designing memorials.</p>" }
        ],
        "correctAnswer": "B",
        "rationale": "<p>Choice B is the best answer because it specifically emphasizes *when* she achieved national recognition ('In 1981, while still a 21-year-old undergraduate').</p>",
        "trapAnalysis": "Fokus pada kata kunci di pertanyaan: 'wants to emphasize WHEN Maya Lin achieved national recognition'. Hanya pilihan B yang menaruh waktu di awal klausa penjelas.",
        "desmosTip": None
    }
]

# Merge all into final bank
final_list = list(base_questions)
seen_ids = set(q['id'] for q in final_list)

for q in additional_high_yield:
    if q['id'] not in seen_ids:
        final_list.append(q)
        seen_ids.add(q['id'])

print(f"Final comprehensive question bank count: {len(final_list)}")

ts_content = f"""import {{ SATQuestion }} from '../types/sat';

export const SEED_QUESTIONS: SATQuestion[] = {json.dumps(final_list, indent=2, ensure_ascii=False)};
"""

with open("src/data/questionsSeed.ts", "w", encoding="utf-8") as f:
    f.write(ts_content)

print("Bank written successfully to src/data/questionsSeed.ts!")
