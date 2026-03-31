import React, { useEffect, useState } from "react";
import AlbumCard from "../components/AlbumCard";
import Modal from "../components/Modal";

function Dashboard() {
  const [albuns, setAlbuns] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [nome, setNome] = useState("");

  useEffect(() => {
    carregarAlbuns();
  }, []);

  const carregarAlbuns = async () => {
    const res = await fetch("http://localhost:5000/albuns");
    const data = await res.json();
    setAlbuns(data);
  };

  const criarAlbum = async () => {
    if (!nome) return;

    await fetch("http://localhost:5000/album", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome }),
    });

    setModalOpen(false);
    setNome("");
    carregarAlbuns();
  };

  return (
    <div className="container">
      <h1 className="title">👶 Mavie</h1>

      <div className="grid">
        {albuns.map((album) => (
          <div key={album.id} className="albumCard">
            <AlbumCard album={album} />
          </div>
        ))}
      </div>

      {/* BOTÃO + */}
      <div className="fab" onClick={() => setModalOpen(true)}>
        +
      </div>

      {/* MODAL */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <h3>Novo Álbum</h3>

        <input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome do álbum"
          className="input"
        />

        <button className="btn" onClick={criarAlbum}>
          Criar
        </button>
      </Modal>
    </div>
  );
}

export default Dashboard;