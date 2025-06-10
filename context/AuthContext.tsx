import { useState, createContext, ReactNode, useContext, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase';
import { loginUser, logoutUser, registerUser } from '@/api/authApi';

type AuthContextType = {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    register: (email: string, password: string) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            await loginUser(email, password);
            return true;
        } catch (error) {
            console.error('[AuthContext] Login error:', error);
            return false;
        }
    };

    const logout = async (): Promise<void> => {
        try {
            await logoutUser();
        } catch (error) {
            console.error('[AuthContext] Logout error:', error);
            throw error;
        }
    };

    const register = async (email: string, password: string): Promise<boolean> => {
        try {
            await registerUser(email, password);
            return true;
        } catch (error) {
            console.error('[AuthContext] Register error:', error);
            return false;
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuthContext can't be used");
    }
    return context;
}