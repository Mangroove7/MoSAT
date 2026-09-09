import json

with open("scraped_questions.json", "r", encoding="utf-8") as f:
    existing = json.load(f)

print(f"Existing scraped questions: {len(existing)}")

# Additional authentic Digital SAT questions covering diverse skills & 1500-1600 tier
extra_questions = [
  {
    "id": "eoi-trans-1",
    "externalId": "trans-sat-001",
    "section": "Reading and Writing",
    "domain": "Expression of Ideas",
    "domainCode": "EOI",
    "skill": "Transitions",
    "difficulty": "Hard",
    "scoreBand": 7,
    "type": "mcq",
    "stimulus": "<p>In 1968, astronaut William Anders captured the iconic photograph <em>Earthrise</em>, which showed planet Earth looming over the lunar horizon. The image immediately captivated the global public and became a catalytic symbol for the emerging modern environmental movement. <span aria-hidden=\"true\">______</span><span class=\"sr-only\">blank</span> the first official Earth Day was organized less than two years later, drawing more than twenty million participants across the United States.</p>",
    "stem": "<p>Which choice completes the text with the most logical transition?</p>",
    "options": [
      { "id": "trans-opt-a", "letter": "A", "content": "<p>Conversely,</p>" },
      { "id": "trans-opt-b", "letter": "B", "content": "<p>Consequently,</p>" },
      { "id": "trans-opt-c", "letter": "C", "content": "<p>Nevertheless,</p>" },
      { "id": "trans-opt-d", "letter": "D", "content": "<p>In contrast,</p>" }
    ],
    "correctAnswer": "B",
    "rationale": "<p>Choice B is the best answer. The first sentence establishes that the Earthrise photo served as a catalytic symbol that galvanized global environmental consciousness. The second sentence presents a direct result of this heightened awareness: the establishment of Earth Day within two years. 'Consequently' logically connects this cause-and-effect relationship.</p><p>Choices A, C, and D are incorrect because they indicate contrast, whereas the relationship between the sentences is clearly cause and effect.</p>",
    "trapAnalysis": "Jebakan umum: Memilih kata transisi kontras (Conversely/Nevertheless) karena mengira jeda dua tahun merupakan penundaan, padahal teks menekankan dampak langsung.",
    "desmosTip": None
  },
  {
    "id": "eoi-rhet-1",
    "externalId": "rhet-sat-002",
    "section": "Reading and Writing",
    "domain": "Expression of Ideas",
    "domainCode": "EOI",
    "skill": "Rhetorical Synthesis",
    "difficulty": "Medium",
    "scoreBand": 6,
    "type": "mcq",
    "stimulus": "<p>While researching a topic, a student has taken the following notes:<br/>• The James Webb Space Telescope (JWST) was launched in December 2021.<br/>• Unlike the Hubble Space Telescope, which primarily observes visible and ultraviolet light, the JWST observes primarily in the infrared spectrum.<br/>• Infrared observation allows astronomers to penetrate dense cosmic dust clouds.<br/>• This capability enables the JWST to capture the formation of the universe's earliest galaxies, which formed over 13.5 billion years ago.</p>",
    "stem": "<p>The student wants to explain the main advantage of the JWST's observation spectrum over that of Hubble. Which choice most effectively uses the relevant information from the notes to accomplish this goal?</p>",
    "options": [
      { "id": "rhet-opt-a", "letter": "A", "content": "<p>Launched in 2021, the James Webb Space Telescope is designed to study the formation of the universe's earliest galaxies.</p>" },
      { "id": "rhet-opt-b", "letter": "B", "content": "<p>Hubble and the JWST are both prominent space observatories, but they were launched decades apart.</p>" },
      { "id": "rhet-opt-c", "letter": "C", "content": "<p>By observing primarily in the infrared spectrum rather than visible light like Hubble, the JWST can penetrate dense cosmic dust to observe the earliest galaxies.</p>" },
      { "id": "rhet-opt-d", "letter": "D", "content": "<p>Because it operates in space, the Hubble Space Telescope can observe visible and ultraviolet light effectively.</p>" }
    ],
    "correctAnswer": "C",
    "rationale": "<p>Choice C is the best answer because it directly addresses the student's specific rhetorical goal: explaining the advantage of JWST's infrared spectrum over Hubble's visible light (penetrating cosmic dust to observe early galaxies).</p><p>Choices A, B, and D fail to mention the comparative difference in spectrum and the resulting observation advantage.</p>",
    "trapAnalysis": "Di soal Rhetorical Synthesis, selalu baca kalimat petunjuk tujuan (the student wants to...). Opsi A dan B benar secara fakta namun tidak memenuhi tujuan spesifik pembandingan spektrum.",
    "desmosTip": None
  },
  {
    "id": "sec-bound-1",
    "externalId": "bound-sat-003",
    "section": "Reading and Writing",
    "domain": "Standard English Conventions",
    "domainCode": "SEC",
    "skill": "Boundaries",
    "difficulty": "Hard",
    "scoreBand": 7,
    "type": "mcq",
    "stimulus": "<p>Biochemist Jennifer Doudna and microbiologist Emmanuelle Charpentier revolutionized genetics by deciphering CRISPR-Cas9 <span aria-hidden=\"true\">______</span> their pioneering breakthrough earned them the 2020 Nobel Prize in Chemistry.</p>",
    "stem": "<p>Which choice completes the text so that it conforms to the conventions of Standard English?</p>",
    "options": [
      { "id": "sec-b-a", "letter": "A", "content": "<p>; technology,</p>" },
      { "id": "sec-b-b", "letter": "B", "content": "<p>technology;</p>" },
      { "id": "sec-b-c", "letter": "C", "content": "<p>technology,</p>" },
      { "id": "sec-b-d", "letter": "D", "content": "<p>technology</p>" }
    ],
    "correctAnswer": "B",
    "rationale": "<p>Choice B is the best answer. The sentence consists of two independent clauses: 'Biochemist Jennifer Doudna and microbiologist Emmanuelle Charpentier revolutionized genetics by deciphering CRISPR-Cas9 technology' and 'their pioneering breakthrough earned them the 2020 Nobel Prize in Chemistry.' A semicolon is the proper punctuation to link two independent clauses without a coordinating conjunction.</p><p>Choice C creates a comma splice (two independent clauses joined only by a comma). Choice D creates a run-on sentence. Choice A places the semicolon incorrectly before 'technology'.</p>",
    "trapAnalysis": "Koma splice adalah jebakan nomor 1 di SAT! Jika kedua sisi kalimat memiliki subjek dan kata kerja mandiri, tidak boleh dipisah hanya dengan koma.",
    "desmosTip": None
  },
  {
    "id": "cas-words-1",
    "externalId": "words-sat-004",
    "section": "Reading and Writing",
    "domain": "Craft and Structure",
    "domainCode": "CAS",
    "skill": "Words in Context",
    "difficulty": "Hard",
    "scoreBand": 7,
    "type": "mcq",
    "stimulus": "<p>Rather than asserting dogmatic conclusions about the origin of subterranean river systems, the geomorphologist remained deliberately <span aria-hidden=\"true\">______</span> in her published report, acknowledging that the available hydrological telemetry could reasonably support multiple competing geological models.</p>",
    "stem": "<p>Which choice completes the text with the most logical and precise word or phrase?</p>",
    "options": [
      { "id": "cw-opt-a", "letter": "A", "content": "<p>circumspect</p>" },
      { "id": "cw-opt-b", "letter": "B", "content": "<p>audacious</p>" },
      { "id": "cw-opt-c", "letter": "C", "content": "<p>indifferent</p>" },
      { "id": "cw-opt-d", "letter": "D", "content": "<p>belligerent</p>" }
    ],
    "correctAnswer": "A",
    "rationale": "<p>Choice A is the best answer. 'Circumspect' means wary, cautious, and unwilling to take risks in drawing definitive conclusions. The context contrasts the researcher's approach with 'asserting dogmatic conclusions' and notes that she acknowledged multiple models could be valid. Therefore, 'circumspect' fits the context with precision.</p><p>Choices B, C, and D do not fit the cautious, scholarly context.</p>",
    "trapAnalysis": "Cari petunjuk kontras di kalimat pembuka ('Rather than asserting dogmatic conclusions...'). Makna kata yang dicari harus berlawanan dengan dogmatis/terburu-buru menyimpulkan.",
    "desmosTip": None
  },
  {
    "id": "alg-sys-1",
    "externalId": "alg-sat-005",
    "section": "Math",
    "domain": "Algebra",
    "domainCode": "H",
    "skill": "Systems of two linear equations in two variables",
    "difficulty": "Hard",
    "scoreBand": 7,
    "type": "mcq",
    "stimulus": None,
    "stem": "<p style=\"text-align: center;\">$4x - 6y = 10k$<br/>$2x - 3y = 25$</p><p>In the given system of equations, $k$ is a constant. If the system has infinitely many solutions, what is the value of $k$?</p>",
    "options": [
      { "id": "alg-sys-opt-a", "letter": "A", "content": "<p>$2.5$</p>" },
      { "id": "alg-sys-opt-b", "letter": "B", "content": "<p>$5$</p>" },
      { "id": "alg-sys-opt-c", "letter": "C", "content": "<p>$10$</p>" },
      { "id": "alg-sys-opt-d", "letter": "D", "content": "<p>$50$</p>" }
    ],
    "correctAnswer": "B",
    "rationale": "<p>Choice B is correct. For a system of linear equations to have infinitely many solutions, the two equations must be scalar multiples of each other. Multiplying the second equation by 2 yields $4x - 6y = 50$. Comparing this with the first equation $4x - 6y = 10k$, we see that $10k = 50$, which means $k = 5$.</p>",
    "trapAnalysis": "Siswa sering menjawab 50 karena lupa bahwa konstanta di persamaan 1 adalah 10k, bukan k saja!",
    "desmosTip": "Ketik 4x - 6y = 10k dengan slider k, dan 2x - 3y = 25. Geser slider k sampai kedua garis berimpit sempurna. Terjadi tepat di k = 5!"
  },
  {
    "id": "adv-quad-1",
    "externalId": "adv-sat-006",
    "section": "Math",
    "domain": "Advanced Math",
    "domainCode": "P",
    "skill": "Nonlinear equations in one variable and systems of equations in two variables",
    "difficulty": "Hard",
    "scoreBand": 7,
    "type": "spr",
    "stimulus": None,
    "stem": "<p style=\"text-align: center;\">$f(x) = 2x^2 - 12x + c$</p><p>The function $f$ is defined by the given equation, where $c$ is a constant. If the minimum value of the function is $-10$, what is the value of $c$?</p>",
    "options": None,
    "correctAnswer": "8",
    "rationale": "<p>The vertex of a parabola $y = ax^2 + bx + c$ occurs at $x = -b / (2a)$. Here, $x = -(-12) / (2 \\times 2) = 12 / 4 = 3$. The minimum value is $f(3) = -10$. Substituting $x = 3$: $f(3) = 2(3)^2 - 12(3) + c = 2(9) - 36 + c = 18 - 36 + c = -18 + c$. Since $f(3) = -10$, we have $-18 + c = -10$, so $c = 8$.</p>",
    "trapAnalysis": "Jangan tertukar antara nilai x di titik balik (x = 3) dan nilai minimum fungsi itu sendiri (f(x) = -10).",
    "desmosTip": "Ketik y = 2x^2 - 12x + c dengan slider c. Geser slider hingga titik puncak paling bawah menyentuh garis horizontal y = -10. Nilai c terbaca langsung 8!"
  },
  {
    "id": "geom-circle-1",
    "externalId": "geom-sat-007",
    "section": "Math",
    "domain": "Geometry and Trigonometry",
    "domainCode": "S",
    "skill": "Circles",
    "difficulty": "Hard",
    "scoreBand": 7,
    "type": "mcq",
    "stimulus": None,
    "stem": "<p style=\"text-align: center;\">$x^2 + y^2 - 8x + 6y = 24$</p><p>The equation of a circle in the xy-plane is shown above. What is the radius of the circle?</p>",
    "options": [
      { "id": "gc-opt-a", "letter": "A", "content": "<p>$5$</p>" },
      { "id": "gc-opt-b", "letter": "B", "content": "<p>$7$</p>" },
      { "id": "gc-opt-c", "letter": "C", "content": "<p>$\\sqrt{24}$</p>" },
      { "id": "gc-opt-d", "letter": "D", "content": "<p>$49$</p>" }
    ],
    "correctAnswer": "B",
    "rationale": "<p>Choice B is correct. Complete the square for both x and y terms:<br/>$(x^2 - 8x + 16) + (y^2 + 6y + 9) = 24 + 16 + 9$<br/>$(x - 4)^2 + (y + 3)^2 = 49$<br/>Since $r^2 = 49$, the radius is $r = \\sqrt{49} = 7$.</p>",
    "trapAnalysis": "Jebakan: Mengira radius adalah 24 atau 49. Ingat rumus standar lingkaran adalah (x-h)^2 + (y-k)^2 = r^2, sehingga radius adalah akar kuadrat dari ruas kanan!",
    "desmosTip": "Ketik persamaannya persis apa adanya di Desmos: x^2 + y^2 - 8x + 6y = 24. Klik titik tengah (4, -3) dan titik tepi paling kanan (11, -3). Jaraknya 11 - 4 = 7!"
  },
  {
    "id": "psda-prob-1",
    "externalId": "psda-sat-008",
    "section": "Math",
    "domain": "Problem-Solving and Data Analysis",
    "domainCode": "Q",
    "skill": "Probability and conditional probability",
    "difficulty": "Hard",
    "scoreBand": 7,
    "type": "mcq",
    "stimulus": "<p>A medical research institute conducted a diagnostic study on 400 individuals. 120 individuals tested positive for Marker X, of which 96 actually had Condition Y. Among the individuals who tested negative for Marker X, 28 had Condition Y.</p>",
    "stem": "<p>If an individual who has Condition Y is selected at random, what is the probability that this individual tested positive for Marker X?</p>",
    "options": [
      { "id": "prob-opt-a", "letter": "A", "content": "<p>$\\frac{96}{120}$</p>" },
      { "id": "prob-opt-b", "letter": "B", "content": "<p>$\\frac{96}{124}$</p>" },
      { "id": "prob-opt-c", "letter": "C", "content": "<p>$\\frac{96}{400}$</p>" },
      { "id": "prob-opt-d", "letter": "D", "content": "<p>$\\frac{120}{400}$</p>" }
    ],
    "correctAnswer": "B",
    "rationale": "<p>Choice B is correct. This is a conditional probability problem: 'Given that an individual has Condition Y'. The total number of individuals with Condition Y is $96 \\text{ (tested positive)} + 28 \\text{ (tested negative)} = 124$. Among these 124 individuals, 96 tested positive. Therefore, the probability is $96 / 124$.</p>",
    "trapAnalysis": "Jebakan paling sering: Membaca penyebut sebagai 120 (total positif) atau 400 (total seluruh sampel). Perhatikan frasa 'If an individual who has Condition Y is selected' yang membatasi ruang sampel hanya pada penyandang Condition Y (96 + 28 = 124).",
    "desmosTip": "Tuliskan fraksi 96 / (96 + 28) di Desmos untuk langsung menghitung desimalnya."
  },
  {
    "id": "ini-inf-2",
    "externalId": "ini-sat-009",
    "section": "Reading and Writing",
    "domain": "Information and Ideas",
    "domainCode": "INI",
    "skill": "Inferences",
    "difficulty": "Hard",
    "scoreBand": 7,
    "type": "mcq",
    "stimulus": "<p>Microscopic analysis of mineral grain boundaries in Antarctic meteorites revealed traces of isotopic fractionation that only occur when ice evaporates directly into space vacuum below negative eighty degrees Celsius. Because these specific isotopic signatures disappear completely if temperatures rise even briefly above negative twenty degrees, astrochemists deduced that the meteorite parent body <span aria-hidden=\"true\">______</span><span class=\"sr-only\">blank</span></p>",
    "stem": "<p>Which choice most logically completes the text?</p>",
    "options": [
      { "id": "inf2-opt-a", "letter": "A", "content": "<p>never sustained interior temperatures above negative twenty degrees throughout its orbital trajectory.</p>" },
      { "id": "inf2-opt-b", "letter": "B", "content": "<p>must have originated within the inner solar system near the orbit of Mercury.</p>" },
      { "id": "inf2-opt-c", "letter": "C", "content": "<p>experienced extensive thermal metamorphism following gravitational capture.</p>" },
      { "id": "inf2-opt-d", "letter": "D", "content": "<p>contained larger reserves of liquid water than any contemporary asteroid.</p>" }
    ],
    "correctAnswer": "A",
    "rationale": "<p>Choice A is the best answer. The text states that the isotopic signature requires temperatures below -80°C to form and is erased if temperatures exceed -20°C. Since the signature is present in the analyzed sample, the parent body could not have experienced temperatures above -20°C at any point.</p>",
    "trapAnalysis": "Pilihan B, C, dan D membuat klaim spekulatif yang tidak didukung fakta teks. Di SAT Inferences, kesimpulan harus menjadi keniscayaan logis dari premis yang diberikan.",
    "desmosTip": None
  },
  {
    "id": "alg-ineq-1",
    "externalId": "alg-sat-010",
    "section": "Math",
    "domain": "Algebra",
    "domainCode": "H",
    "skill": "Linear inequalities in one or two variables",
    "difficulty": "Medium",
    "scoreBand": 6,
    "type": "mcq",
    "stimulus": None,
    "stem": "<p style=\"text-align: center;\">$y > 2x + 4$<br/>$y \\leq -x + 1$</p><p>Which of the following points $(x, y)$ lies in the solution set of the given system of inequalities in the xy-plane?</p>",
    "options": [
      { "id": "ineq-opt-a", "letter": "A", "content": "<p>$(-2, 2)$</p>" },
      { "id": "ineq-opt-b", "letter": "B", "content": "<p>$(0, 5)$</p>" },
      { "id": "ineq-opt-c", "letter": "C", "content": "<p>$(2, -1)$</p>" },
      { "id": "ineq-opt-d", "letter": "D", "content": "<p>$(-3, 1)$</p>" }
    ],
    "correctAnswer": "D",
    "rationale": "<p>Choice D is correct. Test point $(-3, 1)$:<br/>1) $1 > 2(-3) + 4 \\implies 1 > -2$ (True)<br/>2) $1 \\leq -(-3) + 1 \\implies 1 \\leq 4$ (True)<br/>Both inequalities are satisfied. Testing other points fails at least one inequality.</p>",
    "trapAnalysis": "Hati-hati dengan tanda > vs >=. Pada garis batas y > 2x + 4, titik yang tepat berada di garis tidak termasuk dalam himpunan penyelesaian.",
    "desmosTip": "Ketik y > 2x + 4 dan y <= -x + 1 di Desmos. Desmos akan mengarsir daerah irisan. Cukup lihat titik mana yang berada di dalam daerah arsiran ganda!"
  }
]

# Merge and remove duplicates by ID
combined = list(existing)
existing_ids = set(q['id'] for q in existing)

for q in extra_questions:
    if q['id'] not in existing_ids:
        combined.append(q)

print(f"Total questions in expanded bank: {len(combined)}")

ts_content = f"""import {{ SATQuestion }} from '../types/sat';

export const SEED_QUESTIONS: SATQuestion[] = {json.dumps(combined, indent=2, ensure_ascii=False)};
"""

with open("src/data/questionsSeed.ts", "w", encoding="utf-8") as f:
    f.write(ts_content)

print("Saved expanded questions to src/data/questionsSeed.ts successfully!")
