
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
    updateDoc,
    where
} from 'firebase/firestore';
import { db } from '../firebaseConfig';

// --- Types (re-using/adapting from previous data.tsx but aligned with Firestore) ---

export interface UserProfile {
    uid: string;
    email: string;
    name: string;
    role: 'user' | 'admin';
    address?: string;
    phone?: string;
    createdAt?: any;
    isActive?: boolean;
}

export interface Restaurant {
    id: string;
    name: string;
    description?: string;
    rating?: number;
    categories: string[];
    deliveryTime: string;
    image: string; // Changed from imageUrl to match previous code usage or mapped
    isActive: boolean;
    createdAt?: any;
}

export interface Category {
    id: string;
    name: string;
    icon?: string;
    createdAt?: any;
}

export interface FoodItem {
    id: string;
    name: string;
    description: string;
    price: number;
    image?: string;
    categoryId: string;
    restaurantId: string;
    isAvailable: boolean;
    createdAt?: any;
}

export interface Order {
    id: string;
    userId: string;
    items: {
        foodId: string;
        name: string;
        price: number;
        quantity: number;
    }[];
    totalAmount: number;
    deliveryAddress: string;
    status: 'Pending' | 'Preparing' | 'On the way' | 'Delivered' | 'Cancelled';
    createdAt: any;
    restaurantId: string; // Keeping this for admin filtering
    restaurantName: string;
}

// --- References ---
const usersRef = collection(db, 'users');
const restaurantsRef = collection(db, 'restaurants');
const categoriesRef = collection(db, 'categories');
const foodsRef = collection(db, 'foods');
const ordersRef = collection(db, 'orders');

// --- Services ---

// Users
export const createUserProfile = async (uid: string, data: Omit<UserProfile, 'uid'>) => {
    await setDoc(doc(db, 'users', uid), {
        ...data,
        uid,
        createdAt: serverTimestamp(),
        isActive: true
    });
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
    const docSnap = await getDoc(doc(db, 'users', uid));
    if (docSnap.exists()) {
        return docSnap.data() as UserProfile;
    }
    return null;
};

// Restaurants
export const getRestaurants = async () => {
    const q = query(restaurantsRef, where('isActive', '==', true));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Restaurant));
};

export const getAllRestaurantsAdmin = async () => {
    const snapshot = await getDocs(restaurantsRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Restaurant));
};

export const addRestaurant = async (data: Omit<Restaurant, 'id'>) => {
    await addDoc(restaurantsRef, { ...data, createdAt: serverTimestamp(), isActive: true });
};

export const updateRestaurant = async (id: string, data: Partial<Restaurant>) => {
    await updateDoc(doc(db, 'restaurants', id), data);
};

export const deleteRestaurant = async (id: string) => {
    await deleteDoc(doc(db, 'restaurants', id));
};

// Categories
export const getCategories = async () => {
    const snapshot = await getDocs(categoriesRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
};

// Foods
export const getFoodsByRestaurant = async (restaurantId: string) => {
    const q = query(foodsRef, where('restaurantId', '==', restaurantId), where('isAvailable', '==', true));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FoodItem));
};

export const addFood = async (data: Omit<FoodItem, 'id'>) => {
    await addDoc(foodsRef, { ...data, createdAt: serverTimestamp() });
};

// Orders
export const createOrder = async (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => {
    await addDoc(ordersRef, {
        ...order,
        status: 'Pending',
        createdAt: serverTimestamp()
    });
};

export const subscribeToUserOrders = (userId: string, callback: (orders: Order[]) => void) => {
    const q = query(ordersRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
        const orders = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                // Convert Firestore timestamp to Date if needed, or keep as object
                createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date()
            } as Order;
        });
        callback(orders);
    });
};

export const subscribeToAllOrders = (callback: (orders: Order[]) => void) => {
    const q = query(ordersRef, orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
        const orders = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date()
            } as Order;
        });
        callback(orders);
    });
};

export const updateOrderStatusService = async (orderId: string, status: Order.status) => {
    await updateDoc(doc(db, 'orders', orderId), { status });
};
