import React, { useState, useEffect } from 'react';
import { useXRPL } from '../context/xrplcontext';
import { Button, TextInput, Textarea } from '@mantine/core'; // Supposons l'utilisation de Mantine pour les composants UI

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
              console.log("wallet = ", wallett);
              setWallet(wallett);  // Mettre à jour l'état avec l'objet wallet
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nftId = await mintNFT(wallet, description);  // This should now return the NFT ID
    console.log("nftId =", nftId);
    console.log("nfTokenId =", nftId.result.meta.nftoken_id);

    if (nftId) {
        const offerId = await createOffer(wallet, nftId.result.meta.nftoken_id, price);
        console.log("offerId =", offerId);

        try {
            const response = await fetch('http://localhost:5000/feed', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, description, price, nftId, offerId })
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