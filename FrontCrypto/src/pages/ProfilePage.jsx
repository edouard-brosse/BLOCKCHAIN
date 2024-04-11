import React, { useState, useEffect } from 'react';

function ProfilePage() {
    const [walletAddress, setWalletAddress] = useState('');

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/updateProfile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token'), // Supposons que le token JWT soit stocké dans localStorage
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
        </div>
    );
}

export default ProfilePage;