import React, { useState } from "react";
import { api } from "../services/api";

function Login() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const login = async () => {
    const res = await api.post("/login", {
      user,
      pass
    });

    localStorage.setItem("token", res.data.token);
    window.location.href = "/dashboard";
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Login Admin</h2>
      <input placeholder="Usuário" onChange={e => setUser(e.target.value)} />
      <input placeholder="Senha" type="password" onChange={e => setPass(e.target.value)} />
      <button onClick={login}>Entrar</button>
    </div>
  );
}

export default Login;