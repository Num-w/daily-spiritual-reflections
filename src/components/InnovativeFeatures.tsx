import React, { useState, useEffect } from 'react';
import { Brain, Target, TrendingUp, Zap, Clock, Award, Lightbulb, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface InnovativeFeaturesProps {
  darkMode: boolean;
  meditations: any[];
  onAddMeditation: (meditation: any) => void;
}

export const InnovativeFeatures = ({ darkMode, meditations, onAddMeditation }: InnovativeFeaturesProps) => {
  const [dailyChallenge, setDailyChallenge] = useState<string>('');
  const [meditationStreak, setMeditationStreak] = useState(0);
  const [insights, setInsights] = useState<string[]>([]);
  const [mood, setMood] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    generateDailyChallenge();
    calculateStreak();
    generateInsights();
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

  return (
    <div className="space-y-6">
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

      {/* Série de méditations */}
      <div className={`p-4 rounded-lg border ${
        darkMode ? 'bg-gradient-to-r from-green-900 to-teal-900 border-green-700' : 'bg-gradient-to-r from-green-50 to-teal-50 border-green-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Award className="w-5 h-5 mr-2 text-green-500" />
            <h3 className="font-semibold">Série de méditations</h3>
          </div>
          <div className="flex items-center">
            <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
            <span className="text-2xl font-bold text-green-500">{meditationStreak}</span>
            <span className="text-sm ml-1">jours</span>
          </div>
        </div>
        <p className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {meditationStreak > 0 
            ? `Félicitations ! Vous avez médité ${meditationStreak} jour${meditationStreak > 1 ? 's' : ''} consécutif${meditationStreak > 1 ? 's' : ''}.`
            : "Commencez votre série de méditations dès aujourd'hui !"
          }
        </p>
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