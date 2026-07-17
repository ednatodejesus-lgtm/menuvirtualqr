import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from '../services/supabase';

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    // 1. Login no Supabase Auth
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError) {
      setError(authError.message);
      return;
    }


    // 2. Buscar perfil do usuário
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", authData.user.id)
      .single();


    if (profileError) {
      setError("Perfil não encontrado");
      return;
    }


    // 3. Redirecionar pela role
    if (profile.role === "super_admin") {
      navigate("/SuperAdminDashboard");
    } 

    else if (profile.role === "admin") {
      navigate("/AdminDashboard");
    }

    else {
      setError("Usuário sem permissão");
    }
  }


  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />


        <button type="submit">
          Entrar
        </button>

      </form>


      {error && (
        <p>{error}</p>
      )}

    </div>
  );
}