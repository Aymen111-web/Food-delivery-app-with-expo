
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    addCategory as addCategoryService,
    addFood as addFoodService,
    addRestaurant as addRestaurantService,
    Category,
    createOrder as createOrderService,
    deleteCategory as deleteCategoryService,
    deleteFood as deleteFoodService,
    deleteRestaurant as deleteRestaurantService,
    Restaurant as FirestoreRestaurant,
    FoodItem,
    getAllFoods as getAllFoodsService,
    getAllRestaurantsAdmin,
    getAllUsers,
    getCategories,
    getFoodsByRestaurant,
    getRestaurants,
    Order,
    subscribeToAllOrders,
    subscribeToUserOrders,
    toggleUserStatus as toggleUserStatusService,
    updateCategory as updateCategoryService,
    updateFood as updateFoodService,
    updateOrderStatusService,
    updateRestaurant as updateRestaurantService,
    UserProfile
} from '../services/firestore';
import { useAuth } from './auth';

// Extend FirestoreRestaurant for UI
export interface Restaurant extends FirestoreRestaurant {
}

interface DataContextType {
    restaurants: Restaurant[];
    categories: Category[];
    orders: Order[];
    users: UserProfile[];
    allFoods: FoodItem[]; // For search

    // Actions
    addRestaurant: (r: any) => Promise<void>;
    updateRestaurant: (id: string, data: any) => Promise<void>;
    deleteRestaurant: (id: string) => Promise<void>;

    addCategory: (name: string) => Promise<void>;
    updateCategory: (id: string, name: string) => Promise<void>;
    deleteCategory: (id: string) => Promise<void>;

    addMenuItem: (restaurantId: string, item: any) => Promise<void>;
    updateMenuItem: (id: string, item: any) => Promise<void>;
    deleteMenuItem: (id: string) => Promise<void>;

    placeOrder: (order: any) => Promise<void>;
    updateOrderStatus: (orderId: string, status: any) => Promise<void>;

    toggleUserStatus: (uid: string, isActive: boolean) => Promise<void>;

    refreshData: () => void;
    fetchRestaurantMenu: (restaurantId: string) => Promise<FoodItem[]>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [allFoods, setAllFoods] = useState<FoodItem[]>([]);

    const refreshData = async () => {
        try {
            // If admin, get all restaurants (even inactive) and users
            if (user?.role === 'admin') {
                const r = await getAllRestaurantsAdmin();
                setRestaurants(r);
                const u = await getAllUsers();
                setUsers(u);
            } else {
                const r = await getRestaurants();
                setRestaurants(r);
            }

            const c = await getCategories();
            setCategories(c);

            // Fetch all foods for search/global view
            const f = await getAllFoodsService();
            setAllFoods(f);

        } catch (e) {
            console.error("Error fetching data", e);
        }
    };

    useEffect(() => {
        refreshData();
    }, [user]);

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
            unsubscribe = subscribeToUserOrders(user.uid, (newOrders) => {
                setOrders(newOrders);
            });
        }

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [user]);

    // Restaurant Actions
    const addRestaurant = async (r: any) => {
        await addRestaurantService(r);
        refreshData();
    };

    const updateRestaurant = async (id: string, data: any) => {
        await updateRestaurantService(id, data);
        refreshData();
    };

    const deleteRestaurant = async (id: string) => {
        await deleteRestaurantService(id);
        refreshData();
    };

    // Category Actions
    const addCategory = async (name: string) => {
        await addCategoryService(name);
        refreshData();
    };

    const updateCategory = async (id: string, name: string) => {
        await updateCategoryService(id, name);
        refreshData();
    };

    const deleteCategory = async (id: string) => {
        await deleteCategoryService(id);
        refreshData();
    };

    // Menu Actions
    const addMenuItem = async (restaurantId: string, item: any) => {
        await addFoodService({ ...item, restaurantId, isAvailable: true });
        refreshData();
    };

    const updateMenuItem = async (id: string, item: any) => {
        await updateFoodService(id, item);
        refreshData();
    };

    const deleteMenuItem = async (id: string) => {
        await deleteFoodService(id);
        refreshData();
    };

    // Order Actions
    const placeOrder = async (order: any) => {
        await createOrderService(order);
    };

    const updateOrderStatus = async (orderId: string, status: any) => {
        await updateOrderStatusService(orderId, status);
    };

    // User Actions
    const toggleUserStatus = async (uid: string, isActive: boolean) => {
        await toggleUserStatusService(uid, isActive);
        refreshData();
    };

    const fetchRestaurantMenu = async (restaurantId: string) => {
        return await getFoodsByRestaurant(restaurantId);
    };

    return (
        <DataContext.Provider value={{
            restaurants, categories, orders, users, allFoods,
            addRestaurant, updateRestaurant, deleteRestaurant,
            addCategory, updateCategory, deleteCategory,
            addMenuItem, updateMenuItem, deleteMenuItem,
            placeOrder, updateOrderStatus,
            toggleUserStatus,
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
