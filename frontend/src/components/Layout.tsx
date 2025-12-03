import Sidebar from './Sidebar';

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <div className="flex h-screen bg-slate-50">
            <Sidebar />
            <main className="ml-64 flex-1 overflow-y-auto">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
