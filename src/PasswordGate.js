import React, { useState } from "react";

export default function PasswordGate({ children }) {
  const [input, setInput] = useState("");
  const correctPass = "camonthayco";
  const saved = localStorage.getItem("auth_pass") === correctPass;

  const handleLogin = () => {
    if (input === correctPass) {
      localStorage.setItem("auth_pass", input);
      window.location.reload();
    } else {
      alert("Sai mật khẩu!");
    }
  };

  if (saved) return children;

  return (
    <div style={{ padding: 40 }}>
      <h2>Enter Password</h2>
      <input
        type="password"
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
