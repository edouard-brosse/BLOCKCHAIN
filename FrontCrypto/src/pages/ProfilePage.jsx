import React, { useState, useEffect } from 'react';

import { useXRPL } from '../context/xrplcontext';

import { Button, Text } from '@mantine/core';


function ProfilePage() {
    const [walletAddress, setWalletAddress] = useState('');
    const [user, setUser] = useState({ email: '', walletAddress: '' });
    const [wallet, setWallet] = useState('');
    const [Balance, setBalance] = useState('');

    const { getWalletFromSeed, generateNewWallet, getNFTFromWallet, getBalanceFromWallet, mintNFT, burnNFT} = useXRPL();

    

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
          if (data.walletAddress) {
              try {
                  // Obtenir le wallet à partir de la seed
                  const wallet = await getWalletFromSeed(data.walletAddress);
                  console.log("wallet = ", wallet);
                  setWallet(wallet);  // Mettre à jour l'état avec l'objet wallet
  
                  // Obtenir le solde du wallet
                  if (wallet.address) {
                      const balance = await getBalanceFromWallet(wallet.address);
                      console.log("balance = ", balance); // Log du solde, pourrait aussi être stocké dans l'état si nécessaire
                      setBalance(balance);
                  } else {
                      console.log("Aucune adresse valide trouvée pour le wallet.");
                  }
              } catch (error) {
                  console.error("Erreur lors de la récupération du wallet ou du solde :", error);
              }
          }
          if (response.ok) {
              setUser(data);  // Mettre à jour l'état avec les données utilisateur
          } else {
              console.error(data.message);
              // Gérer les erreurs ici, par exemple en affichant un message à l'utilisateur
          }
      };
  
      fetchProfile();
  }, []);
  



    const newWallet = async (e) => {
      const wallet = await generateNewWallet();
      console.log("wallet =", wallet);
      console.log("seed =", wallet.seed);
      handleUpdateProfile(e, wallet.seed);  // Passer directement la seed
  };
  
  const handleUpdateProfile = async (e, walletAddress) => {
    if (e) e.preventDefault();
    const token = localStorage.getItem('token');
    try {
        const response = await fetch('http://localhost:5000/updateProfile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
            body: JSON.stringify({ walletAddress }), // Utiliser directement walletAddress passée en paramètre
        });

        const data = await response.json();
        console.log(data.message);
        
        // Vérifiez si la réponse a été réussie avant de rafraîchir
        if (response.ok) {
            console.log("Profil mis à jour avec succès. Rechargement de la page...");
            window.location.reload();
        } else {
            console.error("La mise à jour a échoué :", data.message);
        }
    } catch (error) {
        console.error("Erreur lors de la mise à jour du profil :", error);
    }
};


    return (
        <div>
        <h1>Votre Profil</h1>
        <p>Email: {user.email}</p>
        {(user.walletAddress && user.walletAddress !== 'Non définie') && (
            <p>Solde du wallet {Balance} XRP</p>
        )}
        
        {/* Conditionnellement afficher le bouton pour ajouter une adresse de wallet si elle n'est pas définie */}
        {(!user.walletAddress || user.walletAddress === 'Non définie') && (
            <button onClick={async () => { await newWallet()}}>Generate new wallet</button>
        )}
        <Button
                    onClick={(e) => { localStorage.clear(); window.location.reload(); }}
                    style={{ marginTop: 10 }}
                    fullWidth
                    color="red"
                >
                    Deconnection
                </Button>
        </div>
    );
}

export default ProfilePage;