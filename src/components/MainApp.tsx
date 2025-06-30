
import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Navigation } from '@/components/Navigation';
import { MeditationsView } from '@/components/MeditationsView';
import { SermonsView } from '@/components/SermonsView';
import { StatsView } from '@/components/StatsView';
import { SettingsView } from '@/components/SettingsView';
import { MeditationEditor } from '@/components/MeditationEditor';
import { Plus } from 'lucide-react';

interface MainAppProps {
  onLock: () => void;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

export const MainApp = ({ onLock, darkMode, setDarkMode }: MainAppProps) => {
  const [activeTab, setActiveTab] = useState('meditations');
  const [showEditor, setShowEditor] = useState(false);

  const renderContent = () => {
    if (showEditor) {
      return <MeditationEditor onClose={() => setShowEditor(false)} darkMode={darkMode} />;
    }

    switch (activeTab) {
      case 'meditations':
        return <MeditationsView darkMode={darkMode} />;
      case 'sermons':
        return <SermonsView darkMode={darkMode} />;
      case 'stats':
        return <StatsView darkMode={darkMode} />;
      case 'settings':
        return <SettingsView darkMode={darkMode} setDarkMode={setDarkMode} />;
      default:
        return <MeditationsView darkMode={darkMode} />;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <Header onLock={onLock} onNewMeditation={() => setShowEditor(true)} darkMode={darkMode} />
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} darkMode={darkMode} />
      
      <div className="px-4 py-6">
        <div className="animate-fade-in">
          {renderContent()}
        </div>
      </div>

      {!showEditor && (
        <button
          onClick={() => setShowEditor(true)}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 animate-bounce"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};
