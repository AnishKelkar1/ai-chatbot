'use client'
import { useRouter } from 'next/navigation';

export default function AuthError() {
  const router = useRouter();


  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100vh', alignItems: 'center', textAlign: 'center'}}>
        <h1 style={{fontSize: '60px', marginBottom: '40px'}}>Oops!</h1>
        <p style={{fontSize: '20px', marginBottom: '20px'}}>There was an authentication error.</p>
        <button style={{ width: 'auto', padding: '10px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '30px' , fontSize: '20px' }} onClick={() => router.push('/')}>Return to Login</button>
    </div>
  );
}