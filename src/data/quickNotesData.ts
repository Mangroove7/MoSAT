export type CurriculumTier = 'tier1_foundation' | 'tier2_strategies' | 'tier3_elite';

export interface NoteSection {
  id: string;
  category: 'grammar' | 'desmos' | 'strategy' | 'formulas' | 'reading';
  tier: CurriculumTier;
  tierLabel: string;
  targetScoreRange: string;
  title: string;
  badge: string;
  summary: string;
  pedagogicalObjective: string;
  domainFocus: string;
  drillDomain?: string;
  keyTakeaways: string[];
  examples: {
    title: string;
    codeOrText: string;
    explanation: string;
    trapWarning?: string;
  }[];
}

export const QUICK_NOTES: NoteSection[] = [
  // ================= TIER 1: FONDASI KONSEP (1200–1400) =================
  {
    id: 't1-punctuation',
    category: 'grammar',
    tier: 'tier1_foundation',
    tierLabel: 'Tier 1: Fondasi Konsep',
    targetScoreRange: '1200–1400',
    title: 'Hirarki Tanda Baca SAT (Period, Semicolon, Colon, Dash)',
    badge: '100% Diuji',
    summary: 'Aturan mutlak pemisahan klausa independen dan dependen pada Digital SAT.',
    pedagogicalObjective: 'Menguasai pemisahan klausa independen tanpa comma splice atau run-on sentence.',
    domainFocus: 'Standard English Conventions',
    drillDomain: 'Standard English Conventions',
    keyTakeaways: [
      'Titik (.) dan Titik Koma (;) adalah 100% IDENTIK secara gramatikal pada SAT: keduanya memisahkan dua Independent Clause. Jika ada 2 opsi pilihan ganda yang hanya beda titik vs titik koma, eliminasi KEDUANYA!',
      'Comma Splice Dilarang: Jangan pernah menyatukan dua independent clause HANYA dengan koma [Klausa 1, Klausa 2 = SALAH]. Wajib ditambah FANBOYS (for, and, nor, but, or, yet, so) atau ganti jadi semicolon.',
      'Titik Dua (:) dan Dash tunggal (-) mensyaratkan KLAUSA LENGKAP sebelum tanda tersebut. Setelah tanda boleh berupa klausa lengkap, frase, daftar, atau satu kata penjelas.',
      'Sepasang Dash (- ... -) atau Sepasang Koma (, ... ,) berfungsi sebagai non-essential clause (appositive). Jika dihilangkan, sisa kalimat tetap harus utuh secara gramatikal.'
    ],
    examples: [
      {
        title: 'Contoh Titik Dua (Colon)',
        codeOrText: 'BENAR: The researchers arrived at a startling conclusion: microbial diversity in the sediment exceeded prior estimates by 40%.\nSALAH: The researchers arrived at: microbial diversity in the sediment...',
        explanation: 'Sebelum titik dua WAJIB klausa lengkap. Pada contoh salah, "The researchers arrived at" bukan klausa lengkap.',
        trapWarning: 'Jangan pakai titik dua setelah kata kerja "is", "such as", atau "including".'
      }
    ]
  },
  {
    id: 't1-subject-verb',
    category: 'grammar',
    tier: 'tier1_foundation',
    tierLabel: 'Tier 1: Fondasi Konsep',
    targetScoreRange: '1200–1400',
    title: 'Kesesuaian Subjek & Kata Kerja (Subject-Verb Agreement)',
    badge: 'Fondasi Utama',
    summary: 'Menentukan subjek sejati yang sering disamarkan oleh prepositional phrase yang panjang.',
    pedagogicalObjective: 'Mampu mencoret modifier pengganggu untuk mencocokkan subjek singular/plural dengan verb yang tepat.',
    domainFocus: 'Standard English Conventions',
    drillDomain: 'Standard English Conventions',
    keyTakeaways: [
      'Coret Prepositional Phrases: Preposisi (of, in, at, with, by, from, between) tidak pernah berisi subjek kalimat.',
      'Contoh: "The discovery of ancient fossils in the volcanic layers [was / were] confirmed." -> Coret "of ancient fossils" dan "in the volcanic layers". Subjek sejati adalah "discovery" (singular), maka gunakan "was".',
      'Kolektif Noun (team, group, committee, faculty) bernilai SINGULAR di SAT Amerika.',
      'Indefinite Pronouns: each, either, neither, everyone, anybody bernilai SINGULAR.'
    ],
    examples: [
      {
        title: 'Prepositional Phrase Distractor',
        codeOrText: 'The array of solar panels installed along the perimeter of the desert installations [harnesses / harness] clean energy.',
        explanation: 'Subjek = "The array" (singular), bukan "solar panels" atau "installations". Kata kerja yang benar: "harnesses".',
        trapWarning: 'College Board sengaja menaruh kata benda jamak tepat sebelum titik-titik kata kerja.'
      }
    ]
  },
  {
    id: 't1-linear-equations',
    category: 'formulas',
    tier: 'tier1_foundation',
    tierLabel: 'Tier 1: Fondasi Konsep',
    targetScoreRange: '1200–1400',
    title: 'Interpretasi Persamaan Linier (y = mx + b)',
    badge: 'Sering Muncul di Math',
    summary: 'Makna kontekstual gradien m (rate of change) dan intersep-y b (initial value).',
    pedagogicalObjective: 'Menerjemahkan soal cerita pemodelan linier menjadi persamaan tanpa salah menafsirkan konstanta.',
    domainFocus: 'Algebra',
    drillDomain: 'Algebra',
    keyTakeaways: [
      'Gradien m = "rate of change", "per unit", "each", "every", "rate". Perhatikan unit perubahan (apakah per jam, per hari, atau per 5 menit).',
      'Intersep-y b = "initial value", "starting cost", "fixed fee", "deposit", "at time t = 0".',
      'Bentuk Standar Ax + By = C: Gradien = -A/B, Intersep-y = C/B.',
      'Dua Garis Sejajar: m1 = m2. Dua Garis Tegak Lurus: m1 * m2 = -1 (lawan kebalikan).'
    ],
    examples: [
      {
        title: 'Soal Cerita Pemodelan Biaya',
        codeOrText: 'C(h) = 75h + 120\nDi mana C adalah total biaya dan h adalah jam kerja mekanik.',
        explanation: '120 = Biaya tetap awal (fixed inspection fee). 75 = Biaya per jam pengerjaan (hourly rate).',
        trapWarning: 'Waspadai pertanyaan seperti "What is the meaning of 75 in this context?" Jawabannya adalah biaya per satu jam tambahan, bukan total biaya.'
      }
    ]
  },

  // ================= TIER 2: STRATEGI & DESMOS SHORTCUTS (1400–1520) =================
  {
    id: 't2-desmos-regression',
    category: 'desmos',
    tier: 'tier2_strategies',
    tierLabel: 'Tier 2: Strategi Cepat',
    targetScoreRange: '1400–1520',
    title: 'Shortcut Desmos: Regresi Linier & Kuadratik Instan',
    badge: 'Senjata Utama Math',
    summary: 'Mendapatkan fungsi matematika dari tabel data tanpa menghitung manual sama sekali.',
    pedagogicalObjective: 'Menyelesaikan soal penentuan fungsi dari tabel dalam < 20 detik menggunakan regresi Desmos.',
    domainFocus: 'Advanced Math',
    drillDomain: 'Advanced Math',
    keyTakeaways: [
      'Klik tanda (+) di Desmos -> Pilih Table -> Masukkan nilai x1 dan y1 dari soal.',
      'Untuk Persamaan Linier: Ketik `y1 ~ m*x1 + b` di baris berikutnya. Desmos langsung menampilkan nilai m dan b dengan presisi tinggi!',
      'Untuk Persamaan Kuadrat: Ketik `y1 ~ a*x1^2 + b*x1 + c`. Desmos langsung menghitung nilai a, b, dan c.',
      'Untuk Eksponensial: Ketik `y1 ~ a*b^(x1)`.',
      'Tanda tilde (~) di Desmos memberitahu sistem untuk mencari parameter fitting terbaik secara instan.'
    ],
    examples: [
      {
        title: 'Menemukan Nilai f(10) dari 3 Titik',
        codeOrText: 'Tabel: (1, 5), (2, 11), (3, 19)\nDi Desmos: y1 ~ a*x1^2 + b*x1 + c\nHasil: a=1, b=3, c=1\nLalu ketik: f(10) = 1(100) + 3(10) + 1 = 131.',
        explanation: 'Jauh lebih cepat dan 100% bebas dari kesalahan hitung aritmatika aljabar.',
        trapWarning: 'Gunakan x1 dan y1 (dengan angka 1 subskrip), bukan hanya x dan y biasa.'
      }
    ]
  },
  {
    id: 't2-desmos-systems',
    category: 'desmos',
    tier: 'tier2_strategies',
    tierLabel: 'Tier 2: Strategi Cepat',
    targetScoreRange: '1400–1520',
    title: 'Shortcut Desmos: Sistem Persamaan & Titik Singgung (Slider)',
    badge: 'Paling Sering Menghemat Waktu',
    summary: 'Mencari nilai konstanta a/k agar sistem memiliki tepat satu solusi atau tanpa solusi.',
    pedagogicalObjective: 'Memvisualisasikan titik perpotongan grafik dan menggunakan slider parameter tanpa rumus diskriminan panjang.',
    domainFocus: 'Algebra',
    drillDomain: 'Algebra',
    keyTakeaways: [
      'Ketik kedua persamaan langsung di baris 1 dan baris 2 di Desmos.',
      'Jika ada konstanta k atau c, klik "add slider". Geser slider hingga kedua kurva berpotongan pada jumlah titik yang diminta.',
      'Tepat 1 solusi = kurva parabola dan garis hanya bersinggungan di satu titik (tangent).',
      'Tanpa solusi = kurva tidak pernah berpotongan.',
      'Tak hingga solusi = kedua garis bertumpuk tepat di atas satu sama lain.'
    ],
    examples: [
      {
        title: 'Berapa nilai c agar y = -3 dan y = x^2 - 6x + c memiliki tepat satu solusi?',
        codeOrText: 'Ketik baris 1: y = -3\nKetik baris 2: y = x^2 - 6x + c\nUbah slider c sampai titik puncak parabola menyentuh garis y = -3.\nDidapat c = 6.',
        explanation: 'Titik vertex parabola adalah (3, 9 - 18 + c) = (3, c - 9). Agar bernilai -3, maka c - 9 = -3 -> c = 6.',
        trapWarning: 'Klik tepat pada titik abu-abu perpotongan di grafik untuk melihat koordinat pasti.'
      }
    ]
  },
  {
    id: 't2-transitions-logic',
    category: 'grammar',
    tier: 'tier2_strategies',
    tierLabel: 'Tier 2: Strategi Cepat',
    targetScoreRange: '1400–1520',
    title: 'Peta Logika Kata Transisi Digital SAT',
    badge: 'Trik Akurasi 100%',
    summary: 'Langkah eliminasi transisi tanpa terjebak nuansa kata mirip.',
    pedagogicalObjective: 'Menentukan relasi logis antar kalimat sebelum melihat opsi pilihan ganda.',
    domainFocus: 'Expression of Ideas',
    drillDomain: 'Expression of Ideas',
    keyTakeaways: [
      'Golden Rule: Tutup opsi jawaban! Baca kalimat sebelum dan kalimat sesudah. Tentukan hubungannya: Kontras, Sebab-Akibat, Penambahan, atau Contoh.',
      'Kategori Kontras: However, Nevertheless, Nonetheless, By contrast, Still, Yet.',
      'Kategori Sebab-Akibat: Therefore, Thus, Consequently, Hence, Accordingly, As a result.',
      'Kategori Penguatan: Furthermore, Moreover, Additionally, In fact, Indeed.',
      'Trik Eliminasi Ganda: Jika dalam 4 opsi terdapat "Therefore" dan "Thus", KEDUANYA SALAH karena artinya sama persis!'
    ],
    examples: [
      {
        title: 'In fact vs However',
        codeOrText: 'Kalimat 1: Teori lama menduga spesies burung ini telah punah di pulau tersebut.\nKalimat 2: Ekspedisi tahun 2024 menemukan tiga sarang aktif.',
        explanation: 'Hubungan: Bertentangan / Kontras dengan dugaan lama. Pilihan tepat: However / In contrast.',
        trapWarning: 'Jangan pilih transisi hanya karena terdengar luwes saat dibaca. Uji relasi logis murninya.'
      }
    ]
  },

  // ================= TIER 3: 1500–1600 ELITE MASTERY =================
  {
    id: 't3-dangling-modifiers',
    category: 'grammar',
    tier: 'tier3_elite',
    tierLabel: 'Tier 3: Elite Mastery',
    targetScoreRange: '1500–1600',
    title: 'Dangling & Misplaced Modifiers Tingkat Lanjut',
    badge: 'Jebakan Tersulit 1550+',
    summary: 'Soal penentu skor 750–800 RW: subjek logis wajib berada persis setelah klausa pembuka koma.',
    pedagogicalObjective: 'Mengidentifikasi pelaku tindakan sejati pada frase participle pembuka kalimat.',
    domainFocus: 'Standard English Conventions',
    drillDomain: 'Standard English Conventions',
    keyTakeaways: [
      'Rumus Baku: [Introductory Modifier Phrase], [Logical Subject] + [Verb] + [Object].',
      'Siapapun yang melakukan aksi di frase pembuka WAJIB menjadi kata pertama tepat setelah tanda koma!',
      'SALAH: "Having completed the architectural blueprints, the construction began immediately."',
      'BENAR: "Having completed the architectural blueprints, the engineer began the construction immediately."',
      'Alasan: "The construction" tidak bisa menyelesaikan cetak biru, hanya insinyur ("the engineer") yang bisa.'
    ],
    examples: [
      {
        title: 'Passive Voice vs Active Subject',
        codeOrText: 'SALAH: Upon analyzing the deep-sea sediment cores, several anomalous trace elements were identified by the geochemist.\nBENAR: Upon analyzing the deep-sea sediment cores, the geochemist identified several anomalous trace elements.',
        explanation: 'Elemen jejak tidak menganalisis inti sedimen. Ahli geokimia yang melakukannya.',
        trapWarning: 'Bentuk pasif (were identified) adalah jebakan paling sering dipasang College Board pada soal modifier 1500+.'
      }
    ]
  },
  {
    id: 't3-rhetorical-synthesis',
    category: 'strategy',
    tier: 'tier3_elite',
    tierLabel: 'Tier 3: Elite Mastery',
    targetScoreRange: '1500–1600',
    title: 'Strategi 30-Detik Soal Rhetorical Synthesis (Student Notes)',
    badge: 'Hemat Waktu & Skor Penuh',
    summary: 'Jangan baca seluruh catatan peluru! Langsung baca kalimat pertanyaan di akhir paragraf.',
    pedagogicalObjective: 'Menjawab soal catatan siswa dalam 30 detik hanya dengan mencocokkan tujuan instruksi.',
    domainFocus: 'Expression of Ideas',
    drillDomain: 'Expression of Ideas',
    keyTakeaways: [
      'Langkah 1: JANGAN baca catatan bullet point di awal. Itu membuang waktu 45 detik berharga!',
      'Langkah 2: Langsung baca kalimat terakhir: "The student wants to [EMPHASIZE A SIMILARITY / CONTRAST / INTRODUCE THE WORK TO A NEW AUDIENCE]."',
      'Langkah 3: Cari satu-satunya opsi jawaban yang secara gramatikal memenuhi kata kunci instruksi tersebut.',
      'Jika instruksi meminta "emphasize a difference/contrast", cari opsi yang memiliki kata kontras (while, unlike, whereas, but).',
      'Jika instruksi meminta "introduce to an unfamiliar audience", cari opsi yang menyebutkan identitas lengkap (profesi, karya, dan konteks).'
    ],
    examples: [
      {
        title: 'Instruksi: Emphasize a Difference',
        codeOrText: 'Instruksi: "The student wants to emphasize a difference between the two species."\nOpsi A: Both species are found in tropical wetlands.\nOpsi B: While Species X feeds primarily on canopy insects, Species Y relies on ground foraging.',
        explanation: 'Opsi B langsung benar karena memiliki kata pembeda "While" dan membandingkan perilaku keduanya.',
        trapWarning: 'Jangan pilih opsi yang informasinya benar tapi tidak menjawab tujuan spesifik di pertanyaan.'
      }
    ]
  },
  {
    id: 't3-advanced-polynomials',
    category: 'formulas',
    tier: 'tier3_elite',
    tierLabel: 'Tier 3: Elite Mastery',
    targetScoreRange: '1500–1600',
    title: 'Polinomial Lanjutan & Teorema Sisa Faktor (Remainder Theorem)',
    badge: 'Penentu Skor 800 Math',
    summary: 'Hubungan akar, faktor, dan sisa pembagian fungsi suku banyak.',
    pedagogicalObjective: 'Menyelesaikan soal polinomial derajat tinggi dengan substitusi akar atau nilai f(c).',
    domainFocus: 'Advanced Math',
    drillDomain: 'Advanced Math',
    keyTakeaways: [
      'Teorema Sisa: Jika polinomial P(x) dibagi oleh (x - c), maka sisanya adalah persis sama dengan nilai P(c).',
      'Faktor: (x - c) adalah faktor dari P(x) jika dan hanya jika P(c) = 0.',
      'Bentuk Akar Kembar (Multiplicity): Jika grafik menyinggung sumbu-x lalu berbalik (tangent), maka faktornya berpangkat genap (x - c)^2.',
      'Jika grafik memotong sumbu-x (crosses), maka faktornya berpangkat ganjil (x - c)^1 atau (x - c)^3.'
    ],
    examples: [
      {
        title: 'Sisa Pembagian Fungsi P(x)',
        codeOrText: 'P(x) = 2x^3 - 5x^2 + ax - 8. Diketahui (x - 2) adalah faktor dari P(x). Berapakah nilai a?\nJawab: P(2) = 0\n2(8) - 5(4) + 2a - 8 = 0\n16 - 20 + 2a - 8 = 0\n2a - 12 = 0 -> a = 6.',
        explanation: 'Tanpa pembagian bersusun panjang, langsung substitusikan x = 2.',
        trapWarning: 'Perhatikan tanda: jika pembaginya (x + 3), maka nilai yang disubstitusikan adalah x = -3.'
      }
    ]
  }
];
