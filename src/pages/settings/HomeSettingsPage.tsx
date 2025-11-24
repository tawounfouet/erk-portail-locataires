import Redirector from '@/components/common/Redirector';
import { useAuth } from '@/hooks/useAuth';
import { obtainInitial } from '@/lib/user';
import { Users, Bookmark, Bell, Settings, HelpCircle, Heart } from 'lucide-react';
import settings_img from "@/assets/images/settings.png";
import { Link } from 'react-router-dom';

export default function HomeSettingsPage()
{
    // ==========================================
	// 				 SERVICE DATA 
	// ==========================================
    const { user } = useAuth();

    const menuItems = [
        { icon: Users, label: 'Mon compte', color: 'bg-orange-400', path: 'myaccount/' },
        { icon: Bookmark, label: 'Feedback', color: 'bg-blue-500', path: 'myaccount/' },
    ];

    const settingsItems = [
        { icon: Bell, label: 'Notifications', color: 'bg-green-400', path: 'myaccount/' },
        { icon: Settings, label: 'Préférences', color: 'bg-gray-500', path: 'myaccount/' },
    ];

    const bottomItems = [
        { icon: HelpCircle, label: 'Aide', color: 'bg-gray-700', path: 'myaccount/' },
        { icon: Heart, label: 'Recommandation', color: 'bg-pink-500', path: 'myaccount/' },
    ];

    if (!user)
        return <Redirector />

    return (
        <div className="min-h-screen text-white pb-24">
            {/* Profile Section */}
            <div className="flex flex-col items-center mb-8 pt-4">
                <div className="relative">
                <div className="w-32 h-32 bg-primary/50 border border-primary rounded-3xl flex items-center justify-center mb-4 shadow-2xl">
                    <div className="text-6xl">{obtainInitial(user.first_name, user.last_name)}</div>
                </div>
                </div>
                <h1 className="text-2xl font-semibold">{user.first_name}</h1>
            </div>

            {/* Menu Items */}
            <div className="space-y-3 mb-6 w-[400px] translate-x-1">
                {menuItems.map((item, index) => (
                    <Link
                        key={index}
                        to={item.path}
                        className="w-full flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 transition-all"
                    >
                        <div className={`${item.color} p-3 rounded-xl`}>
                        <item.icon className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-lg font-medium">{item.label}</span>
                    </Link>
                ))}
            </div>

            {/* Settings Section */}
            <div className="space-y-3 mb-6 w-[400px] translate-x-1">
                {settingsItems.map((item, index) => (
                <button
                    key={index}
                    className="w-full flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 transition-all"
                >
                    <div className={`${item.color} p-3 rounded-xl`}>
                    <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-lg font-medium">{item.label}</span>
                </button>
                ))}
            </div>

        {/* Bottom Items */}
        <div className="space-y-3 mb-8 w-[400px] translate-x-1">
            {bottomItems.map((item, index) => (
            <button
                key={index}
                className="w-full flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 transition-all"
            >
                <div className={`${item.color} p-3 rounded-xl`}>
                <item.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-lg font-medium">{item.label}</span>
            </button>
            ))}
        </div>

        {/* Illustration */}
        <div className="flex justify-center mb-8">
            <div className="relative w-48 h-48">
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-8xl opacity-40"><img src={settings_img} alt="Paramètres" /></div>
            </div>
            </div>
        </div>
        </div>
    );
}