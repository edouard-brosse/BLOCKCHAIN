import React, { useState } from 'react';
import { Button, Input } from '@mantine/core';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');  
  const [checkPassword, setCheckPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    e.preventDefault();
    const response = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    console.log(data);
    // Logique de connexion...
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    console.log(data); // Traitez la réponse de votre serveur ici
  };

  return (
    <div className="App">
      <form onSubmit={isRegistering ? handleRegister : handleLogin}>
        <Input 
          size="md"
          radius="md"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <Input 
          size="md"
          radius="md"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        {isRegistering === true ?
        <div>
          <Input  
            size="md"
            radius="md"
            type='password'
            value={checkPassword}
            placeholder='Confirm Password'
            onChange={(e) => setCheckPassword(e.target.value)}
          />
          <Button disabled={password !== checkPassword} type="submit">{isRegistering ? 'Register' : 'Login'}</Button>
        </div> : 
        <Button type="submit">{isRegistering ? 'Register' : 'Login'}</Button>      }
       
      </form>
      <Button onClick={() => setIsRegistering(!isRegistering)}>
        {isRegistering ? 'Go to Login' : 'Go to Register'}
      </Button>
    </div>
  );
}