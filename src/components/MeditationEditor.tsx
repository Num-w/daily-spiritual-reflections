
import React, { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { RichTextEditor } from './RichTextEditor';

interface MeditationEditorProps {
  onClose: () => void;
  darkMode: boolean;
  meditation?: any;
  onSave: (meditationData: any) => void;
}

export const MeditationEditor = ({ onClose, darkMode, meditation, onSave }: MeditationEditorProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    verse: meditation?.verse || '',
    title: meditation?.title || '',
    content: meditation?.content || '',
    summary: meditation?.summary || '',
    comments: meditation?.comments || '',
    color: meditation?.color || 'blue',
    pinned: meditation?.pinned || false,
    time: meditation?.time || 'matin',
    tags: meditation?.tags?.join(', ') || ''
  });

  const colors = ['blue', 'green', 'yellow', 'red', 'purple', 'orange', 'pink', 'gray'];

  const handleSave = () => {
    if (!formData.verse || !formData.title || !formData.summary) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir les champs obligatoires (verset, titre, résumé)",
        variant: "destructive"
      });
      return;
    }

    const meditationData = {
      id: meditation?.id || Date.now(),
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      date: meditation?.date || new Date().toISOString().split('T')[0]
    };

    onSave(meditationData);
    toast({
      title: "Succès",
      description: meditation ? "Méditation modifiée avec succès" : "Méditation créée avec succès"
    });
    onClose();
  };

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
          <h2 className="text-lg font-semibold">
            {meditation ? 'Modifier la méditation' : 'Nouvelle méditation'}
          </h2>
          <Button 
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            <Save className="w-4 h-4 inline mr-2" />
            Sauvegarder
          </Button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4 animate-fade-in">
            <div>
              <label className="block text-sm font-medium mb-2">Verset *</label>
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
            <label className="block text-sm font-medium mb-2">Titre *</label>
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
            <RichTextEditor
              value={formData.content}
              onChange={(content) => setFormData({...formData, content})}
              placeholder="Copiez le verset ici"
              rows={3}
              darkMode={darkMode}
            />
          </div>

          <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
            <label className="block text-sm font-medium mb-2">Résumé de méditation *</label>
            <RichTextEditor
              value={formData.summary}
              onChange={(summary) => setFormData({...formData, summary})}
              placeholder="Votre réflexion personnelle..."
              rows={4}
              darkMode={darkMode}
            />
          </div>

          <div className="animate-fade-in" style={{ animationDelay: '400ms' }}>
            <label className="block text-sm font-medium mb-2">Commentaires</label>
            <RichTextEditor
              value={formData.comments}
              onChange={(comments) => setFormData({...formData, comments})}
              placeholder="Notes additionnelles..."
              rows={3}
              darkMode={darkMode}
            />
          </div>

          <div className="animate-fade-in" style={{ animationDelay: '500ms' }}>
            <label className="block text-sm font-medium mb-2">Tags (séparés par des virgules)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({...formData, tags: e.target.value})}
              className={`w-full px-3 py-2 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-blue-500 ${
                darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
              }`}
              placeholder="amour, grâce, salut"
            />
          </div>

          <div className="flex items-center justify-between animate-fade-in" style={{ animationDelay: '600ms' }}>
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
