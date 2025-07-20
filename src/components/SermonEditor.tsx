import React, { useState, useEffect } from 'react';
import { Save, X, Plus, Trash2, BookOpen, Calendar, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { RichTextEditor } from './RichTextEditor';

interface SermonEditorProps {
  sermon?: any;
  meditations: any[];
  onSave: (sermon: any) => void;
  onClose: () => void;
  darkMode: boolean;
}

export const SermonEditor = ({ sermon, meditations, onSave, onClose, darkMode }: SermonEditorProps) => {
  const [title, setTitle] = useState('');
  const [theme, setTheme] = useState('');
  const [date, setDate] = useState('');
  const [status, setStatus] = useState('en_preparation');
  const [references, setReferences] = useState<number[]>([]);
  const [outline, setOutline] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [mainPoints, setMainPoints] = useState<string[]>(['']);
  const [conclusion, setConclusion] = useState('');
  const [notes, setNotes] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (sermon) {
      setTitle(sermon.title || '');
      setTheme(sermon.theme || '');
      setDate(sermon.date || '');
      setStatus(sermon.status || 'en_preparation');
      setReferences(sermon.references || []);
      setOutline(sermon.outline || '');
      setIntroduction(sermon.introduction || '');
      setMainPoints(sermon.mainPoints || ['']);
      setConclusion(sermon.conclusion || '');
      setNotes(sermon.notes || '');
    }
  }, [sermon]);

  const handleSave = () => {
    if (!title.trim()) {
      toast({
        title: "Titre requis",
        description: "Veuillez saisir un titre pour le sermon",
        variant: "destructive",
      });
      return;
    }

    const sermonData = {
      id: sermon?.id || Date.now(),
      title: title.trim(),
      theme: theme.trim(),
      date,
      status,
      references,
      outline: outline.trim(),
      introduction: introduction.trim(),
      mainPoints: mainPoints.filter(point => point.trim()),
      conclusion: conclusion.trim(),
      notes: notes.trim(),
      createdAt: sermon?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(sermonData);
    toast({
      title: "Sermon sauvegardé",
      description: "Le sermon a été enregistré avec succès",
    });
    onClose();
  };

  const addMainPoint = () => {
    setMainPoints([...mainPoints, '']);
  };

  const updateMainPoint = (index: number, value: string) => {
    const newPoints = [...mainPoints];
    newPoints[index] = value;
    setMainPoints(newPoints);
  };

  const removeMainPoint = (index: number) => {
    if (mainPoints.length > 1) {
      setMainPoints(mainPoints.filter((_, i) => i !== index));
    }
  };

  const addReference = (meditationId: number) => {
    if (!references.includes(meditationId)) {
      setReferences([...references, meditationId]);
    }
  };

  const removeReference = (meditationId: number) => {
    setReferences(references.filter(id => id !== meditationId));
  };

  const statusOptions = [
    { value: 'en_preparation', label: 'En préparation' },
    { value: 'pret', label: 'Prêt' },
    { value: 'presente', label: 'Présenté' },
    { value: 'archive', label: 'Archivé' }
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {sermon ? 'Modifier le sermon' : 'Nouveau sermon'}
        </h2>
        <Button variant="ghost" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Informations principales */}
        <Card className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mic className="w-5 h-5" />
              <span>Informations</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Titre *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                }`}
                placeholder="Titre du sermon"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Thème</label>
              <input
                type="text"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                }`}
                placeholder="Thème principal"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Statut</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Références bibliques */}
        <Card className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5" />
              <span>Références</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {references.map(refId => {
                const meditation = meditations.find(m => m.id === refId);
                return meditation ? (
                  <div key={refId} className={`p-2 rounded border flex items-center justify-between ${
                    darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div>
                      <p className="text-sm font-medium">{meditation.verse}</p>
                      <p className="text-xs text-gray-500">{meditation.title}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeReference(refId)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : null;
              })}
            </div>

            <Select onValueChange={(value) => addReference(parseInt(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Ajouter une méditation" />
              </SelectTrigger>
              <SelectContent>
                {meditations
                  .filter(m => !references.includes(m.id))
                  .map(meditation => (
                    <SelectItem key={meditation.id} value={meditation.id.toString()}>
                      {meditation.verse} - {meditation.title}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Plan du sermon */}
        <Card className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
          <CardHeader>
            <CardTitle>Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <RichTextEditor
              value={outline}
              onChange={setOutline}
              placeholder="Plan détaillé du sermon..."
              rows={8}
              darkMode={darkMode}
            />
          </CardContent>
        </Card>
      </div>

      {/* Contenu du sermon */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
          <CardHeader>
            <CardTitle>Introduction</CardTitle>
          </CardHeader>
          <CardContent>
            <RichTextEditor
              value={introduction}
              onChange={setIntroduction}
              placeholder="Introduction du sermon..."
              rows={5}
              darkMode={darkMode}
            />
          </CardContent>
        </Card>

        <Card className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
          <CardHeader>
            <CardTitle>Conclusion</CardTitle>
          </CardHeader>
          <CardContent>
            <RichTextEditor
              value={conclusion}
              onChange={setConclusion}
              placeholder="Conclusion du sermon..."
              rows={5}
              darkMode={darkMode}
            />
          </CardContent>
        </Card>
      </div>

      {/* Points principaux */}
      <Card className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Points principaux</span>
            <Button variant="outline" size="sm" onClick={addMainPoint}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {mainPoints.map((point, index) => (
            <div key={index} className="flex items-start space-x-3">
              <span className="text-sm font-medium mt-2">{index + 1}.</span>
              <RichTextEditor
                value={point}
                onChange={(value) => updateMainPoint(index, value)}
                placeholder={`Point principal ${index + 1}...`}
                rows={3}
                darkMode={darkMode}
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeMainPoint(index)}
                disabled={mainPoints.length === 1}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Notes */}
      <Card className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
        <CardHeader>
          <CardTitle>Notes personnelles</CardTitle>
        </CardHeader>
          <CardContent>
            <RichTextEditor
              value={notes}
              onChange={setNotes}
              placeholder="Notes et rappels personnels..."
              rows={4}
              darkMode={darkMode}
            />
          </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Sauvegarder
        </Button>
      </div>
    </div>
  );
};