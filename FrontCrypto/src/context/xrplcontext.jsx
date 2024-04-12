import React, { createContext, useContext, useState, useEffect } from 'react';
import { Client, Wallet, convertStringToHex, SubmittableTransaction } from 'xrpl';



const XRPLContext = createContext(undefined);

export const useXRPL = () => {
    const context = useContext(XRPLContext);
    if (!context) {
        throw new Error('useXRPL must be used within a xrplProvider');
    }
    return context;
};


export const XRPLProvider = ({ children }) => {
    const [xrplClient, setXRPLClient] = useState(undefined);

    const getWalletFromSeed = async (seed) => { // retourne un wallet depuis un seed (clé privé)
        if (!seed || seed.length !== 31) return (undefined);
        const wallet = Wallet.fromSeed(seed);
        return (wallet ? wallet : undefined);
    };

    const generateNewWallet = async () => { // Crétion d'un wallet et le return
        if (xrplClient && xrplClient !== null && xrplClient !== undefined) {
            const wallet = (await xrplClient?.fundWallet(null, { faucetHost: undefined }))?.wallet
            return (wallet ? wallet : undefined);
        }
    };

    const getBalanceFromWallet = async (walletAddress) => { // Savoir combien il y a dans le wallet
        const balance = await xrplClient?.getXrpBalance(walletAddress);
        console.log("balance got from the wallet address:", balance);
        return (balance);
    }

    const mintNFT = async (userWallet, URI) => { // Créer un Nft uri = objet  / rajouté une collection avec tout les nft  qui contient NFTtokenId , description
        const transaction = {
            "TransactionType": "NFTokenMint",
            "Account": userWallet?.classicAddress,
            "URI": convertStringToHex(JSON.stringify(URI)), 
            "Flags": 8,
            "TransferFee": 10000,
            "NFTokenTaxon": 0
        };
        const tsx = await xrplClient?.submitAndWait(transaction, { wallet: userWallet });
        console.log("result from nft transaction mint:", tsx);
        return (tsx);
    };

    const getNFTFromWallet = async (walletAddress) => { // nft possèdé
        const requestData = {
            method: "account_nfts",
            account: walletAddress,
        };
        if (xrplClient && !xrplClient.isConnected()) {
            await xrplClient.connect();
            console.log("reconnecting client");
        }
        const listOfNFT = await xrplClient?.request(requestData);
        console.log("list of nfts of the account:", walletAddress, "equal to:", listOfNFT?.result?.account_nfts);
        return (listOfNFT?.result?.account_nfts ? listOfNFT?.result?.account_nfts : undefined);
    };

    const burnNFT = async (userWallet, NFTokenID) => { // kill nft
        const transaction = {
            "TransactionType": "NFTokenBurn",
            "Account": userWallet?.classicAddress,
            "NFTokenID": NFTokenID,
        };

        const tsx = await xrplClient?.submitAndWait(transaction, { wallet: userWallet })
        console.log("result from nft transaction burn:", tsx);
        return (tsx && tsx !== null ? true : false);
    };

    const createOffer = async (userWallet, NFTokenID, price) => { // creer une offre de vente avec un NFT / prend un wallet, un id de nft , price 10000 = 10xrp
                                                                    // rajouté une collection avec tout les nft en vente qui contient NFTtokenId, , offerId, description, prix
        const transactionBlob = {
            "TransactionType": "NFTokenCreateOffer",
            "Account": userWallet?.classicAddress,
            "NFTokenID": NFTokenID,
            "Amount": price.toString() + '00000',
            "Flags": 1
        };
        const tsx = await xrplClient?.submitAndWait(transactionBlob, { wallet: userWallet });
        return (tsx?.result?.meta && tsx?.result?.meta?.offer_id ? tsx?.result?.meta?.offer_id : undefined); // recuperer l offerId et le stocker dans la db 
    };

    const acceptOffer = async (userWallet, offerNFTokenID) => {
        const transactionBlob = {
            "TransactionType": "NFTokenAcceptOffer",
            "Account": userWallet?.classicAddress,
            "NFTokenSellOffer": offerNFTokenID,
        };
        const tsx = await xrplClient?.submitAndWait(transactionBlob, { wallet: userWallet });
        console.log("result from accept offer transaction:", tsx);
        return (tsx && tsx !== null ? true : false);
    };

    useEffect(() => { // connection au client 
        console.log("xrplclient = ", xrplClient);
        if (xrplClient && !xrplClient.isConnected()) {
            xrplClient.connect();
            console.log("client connected");
        } else {
            console.log("xrplClient not found");
        }
        return () => {
            if (xrplClient) {
                xrplClient.disconnect();
                console.log("client Disconnected");
            } else {
                console.log("xrplClient not found");
            }
        };
    }, [xrplClient]);

    useEffect(() => { // initialise le client avec l'adresse du test net
        const initializeXRPLClient = async () => {
            const client = new Client('wss://s.devnet.rippletest.net:51233/');
            console.log("clinet = ", client);
            client && setXRPLClient(client);
        }

        initializeXRPLClient();
    }, []);

    return (
        <XRPLContext.Provider value={{ xrplClient, getWalletFromSeed, generateNewWallet, getNFTFromWallet, getBalanceFromWallet, mintNFT, burnNFT, createOffer, acceptOffer}}>
            {children}
        </XRPLContext.Provider>
    );
};

