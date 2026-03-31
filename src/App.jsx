import { useEffect, useState } from "react";
import {
  listarAlbuns,
  criarAlbum,
  deletarAlbum,
  editarAlbum,
  listarFotos,
  uploadArquivo,
  deletarFoto,
} from "./api";

function App() {
  const [albuns, setAlbuns] = useState([]);
  const [fotos, setFotos] = useState([]);

  const [novoNome, setNovoNome] = useState("");
  const [renomearNome, setRenomearNome] = useState("");

  const [albumSelecionado, setAlbumSelecionado] = useState(null);
  const [albumEditando, setAlbumEditando] = useState(null);
  const [albumParaDeletar, setAlbumParaDeletar] = useState(null);

  const [file, setFile] = useState(null);

  const [modalCriar, setModalCriar] = useState(false);
  const [modalRenomear, setModalRenomear] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);

  useEffect(() => {
    carregarAlbuns();
  }, []);

  const carregarAlbuns = async () => {
    const res = await listarAlbuns();
    setAlbuns(res?.data || []);
  };

  const abrirAlbum = async (id) => {
    setAlbumSelecionado(id);
    const res = await listarFotos(id);
    setFotos(res?.data || []);
  };

  const criar = async () => {
    if (!novoNome) return;
    await criarAlbum(novoNome);
    setNovoNome("");
    setModalCriar(false);
    carregarAlbuns();
  };

  const renomear = async () => {
    if (!renomearNome) return;
    await editarAlbum(albumEditando, renomearNome);
    setRenomearNome("");
    setModalRenomear(false);
    carregarAlbuns();
  };

  const confirmarDelete = async () => {
    await deletarAlbum(albumParaDeletar);
    setModalDelete(false);
    carregarAlbuns();
  };

  const upload = async () => {
    if (!file) return;
    await uploadArquivo(file, albumSelecionado);
    setFile(null);
    abrirAlbum(albumSelecionado);
  };

  // =========================
  // ÁLBUNS
  // =========================
  if (!albumSelecionado) {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>Mavie</h1>

        <div style={styles.grid}>
          {albuns.map((a) => (
            <div key={a.id} style={styles.card}>
              <div onClick={() => abrirAlbum(a.id)}>
                <img
                  src={a.capa || "https://via.placeholder.com/300"}
                  style={styles.img}
                />
                <p style={styles.nome}>{a.nome}</p>
              </div>

              <div style={styles.actions}>
                <button
                  style={styles.btn}
                  onClick={() => {
                    setAlbumEditando(a.id);
                    setModalRenomear(true);
                  }}
                >
                  Renomear
                </button>

                <button
                  style={styles.btnDanger}
                  onClick={() => {
                    setAlbumParaDeletar(a.id);
                    setModalDelete(true);
                  }}
                >
                  Deletar
                </button>
              </div>
            </div>
          ))}

          <div style={styles.add} onClick={() => setModalCriar(true)}>
            + Novo
          </div>
        </div>

        {modalCriar && (
          <Modal title="Novo Álbum" onClose={() => setModalCriar(false)}>
            <input
              style={styles.input}
              value={novoNome}
              onChange={(e) => setNovoNome(e.target.value)}
            />
            <button style={styles.mainBtn} onClick={criar}>
              Criar
            </button>
          </Modal>
        )}

        {modalRenomear && (
          <Modal title="Renomear Álbum" onClose={() => setModalRenomear(false)}>
            <input
              style={styles.input}
              value={renomearNome}
              onChange={(e) => setRenomearNome(e.target.value)}
            />
            <button style={styles.mainBtn} onClick={renomear}>
              Salvar
            </button>
          </Modal>
        )}

        {modalDelete && (
          <Modal title="Confirmar exclusão" onClose={() => setModalDelete(false)}>
            <p>Deseja realmente deletar?</p>
            <button style={styles.btnDanger} onClick={confirmarDelete}>
              Confirmar
            </button>
          </Modal>
        )}
      </div>
    );
  }

  // =========================
  // FOTOS
  // =========================
  return (
    <div style={styles.container}>
      <button onClick={() => setAlbumSelecionado(null)}>Voltar</button>

      <div style={styles.grid}>
        {fotos.map((f) => (
          <div key={f.id} style={styles.card}>
            <img src={f.url} style={styles.img} />

            <button
              style={styles.btnDanger}
              onClick={() =>
                deletarFoto(f.id).then(() => abrirAlbum(albumSelecionado))
              }
            >
              Deletar
            </button>
          </div>
        ))}

        <div style={styles.add}>
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={(e) => setFile(e.target.files[0])}
          />

          <label htmlFor="file">Selecionar</label>

          {file && (
            <button style={styles.mainBtn} onClick={upload}>
              Enviar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// =========================
// MODAL
// =========================
function Modal({ children, title, onClose }) {
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3>{title}</h3>
        {children}
        <button style={styles.close} onClick={onClose}>
          Fechar
        </button>
      </div>
    </div>
  );
}

// =========================
// ESTILO RESPONSIVO REAL
// =========================

const styles = {
  container: {
    padding: "10px",
    minHeight: "100vh",
    background: "#f5f5f5",
    maxWidth: "900px",
    margin: "0 auto",
  },

  title: {
    textAlign: "center",
    marginBottom: 20,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: 12,
  },

  card: {
    background: "#fff",
    padding: 10,
    borderRadius: 10,
    boxSizing: "border-box",
  },

  img: {
    width: "100%",
    height: 140,
    objectFit: "cover",
    borderRadius: 8,
  },

  nome: {
    marginTop: 6,
    fontWeight: "bold",
    fontSize: 14,
  },

  actions: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    marginTop: 10,
  },

  btn: {
    padding: 8,
    border: "none",
    borderRadius: 6,
    background: "#e0e0e0",
    cursor: "pointer",
    fontSize: 13,
  },

  btnDanger: {
    padding: 8,
    border: "none",
    borderRadius: 6,
    background: "#ff4d4d",
    color: "#fff",
    cursor: "pointer",
    fontSize: 13,
  },

  add: {
    height: 140,
    borderRadius: 10,
    background: "#ddd",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: 14,
  },

  mainBtn: {
    marginTop: 10,
    width: "100%",
    padding: 10,
    border: "none",
    background: "#333",
    color: "#fff",
    borderRadius: 6,
  },

  input: {
    width: "100%",
    padding: 10,
    marginTop: 10,
    boxSizing: "border-box",
  },

  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  modal: {
    background: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "90%",
    maxWidth: 320,
  },

  close: {
    marginTop: 10,
    width: "100%",
    padding: 8,
    border: "none",
    background: "#ccc",
  },
};

export default App;