import { LayoutDashboard, FileText, Settings, Shield, Activity } from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
    className?: string;
}

export function Sidebar({ className }: SidebarProps) {
    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', href: '#', active: false },
        { icon: FileText, label: 'New Intake', href: '#', active: true },
        { icon: Shield, label: 'Risk Assessment', href: '#', active: false },
        { icon: Activity, label: 'Monitoring', href: '#', active: false },
        { icon: Settings, label: 'Settings', href: '#', active: false },
    ];

    return (
        <div className={cn("flex flex-col h-full w-72 bg-slate-900 text-white border-r border-slate-800 shadow-2xl", className)}>
            <div className="p-6 flex items-center gap-3 border-b border-slate-800">
                <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                    <span className="font-bold text-xl tracking-tight">AI GRC</span>
                    <span className="block text-xs text-slate-400 font-medium">Enterprise Edition</span>
                </div>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
                {navItems.map((item) => (
                    <a
                        key={item.label}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                            item.active
                                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/20 translate-x-1"
                                : "text-slate-400 hover:bg-slate-800 hover:text-white hover:translate-x-1"
                        )}
                    >
                        <item.icon className={cn("w-5 h-5 transition-colors", item.active ? "text-white" : "text-slate-400 group-hover:text-white")} />
                        {item.label}
                    </a>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-800 bg-slate-900/50">
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 border-2 border-slate-700" />
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-white">Admin User</span>
                        <span className="text-xs text-slate-400">admin@company.com</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

