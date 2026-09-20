"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface WishlistItem {
    id: number;
    name: string;
    price: string;
    imageUrl: string;
    shortDescription?: string | null;
}

interface WishlistContextType {
    wishlist: WishlistItem[];
    addToWishlist: (item: WishlistItem) => void;
    removeFromWishlist: (id: number) => void;
    toggleWishlist: (item: WishlistItem) => void;
    isInWishlist: (id: number) => boolean;
    clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // تحميل المفضلة من LocalStorage
    useEffect(() => {
        try {
            const savedWishlist = localStorage.getItem('user_wishlist');
            if (savedWishlist) {
                setWishlist(JSON.parse(savedWishlist));
            }
        } catch (error) {
            console.error("فشل تحميل البيانات من LocalStorage:", error);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    // حفظ التغييرات في LocalStorage
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('user_wishlist', JSON.stringify(wishlist));
        }
    }, [wishlist, isLoaded]);

    const addToWishlist = (item: WishlistItem) => {
        setWishlist((prev) => {
            if (!prev.some((i) => Number(i.id) === Number(item.id))) {
                return [...prev, item];
            }
            return prev;
        });
    };

    const removeFromWishlist = (id: number) => {
        setWishlist((prev) => prev.filter((item) => Number(item.id) !== Number(id)));
    };

    const toggleWishlist = (item: WishlistItem) => {
        if (isInWishlist(item.id)) {
            removeFromWishlist(item.id);
        } else {
            addToWishlist(item);
        }
    };

    const isInWishlist = (id: number) => {
        return wishlist.some((item) => Number(item.id) === Number(id));
    };

    const clearWishlist = () => {
        setWishlist([]);
    };

    return (
        <WishlistContext.Provider
            value={{
                wishlist,
                addToWishlist,
                removeFromWishlist,
                toggleWishlist,
                isInWishlist,
                clearWishlist
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist يجب أن يُستخدم داخل WishlistProvider');
    }
    return context;
};