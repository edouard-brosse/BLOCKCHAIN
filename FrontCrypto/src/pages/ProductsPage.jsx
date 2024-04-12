import React, { useEffect } from 'react';
import { useXRPL } from '../context/xrplcontext';

function ProductsPage() {
  const { getWalletFromSeed, generateNewWallet, getNFTFromWallet, getBalanceFromWallet, mintNFT, burnNFT} = useXRPL();
  useEffect(() => {

  }, []);
  
  return (
    <div>
      <h1>Products</h1>
    </div>
  );
}

export default ProductsPage;
