import { FileText, ShieldCheck, Lock, Scale, ClipboardCheck, BarChart3 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
    { name: 'New Request', path: '/', icon: FileText },
    { name: 'My Requests', path: '/requests', icon: ClipboardCheck },
    { name: 'Compliance', path: '/compliance', icon: ShieldCheck },
    { name: 'Security', path: '/security', icon: Lock },
    { name: 'Governance', path: '/governance', icon: Scale },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
];

export default function Sidebar() {
    const location = useLocation();

    return (
        <div className="h-screen w-64 bg-slate-900 text-white flex flex-col fixed left-0 top-0 border-r border-slate-800 shadow-2xl z-50">
            {/* Logo */}
            <div className="h-16 flex items-center px-6 border-b border-slate-800">
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                    AI GRC Platform
                </span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 space-y-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 group relative ${isActive
                                    ? 'text-white bg-white/10 border-r-4 border-indigo-500'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-white'}`} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-6 border-t border-slate-800">
                <p className="text-xs text-slate-500">Version 1.0.0</p>
            </div>
        </div>
    );
}
