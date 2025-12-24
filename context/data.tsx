
import React, { createContext, useContext, useEffect, useState } from 'react';
import { MOCK_CATEGORIES, MOCK_RESTAURANTS } from '../services/mock_api';

// --- Types ---
export interface MenuItem {
    id: string;
    name: string;
    price: number;
    description: string;
    category: string;
    available?: boolean;
    image?: string;
}

export interface Restaurant {
    id: string;
    name: string;
    rating: number;
    categories: string[];
    deliveryTime: string;
    image: string;
    menu: MenuItem[];
}

export interface Category {
    id: string;
    name: string;
    icon: string;
}

export type OrderStatus = 'Pending' | 'Preparing' | 'On the way' | 'Delivered' | 'Cancelled';

export interface OrderItem {
    menuItemId: string;
    name: string;
    quantity: number;
    price: number;
}

export interface Order {
    id: string;
    userId: string;
    userName: string;
    restaurantId: string;
    restaurantName: string;
    items: OrderItem[];
    totalAmount: number;
    status: OrderStatus;
    date: Date;
    address: string;
}

export interface UserProfile {  // Extension of Auth User basically
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    active: boolean;
    phone?: string;
    address?: string;
}

interface DataContextType {
    restaurants: Restaurant[];
    categories: Category[];
    orders: Order[];
    users: UserProfile[]; // For admin management

    // Restaurant Actions
    addRestaurant: (r: Omit<Restaurant, 'id'>) => void;
    updateRestaurant: (id: string, r: Partial<Restaurant>) => void;
    deleteRestaurant: (id: string) => void;

    // Menu Actions
    addMenuItem: (restaurantId: string, item: Omit<MenuItem, 'id'>) => void;
    updateMenuItem: (restaurantId: string, itemId: string, item: Partial<MenuItem>) => void;
    deleteMenuItem: (restaurantId: string, itemId: string) => void;

    // Order Actions
    placeOrder: (order: Omit<Order, 'id' | 'date' | 'status'>) => void;
    updateOrderStatus: (orderId: string, status: OrderStatus) => void;

    // User Actions
    updateUserProfile: (userId: string, data: Partial<UserProfile>) => void;
    toggleUserStatus: (userId: string) => void; // Activate/Deactivate

    // Initializer
    refreshData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
    const [restaurants, setRestaurants] = useState<Restaurant[]>(MOCK_RESTAURANTS);
    const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
    const [orders, setOrders] = useState<Order[]>([]);
    const [users, setUsers] = useState<UserProfile[]>([]);

    // We can simulate some initial orders if we want
    useEffect(() => {
        // Mock some initial orders
        setOrders([
            {
                id: 'ord_1',
                userId: 'user_1',
                userName: 'John Doe',
                restaurantId: '1',
                restaurantName: 'Burger Bistro',
                items: [{ menuItemId: '101', name: 'Classic Cheeseburger', quantity: 2, price: 12.99 }],
                totalAmount: 25.98,
                status: 'Preparing',
                date: new Date(),
                address: '123 Main St'
            }
        ]);

        // Mock some users (synced conceptually with Auth, but stored here for Admin view)
        setUsers([
            { id: 'user_admin', name: 'Admin User', email: 'admin@test.com', role: 'admin', active: true },
            { id: 'user_1', name: 'John Doe', email: 'john@test.com', role: 'user', active: true, phone: '555-0100', address: '123 Main St' }
        ]);
    }, []);

    // --- Actions ---

    const addRestaurant = (r: Omit<Restaurant, 'id'>) => {
        const newR = { ...r, id: Math.random().toString(36).substr(2, 9) };
        setRestaurants(prev => [...prev, newR]);
    };

    const updateRestaurant = (id: string, r: Partial<Restaurant>) => {
        setRestaurants(prev => prev.map(item => item.id === id ? { ...item, ...r } : item));
    };

    const deleteRestaurant = (id: string) => {
        setRestaurants(prev => prev.filter(item => item.id !== id));
    };

    const addMenuItem = (restaurantId: string, item: Omit<MenuItem, 'id'>) => {
        const newItem = { ...item, id: Math.random().toString(36).substr(2, 9) };
        setRestaurants(prev => prev.map(r => {
            if (r.id === restaurantId) {
                return { ...r, menu: [...(r.menu || []), newItem] };
            }
            return r;
        }));
    };

    const updateMenuItem = (restaurantId: string, itemId: string, item: Partial<MenuItem>) => {
        setRestaurants(prev => prev.map(r => {
            if (r.id === restaurantId) {
                return {
                    ...r,
                    menu: r.menu.map(m => m.id === itemId ? { ...m, ...item } : m)
                };
            }
            return r;
        }));
    };

    const deleteMenuItem = (restaurantId: string, itemId: string) => {
        setRestaurants(prev => prev.map(r => {
            if (r.id === restaurantId) {
                return {
                    ...r,
                    menu: r.menu.filter(m => m.id !== itemId)
                };
            }
            return r;
        }));
    };

    const placeOrder = (order: Omit<Order, 'id' | 'date' | 'status'>) => {
        const newOrder: Order = {
            ...order,
            id: 'ord_' + Math.random().toString(36).substr(2, 9),
            date: new Date(),
            status: 'Pending'
        };
        setOrders(prev => [newOrder, ...prev]);
    };

    const updateOrderStatus = (orderId: string, status: OrderStatus) => {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    };

    const updateUserProfile = (userId: string, data: Partial<UserProfile>) => {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...data } : u));
    };

    const toggleUserStatus = (userId: string) => {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, active: !u.active } : u));
    };

    const refreshData = () => {
        // Reset to mocks if needed
        setRestaurants(MOCK_RESTAURANTS);
        setCategories(MOCK_CATEGORIES);
    };

    return (
        <DataContext.Provider value={{
            restaurants, categories, orders, users,
            addRestaurant, updateRestaurant, deleteRestaurant,
            addMenuItem, updateMenuItem, deleteMenuItem,
            placeOrder, updateOrderStatus,
            updateUserProfile, toggleUserStatus,
            refreshData
        }}>
            {children}
        </DataContext.Provider>
    );
}

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
