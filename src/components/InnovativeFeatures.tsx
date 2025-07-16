import React, { useState, useEffect } from 'react';
import { Brain, Target, TrendingUp, Zap, Clock, Award, Lightbulb, Heart, Quote, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface InnovativeFeaturesProps {
  darkMode: boolean;
  meditations: any[];
  onAddMeditation: (meditation: any) => void;
  onSuggestMeditation?: (suggestion: any) => void;
}

export const InnovativeFeatures = ({ darkMode, meditations, onAddMeditation, onSuggestMeditation }: InnovativeFeaturesProps) => {
  const [dailyChallenge, setDailyChallenge] = useState<string>('');
  const [meditationStreak, setMeditationStreak] = useState(0);
  const [insights, setInsights] = useState<string[]>([]);
  const [mood, setMood] = useState<string>('');
  const [suggestion, setSuggestion] = useState<any>(null);
  const [weeklyGoal] = useState(7);
  const { toast } = useToast();

  useEffect(() => {
    generateDailyChallenge();
    calculateStreak();
    generateInsights();
    generateSuggestion();
  }, [meditations]);

  const challenges = [
    "Méditez 5 minutes sur la gratitude aujourd'hui",
    "Trouvez 3 raisons de remercier Dieu dans votre journée",
    "Partagez un verset biblique avec quelqu'un",
    "Prenez 10 minutes pour la prière silencieuse",
    "Écrivez une lettre de reconnaissance à Dieu",
    "Méditez sur un Psaume de votre choix",
    "Pratiquez la compassion envers une personne difficile"
  ];

  const generateDailyChallenge = () => {
    const today = new Date().toDateString();
    const savedChallenge = localStorage.getItem(`challenge_${today}`);
    
    if (savedChallenge) {
      setDailyChallenge(savedChallenge);
    } else {
      const challenge = challenges[Math.floor(Math.random() * challenges.length)];
      setDailyChallenge(challenge);
      localStorage.setItem(`challenge_${today}`, challenge);
    }
  };

  const calculateStreak = () => {
    if (meditations.length === 0) {
      setMeditationStreak(0);
      return;
    }

    const sortedMeditations = meditations
      .filter(m => m.date)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    let streak = 0;
    const today = new Date();
    let currentDate = new Date(today);

    for (const meditation of sortedMeditations) {
      const meditationDate = new Date(meditation.date);
      const diffDays = Math.floor((currentDate.getTime() - meditationDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === streak) {
        streak++;
        currentDate = new Date(meditationDate);
      } else if (diffDays > streak) {
        break;
      }
    }

    setMeditationStreak(streak);
  };

  const generateInsights = () => {
    if (meditations.length < 3) {
      setInsights(["Continuez à écrire des méditations pour obtenir des insights personnalisés!"]);
      return;
    }

    const recentMeditations = meditations
      .filter(m => m.date)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);

    const insights = [];

    // Analyser les thèmes récurrents
    const allTags = recentMeditations.flatMap(m => m.tags || []);
    const tagCounts = allTags.reduce((acc: Record<string, number>, tag: string) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {});

    const topTag = Object.entries(tagCounts).sort((a, b) => (b[1] as number) - (a[1] as number))[0];
    if (topTag) {
      insights.push(`Vous méditez souvent sur "${topTag[0]}" - un thème qui vous tient à cœur.`);
    }

    // Analyser la fréquence
    const frequency = recentMeditations.length;
    if (frequency >= 7) {
      insights.push("Excellente régularité dans vos méditations cette semaine !");
    } else if (frequency >= 3) {
      insights.push("Bonne progression dans votre pratique spirituelle.");
    }

    // Analyser les moments préférés
    const times = recentMeditations.map(m => m.time).filter(Boolean);
    const morningCount = times.filter(t => t === 'matin').length;
    const eveningCount = times.filter(t => t === 'soir').length;
    
    if (morningCount > eveningCount) {
      insights.push("Vous préférez méditer le matin - un excellent moyen de commencer la journée !");
    } else if (eveningCount > morningCount) {
      insights.push("Vous aimez méditer le soir - parfait pour la réflexion en fin de journée.");
    }

    setInsights(insights.slice(0, 3));
  };

  const generateQuickMeditation = () => {
    const verses = [
      "Psaume 23:1 - L'Éternel est mon berger: je ne manquerai de rien.",
      "Philippiens 4:13 - Je puis tout par celui qui me fortifie.",
      "Proverbes 3:5-6 - Confie-toi en l'Éternel de tout ton cœur.",
      "Matthieu 11:28 - Venez à moi, vous tous qui êtes fatigués.",
      "Romains 8:28 - Toutes choses concourent au bien de ceux qui aiment Dieu."
    ];

    const randomVerse = verses[Math.floor(Math.random() * verses.length)];
    const [reference, content] = randomVerse.split(' - ');

    const quickMeditation = {
      id: Date.now(),
      verse: reference,
      title: "Méditation Express",
      content: content,
      summary: "Méditation générée automatiquement pour inspiration rapide",
      comments: "",
      color: "purple",
      pinned: false,
      date: new Date().toISOString().split('T')[0],
      time: new Date().getHours() < 12 ? 'matin' : 'soir',
      tags: ["inspiration", "express"]
    };

    onAddMeditation(quickMeditation);
    toast({
      title: "Méditation générée",
      description: "Une nouvelle méditation express a été ajoutée",
    });
  };

  const moods = [
    { emoji: '😊', label: 'Joyeux', color: 'text-yellow-500' },
    { emoji: '😌', label: 'Paisible', color: 'text-blue-500' },
    { emoji: '🙏', label: 'Reconnaissant', color: 'text-green-500' },
    { emoji: '😔', label: 'Pensif', color: 'text-gray-500' },
    { emoji: '💪', label: 'Motivé', color: 'text-red-500' }
  ];

  const trackMood = (selectedMood: string) => {
    setMood(selectedMood);
    const today = new Date().toDateString();
    localStorage.setItem(`mood_${today}`, selectedMood);
    toast({
      title: "Humeur enregistrée",
      description: `Votre humeur "${selectedMood}" a été sauvegardée`,
    });
  };

  const generateSuggestion = () => {
    if (meditations.length === 0) return;

    const suggestions = [
      {
        verse: "Philippiens 4:13",
        title: "La force en Christ",
        theme: "perseverance",
        reason: "Pour continuer votre série de méditations"
      },
      {
        verse: "Psaume 119:105",
        title: "La lumière de la Parole", 
        theme: "guidance",
        reason: "Pour approfondir votre compréhension"
      },
      {
        verse: "Romains 8:28",
        title: "Toutes choses concourent au bien",
        theme: "providence",
        reason: "Pour méditer sur la providence divine"
      }
    ];

    const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    setSuggestion(randomSuggestion);
  };

  const acceptSuggestion = () => {
    if (suggestion && onSuggestMeditation) {
      onSuggestMeditation({
        verse: suggestion.verse,
        title: suggestion.title,
        content: `Suggestion de méditation sur ${suggestion.verse}`,
        summary: "",
        comments: suggestion.reason,
        color: "purple",
        date: new Date().toISOString().split('T')[0],
        time: "matin",
        tags: [suggestion.theme]
      });
      
      toast({
        title: "Suggestion acceptée",
        description: "Une nouvelle méditation a été créée à partir de la suggestion",
      });
      
      generateSuggestion();
    }
  };

  const weekProgress = Math.min((meditations.filter(m => {
    const date = new Date(m.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return date >= weekAgo;
  }).length / weeklyGoal) * 100, 100);

  return (
    <div className="space-y-6">
      {/* Objectif hebdomadaire et série */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-blue-500" />
              <span>Objectif hebdomadaire</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Progression</span>
                <span className="font-bold">{Math.floor(weekProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${weekProgress}%` }}
                />
              </div>
              <p className="text-sm text-gray-500">
                {meditations.filter(m => {
                  const date = new Date(m.date);
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return date >= weekAgo;
                }).length} / {weeklyGoal} méditations cette semaine
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-green-500" />
              <span>Série actuelle</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500 mb-2">
                {meditationStreak}
              </div>
              <p className="text-sm text-gray-500">
                {meditationStreak === 0 ? 'Commencez une nouvelle série !' :
                 meditationStreak === 1 ? 'jour consécutif' : 'jours consécutifs'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Suggestion intelligente */}
      {suggestion && (
        <Card className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              <span>Suggestion du jour</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Quote className="w-5 h-5 text-blue-500 mt-1" />
                <div className="flex-1">
                  <h4 className="font-medium">{suggestion.title}</h4>
                  <p className="text-sm text-blue-600 mb-2">{suggestion.verse}</p>
                  <p className="text-sm text-gray-500">{suggestion.reason}</p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button onClick={acceptSuggestion} size="sm">
                  Créer cette méditation
                </Button>
                <Button variant="outline" onClick={generateSuggestion} size="sm">
                  Autre suggestion
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Défi du jour */}
      <div className={`p-4 rounded-lg border ${
        darkMode ? 'bg-gradient-to-r from-purple-900 to-blue-900 border-purple-700' : 'bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200'
      }`}>
        <div className="flex items-center mb-3">
          <Target className="w-5 h-5 mr-2 text-purple-500" />
          <h3 className="font-semibold">Défi du jour</h3>
        </div>
        <p className={`text-sm mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {dailyChallenge}
        </p>
        <Button size="sm" variant="outline" onClick={generateDailyChallenge}>
          <Zap className="w-4 h-4 mr-1" />
          Nouveau défi
        </Button>
      </div>


      {/* Insights personnalisés */}
      <div className={`p-4 rounded-lg border ${
        darkMode ? 'bg-gradient-to-r from-blue-900 to-indigo-900 border-blue-700' : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
      }`}>
        <div className="flex items-center mb-3">
          <Brain className="w-5 h-5 mr-2 text-blue-500" />
          <h3 className="font-semibold">Insights personnalisés</h3>
        </div>
        <div className="space-y-2">
          {insights.map((insight, index) => (
            <p key={index} className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              • {insight}
            </p>
          ))}
        </div>
      </div>

      {/* Méditation express */}
      <div className={`p-4 rounded-lg border ${
        darkMode ? 'bg-gradient-to-r from-orange-900 to-red-900 border-orange-700' : 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-200'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <Lightbulb className="w-5 h-5 mr-2 text-orange-500" />
            <h3 className="font-semibold">Méditation Express</h3>
          </div>
          <Clock className="w-4 h-4 text-orange-500" />
        </div>
        <p className={`text-sm mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Besoin d'inspiration rapide ? Générez une méditation automatique.
        </p>
        <Button onClick={generateQuickMeditation} size="sm" className="w-full">
          <Zap className="w-4 h-4 mr-2" />
          Générer une méditation
        </Button>
      </div>

      {/* Suivi d'humeur */}
      <div className={`p-4 rounded-lg border ${
        darkMode ? 'bg-gradient-to-r from-pink-900 to-rose-900 border-pink-700' : 'bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200'
      }`}>
        <div className="flex items-center mb-3">
          <Heart className="w-5 h-5 mr-2 text-pink-500" />
          <h3 className="font-semibold">Comment vous sentez-vous ?</h3>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {moods.map((moodOption) => (
            <button
              key={moodOption.label}
              onClick={() => trackMood(moodOption.label)}
              className={`p-2 rounded-lg text-center transition-all duration-200 hover:scale-105 ${
                mood === moodOption.label 
                  ? (darkMode ? 'bg-gray-700' : 'bg-white shadow-md')
                  : (darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-white')
              }`}
            >
              <div className="text-2xl mb-1">{moodOption.emoji}</div>
              <div className={`text-xs ${moodOption.color}`}>{moodOption.label}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};