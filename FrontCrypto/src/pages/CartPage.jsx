import React, { useEffect, useState } from 'react';
import { Card, Text } from '@mantine/core';

function CartPage() {
    const [purchases, setPurchases] = useState([]);
    const [user, setUser] = useState({ email: '', walletAddress: '' });

    useEffect(() => {
    const fetchProfileAndPurchases = async () => {
        const profileResponse = await fetch('https://back-express-project-8n22.vercel.app/profile', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        });

        if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            setUser(profileData);  // Set user data

            // Fetch purchases after we have the email
            if (profileData.email) {
                const purchasesResponse = await fetch(`https://back-express-project-8n22.vercel.app/user-purchases?email=${encodeURIComponent(profileData.email)}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (purchasesResponse.ok) {
                    const purchasesData = await purchasesResponse.json();
                    setPurchases(purchasesData);
                } else {
                    console.error('Failed to fetch purchases');
                }
            }
        } else {
            console.error('Failed to fetch profile data');
        }
    };

    fetchProfileAndPurchases();
}, [setUser, setPurchases]); // Dependency array to avoid unnecessary re-fetches

    return (
        <div>
            <h1>Votre Panier</h1>
            {purchases.map((purchase, index) => (
               <Card key={index} shadow="sm" padding="lg">
                
                    <Text>Nom: {purchase.name}</Text>
                    <Text>Description: {purchase.description}</Text>
                    <Text>prix: {purchase.price} XRP</Text>
                </Card>
            ))}
        </div>
    );
}

export default CartPage;