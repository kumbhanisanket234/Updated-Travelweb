import { useState, useContext, createContext, useEffect } from "react";

const cartContext = createContext();

const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const TOKEN = "sdrheunNAMsndfwejnajNSUFFUEnsdkcnskdfhifhsdnaskdnsadiheirhefnasdndcmasd,dnfsjfhsuhfuicnmnasm==asffsfsdfsdff,sdff"

    return (
        <cartContext.Provider value={[cart, setCart, TOKEN]}>
            {children}
        </cartContext.Provider>
    )
}

const useCartContext = () => {
    const context = useContext(cartContext);
    if (context === undefined) {
        throw new Error("useCartContext must be used within a CartProvider");
    }
    return context;
}

export { CartProvider, useCartContext };