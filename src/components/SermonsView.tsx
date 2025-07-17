
import React, { useState } from 'react';
import { Plus, Printer, Edit3, Share2, Trash2, X, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface SermonsViewProps {
  darkMode: boolean;
  sermons: any[];
  meditations: any[];
  onSaveSermon: (sermon: any) => void;
  onDeleteSermon: (id: number) => void;
}

export const SermonsView = ({ darkMode, sermons, meditations, onSaveSermon, onDeleteSermon }: SermonsViewProps) => {
  const { toast } = useToast();
  const [showEditor, setShowEditor] = useState(false);
  const [editingSermon, setEditingSermon] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    theme: '',
    date: '',
    references: [],
    outline: '',
    status: 'en_preparation'
  });

  const handleNewSermon = () => {
    setEditingSermon(null);
    setFormData({
      title: '',
      theme: '',
      date: '',
      references: [],
      outline: '',
      status: 'en_preparation'
    });
    setShowEditor(true);
  };

  const handleEditSermon = (sermon: any) => {
    setEditingSermon(sermon);
    setFormData(sermon);
    setShowEditor(true);
  };

  const handleSaveSermon = () => {
    if (!formData.title || !formData.theme || !formData.date) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    const sermonData = {
      ...formData,
      id: editingSermon?.id || Date.now()
    };

    onSaveSermon(sermonData);
    toast({
      title: "Succès",
      description: editingSermon ? "Sermon modifié avec succès" : "Sermon créé avec succès"
    });
    setShowEditor(false);
  };

  const handleDeleteSermon = (sermon: any) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le sermon "${sermon.title}" ?`)) {
      onDeleteSermon(sermon.id);
      toast({
        title: "Supprimé",
        description: "Le sermon a été supprimé avec succès"
      });
    }
  };

  const handlePrint = (sermon: any) => {
    const printContent = `
      <h1>${sermon.title}</h1>
      <p><strong>Thème:</strong> ${sermon.theme}</p>
      <p><strong>Date:</strong> ${sermon.date}</p>
      <p><strong>Statut:</strong> ${sermon.status === 'en_preparation' ? 'En préparation' : 'Terminé'}</p>
      <h2>Plan:</h2>
      <pre>${sermon.outline}</pre>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow?.document.write(`
      <html>
        <head><title>${sermon.title}</title></head>
        <body>${printContent}</body>
      </html>
    `);
    printWindow?.print();
  };

  const handleShare = async (sermon: any) => {
    const shareText = `${sermon.title}\n\nThème: ${sermon.theme}\nDate: ${sermon.date}\n\nPlan:\n${sermon.outline}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: sermon.title,
          text: shareText,
        });
      } catch (error) {
        // Si le partage échoue, copier dans le presse-papier en fallback
        try {
          await navigator.clipboard.writeText(shareText);
          toast({
            title: "Copié !",
            description: "Le contenu du sermon a été copié dans le presse-papier"
          });
        } catch (clipboardError) {
          toast({
            title: "Erreur",
            description: "Impossible de partager ou copier le contenu",
            variant: "destructive"
          });
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        toast({
          title: "Copié !",
          description: "Le contenu du sermon a été copié dans le presse-papier"
        });
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de copier le contenu dans le presse-papier",
          variant: "destructive"
        });
      }
    }
  };

  if (showEditor) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {editingSermon ? 'Modifier le sermon' : 'Nouveau sermon'}
          </h2>
          <div className="flex space-x-2">
            <Button onClick={handleSaveSermon} className="bg-green-600 hover:bg-green-700">
              <Save className="w-4 h-4 mr-2" />
              Sauvegarder
            </Button>
            <Button variant="outline" onClick={() => setShowEditor(false)}>
              <X className="w-4 h-4 mr-2" />
              Annuler
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Titre *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className={`w-full px-3 py-2 rounded-lg border ${
                  darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
                }`}
                placeholder="Titre du sermon"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Thème *</label>
              <input
                type="text"
                value={formData.theme}
                onChange={(e) => setFormData({...formData, theme: e.target.value})}
                className={`w-full px-3 py-2 rounded-lg border ${
                  darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
                }`}
                placeholder="Thème principal"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Date prévue *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className={`w-full px-3 py-2 rounded-lg border ${
                  darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Statut</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className={`w-full px-3 py-2 rounded-lg border ${
                  darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
                }`}
              >
                <option value="en_preparation">En préparation</option>
                <option value="termine">Terminé</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Plan du sermon</label>
            <textarea
              value={formData.outline}
              onChange={(e) => setFormData({...formData, outline: e.target.value})}
              rows={10}
              className={`w-full px-3 py-2 rounded-lg border ${
                darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
              }`}
              placeholder="1. Introduction&#10;2. Point principal 1&#10;3. Point principal 2&#10;4. Conclusion"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between animate-fade-in">
        <h2 className="text-xl font-semibold">Mes Sermons</h2>
        <Button onClick={handleNewSermon} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105">
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
                  {sermon.references?.length || 0} méditation(s) référencée(s)
                </div>
                <pre className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} whitespace-pre-wrap`}>
                  {sermon.outline}
                </pre>
              </div>
              
              <div className="flex space-x-2 ml-4">
                <button 
                  onClick={() => handlePrint(sermon)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-110"
                >
                  <Printer className="w-4 h-4 text-gray-500" />
                </button>
                <button 
                  onClick={() => handleEditSermon(sermon)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-110"
                >
                  <Edit3 className="w-4 h-4 text-gray-500" />
                </button>
                <button 
                  onClick={() => handleShare(sermon)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-110"
                >
                  <Share2 className="w-4 h-4 text-gray-500" />
                </button>
                <button 
                  onClick={() => handleDeleteSermon(sermon)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-110"
                >
                  <Trash2 className="w-4 h-4 text-gray-500" />
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

      {sermons.length === 0 && (
        <div className="text-center py-12 animate-fade-in">
          <p className="text-gray-500">Aucun sermon créé pour le moment.</p>
          <Button onClick={handleNewSermon} className="mt-4 bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" />
            Créer votre premier sermon
          </Button>
        </div>
      )}
    </div>
  );
};
