const express = require("express");
const path = require("path");
const mysql = require("mysql2");

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Menyediakan folder 'public' untuk file CSS, Gambar, atau JS frontend
app.use(express.static("public"));

// Konfigurasi Database Cloud SQL
// Pastikan variabel lingkungan ini sudah diatur atau sesuaikan kodenya
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "db_sipelayang",
});

db.connect((err) => {
  if (err) {
    console.error("Koneksi database gagal: " + err.stack);
    return;
  }
  console.log("Terhubung ke database Cloud SQL.");
});

// --- ROUTES ---

// 1. Rute Utama (Menampilkan Halaman Landing)
app.get("/", (req, res) => {
  // Jika Mane punya file index.html di folder 'views' atau root
  res.sendFile(path.join(__dirname, "index.html"));
});

// 2. Rute API untuk Cek Status (Opsional)
app.get("/api/status", (req, res) => {
  res.json({
    app_name: "SiPelayang",
    version: "1.0.0",
    status: "Running",
    server: "Google Cloud Run",
  });
});

// 3. Contoh Rute untuk Mengambil Data Layanan
app.get("/api/layanan", (req, res) => {
  db.query("SELECT * FROM layanan", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server SiPelayang berjalan di port ${PORT}`);
});
