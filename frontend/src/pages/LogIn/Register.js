import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const handleRegister = () => {

        if (!username || !email || !password) {
            setError('Username, email and password are required.');
            return;
        }

        axios.post('http://localhost:4000/register', {
            username: username,
            email: email,
            password: password
        }).then((response) => {
            // Handle success...
            navigate('/');
        }).catch((error) => {
            // Check for error response and display a relevant message
            if (error.response && error.response.data.error) {
                setError(error.response.data.error);
            } else {
                // Generic error message for other errors
                setError('An error occurred. Please try again.');
            }
        });
        
    };

    return (
        <div>
            <h2>Register</h2>
            {error && <p>{error}</p>}
            <form method='post'>
                <input
                    required
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    required
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    required
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleRegister}>Sign Up</button>
            </form>
            <p>Already registered? <Link to="/login">Click here</Link> to create an account.</p>        </div>
    );
};

export default Register;