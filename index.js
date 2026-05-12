import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom/client";

/* ═══════════════════════════════════════════════════════════
   KONFIGURASI — sesuaikan dengan environment kamu
═══════════════════════════════════════════════════════════ */
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:3001";
const CDN_BASE = process.env.REACT_APP_CDN_URL || "http://34.101.82.15/assets";

/* ═══════════════════════════════════════════════════════════
   GLOBAL STYLES (injected into <head>)
═══════════════════════════════════════════════════════════ */
const GlobalStyles = () => {
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      :root {
        --hijau: #0F6E56; --hijau-mid: #1D9E75; --hijau-light: #E1F5EE; --hijau-dark: #0A4D3C;
        --biru: #185FA5;  --biru-light: #E6F1FB;
        --amber: #BA7517; --amber-light: #FAEEDA;
        --merah: #A32D2D; --merah-light: #FCEBEB;
        --abu-light: #F1EFE8;
        --bg: #F5F6F7; --surface: #FFFFFF; --border: #E5E7EB;
        --text: #111827; --muted: #6B7280;
        --font: 'Plus Jakarta Sans', sans-serif;
        --serif: 'DM Serif Display', serif;
        --radius: 12px; --radius-lg: 16px;
        --shadow: 0 1px 3px rgba(0,0,0,.08), 0 1px 2px rgba(0,0,0,.06);
        --shadow-md: 0 4px 16px rgba(0,0,0,.10);
        --shadow-lg: 0 20px 60px rgba(0,0,0,.15);
      }
      body { font-family: var(--font); background: var(--bg); color: var(--text); min-height: 100vh; }
      #root { min-height: 100vh; }
      input, select, textarea, button { font-family: var(--font); }

      /* scrollbar */
      ::-webkit-scrollbar { width: 6px; height: 6px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 99px; }

      /* fade-in animation */
      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(12px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      .fade-up { animation: fadeUp .35s ease both; }
      .fade-up-1 { animation-delay: .05s; }
      .fade-up-2 { animation-delay: .10s; }
      .fade-up-3 { animation-delay: .15s; }
      .fade-up-4 { animation-delay: .20s; }

      /* table */
      table { width: 100%; border-collapse: collapse; font-size: 13px; table-layout: fixed; }
      th { padding: 10px 14px; text-align: left; font-size: 11px; font-weight: 600;
           text-transform: uppercase; letter-spacing: .06em; color: var(--muted);
           background: #F9FAFB; border-bottom: 1px solid var(--border); }
      td { padding: 11px 14px; border-bottom: 1px solid var(--border);
           vertical-align: middle; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      tr:last-child td { border-bottom: none; }
      tr:hover td { background: #FAFAFA; }

      /* modal overlay */
      .modal-bg { position: fixed; inset: 0; background: rgba(0,0,0,.45);
                  z-index: 500; display: flex; align-items: center; justify-content: center;
                  animation: fadeUp .2s ease; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  return null;
};

/* ═══════════════════════════════════════════════════════════
   REUSABLE COMPONENTS
═══════════════════════════════════════════════════════════ */

// Badge status
const Badge = ({ status }) => {
  const map = {
    Diproses: { bg: "#E6F1FB", color: "#185FA5" },
    Selesai: { bg: "#E1F5EE", color: "#0F6E56" },
    Menunggu: { bg: "#FAEEDA", color: "#BA7517" },
    Baru: { bg: "#F1EFE8", color: "#555" },
  };
  const s = map[status] || map["Baru"];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "3px 10px",
        borderRadius: 99,
        fontSize: 11,
        fontWeight: 600,
        background: s.bg,
        color: s.color,
        whiteSpace: "nowrap",
      }}
    >
      {status}
    </span>
  );
};

// Tombol utama hijau
const Btn = ({
  children,
  onClick,
  type = "button",
  style = {},
  variant = "primary",
  disabled,
}) => {
  const base = {
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    border: "none",
    borderRadius: 10,
    padding: "10px 20px",
    fontSize: 14,
    fontWeight: 600,
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all .15s",
    opacity: disabled ? 0.6 : 1,
  };
  const variants = {
    primary: { background: "#0F6E56", color: "#fff" },
    danger: { background: "#A32D2D", color: "#fff" },
    ghost: {
      background: "#F3F4F6",
      color: "#374151",
      border: "1px solid #E5E7EB",
    },
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{ ...base, ...variants[variant], ...style }}
    >
      {children}
    </button>
  );
};

// Input / Select / Textarea standar
const Field = ({ label, required, children }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    <label style={{ fontSize: 13, fontWeight: 500 }}>
      {label}
      {required && <span style={{ color: "#A32D2D", marginLeft: 2 }}>*</span>}
    </label>
    {children}
  </div>
);

const inputStyle = {
  width: "100%",
  padding: "9px 12px",
  border: "1px solid #E5E7EB",
  borderRadius: 8,
  fontSize: 13,
  background: "#fff",
  color: "#111827",
  outline: "none",
  transition: "border-color .15s",
};

// Spinner loading
const Spinner = () => (
  <span
    style={{
      display: "inline-block",
      width: 16,
      height: 16,
      border: "2px solid rgba(255,255,255,.4)",
      borderTopColor: "#fff",
      borderRadius: "50%",
      animation: "spin .6s linear infinite",
    }}
  />
);

/* ═══════════════════════════════════════════════════════════
   NAVBAR
═══════════════════════════════════════════════════════════ */
const Navbar = ({ page, setPage }) => {
  const navs = [
    { id: "beranda", label: "Beranda", icon: "🏠" },
    { id: "ajukan", label: "Ajukan Layanan", icon: "📋" },
    { id: "data", label: "Data Pengajuan", icon: "🗄️" },
  ];
  return (
    <nav
      style={{
        background: "#fff",
        borderBottom: "1px solid #E5E7EB",
        padding: "0 2rem",
        height: 56,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 1px 4px rgba(0,0,0,.06)",
      }}
    >
      {/* Brand */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 34,
            height: 34,
            background: "#0F6E56",
            borderRadius: 9,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            color: "#fff",
          }}
        >
          🏛️
        </div>
        <div>
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "#0F6E56",
              lineHeight: 1.2,
            }}
          >
            SiPelayang
          </div>
          <div style={{ fontSize: 11, color: "#9CA3AF" }}>
            Sistem Pelayanan Masyarakat Terpadu
          </div>
        </div>
      </div>

      {/* Links */}
      <div style={{ display: "flex", gap: 4 }}>
        {navs.map((n) => (
          <button
            key={n.id}
            onClick={() => setPage(n.id)}
            style={{
              background: page === n.id ? "#E1F5EE" : "none",
              color: page === n.id ? "#0F6E56" : "#6B7280",
              fontWeight: page === n.id ? 600 : 400,
              border: "none",
              padding: "7px 14px",
              borderRadius: 8,
              fontSize: 13,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 5,
              transition: "all .15s",
            }}
          >
            <span>{n.icon}</span> {n.label}
          </button>
        ))}
      </div>
    </nav>
  );
};

