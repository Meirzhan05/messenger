import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    
        // Check if email and password are defined and properly formatted
        if (!email || !password) {
            setError('Email and password are required.');
            return;
        }
    
        axios.post('http://localhost:4000/login', {
            email: email,
            password: password
        }).then((response) => {
            // Check if the token exists in the response
            if (response.data.token) {
                // Save the token to local storage
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                navigate('/');
            }
        }).catch((error) => {
            console.error(error);
            setError('Invalid email or password. Please try again.');
        });
    };

    return (
        <div>
            <h2>Login</h2>
            {error && <p>{error}</p>}
            <form method='post'>
                <label>
                    Email:
                    <input type="email" value={email} onChange={handleEmailChange} />
                </label>
                <br />
                <label>
                    Password:
                    <input type="password" value={password} onChange={handlePasswordChange} />
                </label>
                <br />
                <button onClick={handleSubmit} type="submit">Login</button>
            </form>
            <p>Already registered? <Link to="/register">Click here</Link> to create an account.</p>
        </div>
    );
};

export default Login;