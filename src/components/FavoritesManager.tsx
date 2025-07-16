import React, { useState, useEffect } from 'react';
import { Heart, Star, Pin, Filter, Calendar, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface FavoritesManagerProps {
  meditations: any[];
  onEditMeditation: (meditation: any) => void;
  darkMode: boolean;
}

export const FavoritesManager = ({ meditations, onEditMeditation, darkMode }: FavoritesManagerProps) => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [pinned, setPinned] = useState<number[]>([]);
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const { toast } = useToast();

  useEffect(() => {
    const savedFavorites = localStorage.getItem('meditation_favorites');
    const savedPinned = localStorage.getItem('meditation_pinned');
    
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    
    if (savedPinned) {
      setPinned(JSON.parse(savedPinned));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('meditation_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('meditation_pinned', JSON.stringify(pinned));
  }, [pinned]);

  const toggleFavorite = (meditationId: number) => {
    setFavorites(prev => {
      if (prev.includes(meditationId)) {
        return prev.filter(id => id !== meditationId);
      } else {
        toast({
          title: "Ajouté aux favoris",
          description: "Cette méditation a été ajoutée à vos favoris",
        });
        return [...prev, meditationId];
      }
    });
  };

  const togglePin = (meditationId: number) => {
    setPinned(prev => {
      if (prev.includes(meditationId)) {
        return prev.filter(id => id !== meditationId);
      } else {
        toast({
          title: "Méditation épinglée",
          description: "Cette méditation apparaîtra en haut de votre liste",
        });
        return [...prev, meditationId];
      }
    });
  };

  const getFilteredMeditations = () => {
    let filtered = meditations;

    switch (filterType) {
      case 'favorites':
        filtered = meditations.filter(m => favorites.includes(m.id));
        break;
      case 'pinned':
        filtered = meditations.filter(m => pinned.includes(m.id));
        break;
      case 'recent':
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        filtered = meditations.filter(m => new Date(m.date) >= weekAgo);
        break;
      default:
        filtered = meditations;
    }

    // Tri
    filtered.sort((a, b) => {
      // Les épinglées en premier
      if (pinned.includes(a.id) && !pinned.includes(b.id)) return -1;
      if (!pinned.includes(a.id) && pinned.includes(b.id)) return 1;

      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'verse':
          return a.verse.localeCompare(b.verse);
        case 'date':
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

    return filtered;
  };

  const filteredMeditations = getFilteredMeditations();
  const favoriteCount = favorites.length;
  const pinnedCount = pinned.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Méditations organisées</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Star className="w-4 h-4" />
          <span>{favoriteCount} favoris</span>
          <Pin className="w-4 h-4 ml-4" />
          <span>{pinnedCount} épinglées</span>
        </div>
      </div>

      {/* Filtres et tri */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4" />
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes</SelectItem>
              <SelectItem value="favorites">Favoris uniquement</SelectItem>
              <SelectItem value="pinned">Épinglées uniquement</SelectItem>
              <SelectItem value="recent">Récentes (7 jours)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Trier par date</SelectItem>
            <SelectItem value="title">Trier par titre</SelectItem>
            <SelectItem value="verse">Trier par verset</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Liste des méditations */}
      <div className="grid gap-4">
        {filteredMeditations.length === 0 ? (
          <Card className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
            <CardContent className="p-8 text-center">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">
                {filterType === 'favorites' && 'Aucun favori pour le moment'}
                {filterType === 'pinned' && 'Aucune méditation épinglée'}
                {filterType === 'recent' && 'Aucune méditation récente'}
                {filterType === 'all' && 'Aucune méditation trouvée'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredMeditations.map((meditation) => (
            <Card
              key={meditation.id}
              className={`transition-all duration-200 hover:shadow-lg cursor-pointer ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              } ${pinned.includes(meditation.id) ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}
              onClick={() => onEditMeditation(meditation)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {pinned.includes(meditation.id) && (
                        <Pin className="w-4 h-4 text-blue-500" />
                      )}
                      <span className="text-sm text-blue-600 font-medium">
                        {meditation.verse}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(meditation.date).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    
                    <h3 className="font-semibold mb-2">{meditation.title}</h3>
                    
                    {meditation.summary && (
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {meditation.summary}
                      </p>
                    )}
                    
                    {meditation.tags && meditation.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {meditation.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col space-y-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(meditation.id);
                      }}
                      className={favorites.includes(meditation.id) ? 'text-red-500' : 'text-gray-400'}
                    >
                      <Heart 
                        className="w-4 h-4" 
                        fill={favorites.includes(meditation.id) ? 'currentColor' : 'none'}
                      />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePin(meditation.id);
                      }}
                      className={pinned.includes(meditation.id) ? 'text-blue-500' : 'text-gray-400'}
                    >
                      <Pin className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};