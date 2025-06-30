
import React from 'react';
import { BookOpen, Mic, TrendingUp, Settings } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  darkMode: boolean;
}

export const Navigation = ({ activeTab, setActiveTab, darkMode }: NavigationProps) => {
  const tabs = [
    { id: 'meditations', label: 'Méditations', icon: BookOpen },
    { id: 'sermons', label: 'Sermons', icon: Mic },
    { id: 'stats', label: 'Statistiques', icon: TrendingUp },
    { id: 'settings', label: 'Paramètres', icon: Settings }
  ];

  return (
    <div className={`sticky top-16 z-30 transition-colors duration-300 border-b ${
      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="px-4">
        <div className="flex space-x-6">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-3 border-b-2 transition-all duration-200 transform hover:scale-105 ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
