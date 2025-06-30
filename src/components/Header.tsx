
import React from 'react';
import { BookOpen, Plus, Bell, Lock } from 'lucide-react';

interface HeaderProps {
  onLock: () => void;
  onNewMeditation: () => void;
  darkMode: boolean;
}

export const Header = ({ onLock, onNewMeditation, darkMode }: HeaderProps) => {
  return (
    <div className={`sticky top-0 z-40 transition-colors duration-300 border-b ${
      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="animate-pulse">
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Daily Meditations</h1>
              <p className="text-xs text-gray-500">Votre journal spirituel</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={onNewMeditation}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
            </button>
            
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
              <Bell className="w-5 h-5 text-gray-600" />
            </button>
            
            <button
              onClick={onLock}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <Lock className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
