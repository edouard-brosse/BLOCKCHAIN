import React, { useState, useEffect } from 'react';


import { useXRPL } from '../context/xrplcontext';

import { Button, Text, Card } from '@mantine/core';


function ProfilePage() {
    const [walletAddress, setWalletAddress] = useState('');
    const [user, setUser] = useState({ email: '', walletAddress: '' });
    const [wallet, setWallet] = useState('');
    const [Balance, setBalance] = useState('');
    const [feeds, setFeeds] = useState([]);

    const { getWalletFromSeed, generateNewWallet, getNFTFromWallet, getBalanceFromWallet, mintNFT, burnNFT} = useXRPL();

    

    useEffect(() => {
      const fetchProfile = async () => {
          const response = await fetch('https://back-express-project-8n22.vercel.app/profile', {
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
                  setWallet(wallet);  // Mettre à jour l'état avec l'objet wallet
  

                  if (wallet.address) {
                      const balance = await getBalanceFromWallet(wallet.address);
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

          }
      };
  
      fetchProfile();
  }, []);

  useEffect(() => {
    const fetchUserFeeds = async () => {
        const email = user.email;
        const response = await fetch(`https://back-express-project-8n22.vercel.app/user-feeds?email=${encodeURIComponent(email)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        });

        if (response.ok) {
            const data = await response.json();
            setFeeds(data);
        } else {
            console.error('Failed to fetch user feeds');
        }
    };

    if (user.email) {
        fetchUserFeeds();
    }
}, [user.email]);
  



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
        const response = await fetch('https://back-express-project-8n22.vercel.app/updateProfile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
            body: JSON.stringify({ walletAddress }),
        });

        const data = await response.json();
        console.log(data.message);
        

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
        <h2>Vos Offres</h2>
        {feeds.map(feed => (
            <Card key={feed.id} shadow="sm" padding="lg">
                
            <Text>Article: {feed.name}</Text>
            <Text>Description: {feed.description}</Text>
            <Text>prix: {feed.price} XRP</Text>
            <Text>Statut: {feed.isSold ? 'Vendu' : 'En vente'}</Text>
            </Card>
        ))}
        {(user.walletAddress && user.walletAddress !== 'Non définie') && (
            <p>Solde du wallet {Balance} XRP</p>
            
        )}
        
        
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