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
  <div
    style={{
      color: "white",            // chữ trắng
      display: "flex",
      flexDirection: "column",
      alignItems: "center",      // canh giữa ngang
      justifyContent: "center",  // canh giữa dọc
      height: "100vh",           // full height viewport
      textAlign: "center",       // chữ canh giữa
      padding: 40,
    }}
  >
    <h2>Enter Password</h2>
    <input
      type="password"
      onChange={(e) => setInput(e.target.value)}
      style={{
        margin: "10px 0",
        padding: "8px 12px",
        borderRadius: "4px",
        border: "1px solid #ccc",
        textAlign: "center",
      }}
    />
    <button
      onClick={handleLogin}
      style={{
        padding: "8px 16px",
        borderRadius: "4px",
        border: "none",
        backgroundColor: "#fff",
        color: "purple",
        cursor: "pointer",
        fontWeight: "bold",
      }}
    >
      Login
    </button>
  </div>
);
