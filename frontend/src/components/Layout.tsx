import React from 'react';
import { Sidebar } from './Sidebar';

interface LayoutProps {
    children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
    return (
        <div className="flex flex-row h-screen w-full bg-gray-50 overflow-hidden">
            <Sidebar className="flex-shrink-0" />
            <main className="flex-1 overflow-y-auto relative">
                <div className="max-w-7xl mx-auto px-8 py-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
