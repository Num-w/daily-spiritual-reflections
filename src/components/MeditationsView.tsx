
import React, { useState } from 'react';
import { Search, Filter, Menu, Star, Share2, Edit3, Trash2 } from 'lucide-react';

interface MeditationsViewProps {
  darkMode: boolean;
}

export const MeditationsView = ({ darkMode }: MeditationsViewProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentView, setCurrentView] = useState('grid');
  const [sortBy, setSortBy] = useState('date');
  const [filterColor, setFilterColor] = useState('all');

  const colors = ['blue', 'green', 'yellow', 'red', 'purple', 'orange', 'pink', 'gray'];
  
  const meditations = [
    {
      id: 1,
      verse: "Jean 3:16",
      title: "L'amour de Dieu",
      content: "Car Dieu a tant aimé le monde qu'il a donné son Fils unique...",
      summary: "Méditation sur l'amour inconditionnel de Dieu manifesté par le sacrifice de Jésus. Cette vérité fondamentale nous rappelle que notre salut ne dépend pas de nos œuvres mais de la grâce divine.",
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
      color: "green",
      pinned: false,
      date: "2025-06-24",
      time: "soir",
      tags: ["provision", "confiance", "protection"]
    }
  ];

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

      {/* Meditations list */}
      <div className={currentView === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-3'}>
        {meditations.map((meditation, index) => (
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
                <button className="p-1 hover:bg-gray-100 rounded transition-all duration-200 hover:scale-110">
                  <Share2 className="w-4 h-4 text-gray-500" />
                </button>
                <button className="p-1 hover:bg-gray-100 rounded transition-all duration-200 hover:scale-110">
                  <Edit3 className="w-4 h-4 text-gray-500" />
                </button>
                <button className="p-1 hover:bg-gray-100 rounded transition-all duration-200 hover:scale-110">
                  <Trash2 className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} flex items-center justify-between`}>
              <span>{meditation.date}</span>
              <div className="flex space-x-1">
                {meditation.tags.map(tag => (
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
    </div>
  );
};
