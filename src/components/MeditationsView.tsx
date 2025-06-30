
import React, { useState } from 'react';
import { Search, Filter, Menu, Star, Share2, Edit3, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MeditationsViewProps {
  darkMode: boolean;
  meditations: any[];
  onEditMeditation: (meditation: any) => void;
  onDeleteMeditation: (id: number) => void;
}

export const MeditationsView = ({ darkMode, meditations, onEditMeditation, onDeleteMeditation }: MeditationsViewProps) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentView, setCurrentView] = useState('grid');
  const [sortBy, setSortBy] = useState('date');
  const [filterColor, setFilterColor] = useState('all');

  const colors = ['blue', 'green', 'yellow', 'red', 'purple', 'orange', 'pink', 'gray'];

  const filteredMeditations = meditations.filter(meditation => {
    const matchesSearch = searchTerm === '' || 
      meditation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meditation.verse.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meditation.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meditation.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesColor = filterColor === 'all' || meditation.color === filterColor;
    
    return matchesSearch && matchesColor;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'verse':
        return a.verse.localeCompare(b.verse);
      case 'color':
        return a.color.localeCompare(b.color);
      case 'date':
      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

  const handleShare = (meditation: any) => {
    const shareText = `${meditation.title}\n\n${meditation.verse}\n\n${meditation.summary}`;
    
    if (navigator.share) {
      navigator.share({
        title: meditation.title,
        text: shareText,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast({
        title: "Copié !",
        description: "Le contenu de la méditation a été copié dans le presse-papier"
      });
    }
  };

  const handleDelete = (meditation: any) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la méditation "${meditation.title}" ?`)) {
      onDeleteMeditation(meditation.id);
      toast({
        title: "Supprimé",
        description: "La méditation a été supprimée avec succès"
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and filters */}
      <div className="flex space-x-2 animate-fade-in">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par verset, titre, contenu..."
            className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-blue-500 ${
              darkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'
            }`}
          />
        </div>
        <button className={`px-4 py-2 rounded-lg border transition-all duration-200 hover:scale-105 ${
          darkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'
        }`}>
          <Filter className="w-4 h-4" />
        </button>
      </div>

      {/* View options */}
      <div className="flex items-center justify-between animate-fade-in">
        <div className="flex space-x-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={`px-3 py-1 rounded-lg border text-sm transition-colors duration-200 ${
              darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
            }`}
          >
            <option value="date">Trier par date</option>
            <option value="title">Trier par titre</option>
            <option value="verse">Trier par verset</option>
            <option value="color">Trier par couleur</option>
          </select>
          
          <select
            value={filterColor}
            onChange={(e) => setFilterColor(e.target.value)}
            className={`px-3 py-1 rounded-lg border text-sm transition-colors duration-200 ${
              darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
            }`}
          >
            <option value="all">Toutes les couleurs</option>
            {colors.map(color => (
              <option key={color} value={color}>{color}</option>
            ))}
          </select>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentView('list')}
            className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
              currentView === 'list' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
            }`}
          >
            <Menu className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentView('grid')}
            className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
              currentView === 'grid' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
            }`}
          >
            <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
              <div className="bg-current rounded-sm"></div>
              <div className="bg-current rounded-sm"></div>
              <div className="bg-current rounded-sm"></div>
              <div className="bg-current rounded-sm"></div>
            </div>
          </button>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-500 animate-fade-in">
        {filteredMeditations.length} méditation{filteredMeditations.length !== 1 ? 's' : ''} trouvée{filteredMeditations.length !== 1 ? 's' : ''}
      </div>

      {/* Meditations list */}
      <div className={currentView === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-3'}>
        {filteredMeditations.map((meditation, index) => (
          <div
            key={meditation.id}
            className={`p-4 rounded-xl border-l-4 border-l-blue-500 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] transform animate-fade-in ${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm font-medium px-2 py-1 rounded bg-blue-100 text-blue-700">
                    {meditation.verse}
                  </span>
                  {meditation.pinned && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                  <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {meditation.time}
                  </span>
                </div>
                <h3 className="font-semibold text-lg mb-2">{meditation.title}</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} line-clamp-3`}>
                  {meditation.summary}
                </p>
              </div>
              
              <div className="flex space-x-1 ml-4">
                <button 
                  onClick={() => handleShare(meditation)}
                  className="p-1 hover:bg-gray-100 rounded transition-all duration-200 hover:scale-110"
                >
                  <Share2 className="w-4 h-4 text-gray-500" />
                </button>
                <button 
                  onClick={() => onEditMeditation(meditation)}
                  className="p-1 hover:bg-gray-100 rounded transition-all duration-200 hover:scale-110"
                >
                  <Edit3 className="w-4 h-4 text-gray-500" />
                </button>
                <button 
                  onClick={() => handleDelete(meditation)}
                  className="p-1 hover:bg-gray-100 rounded transition-all duration-200 hover:scale-110"
                >
                  <Trash2 className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} flex items-center justify-between`}>
              <span>{meditation.date}</span>
              <div className="flex space-x-1">
                {meditation.tags.map((tag: string) => (
                  <span key={tag} className={`px-2 py-1 rounded-full bg-gray-100 transition-colors duration-200 ${
                    darkMode ? 'bg-gray-700 text-gray-300' : 'text-gray-600'
                  }`}>
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMeditations.length === 0 && (
        <div className="text-center py-12 animate-fade-in">
          <p className="text-gray-500">Aucune méditation trouvée.</p>
        </div>
      )}
    </div>
  );
};
