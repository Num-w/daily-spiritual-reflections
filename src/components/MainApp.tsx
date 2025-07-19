
import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Navigation } from '@/components/Navigation';
import { MeditationsView } from '@/components/MeditationsView';
import { SermonsView } from '@/components/SermonsView';
import { StatsView } from '@/components/StatsView';
import { SettingsView } from '@/components/SettingsView';
import { MeditationEditor } from '@/components/MeditationEditor';
import { SermonEditor } from '@/components/SermonEditor';
import { FavoritesManager } from '@/components/FavoritesManager';
import { AudioRecorder } from '@/components/AudioRecorder';
import { Plus } from 'lucide-react';

interface MainAppProps {
  onLock: () => void;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

export const MainApp = ({ onLock, darkMode, setDarkMode }: MainAppProps) => {
  const [activeTab, setActiveTab] = useState('meditations');
  const [showEditor, setShowEditor] = useState(false);
  const [showSermonEditor, setShowSermonEditor] = useState(false);
  const [editingMeditation, setEditingMeditation] = useState(null);
  const [editingSermon, setEditingSermon] = useState(null);
  const [meditations, setMeditations] = useState([]);
  const [sermons, setSermons] = useState([]);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedMeditations = localStorage.getItem('meditations');
    const savedSermons = localStorage.getItem('sermons');

    if (savedMeditations) {
      setMeditations(JSON.parse(savedMeditations));
    } else {
      // Initialize with sample data if no saved data
      const sampleMeditations = [
        {
          id: 1,
          verse: "Jean 3:16",
          title: "L'amour de Dieu",
          content: "Car Dieu a tant aimé le monde qu'il a donné son Fils unique...",
          summary: "Méditation sur l'amour inconditionnel de Dieu manifesté par le sacrifice de Jésus. Cette vérité fondamentale nous rappelle que notre salut ne dépend pas de nos œuvres mais de la grâce divine.",
          comments: "Réflexion personnelle sur la manifestation de cet amour dans notre quotidien.",
          color: "blue",
          pinned: true,
          date: "2025-06-25",
          time: "matin",
          tags: ["amour", "salut", "grâce"]
        },
        {
          id: 2,
          verse: "Psaume 23:1",
          title: "Le Bon Berger",
          content: "L'Éternel est mon berger: je ne manquerai de rien.",
          summary: "Méditation sur la provision divine et la sécurité en Dieu. Le Seigneur pourvoit à tous nos besoins selon sa richesse.",
          comments: "Gratitude pour la fidélité de Dieu dans ma vie.",
          color: "green",
          pinned: false,
          date: "2025-06-24",
          time: "soir",
          tags: ["provision", "confiance", "protection"]
        }
      ];
      setMeditations(sampleMeditations);
    }

    if (savedSermons) {
      setSermons(JSON.parse(savedSermons));
    } else {
      const sampleSermons = [
        {
          id: 1,
          title: "L'amour transformateur de Dieu",
          theme: "Amour divin",
          date: "2025-07-01",
          references: [1],
          outline: "1. L'origine de l'amour\n2. La manifestation de l'amour\n3. Notre réponse à l'amour",
          status: "en_preparation"
        }
      ];
      setSermons(sampleSermons);
    }
  }, []);

  // Save meditations to localStorage whenever they change
  useEffect(() => {
    if (meditations.length > 0) {
      localStorage.setItem('meditations', JSON.stringify(meditations));
    }
  }, [meditations]);

  // Save sermons to localStorage whenever they change
  useEffect(() => {
    if (sermons.length > 0) {
      localStorage.setItem('sermons', JSON.stringify(sermons));
    }
  }, [sermons]);

  const handleNewMeditation = () => {
    setEditingMeditation(null);
    setShowEditor(true);
  };

  const handleEditMeditation = (meditation: any) => {
    setEditingMeditation(meditation);
    setShowEditor(true);
  };

  const handleSaveMeditation = (meditationData: any) => {
    if (editingMeditation) {
      // Update existing meditation
      setMeditations(prev => prev.map(m => m.id === meditationData.id ? meditationData : m));
    } else {
      // Add new meditation
      setMeditations(prev => [...prev, meditationData]);
    }
  };

  const handleDeleteMeditation = (id: number) => {
    setMeditations(prev => prev.filter(m => m.id !== id));
  };

  const handleSaveSermon = (sermonData: any) => {
    if (sermonData.id && sermons.find(s => s.id === sermonData.id)) {
      // Update existing sermon
      setSermons(prev => prev.map(s => s.id === sermonData.id ? sermonData : s));
    } else {
      // Add new sermon
      setSermons(prev => [...prev, { ...sermonData, id: Date.now() }]);
    }
  };

  const handleDeleteSermon = (id: number) => {
    setSermons(prev => prev.filter(s => s.id !== id));
  };

  const handleEditSermon = (sermon: any) => {
    setEditingSermon(sermon);
    setShowSermonEditor(true);
  };

  const handleImportMeditations = (importedMeditations: any[]) => {
    setMeditations(prev => [...prev, ...importedMeditations]);
  };

  const handleImportSermons = (importedSermons: any[]) => {
    setSermons(prev => [...prev, ...importedSermons]);
  };

  const renderContent = () => {
    if (showEditor) {
      return (
        <MeditationEditor 
          onClose={() => setShowEditor(false)} 
          darkMode={darkMode} 
          meditation={editingMeditation}
          onSave={handleSaveMeditation}
        />
      );
    }

    if (showSermonEditor) {
      return (
        <SermonEditor
          sermon={editingSermon}
          meditations={meditations}
          onSave={handleSaveSermon}
          onClose={() => setShowSermonEditor(false)}
          darkMode={darkMode}
        />
      );
    }

    switch (activeTab) {
      case 'meditations':
        return (
          <MeditationsView 
            darkMode={darkMode} 
            meditations={meditations}
            onEditMeditation={handleEditMeditation}
            onDeleteMeditation={handleDeleteMeditation}
          />
        );
      case 'favorites':
        return (
          <FavoritesManager
            meditations={meditations}
            onEditMeditation={handleEditMeditation}
            darkMode={darkMode}
          />
        );
      case 'sermons':
        return (
          <SermonsView 
            darkMode={darkMode} 
            sermons={sermons}
            meditations={meditations}
            onSaveSermon={handleSaveSermon}
            onDeleteSermon={handleDeleteSermon}
          />
        );
      case 'audio':
        return <AudioRecorder darkMode={darkMode} />;
      case 'stats':
        return <StatsView darkMode={darkMode} meditations={meditations} sermons={sermons} />;
      case 'settings':
        return (
          <SettingsView 
            darkMode={darkMode} 
            setDarkMode={setDarkMode}
            meditations={meditations}
            sermons={sermons}
            onAddMeditation={handleSaveMeditation}
            onEditMeditation={handleEditMeditation}
            onEditSermon={handleEditSermon}
            onImportMeditations={handleImportMeditations}
            onImportSermons={handleImportSermons}
          />
        );
      default:
        return (
          <MeditationsView 
            darkMode={darkMode} 
            meditations={meditations}
            onEditMeditation={handleEditMeditation}
            onDeleteMeditation={handleDeleteMeditation}
          />
        );
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <Header onLock={onLock} onNewMeditation={handleNewMeditation} darkMode={darkMode} />
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} darkMode={darkMode} />
      
      <div className="px-4 py-6">
        <div className="animate-fade-in">
          {renderContent()}
        </div>
      </div>

      {!showEditor && !showSermonEditor && (
        <button
          onClick={handleNewMeditation}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 animate-bounce"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};
