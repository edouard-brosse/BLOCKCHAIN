import React, { useState, useEffect } from 'react';
import { useXRPL } from '../context/xrplcontext';
import { Button, TextInput, Textarea } from '@mantine/core';

function ProductsPage() {
  const { getWalletFromSeed, generateNewWallet, getNFTFromWallet, getBalanceFromWallet, mintNFT, burnNFT, createOffer} = useXRPL();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [wallet, setWallet] = useState('');
  const [user, setUser] = useState({ email: '', walletAddress: '' });

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
              // Obtenir le wallet à partir de la seed
              const wallett = await getWalletFromSeed(data.walletAddress);
              setWallet(wallett);  // Mettre à jour l'état avec l'objet wallet
      }
      if (response.ok) {
          setUser(data);  // Mettre à jour l'état avec les données utilisateur
      } else {
          console.error(data.message);
      }
  };

  fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user.email) {
        console.error("User email is not loaded yet!");
        return;
    }

    const nftResponse = await mintNFT(wallet, description);

    if (nftResponse && nftResponse.result && nftResponse.result.meta && nftResponse.result.meta.nftoken_id) {
        const nftId = nftResponse.result.meta.nftoken_id;
        const offerId = await createOffer(wallet, nftId, price);

        try {
          const response = await fetch('http://localhost:5000/feed', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
            body: JSON.stringify({ 
              name, 
              description, 
              price, 
              nftId, 
              offerId, 
              creatorEmail: user.email,
              isSold: false
            })
          });
           

            const data = await response.json();
            if (response.ok) {
                console.log('Product added successfully:', data);
            } else {
                console.error('Failed to add product:', data.message);
            }
        } catch (error) {
            console.error('Error submitting the product:', error);
        }
    } else {
        console.error('Failed to mint NFT or NFT ID not retrieved.');
    }
};

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <TextInput
          label="Name of the product"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter product name"
          required
        />
        <Textarea
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter product description"
          required
        />
        <TextInput
          label="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Enter price"
          required
        />
        <Button type="submit">Put on Sale</Button>
      </form>
    </div>
  );
}

export default ProductsPage;