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
      display: "flex",
      flexDirection: "column",
      alignItems: "center",      // canh giữa ngang
      justifyContent: "center",  // canh giữa dọc
      minHeight: "100vh",        // chiếm full height viewport
      textAlign: "center",
      padding: "40px",
      backgroundColor: "purple", // nếu muốn chắc chắn nền tím
    }}
  >
    <h2 style={{ color: "white", marginBottom: "20px" }}>Enter Password</h2>

    <input
      type="password"
      onChange={(e) => setInput(e.target.value)}
      style={{
        margin: "10px 0",
        padding: "10px 15px",
        borderRadius: "5px",
        border: "1px solid white",
        backgroundColor: "rgba(255,255,255,0.1)",
        color: "white",           // chữ nhập màu trắng
        textAlign: "center",
        outline: "none",
      }}
    />

    <button
      onClick={handleLogin}
      style={{
        padding: "10px 20px",
        borderRadius: "5px",
        border: "none",
        backgroundColor: "white",
        color: "purple",
        fontWeight: "bold",
        cursor: "pointer",
        marginTop: "15px",
      }}
    >
      Login
    </button>
  </div>
);
