# 📑 Cara Memulai Projek Baru dari Template Ini

Ikuti langkah-langkah di bawah ini untuk menyalin struktur boilerplate ini ke dalam projek baru Anda secara bersih dengan repositori Git baru.

---

## 🏃‍♂️ Langkah Cepat Lewat Terminal

### 1. Unduh (Clone) Boilerplate Ini ke Folder Baru
Jalankan perintah ini di folder kerja Anda (ubah `nama-projek-baru` sesuai keinginan Anda):
```bash
git clone https://github.com/pato88/basic-struktur.git nama-projek-baru
```

### 2. Masuk ke Folder Projek Baru
```bash
cd nama-projek-baru
```

### 3. Putuskan Hubungan Git Lama (Hapus Folder `.git`)
Hapus riwayat Git bawaan template agar tidak menumpuk di projek baru:
*   **Di Windows (PowerShell)**:
    ```powershell
    Remove-Item -Recurse -Force .git
    ```
*   **Di macOS / Linux**:
    ```bash
    rm -rf .git
    ```

### 4. Inisialisasi Git Baru & Push ke Repositori Projek Baru Anda
Ganti `URL_REPO_PROJEK_BARU_ANDA` dengan alamat repositori GitHub yang baru Anda buat khusus untuk projek tersebut:
```bash
# 1. Inisialisasi Git lokal baru
git init

# 2. Tambahkan semua berkas projek
git add .

# 3. Buat commit pertama Anda
git commit -m "feat: initial commit from basic-struktur boilerplate"

# 4. Ubah branch utama menjadi 'main'
git branch -M main

# 5. Hubungkan ke repositori baru Anda
git remote add origin https://github.com/pato88/repo-projek-baru-anda.git

# 6. Push kode pertama ke repositori baru Anda
git push -u origin main
```

---

*Selamat! Projek baru Anda sekarang sudah terhubung dengan repositorinya sendiri secara bersih, menggunakan struktur dasar dari boilerplate ini.*
