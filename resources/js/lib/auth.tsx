import { type ReactNode, createContext, useContext, useCallback } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import * as authApi from './api';
import { addToCart } from './api';
import { getPendingCartItem, clearPendingCartItem } from './pending-cart';
import type { User } from '../types/models';

interface AuthContextValue {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (data: { email: string; password: string }) => Promise<void>;
    register: (data: {
        name: string;
        email: string;
        password: string;
        password_confirmation: string;
    }) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const queryClient = useQueryClient();

    const {
        data: user,
        isLoading,
    } = useQuery<User | null>({
        queryKey: ['auth', 'user'],
        queryFn: async () => {
            try {
                return await authApi.getUser();
            } catch {
                return null;
            }
        },
        retry: false,
        staleTime: 1000 * 60 * 5,
    });

    const processPendingCart = useCallback(async () => {
        const pending = getPendingCartItem();
        if (!pending) return;
        clearPendingCartItem();
        try {
            await addToCart(pending);
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        } catch {
            // silently ignore — product may be out of stock
        }
    }, [queryClient]);

    const loginMutation = useMutation({
        mutationFn: async (data: { email: string; password: string }) => {
            await authApi.getCsrfCookie();
            const res = await authApi.login(data);
            return res.data;
        },
        onSuccess: async (user) => {
            queryClient.setQueryData(['auth', 'user'], user);
            await processPendingCart();
        },
    });

    const registerMutation = useMutation({
        mutationFn: async (data: {
            name: string;
            email: string;
            password: string;
            password_confirmation: string;
        }) => {
            await authApi.getCsrfCookie();
            const res = await authApi.register(data);
            return res.data;
        },
        onSuccess: async (user) => {
            queryClient.setQueryData(['auth', 'user'], user);
            await processPendingCart();
        },
    });

    const logoutMutation = useMutation({
        mutationFn: authApi.logout,
        onSuccess: () => {
            queryClient.setQueryData(['auth', 'user'], null);
            queryClient.removeQueries({ queryKey: ['cart'] });
            queryClient.removeQueries({ queryKey: ['orders'] });
        },
    });

    const login = useCallback(
        async (data: { email: string; password: string }) => {
            await loginMutation.mutateAsync(data);
        },
        [loginMutation],
    );

    const register = useCallback(
        async (data: {
            name: string;
            email: string;
            password: string;
            password_confirmation: string;
        }) => {
            await registerMutation.mutateAsync(data);
        },
        [registerMutation],
    );

    const logoutFn = useCallback(async () => {
        await logoutMutation.mutateAsync();
    }, [logoutMutation]);

    const value: AuthContextValue = {
        user: user ?? null,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout: logoutFn,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
