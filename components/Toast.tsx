'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';
import { Toast as ToastType } from '@/types';

interface ToastProps {
    toast: ToastType;
    onDismiss: (id: string) => void;
    isUpsideDownMode: boolean;
}

export default function Toast({ toast, onDismiss, isUpsideDownMode }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onDismiss(toast.id);
        }, 4000);
        return () => clearTimeout(timer);
    }, [toast.id, onDismiss]);

    const getIcon = () => {
        switch (toast.type) {
            case 'success':
                return <CheckCircle className="w-5 h-5" />;
            case 'warning':
                return <AlertTriangle className="w-5 h-5" />;
            case 'error':
                return <X className="w-5 h-5" />;
            default:
                return <Info className="w-5 h-5" />;
        }
    };

    const getStyles = () => {
        if (isUpsideDownMode) {
            return {
                success: 'bg-purple-600 text-white border-purple-400',
                warning: 'bg-pink-600 text-white border-pink-400',
                error: 'bg-red-600 text-white border-red-400',
                info: 'bg-gray-700 text-white border-gray-500', // Changed from Indigo
            }[toast.type];
        }
        return {
            success: 'bg-green-600 text-white border-green-400',
            warning: 'bg-amber-600 text-black border-amber-400', // Changed from Yellow/Blue to Amber
            error: 'bg-red-600 text-white border-red-400',
            info: 'bg-gray-600 text-white border-gray-400', // Changed from Blue
        }[toast.type];
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`flex items-center gap-3 px-4 py-3 rounded border-2 shadow-lg ${getStyles()}`}
        >
            {getIcon()}
            <span className="font-mono text-sm font-bold uppercase tracking-wider">
                {toast.message}
            </span>
            <button
                onClick={() => onDismiss(toast.id)}
                className="ml-2 p-1 hover:bg-white/20 rounded transition-colors"
            >
                <X className="w-4 h-4" />
            </button>
        </motion.div>
    );
}

// Toast Container Component
interface ToastContainerProps {
    toasts: ToastType[];
    onDismiss: (id: string) => void;
    isUpsideDownMode: boolean;
}

export function ToastContainer({ toasts, onDismiss, isUpsideDownMode }: ToastContainerProps) {
    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
            <AnimatePresence mode="popLayout">
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        toast={toast}
                        onDismiss={onDismiss}
                        isUpsideDownMode={isUpsideDownMode}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
}

// Hook for managing toasts
export function useToasts() {
    const [toasts, setToasts] = useState<ToastType[]>([]);

    const showToast = useCallback((message: string, type: ToastType['type'] = 'success') => {
        const id = Math.random().toString(36).substring(7);
        setToasts((prev) => [...prev, { id, message, type }]);
    }, []);

    const dismissToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return { toasts, showToast, dismissToast };
}
