import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Notification } from '@/types/crm';
import { mockNotifications as initialMockNotifications } from '@/data/mockData';

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>(() => {
        const saved = localStorage.getItem('notifications');
        return saved ? JSON.parse(saved) : initialMockNotifications;
    });

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAsRead = (id: string) => {
        setNotifications(prev => {
            const updated = prev.map(n => (n.id === id ? { ...n, read: true } : n));
            localStorage.setItem('notifications', JSON.stringify(updated));
            return updated;
        });
    };

    const markAllAsRead = () => {
        setNotifications(prev => {
            const updated = prev.map(n => ({ ...n, read: true }));
            localStorage.setItem('notifications', JSON.stringify(updated));
            return updated;
        });
    };

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
}
