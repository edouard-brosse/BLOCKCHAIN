import React, { useState } from 'react';
import { Button, Input } from '@mantine/core';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');  
  const [checkPassword, setCheckPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLogin = async (e) => {
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

    if (data.token) {
        // Enregistrer le token dans localStorage
        localStorage.setItem('token', data.token);

        // Redirection de l'utilisateur ou mise à jour de l'état de l'application après la connexion réussie
        console.log("Connexion réussie et token enregistré.");
    } else {
        // Gérer les cas d'erreur, par exemple si le token n'est pas fourni
        console.error("Échec de la connexion.");
    }
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
          {/* <Button disabled={password !== checkPassword } type="submit">{isRegistering ? 'Register' : 'Login'}</Button> */}
          <Button type="submit">
            {isRegistering ? 'Register' : 'Login'}
          </Button>
        </div> : 
        <Button  type="submit">{isRegistering ? 'Register' : 'Login'}</Button>      }
       
      </form>
      <Button onClick={() => setIsRegistering(!isRegistering)}>
        {isRegistering ? 'Go to Login' : 'Go to Register'}
      </Button>
    </div>
  );
}