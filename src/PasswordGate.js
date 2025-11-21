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
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      textAlign: "center",
      padding: 40,
      color: "white", // áp dụng cho text bình thường (h2)
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
        color: "white",           // chữ nhập trong input
        backgroundColor: "rgba(255,255,255,0.1)", // nền input nhẹ để thấy chữ trắng
        borderColor: "white",     // viền trắng
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
