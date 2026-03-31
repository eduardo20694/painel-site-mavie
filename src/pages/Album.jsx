import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function Album() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [fotos, setFotos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    carregarFotos();
  }, []);

  const carregarFotos = async () => {
    const res = await fetch(`http://localhost:5000/fotos/${id}`);
    const data = await res.json();
    setFotos(data);
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setSuccess(false);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("album_id", id);

    await fetch("http://localhost:5000/upload", {
      method: "POST",
      body: formData,
    });

    setLoading(false);
    setSuccess(true);
    setFile(null);
    carregarFotos();

    // fecha modal depois de 1.5s
    setTimeout(() => setModalOpen(false), 1500);
  };

  return (
    <div style={container}>
      {/* HEADER */}
      <div style={header}>
        <button style={backBtn} onClick={() => navigate("/")}>
          ←
        </button>
        <h2 style={{ margin: 0 }}>Álbum</h2>
      </div>

      {/* GRID */}
      <div style={grid}>
        {fotos.map((f) => (
          <div key={f.id} style={card}>
            {f.url.includes("videos") ? (
              <video src={f.url} style={media} controls />
            ) : (
              <img src={f.url} style={media} />
            )}
          </div>
        ))}

        {/* BOTÃO + */}
        <div style={addFoto} onClick={() => setModalOpen(true)}>
          +
        </div>
      </div>

      {/* MODAL DE UPLOAD */}
      {modalOpen && (
        <div style={overlay}>
          <div style={modal}>
            <h3>Adicionar Foto/Video</h3>

            {!loading && !success && (
              <>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => setFile(e.target.files[0])}
                  style={fileInput}
                />
                {file && (
                  <button style={btn} onClick={handleUpload}>
                    Enviar
                  </button>
                )}
              </>
            )}

            {loading && <div style={loading}>⏳ Enviando...</div>}
            {success && <div style={successText}>✅ Enviado com sucesso!</div>}

            <button style={closeBtn} onClick={() => setModalOpen(false)}>
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ESTILO PREMIUM */
const container = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)",
  padding: "20px",
};

const header = {
  display: "flex",
  alignItems: "center",
  gap: "15px",
  marginBottom: "25px",
};

const backBtn = {
  border: "none",
  background: "#fff",
  borderRadius: "50%",
  width: "45px",
  height: "45px",
  boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
  cursor: "pointer",
  fontSize: "20px",
  fontWeight: "bold",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
  gap: "15px",
};

const card = {
  borderRadius: "15px",
  overflow: "hidden",
  boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
  cursor: "pointer",
};

const media = {
  width: "100%",
  height: "120px",
  objectFit: "cover",
  display: "block",
};

const addFoto = {
  width: "120px",
  height: "120px",
  borderRadius: "15px",
  background: "#ffebef",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  fontSize: "40px",
  fontWeight: "bold",
  color: "#ff4d6d",
  boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
};

const overlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modal = {
  background: "#fff",
  padding: "20px",
  borderRadius: "15px",
  width: "300px",
  textAlign: "center",
  position: "relative",
};

const fileInput = {
  width: "100%",
  padding: "10px",
  borderRadius: "10px",
  border: "1px solid #ddd",
  marginBottom: "10px",
};

const btn = {
  width: "100%",
  padding: "10px",
  borderRadius: "10px",
  border: "none",
  background: "#ff4d6d",
  color: "#fff",
  cursor: "pointer",
};

const closeBtn = {
  position: "absolute",
  top: "10px",
  right: "10px",
  border: "none",
  background: "transparent",
  fontSize: "18px",
  cursor: "pointer",
};

const loading = {
  fontSize: "18px",
  color: "#555",
  margin: "15px 0",
};

const successText = {
  fontSize: "18px",
  color: "#4caf50",
  margin: "15px 0",
};

export default Album;