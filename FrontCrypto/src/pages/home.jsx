import React, { useEffect, useState } from 'react';
import { Card, Image, Text, Group, Button, SimpleGrid } from '@mantine/core';
import { useXRPL } from '../context/xrplcontext';

function Home() {
    const [feeds, setFeeds] = useState([]);
    const { getWalletFromSeed, generateNewWallet, getNFTFromWallet, getBalanceFromWallet, mintNFT, burnNFT, acceptOffer} = useXRPL();
    const [wallet, setWallet] = useState('');
    const [user, setUser] = useState({ email: '', walletAddress: '' });
    const [Balance, setBalance] = useState('');

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

    useEffect(() => {
      const fetchFeeds = async () => {
        try {
          const response = await fetch('http://localhost:5000/feeds');
          const data = await response.json();
          if (response.ok) {
            setFeeds(data);
          } else {
            throw new Error(data.message);
          }
        } catch (error) {
          console.error('Error fetching feeds:', error);
        }
      };

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

    fetchFeeds();

    }, []);

    const handleBuy = async (feedId) => {
        try {
          const response = await fetch(`http://localhost:5000/buy-feed/${feedId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
          });
      
          const data = await response.json();
          if (!response.ok) throw new Error(data.message);
          console.log('Purchase successful:', data);
          // Mettre à jour l'état local pour refléter que l'article a été vendu
          setFeeds(currentFeeds => currentFeeds.map(feed => feed._id === feedId ? { ...feed, isSold: true } : feed));
        } catch (error) {
          console.error('Purchase failed:', error);
        }
      };

    const BuyOffer = async (feed) => {
        if (!feed) {
            console.error("No feed data to process");
            return;
        }
    
        console.log("feed data = ", feed);
        if (!feed.offerId) {
            console.error("No offerId found in feed data");
            return;
        }
    
        try {
            await acceptOffer(wallet, feed.offerId);
            console.log("Offer accepted successfully");
            await handleBuy(feed._id);
            window.location.reload();
        } catch (error) {
            console.error("Error accepting offer:", error);
        }
    };

  return (
    <div>
      <h1>Bienvenue sur notre plateforme de vêtements</h1>
      <p>solde: {Balance} XRP</p>
      <SimpleGrid cols={3} spacing="lg" breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
        {feeds.map((feed, index) => (
          <Card key={index} shadow="sm" padding="lg">
            <Card.Section>
            </Card.Section>
            <Group position="apart" style={{ marginBottom: 5, marginTop: 5 }}>
              <Text weight={500}>{feed.name}</Text>
              <Text weight={500}>{feed.price} XRP</Text>
            </Group>
            <Text size="sm" style={{ lineHeight: 1.5 }}>
              {feed.description}
            </Text>
            <Button 
              variant="light" 
              color="blue" 
              fullWidth 
              style={{ marginTop: 14 }} 
              onClick={() => BuyOffer(feed)}  // Assurez-vous que feed est bien passé ici
            >
              Buy now
            </Button>
          </Card>
        ))}
      </SimpleGrid>
    </div>
  );
}

export default Home;

