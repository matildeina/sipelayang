const express = require("express");
const path = require("path");
const app = express();

const port = process.env.PORT || 8080;

// Memberitahu Express untuk menyajikan file statis (jika ada folder public, dll)
app.use(express.static(path.join(__dirname)));

// Route utama untuk mengirim file index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Contoh API endpoint (Backend)
app.get("/api/status", (req, res) => {
  res.json({
    status: "online",
    project: "SiPelayang",
    message: "Backend Aktif di Cloud Run",
  });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server SiPelayang berjalan di port ${port}`);
});
