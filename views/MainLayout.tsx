
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { View } from '../types';
import Dashboard from './Dashboard';
import LeadsList from './LeadsList';
import StatsView from './StatsView';
import Settings from './Settings';
import ChatbotView from './ChatbotView';
import LayoutDashboardIcon from '../components/icons/LayoutDashboardIcon';
import UsersIcon from '../components/icons/UsersIcon';
import BotIcon from '../components/icons/BotIcon';
import BarChartIcon from '../components/icons/BarChartIcon';
import SettingsIcon from '../components/icons/SettingsIcon';
import MapPinIcon from '../components/icons/MapPinIcon';

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
      isActive
        ? 'bg-indigo-600 text-white'
        : 'text-slate-400 hover:bg-slate-700 hover:text-white'
    }`}
  >
    {icon}
    <span className="ml-3">{label}</span>
  </button>
);

const Sidebar: React.FC = () => {
    const { activeView, setActiveView } = useAppContext();
    
    const navItems = [
        { id: View.Dashboard, label: 'Dashboard', icon: <LayoutDashboardIcon className="w-5 h-5" /> },
        { id: View.Leads, label: 'Clientes Potenciais', icon: <UsersIcon className="w-5 h-5" /> },
        { id: View.Chatbot, label: 'Chatbot', icon: <BotIcon className="w-5 h-5" /> },
        { id: View.Stats, label: 'Estatísticas', icon: <BarChartIcon className="w-5 h-5" /> },
        { id: View.Settings, label: 'Configurações', icon: <SettingsIcon className="w-5 h-5" /> },
    ];

    return (
        <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col p-4">
            <div className="flex items-center mb-8 px-2">
                <MapPinIcon className="w-8 h-8 text-indigo-400" />
                <h1 className="text-xl font-bold ml-2 text-white">GeoLead AI</h1>
            </div>
            <nav className="flex-1 space-y-2">
                {navItems.map(item => (
                    <NavItem 
                        key={item.id}
                        icon={item.icon}
                        label={item.label}
                        isActive={activeView === item.id}
                        onClick={() => setActiveView(item.id)}
                    />
                ))}
            </nav>
        </aside>
    );
};


const MainLayout: React.FC = () => {
  const { activeView } = useAppContext();

  const renderView = () => {
    switch (activeView) {
      case View.Dashboard:
        return <Dashboard />;
      case View.Leads:
        return <LeadsList />;
      case View.Chatbot:
          return <ChatbotView />;
      case View.Stats:
        return <StatsView />;
      case View.Settings:
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto bg-slate-900">
        {renderView()}
      </main>
    </div>
  );
};

export default MainLayout;
