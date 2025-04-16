import React, { useState } from 'react';


function SignUp() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  return (
    <div id="signupDiv" style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '80vh',
      flexDirection: 'column',
      background: 'transparent'
    }}>
      <form style={{
        background: 'linear-gradient(to right, #D81E5B, #F0544F, #FFA630)',
        padding: '3rem',
        borderRadius: '20px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        minWidth: '300px',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        fontSize: '1.1rem',
        color: 'white'
      }}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ padding: '0.8rem', borderRadius: '10px', border: 'none' }}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: '0.8rem', borderRadius: '10px', border: 'none' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: '0.8rem', borderRadius: '10px', border: 'none' }}
        />
        <input
          type="submit"
          value="Sign Up"
          style={{
            backgroundColor: 'white',
            color: '#F0544F',
            fontWeight: 'bold',
            borderRadius: '10px',
            padding: '0.8rem',
            border: 'none',
            cursor: 'pointer'
          }}
        />
      </form>
      <p style={{ marginTop: '1rem', color: 'red' }}>{message}</p>
    </div>
  );
}

export default SignUp;
