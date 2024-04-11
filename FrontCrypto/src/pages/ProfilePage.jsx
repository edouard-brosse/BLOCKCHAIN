import React, { useState, useEffect } from 'react';
import { Button, Text } from '@mantine/core';

function ProfilePage() {
    const [walletAddress, setWalletAddress] = useState('');
    const [user, setUser] = useState({ email: '', walletAddress: '' });


    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        console.log("token = ", token);
        try {
            const response = await fetch('http://localhost:5000/updateProfile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token, // Supposons que le token JWT soit stocké dans localStorage
                },
                body: JSON.stringify({ walletAddress }),
            });

            const data = await response.json();
            console.log(data.message);
            // Afficher un message de succès ou gérer la réponse ici
        } catch (error) {
            console.error("Erreur lors de la mise à jour du profil :", error);
            // Gérer l'erreur ici
        }
    };

    useEffect(() => {
        const fetchProfile = async () => {
            const response = await fetch('http://localhost:5000/profile', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            });

            const data = await response.json();
            if (response.ok) {
                setUser(data);
            } else {
                console.error(data.message);
                // Gérer les erreurs ici, par exemple en affichant un message à l'utilisateur
            }
        };

        fetchProfile();
    }, []);


    return (
        <div>
            <h1>Votre Profil</h1>
            <form onSubmit={handleUpdateProfile}>
                <input
                    type="text"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    placeholder="Adresse du Wallet XRP"
                />
                <button type="submit">Mettre à jour le profil</button>
              
            </form>
            <div >
                <Text>Adresse du Wallet XRP: {walletAddress}</Text>
                <Text>localStorage: {localStorage.getItem('token')} | {localStorage.getItem('email')} </Text>
                <Button onClick={(e) => {localStorage.clear()}}> unregister</Button>
                <br />
                <p>Email: {user.email}</p>
                <p>Adresse Wallet XRP: {user.walletAddress}</p>
                {/* Conditionnellement afficher le bouton pour ajouter une adresse de wallet si elle n'est pas définie */}
                {(!user.walletAddress || user.walletAddress === 'Non définie') && (
                <button onClick={() => {/* Logique pour ajouter une adresse de wallet */}}>
                    Ajouter une adresse de Wallet XRP
                </button>
            )}
            </div>
        </div>
    );
}

export default ProfilePage;