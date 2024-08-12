// Login Page

'use client';  // Mark this component as a Client Component

import AndroidIcon from '@mui/icons-material/Android';
import { Stack } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import {signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import the useRouter hook for navigation
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import styles from './login.module.css';



export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const router = useRouter();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (username && password) {
            localStorage.setItem('isAuthenticated', 'true');
            router.push('/chat');
        } else {
            setErrorMessage('Invalid username or password');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.heading}>
                <h1 className={styles.title}>AI Chatbot</h1>
                <IconButton color="inherit" style={{ cursor: 'default' }}>
                    <AndroidIcon style={{ fontSize: 90 }} />
                </IconButton>
            </div>
            <Stack className={styles.loginArea} width='100%' border="2px solid white" borderRadius="10px" p={5}>
                <h1 style={{ textAlign: 'center', marginBottom: '20px'}}>Login</h1>

                <form onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label} htmlFor="username">Username</label>
                        <input
                            className={styles.input}
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label className={styles.label} htmlFor="password">Password</label>
                        <input
                            className={styles.input}
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <Tooltip title="Login">
                        <button className={styles.button} type="submit">Login</button>
                    </Tooltip>


                    {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
                </form>

                <h1 style={{ textAlign: 'center', marginTop: '40px', marginBottom: '10px'}}>Or</h1>

                {/* <Tooltip title="Sign in with Google">
                    <button 
                        className={styles.button} 
                        style={{backgroundColor: 'white'}} 
                        onClick={() => signIn('google', { callbackUrl: '/chat' })}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                            <FcGoogle size={20}/>
                            <span style={{ marginLeft: '10px', color: '#007BFF' }}>Sign in with Google</span>
                        </div>
                    </button>
                </Tooltip> */}

                <Tooltip title="Continue as Guest">
                    <Link href="/chat">
                        <button className={styles.button}>Continue as Guest</button>
                    </Link>
                </Tooltip>
            </Stack>
        </div>
    );
}