/* ═══════════════════════════════════════════════════════════
   HALAMAN 1: BERANDA
═══════════════════════════════════════════════════════════ */
const PageBeranda = ({ setPage, stats }) => {
  const layanan = [
    {
      icon: "🪪",
      title: "Surat Pengantar",
      desc: "Keperluan administrasi, SKCK, beasiswa, dan dokumen resmi lainnya.",
      bg: "#E6F1FB",
      color: "#185FA5",
    },
    {
      icon: "🔧",
      title: "Laporan Fasilitas Rusak",
      desc: "Laporkan kerusakan jalan, lampu, jembatan, atau saluran air.",
      bg: "#FAEEDA",
      color: "#BA7517",
    },
    {
      icon: "🤝",
      title: "Permohonan Bansos",
      desc: "Daftar program bantuan sosial, UMKM, dan subsidi pemerintah.",
      bg: "#E1F5EE",
      color: "#0F6E56",
    },
    {
      icon: "📣",
      title: "Pengaduan Umum",
      desc: "Sampaikan keluhan atau saran terhadap pelayanan publik.",
      bg: "#FCEBEB",
      color: "#A32D2D",
    },
  ];
  return (
    <div style={{ padding: "2rem", maxWidth: 980, margin: "0 auto" }}>
      {/* Hero */}
      <div
        className="fade-up"
        style={{
          background:
            "linear-gradient(135deg, #0A4D3C 0%, #0F6E56 60%, #1D9E75 100%)",
          borderRadius: 20,
          padding: "3rem 2.5rem",
          marginBottom: "1.5rem",
          position: "relative",
          overflow: "hidden",
          color: "#fff",
        }}
      >
        {/* Dekorasi */}
        <div
          style={{
            position: "absolute",
            right: -40,
            top: -40,
            width: 250,
            height: 250,
            background:
              "radial-gradient(circle, rgba(255,255,255,.1) 0%, transparent 70%)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 60,
            bottom: -60,
            width: 180,
            height: 180,
            background:
              "radial-gradient(circle, rgba(255,255,255,.06) 0%, transparent 70%)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "rgba(255,255,255,.15)",
            borderRadius: 99,
            padding: "4px 14px",
            fontSize: 12,
            fontWeight: 600,
            marginBottom: "1rem",
            backdropFilter: "blur(4px)",
          }}
        >
          🛡️ Sistem Digital Kelurahan
        </div>

        <h1
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 36,
            fontWeight: 400,
            lineHeight: 1.2,
            marginBottom: ".75rem",
          }}
        >
          Layanan Warga{" "}
          <em style={{ color: "#7EE0B5", fontStyle: "normal" }}>Cepat</em> &amp;
          Transparan
        </h1>

        <p
          style={{
            opacity: 0.85,
            fontSize: 15,
            lineHeight: 1.65,
            maxWidth: 500,
            marginBottom: "1.75rem",
          }}
        >
          Ajukan surat pengantar, laporan kerusakan fasilitas, atau permohonan
          bansos secara digital — tanpa antre, tanpa kertas.
        </p>

        <button
          onClick={() => setPage("ajukan")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "#fff",
            color: "#0F6E56",
            border: "none",
            padding: "12px 26px",
            borderRadius: 11,
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(0,0,0,.15)",
            transition: "transform .15s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "translateY(-1px)")
          }
          onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
        >
          📋 Ajukan Layanan Sekarang
        </button>
      </div>

      {/* Stats */}
      <p
        className="fade-up fade-up-1"
        style={{
          fontSize: 11,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: ".07em",
          color: "#9CA3AF",
          marginBottom: ".75rem",
        }}
      >
        Statistik Pelayanan
      </p>
      <div
        className="fade-up fade-up-1"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 12,
          marginBottom: "1.5rem",
        }}
      >
        {[
          { icon: "📄", num: stats.total, label: "Total Pengajuan" },
          { icon: "✅", num: stats.selesai, label: "Pengajuan Selesai" },
          { icon: "⚙️", num: stats.proses, label: "Sedang Diproses" },
          { icon: "⏳", num: stats.tunggu, label: "Menunggu Verifikasi" },
        ].map((s, i) => (
          <div
            key={i}
            style={{
              background: "#fff",
              border: "1px solid #E5E7EB",
              borderRadius: 12,
              padding: "1rem 1.25rem",
              boxShadow: "0 1px 3px rgba(0,0,0,.06)",
            }}
          >
            <div style={{ fontSize: 20, marginBottom: 8 }}>{s.icon}</div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: "#0F6E56",
                fontFamily: "'DM Serif Display', serif",
              }}
            >
              {s.num}
            </div>
            <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Jenis layanan */}
      <p
        className="fade-up fade-up-2"
        style={{
          fontSize: 11,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: ".07em",
          color: "#9CA3AF",
          marginBottom: ".75rem",
        }}
      >
        Jenis Layanan Tersedia
      </p>
      <div
        className="fade-up fade-up-2"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 12,
        }}
      >
        {layanan.map((l, i) => (
          <div
            key={i}
            style={{
              background: "#fff",
              border: "1px solid #E5E7EB",
              borderRadius: 12,
              padding: "1.25rem",
              boxShadow: "0 1px 3px rgba(0,0,0,.06)",
              cursor: "default",
              transition: "transform .15s, box-shadow .15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,.09)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,.06)";
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 9,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 19,
                marginBottom: ".75rem",
                background: l.bg,
                color: l.color,
              }}
            >
              {l.icon}
            </div>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 5 }}>
              {l.title}
            </h3>
            <p style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.55 }}>
              {l.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   HALAMAN 2: FORM PENGAJUAN (CREATE + UPLOAD)
═══════════════════════════════════════════════════════════ */
const PageAjukan = ({ onSubmitSuccess }) => {
  const [form, setForm] = useState({
    nama: "",
    telp: "",
    jenis: "",
    lokasi: "",
    deskripsi: "",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null); // tiket ID
  const [error, setError] = useState("");
  const fileRef = useRef();

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) {
      setError("Ukuran file maksimal 10 MB.");
      return;
    }
    setFile(f);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nama || !form.jenis || !form.deskripsi) {
      setError("Nama pelapor, jenis layanan, dan deskripsi wajib diisi.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("nama", form.nama);
      fd.append("telp", form.telp);
      fd.append("jenis", form.jenis);
      fd.append("lokasi", form.lokasi);
      fd.append("deskripsi", form.deskripsi);
      if (file) fd.append("dokumen", file);

      // POST ke backend Node — endpoint: POST /api/pengajuan
      const res = await fetch(`${API_BASE}/api/pengajuan`, {
        method: "POST",
        body: fd,
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();

      setSuccess(data.id || "BARU");
      setForm({ nama: "", telp: "", jenis: "", lokasi: "", deskripsi: "" });
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
      onSubmitSuccess();
    } catch (err) {
      setError(
        "Gagal mengirim pengajuan. Pastikan backend berjalan dan coba lagi.",
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const inputFocus = (e) => (e.target.style.borderColor = "#0F6E56");
  const inputBlur = (e) => (e.target.style.borderColor = "#E5E7EB");

  return (
    <div style={{ padding: "2rem", maxWidth: 700, margin: "0 auto" }}>
      {/* Banner sukses */}
      {success && (
        <div
          className="fade-up"
          style={{
            background: "#E1F5EE",
            border: "1px solid #1D9E75",
            borderRadius: 12,
            padding: "1rem 1.25rem",
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: "1.5rem",
            color: "#0A4D3C",
          }}
        >
          <span style={{ fontSize: 22 }}>✅</span>
          <p style={{ fontSize: 13, fontWeight: 500 }}>
            Pengajuan berhasil dikirim! Dokumen terunggah ke GCS Bucket. Nomor
            tiket: <strong>#{success}</strong>
          </p>
          <button
            onClick={() => setSuccess(null)}
            style={{
              marginLeft: "auto",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 18,
              color: "#6B7280",
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* Banner error */}
      {error && (
        <div
          style={{
            background: "#FCEBEB",
            border: "1px solid #A32D2D",
            borderRadius: 12,
            padding: ".875rem 1.25rem",
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: "1.5rem",
            color: "#A32D2D",
            fontSize: 13,
          }}
        >
          ⚠️ {error}
          <button
            onClick={() => setError("")}
            style={{
              marginLeft: "auto",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 18,
            }}
          >
            ×
          </button>
        </div>
      )}

      <div
        className="fade-up"
        style={{
          background: "#fff",
          border: "1px solid #E5E7EB",
          borderRadius: 16,
          padding: "2rem",
          boxShadow: "0 2px 8px rgba(0,0,0,.06)",
        }}
      >
        {/* Header form */}
        <div
          style={{
            marginBottom: "1.5rem",
            paddingBottom: "1rem",
            borderBottom: "1px solid #F3F4F6",
          }}
        >
          <h2
            style={{
              fontSize: 20,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            📋 Form Pengajuan Layanan
          </h2>
          <p style={{ color: "#6B7280", fontSize: 13, marginTop: 4 }}>
            Isi formulir dengan lengkap dan benar. Kolom bertanda{" "}
            <span style={{ color: "#A32D2D" }}>*</span> wajib diisi.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Row 1 */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
              marginBottom: 16,
            }}
          >
            <Field label="Nama Pelapor" required>
              <input
                style={inputStyle}
                value={form.nama}
                onChange={set("nama")}
                placeholder="Nama lengkap sesuai KTP"
                onFocus={inputFocus}
                onBlur={inputBlur}
              />
            </Field>
            <Field label="No. Telepon / WhatsApp">
              <input
                style={inputStyle}
                value={form.telp}
                onChange={set("telp")}
                placeholder="08xx-xxxx-xxxx"
                onFocus={inputFocus}
                onBlur={inputBlur}
              />
            </Field>
          </div>

          {/* Row 2 */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
              marginBottom: 16,
            }}
          >
            <Field label="Jenis Layanan" required>
              <select
                style={inputStyle}
                value={form.jenis}
                onChange={set("jenis")}
                onFocus={inputFocus}
                onBlur={inputBlur}
              >
                <option value="">— Pilih jenis layanan —</option>
                <option value="Surat Pengantar">Surat Pengantar</option>
                <option value="Fasilitas Umum">Laporan Fasilitas Rusak</option>
                <option value="Bansos">Permohonan Bansos</option>
                <option value="Pengaduan">Pengaduan Umum</option>
              </select>
            </Field>
            <Field label="Lokasi / RT-RW">
              <input
                style={inputStyle}
                value={form.lokasi}
                onChange={set("lokasi")}
                placeholder="Cth: RT 03/RW 07, Kel. Lebak Gede"
                onFocus={inputFocus}
                onBlur={inputBlur}
              />
            </Field>
          </div>

          {/* Row 3: Deskripsi */}
          <div style={{ marginBottom: 16 }}>
            <Field label="Deskripsi / Keterangan" required>
              <textarea
                style={{
                  ...inputStyle,
                  minHeight: 90,
                  resize: "vertical",
                  lineHeight: 1.5,
                }}
                value={form.deskripsi}
                onChange={set("deskripsi")}
                placeholder="Jelaskan keperluan atau permasalahan yang dilaporkan secara detail..."
                onFocus={inputFocus}
                onBlur={inputBlur}
              />
            </Field>
          </div>

          {/* Row 4: Upload */}
          <div style={{ marginBottom: 8 }}>
            <Field label="Unggah Dokumen / Foto Bukti">
              <div
                onClick={() => fileRef.current?.click()}
                style={{
                  border: `2px dashed ${file ? "#0F6E56" : "#D1D5DB"}`,
                  borderRadius: 10,
                  padding: "1.75rem",
                  textAlign: "center",
                  cursor: "pointer",
                  background: file ? "#E1F5EE" : "#FAFAFA",
                  transition: "all .2s",
                }}
                onMouseEnter={(e) => {
                  if (!file) {
                    e.currentTarget.style.borderColor = "#0F6E56";
                    e.currentTarget.style.background = "#F0FDF9";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!file) {
                    e.currentTarget.style.borderColor = "#D1D5DB";
                    e.currentTarget.style.background = "#FAFAFA";
                  }
                }}
              >
                <div style={{ fontSize: 32, marginBottom: ".5rem" }}>
                  {file ? "📎" : "☁️"}
                </div>
                {file ? (
                  <p
                    style={{ fontSize: 13, color: "#0F6E56", fontWeight: 600 }}
                  >
                    ✓ {file.name}{" "}
                    <span style={{ fontWeight: 400, color: "#6B7280" }}>
                      ({(file.size / 1024).toFixed(0)} KB)
                    </span>
                  </p>
                ) : (
                  <>
                    <p style={{ fontSize: 13, color: "#374151" }}>
                      <strong>Klik untuk memilih file</strong> atau seret ke
                      sini
                    </p>
                    <p style={{ fontSize: 11, color: "#9CA3AF", marginTop: 4 }}>
                      Format: PDF, JPG, PNG — Maks. 10 MB
                    </p>
                  </>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFile}
                style={{ display: "none" }}
              />
            </Field>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              marginTop: "1.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              background: loading ? "#6B7280" : "#0F6E56",
              color: "#fff",
              border: "none",
              padding: "12px",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background .15s",
            }}
          >
            {loading ? (
              <>
                <Spinner /> Mengirim...
              </>
            ) : (
              <>📤 Kirim Pengajuan</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   HALAMAN 3: DATA PENGAJUAN — CRUD TABLE
═══════════════════════════════════════════════════════════ */
const PageData = () => {
  const [rows, setRows] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("semua");
  const [editRow, setEditRow] = useState(null);
  const [delRow, setDelRow] = useState(null);
  const [saving, setSaving] = useState(false);

  // ── FETCH / READ ──
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/pengajuan`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setRows(data);
      setFiltered(data);
    } catch {
      setError(
        "Gagal mengambil data dari server. Pastikan backend & Cloud SQL aktif.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setFiltered(
      filter === "semua" ? rows : rows.filter((r) => r.status === filter),
    );
  }, [filter, rows]);

  // ── UPDATE ──
  const handleEdit = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/pengajuan/${editRow.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama: editRow.nama,
          jenis: editRow.jenis,
          ket: editRow.ket,
          status: editRow.status,
        }),
      });
      if (!res.ok) throw new Error();
      setRows((prev) =>
        prev.map((r) => (r.id === editRow.id ? { ...r, ...editRow } : r)),
      );
      setEditRow(null);
    } catch {
      alert("Gagal menyimpan perubahan. Coba lagi.");
    } finally {
      setSaving(false);
    }
  };

  // ── DELETE ──
  const handleDelete = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/pengajuan/${delRow.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      setRows((prev) => prev.filter((r) => r.id !== delRow.id));
      setDelRow(null);
    } catch {
      alert("Gagal menghapus data. Coba lagi.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: 1100, margin: "0 auto" }}>
      <div
        className="fade-up"
        style={{
          background: "#fff",
          border: "1px solid #E5E7EB",
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,.06)",
        }}
      >
        {/* Topbar */}
        <div
          style={{
            padding: "1.25rem 1.5rem",
            borderBottom: "1px solid #F3F4F6",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <h2
            style={{
              fontSize: 16,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            🗄️ Data Pengajuan — Cloud SQL
          </h2>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "#9CA3AF" }}>Filter:</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{
                padding: "6px 10px",
                border: "1px solid #E5E7EB",
                borderRadius: 7,
                fontSize: 12,
                background: "#F9FAFB",
                cursor: "pointer",
                outline: "none",
              }}
            >
              {["semua", "Diproses", "Selesai", "Menunggu", "Baru"].map((v) => (
                <option key={v} value={v}>
                  {v === "semua" ? "Semua Status" : v}
                </option>
              ))}
            </select>
            <button
              onClick={fetchData}
              style={{
                padding: "6px 12px",
                border: "1px solid #E5E7EB",
                borderRadius: 7,
                fontSize: 12,
                background: "#F9FAFB",
                cursor: "pointer",
              }}
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div
            style={{ padding: "3rem", textAlign: "center", color: "#9CA3AF" }}
          >
            ⏳ Memuat data dari Cloud SQL...
          </div>
        ) : error ? (
          <div
            style={{
              padding: "3rem",
              textAlign: "center",
              color: "#A32D2D",
              fontSize: 13,
            }}
          >
            ⚠️ {error}
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th style={{ width: 55 }}>ID</th>
                  <th style={{ width: 95 }}>Tanggal</th>
                  <th style={{ width: 160 }}>Nama Pelapor</th>
                  <th style={{ width: 155 }}>Jenis Layanan</th>
                  <th style={{ width: 180 }}>Keterangan</th>
                  <th style={{ width: 95 }}>Status</th>
                  <th style={{ width: 150 }}>Link Lampiran (CDN)</th>
                  <th style={{ width: 120 }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      style={{
                        textAlign: "center",
                        padding: "2.5rem",
                        color: "#9CA3AF",
                      }}
                    >
                      📭 Tidak ada data ditemukan
                    </td>
                  </tr>
                ) : (
                  filtered.map((r) => (
                    <tr key={r.id}>
                      <td>
                        <span
                          style={{
                            fontSize: 11,
                            background: "#F3F4F6",
                            padding: "2px 8px",
                            borderRadius: 4,
                            color: "#6B7280",
                            fontWeight: 500,
                          }}
                        >
                          #{r.id}
                        </span>
                      </td>
                      <td style={{ color: "#9CA3AF", fontSize: 12 }}>
                        {r.tanggal || r.tgl}
                      </td>
                      <td style={{ fontWeight: 500 }}>{r.nama}</td>
                      <td>{r.jenis}</td>
                      <td style={{ color: "#6B7280" }}>
                        {r.keterangan || r.ket}
                      </td>
                      <td>
                        <Badge status={r.status} />
                      </td>
                      <td>
                        {r.file_url || r.file ? (
                          <a
                            href={r.file_url || `${CDN_BASE}/${r.file}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              color: "#185FA5",
                              fontSize: 12,
                              textDecoration: "none",
                              display: "flex",
                              alignItems: "center",
                              gap: 3,
                            }}
                          >
                            📎 {r.file_name || r.file}
                          </a>
                        ) : (
                          <span style={{ color: "#D1D5DB", fontSize: 12 }}>
                            —
                          </span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button
                            onClick={() => setEditRow({ ...r })}
                            style={{
                              background: "none",
                              border: "1px solid #E5E7EB",
                              borderRadius: 6,
                              padding: "4px 10px",
                              fontSize: 11,
                              cursor: "pointer",
                              color: "#6B7280",
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                              transition: "all .15s",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = "#0F6E56";
                              e.currentTarget.style.color = "#0F6E56";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = "#E5E7EB";
                              e.currentTarget.style.color = "#6B7280";
                            }}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => setDelRow(r)}
                            style={{
                              background: "none",
                              border: "1px solid #E5E7EB",
                              borderRadius: 6,
                              padding: "4px 10px",
                              fontSize: 11,
                              cursor: "pointer",
                              color: "#6B7280",
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                              transition: "all .15s",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = "#A32D2D";
                              e.currentTarget.style.color = "#A32D2D";
                              e.currentTarget.style.background = "#FCEBEB";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = "#E5E7EB";
                              e.currentTarget.style.color = "#6B7280";
                              e.currentTarget.style.background = "none";
                            }}
                          >
                            🗑️ Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Modal Edit ── */}
      {editRow && (
        <div
          className="modal-bg"
          onClick={(e) => e.target === e.currentTarget && setEditRow(null)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: "2rem",
              width: 460,
              maxWidth: "90vw",
              border: "1px solid #E5E7EB",
              boxShadow: "0 20px 60px rgba(0,0,0,.15)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1.25rem",
              }}
            >
              <h3 style={{ fontSize: 17, fontWeight: 700 }}>
                ✏️ Edit Pengajuan
              </h3>
              <button
                onClick={() => setEditRow(null)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: 20,
                  cursor: "pointer",
                  color: "#9CA3AF",
                }}
              >
                ×
              </button>
            </div>

            <div style={{ display: "grid", gap: 12 }}>
              <Field label="Nama Pelapor">
                <input
                  style={inputStyle}
                  value={editRow.nama}
                  onChange={(e) =>
                    setEditRow((r) => ({ ...r, nama: e.target.value }))
                  }
                  onFocus={(e) => (e.target.style.borderColor = "#0F6E56")}
                  onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                />
              </Field>
              <Field label="Jenis Layanan">
                <select
                  style={inputStyle}
                  value={editRow.jenis}
                  onChange={(e) =>
                    setEditRow((r) => ({ ...r, jenis: e.target.value }))
                  }
                >
                  <option value="Surat Pengantar">Surat Pengantar</option>
                  <option value="Fasilitas Umum">
                    Laporan Fasilitas Rusak
                  </option>
                  <option value="Bansos">Permohonan Bansos</option>
                  <option value="Pengaduan">Pengaduan Umum</option>
                </select>
              </Field>
              <Field label="Keterangan">
                <input
                  style={inputStyle}
                  value={editRow.keterangan || editRow.ket || ""}
                  onChange={(e) =>
                    setEditRow((r) => ({
                      ...r,
                      keterangan: e.target.value,
                      ket: e.target.value,
                    }))
                  }
                  onFocus={(e) => (e.target.style.borderColor = "#0F6E56")}
                  onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                />
              </Field>
              <Field label="Status">
                <select
                  style={inputStyle}
                  value={editRow.status}
                  onChange={(e) =>
                    setEditRow((r) => ({ ...r, status: e.target.value }))
                  }
                >
                  {["Baru", "Menunggu", "Diproses", "Selesai"].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div
              style={{
                display: "flex",
                gap: 8,
                marginTop: "1.5rem",
                justifyContent: "flex-end",
              }}
            >
              <Btn variant="ghost" onClick={() => setEditRow(null)}>
                Batal
              </Btn>
              <Btn onClick={handleEdit} disabled={saving}>
                {saving ? (
                  <>
                    <Spinner /> Menyimpan...
                  </>
                ) : (
                  <>✅ Simpan Perubahan</>
                )}
              </Btn>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Hapus ── */}
      {delRow && (
        <div
          className="modal-bg"
          onClick={(e) => e.target === e.currentTarget && setDelRow(null)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: "2rem",
              width: 420,
              maxWidth: "90vw",
              border: "1px solid #E5E7EB",
              boxShadow: "0 20px 60px rgba(0,0,0,.15)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1rem",
              }}
            >
              <h3 style={{ fontSize: 17, fontWeight: 700 }}>🗑️ Hapus Data</h3>
              <button
                onClick={() => setDelRow(null)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: 20,
                  cursor: "pointer",
                  color: "#9CA3AF",
                }}
              >
                ×
              </button>
            </div>
            <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.65 }}>
              Yakin ingin menghapus pengajuan dari{" "}
              <strong style={{ color: "#111827" }}>{delRow.nama}</strong>?{" "}
              Tindakan ini{" "}
              <strong style={{ color: "#A32D2D" }}>
                tidak dapat dibatalkan
              </strong>
              .
            </p>
            <div
              style={{
                display: "flex",
                gap: 8,
                marginTop: "1.5rem",
                justifyContent: "flex-end",
              }}
            >
              <Btn variant="ghost" onClick={() => setDelRow(null)}>
                Batal
              </Btn>
              <Btn variant="danger" onClick={handleDelete} disabled={saving}>
                {saving ? (
                  <>
                    <Spinner /> Menghapus...
                  </>
                ) : (
                  <>🗑️ Ya, Hapus</>
                )}
              </Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════════════════ */
const App = () => {
  const [page, setPage] = useState("beranda");
  const [stats, setStats] = useState({
    total: 0,
    selesai: 0,
    proses: 0,
    tunggu: 0,
  });

  // Ambil statistik dari API
  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/pengajuan`);
      if (!res.ok) return;
      const data = await res.json();
      setStats({
        total: data.length,
        selesai: data.filter((r) => r.status === "Selesai").length,
        proses: data.filter((r) => r.status === "Diproses").length,
        tunggu: data.filter(
          (r) => r.status === "Menunggu" || r.status === "Baru",
        ).length,
      });
    } catch {
      // Diam saja kalau API belum aktif
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const onSubmitSuccess = () => {
    fetchStats();
    // Opsional: langsung pindah ke halaman data
    // setPage("data");
  };

  return (
    <>
      <GlobalStyles />
      <Navbar page={page} setPage={setPage} />
      {page === "beranda" && <PageBeranda setPage={setPage} stats={stats} />}
      {page === "ajukan" && <PageAjukan onSubmitSuccess={onSubmitSuccess} />}
      {page === "data" && <PageData />}
    </>
  );
};

// Mount ke DOM
const port = process.env.PORT || 8080; // Pastikan menggunakan process.env.PORT

app.listen(port, () => {
  console.log(`Aplikasi Sipelayang jalan di port ${port}`);
});
