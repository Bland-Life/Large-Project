import React, { useState } from 'react';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    async function doLogin(event: React.FormEvent): Promise<void> {
        event.preventDefault();

        const obj = { login: username, password: password };
        const js = JSON.stringify(obj);

        try {
            const response = await fetch('https://ohtheplacesyoullgo.space/api/login', {
                method: 'POST',
                body: js,
                headers: { 'Content-Type': 'application/json' }
            });

            const res = JSON.parse(await response.text());

            if (res.id <= 0) {
                setMessage('User/Password combination incorrect');
		console.log(res.id);
            } else {
                const user = {
                    firstName: res.firstName,
                    lastName: res.lastName,
                    id: res.id,
                    username: res.username
                };
                localStorage.setItem('user_data', JSON.stringify(user));
                setMessage('');
                window.location.href = '/Map';
            }
        } catch (error: any) {
            alert(error.toString());
        }
    };

    return (
        <div id="loginDiv">
            <form onSubmit={doLogin}>
                <input
                    type="text"
                    id="username"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <br />
                <input
                    type="password"
                    id="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <br />
                <div className='button-container'>
                    <input
                        type="submit"
                        id="loginButton"
                        className="button"
                        value="Login"
                    />
                </div>
            </form>
            <p id="error">{message}</p>
        </div>
    );
}

export default Login;
