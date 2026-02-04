import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "@/lib/api";

type User = {
    id: string;
    name: string;
    email: string;
    target_role: string;
};

type AuthContextType = {
    user: User | null;
    token: string | null;
    login: (token: string, user: User) => void;
    logout: () => void;
    isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const storedToken = localStorage.getItem("token");
            if (storedToken) {
                setToken(storedToken);
                // Ideally verify token with backend or decode it, 
                // but for now we trust persistence or wait for first API call to fail
                // Fetch user profile if we have token but no user
                if (!user) {
                    try {
                        // We need a way to get 'me'. For now, let's assume we store user in localstorage too
                        // or we can decode token if it had user info. 
                        // Let's modify login to store user in localStorage for persistence across simplified sessions
                        const storedUser = localStorage.getItem("user");
                        if (storedUser) {
                            setUser(JSON.parse(storedUser));
                        }
                    } catch (e) {
                        console.error("Failed to restore user session", e);
                        logout();
                    }
                }
            }
            setIsLoading(false);
        };
        initAuth();
    }, []);

    const login = (newToken: string, newUser: User) => {
        localStorage.setItem("token", newToken);
        localStorage.setItem("user", JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
        window.location.href = "/login";
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
