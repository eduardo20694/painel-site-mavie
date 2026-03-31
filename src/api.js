import axios from "axios";

export const api = axios.create({
  baseURL: "https://api-mavie-production.up.railway.app"
});

// ÁLBUNS
export const criarAlbum = (nome) => api.post("/album", { nome });
export const listarAlbuns = () => api.get("/albuns");
export const editarAlbum = (id, nome) => api.put(`/album/${id}`, { nome });
export const deletarAlbum = (id) => api.delete(`/album/${id}`);

// UPLOAD
export const uploadArquivo = (file, albumId) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("album_id", albumId);

  return api.post("/upload", formData);
};

// FOTOS
export const listarFotos = (albumId) => api.get(`/fotos/${albumId}`);
export const deletarFoto = (id) => api.delete(`/foto/${id}`);