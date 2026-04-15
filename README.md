
# Web App

Frontend aplikasi ini berada di folder `web`.

## Persiapan

Pastikan perangkat sudah terpasang:

- Node.js versi 18 atau lebih baru
- npm / pnpm / yarn
- Git

## 1) Clone repository

```bash
git clone https://github.com/AlfitoAdityaProtic/Capstone-Project.git
cd Capstone-Project/web
```

## 2) Install dependency

Pilih salah satu package manager:

```bash
npm install
```

atau

```bash
yarn install
```

atau

```bash
pnpm install
```

## 3) Siapkan file environment

Salin file contoh environment:

```bash
cp .env.example .env
```

Lalu isi nilainya sesuai kebutuhan project.

Contoh yang biasanya paling penting:

- `VITE_API_URL` = alamat backend / API
- `VITE_APP_NAME` = nama aplikasi
- `VITE_APP_ENV` = mode aplikasi (`development` / `production`)
- `VITE_PORT` = port frontend jika dipakai di project

## 4) Jalankan project di mode development

```bash
npm run dev
```

Jika project memakai package manager lain:

```bash
yarn dev
```

atau

```bash
pnpm dev
```

Setelah berhasil dijalankan, buka alamat lokal yang tampil di terminal, biasanya:

```bash
http://localhost:5173
```

## 5) Build untuk production

```bash
npm run build
```

Hasil build biasanya akan masuk ke folder seperti `dist/`.

## 6) Preview hasil build

```bash
npm run preview
```

## Struktur penggunaan singkat

Alur menjalankan project:

1. Clone repository.
2. Masuk ke folder `web`.
3. Install dependency.
4. Copy `.env.example` menjadi `.env`.
5. Isi konfigurasi environment.
6. Jalankan `npm run dev`.
7. Akses aplikasi dari browser.

## Catatan

- Jika backend dijalankan terpisah, pastikan `VITE_API_URL` mengarah ke backend yang benar.
- Jika ada error dependency, hapus `node_modules` lalu install ulang.
- Jika port bentrok, ubah port di konfigurasi project atau di file environment.

## Troubleshooting

### Dependency gagal di-install

Coba jalankan:

```bash
rm -rf node_modules package-lock.json
npm install
```

### Environment tidak terbaca

Pastikan:

- nama file adalah `.env`
- variabel untuk project Vite diawali dengan `VITE_`
- setelah mengubah `.env`, server dev dijalankan ulang

### API tidak terhubung

Periksa:

- backend sudah aktif
- nilai `VITE_API_URL` sudah benar
- tidak ada masalah CORS di backend

---

README ini dibuat sebagai template penggunaan folder `web`.
=======
# Web App

Frontend aplikasi ini berada di folder `web`.

## Persiapan

Pastikan perangkat sudah terpasang:

- Node.js versi 18 atau lebih baru
- npm / pnpm / yarn
- Git

## 1) Clone repository

```bash
git clone https://github.com/AlfitoAdityaProtic/Capstone-Project.git
cd Capstone-Project/web
```

## 2) Install dependency

Pilih salah satu package manager:

```bash
npm install
```

atau

```bash
yarn install
```

atau

```bash
pnpm install
```

## 3) Siapkan file environment

Salin file contoh environment:

```bash
cp .env.example .env
```

Lalu isi nilainya sesuai kebutuhan project.

Contoh yang biasanya paling penting:

- `VITE_API_URL` = alamat backend / API
- `VITE_APP_NAME` = nama aplikasi
- `VITE_APP_ENV` = mode aplikasi (`development` / `production`)
- `VITE_PORT` = port frontend jika dipakai di project

## 4) Jalankan project di mode development

```bash
npm run dev
```

Jika project memakai package manager lain:

```bash
yarn dev
```

atau

```bash
pnpm dev
```

Setelah berhasil dijalankan, buka alamat lokal yang tampil di terminal, biasanya:

```bash
http://localhost:5173
```

## 5) Build untuk production

```bash
npm run build
```

Hasil build biasanya akan masuk ke folder seperti `dist/`.

## 6) Preview hasil build

```bash
npm run preview
```

## Struktur penggunaan singkat

Alur menjalankan project:

1. Clone repository.
2. Masuk ke folder `web`.
3. Install dependency.
4. Copy `.env.example` menjadi `.env`.
5. Isi konfigurasi environment.
6. Jalankan `npm run dev`.
7. Akses aplikasi dari browser.

## Catatan

- Jika backend dijalankan terpisah, pastikan `VITE_API_URL` mengarah ke backend yang benar.
- Jika ada error dependency, hapus `node_modules` lalu install ulang.
- Jika port bentrok, ubah port di konfigurasi project atau di file environment.

## Troubleshooting

### Dependency gagal di-install

Coba jalankan:

```bash
rm -rf node_modules package-lock.json
npm install
```

### Environment tidak terbaca

Pastikan:

- nama file adalah `.env`
- variabel untuk project Vite diawali dengan `VITE_`
- setelah mengubah `.env`, server dev dijalankan ulang

### API tidak terhubung

Periksa:

- backend sudah aktif
- nilai `VITE_API_URL` sudah benar
- tidak ada masalah CORS di backend

---

README ini dibuat sebagai template penggunaan folder `web`.

