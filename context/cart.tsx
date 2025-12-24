
import React, { createContext, useContext, useState } from 'react';

export interface CartItem {
    id: string; // Creates a unique ID for the cart entry (e.g. itemId + options)
    menuItemId: string;
    restaurantId: string;
    name: string;
    price: number;
    quantity: number;
    description?: string;
}

interface CartContextType {
    items: CartItem[];
    addItem: (item: Omit<CartItem, 'id'>) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    totalAmount: number;
    totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    const addItem = (item: Omit<CartItem, 'id'>) => {
        setItems((currentItems) => {
            const existingItemIndex = currentItems.findIndex(
                (i) => i.menuItemId === item.menuItemId && i.restaurantId === item.restaurantId
            );

            if (existingItemIndex > -1) {
                // Update quantity if item exists
                const newItems = [...currentItems];
                newItems[existingItemIndex].quantity += item.quantity;
                return newItems;
            } else {
                // Add new item
                return [...currentItems, { ...item, id: Math.random().toString(36).substr(2, 9) }];
            }
        });
    };

    const removeItem = (id: string) => {
        setItems((current) => current.filter((item) => item.id !== id));
    };

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity <= 0) {
            removeItem(id);
            return;
        }
        setItems((current) =>
            current.map((item) => (item.id === id ? { ...item, quantity } : item))
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalAmount, totalItems }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
