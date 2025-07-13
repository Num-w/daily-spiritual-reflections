import React, { useState, useMemo } from 'react';
import { Search, X, Calendar, Tag, BookOpen, Mic } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SearchSystemProps {
  darkMode: boolean;
  meditations: any[];
  sermons: any[];
  onSelectMeditation: (meditation: any) => void;
  onSelectSermon: (sermon: any) => void;
}

export const SearchSystem = ({ 
  darkMode, 
  meditations, 
  sermons, 
  onSelectMeditation, 
  onSelectSermon 
}: SearchSystemProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'meditations' | 'sermons'>('all');

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return { meditations: [], sermons: [] };

    const term = searchTerm.toLowerCase();
    
    const filteredMeditations = meditations.filter(meditation => 
      meditation.title?.toLowerCase().includes(term) ||
      meditation.verse?.toLowerCase().includes(term) ||
      meditation.content?.toLowerCase().includes(term) ||
      meditation.summary?.toLowerCase().includes(term) ||
      meditation.comments?.toLowerCase().includes(term) ||
      meditation.tags?.some((tag: string) => tag.toLowerCase().includes(term))
    );

    const filteredSermons = sermons.filter(sermon => 
      sermon.title?.toLowerCase().includes(term) ||
      sermon.theme?.toLowerCase().includes(term) ||
      sermon.outline?.toLowerCase().includes(term)
    );

    return {
      meditations: activeFilter === 'sermons' ? [] : filteredMeditations,
      sermons: activeFilter === 'meditations' ? [] : filteredSermons
    };
  }, [searchTerm, meditations, sermons, activeFilter]);

  const totalResults = searchResults.meditations.length + searchResults.sermons.length;

  const clearSearch = () => {
    setSearchTerm('');
  };

  const highlightText = (text: string, searchTerm: string) => {
    if (!searchTerm.trim()) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <div className="space-y-4">
      {/* Barre de recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Rechercher dans les méditations et sermons..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 h-6 w-6"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Filtres */}
      <div className="flex space-x-2">
        <Button
          variant={activeFilter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveFilter('all')}
        >
          Tout
        </Button>
        <Button
          variant={activeFilter === 'meditations' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveFilter('meditations')}
        >
          <BookOpen className="w-4 h-4 mr-1" />
          Méditations
        </Button>
        <Button
          variant={activeFilter === 'sermons' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveFilter('sermons')}
        >
          <Mic className="w-4 h-4 mr-1" />
          Sermons
        </Button>
      </div>

      {/* Résultats */}
      {searchTerm && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Résultats de recherche
            </h3>
            <Badge variant="secondary">
              {totalResults} résultat{totalResults !== 1 ? 's' : ''}
            </Badge>
          </div>

          {totalResults === 0 ? (
            <Card className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}>
              <CardContent className="py-8 text-center text-gray-500">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Aucun résultat trouvé pour "{searchTerm}"</p>
                <p className="text-sm mt-2">
                  Essayez avec d'autres mots-clés ou vérifiez l'orthographe
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {/* Méditations */}
              {searchResults.meditations.map((meditation) => (
                <Card 
                  key={meditation.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    darkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => onSelectMeditation(meditation)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className={`w-3 h-3 rounded-full mt-2 ${
                        meditation.color === 'blue' ? 'bg-blue-500' :
                        meditation.color === 'green' ? 'bg-green-500' :
                        meditation.color === 'purple' ? 'bg-purple-500' :
                        meditation.color === 'orange' ? 'bg-orange-500' :
                        'bg-gray-500'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <BookOpen className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-600">Méditation</span>
                          <Badge variant="outline" className="text-xs">
                            {meditation.verse}
                          </Badge>
                        </div>
                        <h4 className="font-semibold mb-2">
                          {highlightText(meditation.title, searchTerm)}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                          {highlightText(meditation.summary || meditation.content, searchTerm)}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(meditation.date)}</span>
                          </div>
                          {meditation.tags && meditation.tags.length > 0 && (
                            <div className="flex items-center space-x-1">
                              <Tag className="w-3 h-3" />
                              <span>{meditation.tags.join(', ')}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Sermons */}
              {searchResults.sermons.map((sermon) => (
                <Card 
                  key={sermon.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    darkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => onSelectSermon(sermon)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-3 h-3 rounded-full mt-2 bg-purple-500" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <Mic className="w-4 h-4 text-purple-600" />
                          <span className="text-sm font-medium text-purple-600">Sermon</span>
                          <Badge 
                            variant={
                              sermon.status === 'termine' ? 'default' :
                              sermon.status === 'en_preparation' ? 'secondary' : 'outline'
                            }
                            className="text-xs"
                          >
                            {sermon.status === 'termine' ? 'Terminé' :
                             sermon.status === 'en_preparation' ? 'En préparation' : 'Brouillon'}
                          </Badge>
                        </div>
                        <h4 className="font-semibold mb-2">
                          {highlightText(sermon.title, searchTerm)}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          Thème: {highlightText(sermon.theme, searchTerm)}
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(sermon.date)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};