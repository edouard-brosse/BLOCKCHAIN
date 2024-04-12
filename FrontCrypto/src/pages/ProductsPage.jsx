import React, { useEffect } from 'react';
import { useXRPL } from '../context/xrplcontext';

function ProductsPage() {
  const { getWalletFromSeed, generateNewWallet, getNFTFromWallet, getBalanceFromWallet, mintNFT, burnNFT} = useXRPL();
  useEffect(() => {

  }, []);
  
  return (
    <div>

    </div>
  );
}

export default ProductsPage;
