import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';
import { Toaster } from 'react-hot-toast';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => title ? `${title} - ${appName}` : appName,
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <>
                <App {...props} />
                <Toaster
                    position="top-right"
                    reverseOrder={false}
                    gutter={8}
                    containerClassName=""
                    containerStyle={{}}
                    toastOptions={{
                        // Default options for all toasts
                        className: '',
                        duration: 4000,
                        style: {
                            background: '#ffffff',
                            color: '#000000',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '500',
                            padding: '12px 16px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        },
                        
                        // Success toast style
                        success: {
                            style: {
                                background: '#ffffff',
                                color: '#000000',
                                border: '1px solid #22c55e',
                                borderRadius: '8px',
                            },
                            iconTheme: {
                                primary: '#22c55e',
                                secondary: '#ffffff',
                            },
                        },
                        
                        // Error toast style
                        error: {
                            style: {
                                background: '#ffffff',
                                color: '#000000',
                                border: '1px solid #ef4444',
                                borderRadius: '8px',
                            },
                            iconTheme: {
                                primary: '#ef4444',
                                secondary: '#ffffff',
                            },
                        },
                        
                        // Loading toast style
                        loading: {
                            style: {
                                background: '#ffffff',
                                color: '#000000',
                                border: '1px solid #6b7280',
                                borderRadius: '8px',
                            },
                            iconTheme: {
                                primary: '#6b7280',
                                secondary: '#ffffff',
                            },
                        },
                        
                        // Custom toast style
                        custom: {
                            style: {
                                background: '#000000',
                                color: '#ffffff',
                                border: '1px solid #374151',
                                borderRadius: '8px',
                            },
                        },
                    }}
                />
            </>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();