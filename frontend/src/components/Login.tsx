import React, { useState } from "react";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function doLogin(event: React.FormEvent): Promise<void> {
    event.preventDefault();

    const obj = { login: username, password: password };
    const js = JSON.stringify(obj);

    try {
      const response = await fetch("https://ohtheplacesyoullgo.space/api/login", {
        method: "POST",
        body: js,
        headers: { "Content-Type": "application/json" },
      });

      const res = JSON.parse(await response.text());

      if (res.id <= 0) {
        setMessage("User/Password combination incorrect");
        console.log(res.id);
      } else {
        const user = {
          firstName: res.firstName,
          lastName: res.lastName,
          id: res.id,
        };
        localStorage.setItem("user_data", JSON.stringify(user));
        setMessage("");
        window.location.href = "/";
      }
    } catch (error: any) {
      alert(error.toString());
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "80vh",
      }}
    >
      <form
        onSubmit={doLogin}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background: "linear-gradient(to right, #d4145a, #fbb03b)",
          padding: "30px",
          borderRadius: "20px",
          boxShadow: "0 0 10px rgba(0,0,0,0.2)",
        }}
      >
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            padding: "10px",
            fontSize: "1.1rem",
            marginBottom: "15px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            width: "250px",
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            padding: "10px",
            fontSize: "1.1rem",
            marginBottom: "15px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            width: "250px",
          }}
        />
        <input
          type="submit"
          value="Login"
          style={{
            padding: "10px 20px",
            fontSize: "1.1rem",
            borderRadius: "12px",
            border: "none",
            backgroundColor: "#fff",
            color: "#d4145a",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        />
        <p style={{ marginTop: "15px", color: "#fff" }}>{message}</p>
      </form>
    </div>
  );
}

export default Login;
