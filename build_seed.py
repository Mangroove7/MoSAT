import json
import re

with open("scraped_questions.json", "r", encoding="utf-8") as f:
    scraped = json.load(f)

# Add trapAnalysis and desmosTip to questions based on domain
DESMOS_TIPS = {
    "Linear equations in one variable": "Ketik persamaan langsung ke Desmos! Buat garis vertikal di x = nilai atau gunakan regresi jika mencari konstanta.",
    "Systems of two linear equations in two variables": "Ketik kedua persamaan di baris 1 dan baris 2 Desmos. Titik potong abu-abu (gray dot) langsung menunjukkan nilai (x, y)!",
    "Nonlinear functions": "Masukkan fungsi ke Desmos (contoh f(x) = ax^2 + bx + c). Klik titik puncak (vertex) atau titik potong sumbu-x untuk mendapatkan solusi secara instan.",
    "Equivalent expressions": "Beri nilai variabel sembarang (misal x = 2.5) atau gambar kedua fungsi. Jika grafik berimpit sempurna, ekspresi tersebut ekuivalen!",
    "Circles": "Masukkan persamaan lingkaran ke Desmos. Klik pusat dan titik tepi untuk membaca jari-jari r tanpa perlu melengkapkan kuadrat manual!",
    "Nonlinear equations in one variable and systems of equations in two variables": "Plot kedua kurva di Desmos. Jumlah titik potong = jumlah solusi riil! Klik titik potong untuk membaca nilai x atau y.",
    "Area and volume": "Gunakan formula reference sheet di Desmos. Masukkan variabel sebagai slider untuk memverifikasi rasio perubahan volume/luas.",
    "Right triangles and trigonometry": "Pastikan Desmos dalam mode DEGREE jika sudut dalam derajat. Gunakan sin/cos/tan langsung di keypad Desmos.",
    "Percentages": "Tuliskan persentase sebagai pengali desimal: p% naik = (1 + p/100)*x. Desmos langsung mengevaluasi tanpa risiko salah hitung.",
    "Two-variable data: Models and scatterplots": "Gunakan tabel (tabel x1, y1) lalu masukkan regresi linear: y1 ~ m*x1 + b. Desmos akan menghitung slope m dan intercept b otomatis!"
}

TRAP_ANALYSIS = {
    "Inferences": "Jebakan umum: Pilihan yang melompat terlalu jauh dari data (ekstrapolasi liar) atau mengulang fakta teks tanpa menyimpulkan hal baru.",
    "Words in Context": "Jebakan umum: Memilih arti kamus yang paling umum padahal konteks kalimat menuntut makna figuratif atau sekunder.",
    "Command of Evidence": "Jebakan umum: Data di grafik memang benar secara fakta, tetapi TIDAK mendukung hipotesis spesifik peneliti di teks.",
    "Boundaries": "Jebakan umum: Comma splice (menggabungkan dua independent clause hanya dengan koma tanpa FANBOYS).",
    "Form, Structure, and Sense": "Jebakan umum: Dangling modifier (subjek yang dijelaskan tidak langsung berada setelah koma pembuka).",
    "Transitions": "Jebakan umum: Tertukar antara 'Furthermore/Moreover' (penambahan) dan 'Consequently/Therefore' (sebab-akibat).",
    "Linear equations in one variable": "Jebakan umum: Lupa membagi semua suku atau salah tanda minus saat mendistribusikan tanda kurung.",
    "Systems of two linear equations in two variables": "Jebakan umum: Soal menanyakan nilai 'x + y' atau '2x - y', bukan sekadar 'x'. Jangan berhenti terlalu cepat!"
}

for q in scraped:
    skill = q.get('skill', '')
    domain = q.get('domain', '')
    
    # Assign Desmos tip for Math
    if q.get('section') == 'Math':
        for k, tip in DESMOS_TIPS.items():
            if k.lower() in skill.lower() or k.lower() in domain.lower():
                q['desmosTip'] = tip
                break
        if not q.get('desmosTip'):
            q['desmosTip'] = "Plot fungsi atau persamaan langsung di Desmos untuk melihat perpotongan sumbu dan koordinat kunci."
            
    # Assign Trap analysis
    for k, trap in TRAP_ANALYSIS.items():
        if k.lower() in skill.lower() or k.lower() in domain.lower():
            q['trapAnalysis'] = trap
            break
    if not q.get('trapAnalysis'):
        q['trapAnalysis'] = "Hindari opsi yang terdengar meyakinkan tetapi mengubah relasi logis atau mengabaikan batasan nilai dalam soal."

# Write to TypeScript file
ts_content = f"""import {{ SATQuestion }} from '../types/sat';

export const SEED_QUESTIONS: SATQuestion[] = {json.dumps(scraped, indent=2, ensure_ascii=False)};
"""

import os
os.makedirs("src/data", exist_ok=True)

with open("src/data/questionsSeed.ts", "w", encoding="utf-8") as f:
    f.write(ts_content)

print(f"Generated src/data/questionsSeed.ts with {len(scraped)} questions!")
