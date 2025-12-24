
import { useRouter, useSegments } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useEffect, useState } from 'react';

// Define User Types
export type UserRole = 'user' | 'admin';

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    phone?: string;
    address?: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, name: string, role?: UserRole) => Promise<void>;
    signOut: () => Promise<void>;
    updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- Mock Auth Logic ---
// We simulate a delay to mimic network request
const NETWORK_DELAY = 1000;

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const segments = useSegments();

    // Check for persisted user on mount
    useEffect(() => {
        const loadUser = async () => {
            try {
                const storedUser = await SecureStore.getItemAsync('user_session');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            } catch (e) {
                console.error("Failed to load user session", e);
            } finally {
                setIsLoading(false);
            }
        };
        loadUser();
    }, []);

    // Protected Route Logic
    useEffect(() => {
        if (isLoading) return;

        const inAuthGroup = segments[0] === '(auth)';
        const inAdminGroup = segments[0] === '(admin)';
        const inCustomerGroup = segments[0] === '(customer)';

        if (!user && !inAuthGroup) {
            // No user, redirect to login
            router.replace('/(auth)/login');
        } else if (user) {
            if (user.role === 'admin' && !inAdminGroup) {
                // Admin user, ensure in admin section
                router.replace('/(admin)/dashboard');
            } else if (user.role === 'user' && inAuthGroup) {
                // Customer user in auth page, redirect to home
                router.replace('/(customer)/home');
            } else if (user.role === 'user' && inAdminGroup) {
                // Customer tried to access admin
                router.replace('/(customer)/home');
            }
        }
    }, [user, segments, isLoading]);

    const signIn = async (email: string, password: string) => {
        // MOCK: Accept any email/password
        // Special logic: if email contains 'admin', make them mock admin
        await new Promise(resolve => setTimeout(resolve, NETWORK_DELAY));

        const role: UserRole = email.toLowerCase().includes('admin') ? 'admin' : 'user';
        const mockUser: User = {
            id: Math.random().toString(36).substr(2, 9),
            email,
            name: email.split('@')[0],
            role,
        };

        setUser(mockUser);
        await SecureStore.setItemAsync('user_session', JSON.stringify(mockUser));
    };

    const signUp = async (email: string, password: string, name: string, role: UserRole = 'user') => {
        await new Promise(resolve => setTimeout(resolve, NETWORK_DELAY));

        const mockUser: User = {
            id: Math.random().toString(36).substr(2, 9),
            email,
            name,
            role,
        };

        setUser(mockUser);
        await SecureStore.setItemAsync('user_session', JSON.stringify(mockUser));
    };

    const signOut = async () => {
        setUser(null);
        await SecureStore.deleteItemAsync('user_session');
        router.replace('/(auth)/login');
    };

    const updateProfile = async (data: Partial<User>) => {
        if (!user) return;
        const updatedUser = { ...user, ...data };
        setUser(updatedUser);
        await SecureStore.setItemAsync('user_session', JSON.stringify(updatedUser));
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
