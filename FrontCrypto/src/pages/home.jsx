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
      const fetchFeeds = async () => {
        try {
          const response = await fetch('https://back-express-project-8n22.vercel.app/feeds');
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

                setWallet(wallet);
            
                // Obtenir le solde du wallet
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
            setUser(data);
        } else {
            console.error(data.message);

        }
    };

    fetchProfile();

    fetchFeeds();

    }, []);

      const handleBuy = async (feedId) => {
        const buyerEmail = user.email;
        try {
            const response = await fetch(`https://back-express-project-8n22.vercel.app/buy-feed/${feedId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ buyerEmail })
            });
    
            const data = await response.json();
            if (response.ok) {
                console.log('Offer purchased and marked as sold successfully:', data);

            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Failed to purchase offer:', error.message);
        }
    };

    const BuyOffer = async (feed) => {
        if (!feed) {
            console.error("No feed data to process");
            return;
        }
    
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
              <Text weight={500}>Article: {feed.name}</Text>
              <Text weight={500}> prix: {feed.price} XRP</Text>
            </Group>
            <Text size="sm" style={{ lineHeight: 1.5 }}>
              Description: {feed.description}

            </Text>
            {(user && feed && user.email !== feed.creatorEmail) && (
                <Button
                  variant="light"
                  color="blue"
                  fullWidth
                  style={{ marginTop: 14 }}
                  onClick={() => BuyOffer(feed)}
                >
                  Buy now
                </Button>
            )}
            
          </Card>
        ))}
      </SimpleGrid>
    </div>
  );
}

export default Home;

