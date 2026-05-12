const express = require('express');
const { Storage } = require('@google-cloud/storage');
const multer = require('multer');
const app = express();
const storage = new Storage();
const bucket = storage.bucket('assets-sipelayang-2026'); 
const upload = multer({ storage: multer.memoryStorage() });

app.get('/', (req, res) => res.send('Aplikasi SiPelayang Aktif di Google Cloud!'));

// Fitur Wajib: Upload file ke Storage (diakses via CDN)
app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).send('Tidak ada file.');
  const blob = bucket.file(req.file.originalname);
  const blobStream = blob.createWriteStream();
  blobStream.on('finish', () => {
    // Ganti [IP_CDN] dengan IP yang kamu dapat tadi
    res.status(200).send(`Berhasil! Akses via CDN: http://136.110.144.255/${req.file.originalname}`);
  });
  blobStream.end(req.file.buffer);
});

app.listen(8080, () => console.log('Server jalan di port 8080'));
