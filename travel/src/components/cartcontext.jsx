import { useState, useContext, createContext } from "react";

const cartContext = createContext();

const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);    
    return (
        <cartContext.Provider value={[cart, setCart]}>
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