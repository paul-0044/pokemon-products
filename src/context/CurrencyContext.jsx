import React, { createContext, useContext, useState } from 'react';

const CurrencyContext = createContext();

export function CurrencyProvider({ children }) {
  // Primary default currency is strictly USD as requested by user
  const [currency, setCurrency] = useState('USD');

  const formatPrice = (usdPrice, cadPrice) => {
    const numericUSD = parseFloat(usdPrice || 0);
    if (currency === 'CAD') {
      const numericCAD = cadPrice ? parseFloat(cadPrice) : numericUSD / 0.74;
      return `$${numericCAD.toFixed(2)} CAD`;
    }
    return `$${numericUSD.toFixed(2)} USD`;
  };

  const formatRaw = (val) => {
    const num = parseFloat(val || 0);
    return `$${num.toFixed(2)} ${currency}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, formatRaw }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
