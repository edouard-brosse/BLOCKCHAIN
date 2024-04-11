import React, { useEffect } from 'react';
import { useXRPL } from '../context/xrplcontext';

function ProductsPage() {
  const { generateNewWallet } = useXRPL();
  useEffect(() => {
    const getWallet = async () => {
    };
    getWallet();
  }, []); 
  return (
    <div>
      <h1>Catalogue de Produits</h1>
      <button onClick={async () => { await generateNewWallet()}}>Generate new wallet</button>
    </div>
  );
}

export default ProductsPage;
