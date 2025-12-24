
import { useRouter, useSegments } from 'expo-router';
import {
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    signInWithEmailAndPassword
} from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebaseConfig';
import { createUserProfile, getUserProfile, UserProfile } from '../services/firestore';

// Define User Types
export type UserRole = 'user' | 'admin';

export interface User extends UserProfile {
    id: string; // Map uid to id for compatibility
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, name: string, role?: UserRole) => Promise<void>;
    signOut: () => Promise<void>;
    updateProfile: (data: Partial<User>) => Promise<void>; // Setup later if needed
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const segments = useSegments();

    // Listen to Firebase Auth state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    const profile = await getUserProfile(firebaseUser.uid);
                    if (profile) {
                        setUser({ ...profile, id: profile.uid });
                    } else {
                        // Handle case where auth exists but profile doesn't (rare)
                        console.error('User profile not found for uid:', firebaseUser.uid);
                        setUser(null);
                    }
                } catch (e) {
                    console.error('Error fetching user profile:', e);
                    setUser(null);
                }
            } else {
                setUser(null);
            }
            setIsLoading(false);
        });

        return unsubscribe;
    }, []);

    // Protected Route Logic
    useEffect(() => {
        if (isLoading) return;

        const inAuthGroup = segments[0] === '(auth)';
        const inAdminGroup = segments[0] === '(admin)';
        const inCustomerGroup = segments[0] === '(customer)';

        if (!user && !inAuthGroup) {
            router.replace('/(auth)/login');
        } else if (user) {
            if (user.role === 'admin' && !inAdminGroup) {
                router.replace('/(admin)/dashboard');
            } else if (user.role === 'user' && inAuthGroup) {
                router.replace('/(customer)/home');
            } else if (user.role === 'user' && inAdminGroup) {
                router.replace('/(customer)/home');
            }
        }
    }, [user, segments, isLoading]);

    const signIn = async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password);
    };

    const signUp = async (email: string, password: string, name: string, role: UserRole = 'user') => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;

        // Create Profile
        await createUserProfile(uid, {
            email,
            name,
            role,
            isActive: true
        });

        // Current state will be updated by onAuthStateChanged listener
    };

    const signOut = async () => {
        await firebaseSignOut(auth);
    };

    const updateProfile = async (data: Partial<User>) => {
        // Implement if needed using updateDoc
        // For now just local update to satisfy interface
        if (user) {
            setUser({ ...user, ...data });
        }
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
