
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    addFood as addFoodService,
    addRestaurant as addRestaurantService,
    Category,
    createOrder as createOrderService,
    deleteRestaurant as deleteRestaurantService,
    Restaurant as FirestoreRestaurant,
    FoodItem,
    getCategories,
    getFoodsByRestaurant,
    getRestaurants,
    Order,
    subscribeToAllOrders,
    subscribeToUserOrders,
    updateOrderStatusService,
    UserProfile
} from '../services/firestore';
import { useAuth } from './auth';

// Extend FirestoreRestaurant for UI (initially just alias, but we might add menu back conceptually if needed)
export interface Restaurant extends FirestoreRestaurant {
    // Menu is fetched separately, but we might cache it here if needed.
    // For now, let's assume components fetch menu when needed.
}

interface DataContextType {
    restaurants: Restaurant[];
    categories: Category[];
    orders: Order[];
    users: UserProfile[];

    // Actions
    addRestaurant: (r: any) => Promise<void>;
    deleteRestaurant: (id: string) => Promise<void>;
    addMenuItem: (restaurantId: string, item: any) => Promise<void>;
    placeOrder: (order: any) => Promise<void>;
    updateOrderStatus: (orderId: string, status: any) => Promise<void>;
    refreshData: () => void;

    // New Helper
    fetchRestaurantMenu: (restaurantId: string) => Promise<FoodItem[]>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [users, setUsers] = useState<UserProfile[]>([]); // Admin only usually

    const refreshData = async () => {
        try {
            const r = await getRestaurants();
            const c = await getCategories();
            setRestaurants(r);
            setCategories(c);
        } catch (e) {
            console.error("Error fetching data", e);
        }
    };

    useEffect(() => {
        refreshData();
    }, []);

    // Subscribe to Orders based on Role
    useEffect(() => {
        if (!user) {
            setOrders([]);
            return;
        }

        let unsubscribe: () => void;

        if (user.role === 'admin') {
            unsubscribe = subscribeToAllOrders((newOrders) => {
                setOrders(newOrders);
            });
        } else {
            unsubscribe = subscribeToUserOrders(user.id, (newOrders) => {
                setOrders(newOrders);
            });
        }

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [user]);

    const addRestaurant = async (r: any) => {
        await addRestaurantService(r);
        refreshData();
    };

    const deleteRestaurant = async (id: string) => {
        await deleteRestaurantService(id);
        refreshData();
    };

    const addMenuItem = async (restaurantId: string, item: any) => {
        await addFoodService({ ...item, restaurantId, isAvailable: true });
    };

    const placeOrder = async (order: any) => {
        await createOrderService(order);
    };

    const updateOrderStatus = async (orderId: string, status: any) => {
        await updateOrderStatusService(orderId, status);
    };

    const fetchRestaurantMenu = async (restaurantId: string) => {
        return await getFoodsByRestaurant(restaurantId);
    };

    return (
        <DataContext.Provider value={{
            restaurants, categories, orders, users,
            addRestaurant, deleteRestaurant,
            addMenuItem,
            placeOrder, updateOrderStatus,
            refreshData,
            fetchRestaurantMenu
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
