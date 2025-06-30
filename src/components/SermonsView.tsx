
import React from 'react';
import { Plus, Printer, Edit3, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SermonsViewProps {
  darkMode: boolean;
}

export const SermonsView = ({ darkMode }: SermonsViewProps) => {
  const sermons = [
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between animate-fade-in">
        <h2 className="text-xl font-semibold">Mes Sermons</h2>
        <Button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105">
          <Plus className="w-4 h-4 inline mr-2" />
          Nouveau sermon
        </Button>
      </div>

      <div className="space-y-3">
        {sermons.map((sermon, index) => (
          <div 
            key={sermon.id} 
            className={`p-4 rounded-lg border transition-all duration-300 hover:shadow-lg transform hover:scale-[1.02] animate-fade-in ${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">{sermon.title}</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                  Thème: {sermon.theme}
                </p>
                <div className="text-xs text-blue-600 mb-2">
                  {sermon.references.length} méditation(s) référencée(s)
                </div>
                <pre className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} whitespace-pre-wrap`}>
                  {sermon.outline}
                </pre>
              </div>
              
              <div className="flex space-x-2 ml-4">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-110">
                  <Printer className="w-4 h-4 text-gray-500" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-110">
                  <Edit3 className="w-4 h-4 text-gray-500" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-110">
                  <Share2 className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} flex items-center justify-between pt-3 border-t ${
              darkMode ? 'border-gray-700' : 'border-gray-100'
            }`}>
              <span>Prévu pour: {sermon.date}</span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                sermon.status === 'en_preparation' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
              }`}>
                {sermon.status === 'en_preparation' ? 'En préparation' : 'Terminé'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
