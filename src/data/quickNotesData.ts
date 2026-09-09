export interface NoteSection {
  id: string;
  category: 'grammar' | 'desmos' | 'strategy' | 'formulas';
  title: string;
  badge: string;
  summary: string;
  keyTakeaways: string[];
  examples: {
    title: string;
    codeOrText: string;
    explanation: string;
    trapWarning?: string;
  }[];
}

export const QUICK_NOTES: NoteSection[] = [
  {
    id: 'grammar-punctuation',
    category: 'grammar',
    title: 'Hirarki Tanda Baca SAT (Period, Semicolon, Colon, Dash)',
    badge: '100% Sering Muncul',
    summary: 'Aturan mutlak pemisahan klausa independen dan dependen pada Digital SAT.',
    keyTakeaways: [
      'Titik (.) dan Titik Koma (;) adalah 100% GRAMATIKAL IDENTIK pada SAT: keduanya memisahkan dua Independent Clause (kalimat lengkap). Jika ada 2 opsi pilihan ganda yang hanya beda titik vs titik koma, eliminasi KEDUANYA!',
      'Comma Splice dilarang: Jangan pernah menyatukan dua independent clause HANYA dengan koma [Klausa 1, Klausa 2 = SALAH]. Harus ditambah FANBOYS (for, and, nor, but, or, yet, so) atau ganti jadi semicolon.',
      'Titik Dua (:) dan Dash tunggal (-) mensyaratkan KLAUSA LENGKAP (Independent Clause) sebelum tanda tersebut. Setelah tanda boleh berupa klausa lengkap, frase, daftar, atau satu kata penjelas.',
      'Sepasang Dash (- ... -) atau Sepasang Koma (, ... ,) berfungsi sebagai non-essential clause / appositive. Jika dihilangkan, sisa kalimat tetap harus utuh secara gramatikal.'
    ],
    examples: [
      {
        title: 'Contoh Titik Dua (:)',
        codeOrText: 'BENAR: The researchers arrived at a startling conclusion: microbial diversity in the sediment exceeded prior estimates by 40%.\nSALAH: The researchers arrived at: microbial diversity in the sediment...',
        explanation: 'Sebelum titik dua WAJIB klausa lengkap. Pada contoh salah, "The researchers arrived at" bukan klausa lengkap.',
        trapWarning: 'Jangan pakai titik dua setelah kata kerja "is", "such as", atau "including".'
      },
      {
        title: 'Contoh Dangling Modifier',
        codeOrText: 'SALAH: Having completed the architectural blueprint, the construction began immediately.\nBENAR: Having completed the architectural blueprint, the engineer began the construction immediately.',
        explanation: 'Siapa yang menyelesaikan cetak biru? "The construction" tidak bisa menyelesaikan cetak biru, harus "the engineer" yang diletakkan tepat setelah koma pembuka.',
        trapWarning: 'Soal Modifier di SAT selalu menguji apakah subjek logis berada persis di samping frase pembuka.'
      }
    ]
  },
  {
    id: 'grammar-transitions',
    category: 'grammar',
    title: 'Peta Kata Transisi Digital SAT (Transitions Guide)',
    badge: 'High Yield',
    summary: 'Cara cepat menentukan transisi kalimat berdasarkan relasi logis antar gagasan.',
    keyTakeaways: [
      'Kontras (Contrast): However, Nevertheless, Nonetheless, In contrast, Conversely, Still, Yet, Despite this.',
      'Sebab-Akibat (Causation): Therefore, Consequently, Thus, Hence, As a result, Accordingly.',
      'Penambahan / Penguatan (Addition/Continuation): Furthermore, Moreover, Additionally, In fact, Indeed, Likewise.',
      'Contoh / Spesifikasi: For instance, For example, Specifically, To illustrate.',
      'Penyederhanaan / Ringkasan: In other words, That is, Ultimately, In sum.',
      'Golden Rule: Baca kalimat SEBELUM dan SESUDAH tanpa melihat opsi. Tentukan hubungannya (apakah berlawanan, sebab-akibat, atau menambah info). Baru cocokkan dengan opsi!'
    ],
    examples: [
      {
        title: 'In fact vs However',
        codeOrText: 'Sentence 1: Many critics expected the revival of the opera to fail financially.\nSentence 2: [Indeed / In fact], opening-weekend ticket sales broke the auditorium’s eighty-year box-office record.',
        explanation: '"Indeed" atau "In fact" digunakan untuk menegaskan fakta ekstrem yang menguatkan kalimat sebelumnya melampaui ekspektasi biasa.',
        trapWarning: 'Hati-hati: Jika Sentence 1 adalah keraguan dan Sentence 2 adalah kesuksesan mutlak, itu bisa berupa kontras ("However") jika fokusnya menyanggah, atau "In fact" jika mempertegas kontras situasi.'
      }
    ]
  },
  {
    id: 'desmos-regression',
    category: 'desmos',
    title: 'Desmos Hack 1: Regresi Linear & Kuadratik (~)',
    badge: 'Desmos Shortcut',
    summary: 'Selesaikan soal tabel, titik koordinat, model eksponensial/kuadratik dalam 15 detik!',
    keyTakeaways: [
      'Gunakan tombol (+) lalu pilih "Table". Masukkan nilai x di kolom x1 dan nilai y di kolom y1.',
      'Untuk mencari fungsi linear: ketik `y1 ~ m x1 + b` (simbol tilde ~ didapat dengan Shift + `). Desmos akan langsung menampilkan nilai m dan b dengan akurasi 100%!',
      'Untuk mencari fungsi kuadratik: ketik `y1 ~ a x1^2 + b x1 + c` atau vertex form `y1 ~ a (x1 - h)^2 + k`.',
      'Untuk model eksponensial: ketik `y1 ~ a * b^x1`.',
      'Jika mencari konstanta k dari persamaan f(x) yang melalui (p, q), masukkan titiknya ke tabel atau gunakan slider!'
    ],
    examples: [
      {
        title: 'Mencari persamaan garis dari 2 titik (3, 7) dan (8, 22)',
        codeOrText: 'Baris 1: Buat tabel x1=[3, 8], y1=[7, 22]\nBaris 2: y1 ~ m*x1 + b\nHasil Desmos: m = 3, b = -2  =>  y = 3x - 2',
        explanation: 'Tidak perlu menghitung slope (y2-y1)/(x2-x1) secara manual. Desmos langsung mengekstrak parameter m dan b!',
        trapWarning: 'Pastikan nama variabel konsisten: jika di tabel x1 dan y1, rumusnya wajib x1 dan y1 (bukan x dan y biasa).'
      }
    ]
  },
  {
    id: 'desmos-systems',
    category: 'desmos',
    title: 'Desmos Hack 2: Titik Potong Sistem Persamaan & Akar',
    badge: 'Desmos Shortcut',
    summary: 'Cari solusi sistem persamaan (linear, lingkaran, parabola) tanpa substitusi atau eliminasi aljabar.',
    keyTakeaways: [
      'Ketik persamaan 1 persis seperti di lembar soal: misal `3x - 4y = 12`.',
      'Ketik persamaan 2: misal `y = 2x^2 - 5x + 1`.',
      'Desmos otomatis merender kurva. Klik titik temu (gray dot) antara kedua kurva untuk membaca koordinat (x, y).',
      'Jika soal menanyakan "berapa banyak solusi riil?": Hitung jumlah titik potong kurva. 0 titik = no solution, 1 titik (singgung) = exactly one solution, 2 titik = two solutions.',
      'Jika soal memiliki konstanta k tak diketahui dan berkata "has exactly one solution": Ketik persamaannya dengan k, tambahkan slider k, lalu geser hingga kurva saling menyinggung (tangent)!'
    ],
    examples: [
      {
        title: 'Mencari nilai x pada perpotongan garis dan parabola',
        codeOrText: 'Line 1: y = -1.5\nLine 2: y = x^2 + 8x + a\nSlider a: Geser a sampai vertex parabola menyentuh y = -1.5\nHasil: a = 14.5',
        explanation: 'Parabola y = x^2 + 8x + a memiliki titik balik di x = -b/(2a) = -4. Nilai y di vertex = (-4)^2 + 8(-4) + a = -16 + a. Agar y = -1.5, maka -16 + a = -1.5 -> a = 14.5.',
        trapWarning: 'Periksa apakah pertanyaan menanyakan nilai x, nilai y, atau nilai x + y!'
      }
    ]
  },
  {
    id: 'sat-pacing-strategy',
    category: 'strategy',
    title: 'Pacing & Strategi 1500–1600 (Pembeda 1450 vs 1550+)',
    badge: 'Target 1600',
    summary: 'Manajemen waktu dan psikologi eliminasi soal jebakan di Digital SAT.',
    keyTakeaways: [
      'Alokasi Waktu Reading and Writing: 32 menit untuk 27 soal = 1 menit 11 detik per soal. Mulai dengan Standard English Conventions & Transitions lebih dulu (soal nomor 15-27) yang bisa dikerjakan dalam < 40 detik, simpan waktu untuk Information & Ideas (grafik/inferences panjang)!',
      'Alokasi Waktu Math: 35 menit untuk 22 soal = 1 menit 35 detik per soal. 10 soal pertama harus selesai dalam 10 menit menggunakan Desmos, sisakan 15 menit untuk 5 soal tersulit di akhir modul 2!',
      'Strategi Module 1: Modul 1 WAJIB akurasi > 85% untuk membuka modul 2 HARD path. Jika terlempar ke easy path di modul 2, skor Math/RW dibatasi maksimal ~600-650!',
      'Eliminasi Jawaban Jebakan: Di SAT Reading, jawaban benar adalah yang 100% didukung langsung oleh teks tanpa asumsi tambahan. Jika 90% kata benar tetapi ada 1 kata ekstrem ("always", "proves definitively", "unprecedented"), OPSI ITU SALAH!',
      'Mentalitas Hard Module: Soal di modul 2 Hard akan terlihat rumit dan sengaja dibuat untuk membuat siswa panik. Tarik napas, pecah kalimat menjadi premis matematis atau klausa sederhana.'
    ],
    examples: [
      {
        title: 'Teknik Two-Pass System di Math',
        codeOrText: 'Pass 1 (Menit 0 - 20): Kerjakan semua soal yang langsung bisa diselesaikan atau diplot di Desmos. Jika soal butuh berpikir > 60 detik, beri bendera (Flag) dan langsung lewati!\nPass 2 (Menit 20 - 35): Buka Review screen, fokus ke 4-5 soal berbendera dengan kepala dingin.',
        explanation: 'Tidak ada penalti nilai minus di SAT. Jangan pernah menghabiskan 4 menit di satu soal sehingga kehabisan waktu di 3 soal mudah lainnya!',
        trapWarning: 'Jangan lupa mengisi semua jawaban sebelum waktu habis, tebak berpendidikan selalu lebih baik daripada kosong.'
      }
    ]
  },
  {
    id: 'math-formulas-sheet',
    category: 'formulas',
    title: 'Formula Kunci SAT Math (Reference Sheet & Extra)',
    badge: 'Wajib Hafal',
    summary: 'Rumus geometri resmi College Board dan rumus ekstra yang sering diujikan.',
    keyTakeaways: [
      'Lingkaran: Keliling C = 2πr, Luas A = πr^2. Persamaan Lingkaran: (x - h)^2 + (y - k)^2 = r^2 dengan pusat (h, k) dan radius r.',
      'Persamaan Kuadrat: Sumbu simetri x = -b / (2a). Jumlah akar x1 + x2 = -b / a. Perkalian akar x1 * x2 = c / a. Diskriminan D = b^2 - 4ac (D > 0: 2 solusi riil, D = 0: 1 solusi riil, D < 0: 0 solusi riil / 2 imajiner).',
      'Segitiga Khusus 30°-60°-90°: Sisi di depan 30° = x, depan 60° = x√3, hipotenusa = 2x.',
      'Segitiga Khusus 45°-45°-90°: Kaki = x, hipotenusa = x√2.',
      'Trigonometri: sin(x) = cos(90° - x). Jika sin(A) = cos(B), maka A + B = 90° (sudut berkomplemen)!',
      'Volume: Balok V = lwh, Tabung V = πr^2 h, Bola V = (4/3)πr^3, Kerucut V = (1/3)πr^2 h, Piramida V = (1/3) lwh.'
    ],
    examples: [
      {
        title: 'Trik Sudut Komplemen sin(A) = cos(B)',
        codeOrText: 'Soal: Jika sin(3x - 12°) = cos(2x + 7°), berapa nilai x?\nSolusi: Karena sin(A) = cos(B), maka A + B = 90°!\n(3x - 12) + (2x + 7) = 90  =>  5x - 5 = 90  =>  5x = 95  =>  x = 19°',
        explanation: 'Siswa yang tidak tahu identitas ini akan bingung karena tidak bisa menghitung arcsin secara langsung. Dengan identitas komplemen, soal selesai dalam 15 detik.',
        trapWarning: 'Hati-hati dalam satuan derajat vs radian. 90° = π/2 radian.'
      }
    ]
  }
];
