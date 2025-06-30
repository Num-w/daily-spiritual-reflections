
import React, { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MeditationEditorProps {
  onClose: () => void;
  darkMode: boolean;
}

export const MeditationEditor = ({ onClose, darkMode }: MeditationEditorProps) => {
  const [formData, setFormData] = useState({
    verse: '',
    title: '',
    content: '',
    summary: '',
    comments: '',
    color: 'blue',
    pinned: false,
    time: 'matin',
    tags: ''
  });

  const colors = ['blue', 'green', 'yellow', 'red', 'purple', 'orange', 'pink', 'gray'];

  return (
    <div className={`fixed inset-0 z-50 animate-fade-in ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <div className={`h-full flex flex-col ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b transition-colors duration-300 ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-110"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-semibold">Nouvelle méditation</h2>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105">
            <Save className="w-4 h-4 inline mr-2" />
            Sauvegarder
          </Button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4 animate-fade-in">
            <div>
              <label className="block text-sm font-medium mb-2">Verset</label>
              <input
                type="text"
                value={formData.verse}
                onChange={(e) => setFormData({...formData, verse: e.target.value})}
                className={`w-full px-3 py-2 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-blue-500 ${
                  darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
                }`}
                placeholder="ex: Jean 3:16"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Moment</label>
              <select
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
                className={`w-full px-3 py-2 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-blue-500 ${
                  darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
                }`}
              >
                <option value="matin">Matin</option>
                <option value="soir">Soir</option>
                <option value="midi">Midi</option>
              </select>
            </div>
          </div>

          <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
            <label className="block text-sm font-medium mb-2">Titre</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className={`w-full px-3 py-2 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-blue-500 ${
                darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
              }`}
              placeholder="Titre de votre méditation"
            />
          </div>

          <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
            <label className="block text-sm font-medium mb-2">Texte biblique</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              rows={3}
              className={`w-full px-3 py-2 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-blue-500 ${
                darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
              }`}
              placeholder="Copiez le verset ici"
            />
          </div>

          <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
            <label className="block text-sm font-medium mb-2">Résumé de méditation</label>
            <textarea
              value={formData.summary}
              onChange={(e) => setFormData({...formData, summary: e.target.value})}
              rows={4}
              className={`w-full px-3 py-2 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-blue-500 ${
                darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
              }`}
              placeholder="Votre réflexion personnelle..."
            />
          </div>

          <div className="animate-fade-in" style={{ animationDelay: '400ms' }}>
            <label className="block text-sm font-medium mb-2">Commentaires</label>
            <textarea
              value={formData.comments}
              onChange={(e) => setFormData({...formData, comments: e.target.value})}
              rows={3}
              className={`w-full px-3 py-2 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-blue-500 ${
                darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
              }`}
              placeholder="Notes additionnelles..."
            />
          </div>

          <div className="flex items-center justify-between animate-fade-in" style={{ animationDelay: '500ms' }}>
            <div>
              <label className="block text-sm font-medium mb-2">Couleur</label>
              <div className="flex space-x-2">
                {colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setFormData({...formData, color})}
                    className={`w-8 h-8 rounded-full bg-${color}-500 transition-all duration-200 hover:scale-110 ${
                      formData.color === color ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''
                    }`}
                  />
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.pinned}
                  onChange={(e) => setFormData({...formData, pinned: e.target.checked})}
                  className="mr-2"
                />
                Épingler
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
