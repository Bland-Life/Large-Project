import React, { useState } from "react";
import '../css/HomePage.css'

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
    <div className="signupContainer">
    
      <form
        onSubmit={doLogin}
      >
        <div className="signupDiv">
          <div className="input-field"><input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          /></div>
          
          <div className="input-field"><input
            className="input-field"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          /></div>
          <p>{message}</p>
        </div>
        <div className='button-signup'>
            <input 
            className="button"
            type="submit"
            value="Login"
          />
        </div>
      </form>
    
    </div>
  );
}

export default Login;
