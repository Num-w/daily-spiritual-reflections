
import React, { useState, useEffect } from 'react';
import { Sun, Lightbulb } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BrightnessControlProps {
  darkMode: boolean;
}

export const BrightnessControl = ({ darkMode }: BrightnessControlProps) => {
  const [brightness, setBrightness] = useState(100);

  useEffect(() => {
    // Charger la luminosité sauvegardée
    const savedBrightness = localStorage.getItem('appBrightness');
    if (savedBrightness) {
      const value = parseInt(savedBrightness);
      setBrightness(value);
      applyBrightness(value);
    }
  }, []);

  const applyBrightness = (value: number) => {
    const root = document.documentElement;
    const body = document.body;
    
    // Calculer l'opacité de l'overlay sombre (inversement proportionnelle à la luminosité)
    const darknessOpacity = (100 - value) / 100;
    
    if (darknessOpacity > 0) {
      // Appliquer un overlay sombre pour réduire l'éclat
      const overlay = `linear-gradient(rgba(0, 0, 0, ${darknessOpacity * 0.3}), rgba(0, 0, 0, ${darknessOpacity * 0.2}))`;
      
      if (darkMode) {
        // En mode sombre, assombrir encore plus
        body.style.background = `${overlay}, hsl(222.2 84% ${4.9 * (value / 100)}%)`;
        root.style.setProperty('--background', `222.2 84% ${4.9 * (value / 100)}%`);
        root.style.setProperty('--card', `222.2 84% ${4.9 * (value / 100)}%`);
      } else {
        // En mode clair, réduire la luminosité du blanc
        const adjustedLightness = 98 * (value / 100);
        body.style.background = `${overlay}, hsl(0 0% ${adjustedLightness}%)`;
        root.style.setProperty('--background', `0 0% ${adjustedLightness}%`);
        root.style.setProperty('--card', `0 0% ${Math.max(adjustedLightness - 2, 95)}%`);
      }
      
      // Ajuster la luminosité des autres éléments
      root.style.setProperty('--popover', darkMode ? `222.2 84% ${4.9 * (value / 100)}%` : `0 0% ${98 * (value / 100)}%`);
      root.style.setProperty('--secondary', darkMode ? `217.2 32.6% ${17.5 * (value / 100)}%` : `210 40% ${96.1 * (value / 100)}%`);
      root.style.setProperty('--muted', darkMode ? `217.2 32.6% ${17.5 * (value / 100)}%` : `210 40% ${96.1 * (value / 100)}%`);
      root.style.setProperty('--accent', darkMode ? `217.2 32.6% ${17.5 * (value / 100)}%` : `210 40% ${96.1 * (value / 100)}%`);
      
    } else {
      // Réinitialiser les valeurs par défaut
      if (darkMode) {
        body.style.background = 'hsl(222.2 84% 4.9%)';
        root.style.setProperty('--background', '222.2 84% 4.9%');
        root.style.setProperty('--card', '222.2 84% 4.9%');
        root.style.setProperty('--popover', '222.2 84% 4.9%');
        root.style.setProperty('--secondary', '217.2 32.6% 17.5%');
        root.style.setProperty('--muted', '217.2 32.6% 17.5%');
        root.style.setProperty('--accent', '217.2 32.6% 17.5%');
      } else {
        body.style.background = 'hsl(0 0% 98%)';
        root.style.setProperty('--background', '0 0% 100%');
        root.style.setProperty('--card', '0 0% 100%');
        root.style.setProperty('--popover', '0 0% 100%');
        root.style.setProperty('--secondary', '210 40% 96.1%');
        root.style.setProperty('--muted', '210 40% 96.1%');
        root.style.setProperty('--accent', '210 40% 96.1%');
      }
    }
  };

  const handleBrightnessChange = (value: number[]) => {
    const newBrightness = value[0];
    setBrightness(newBrightness);
    applyBrightness(newBrightness);
    localStorage.setItem('appBrightness', newBrightness.toString());
  };

  return (
    <Card className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Lightbulb className="w-5 h-5" />
          <span>Contrôle de l'éclat</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">
              Luminosité de l'application
            </label>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Sun className="w-4 h-4" />
              <span>{brightness}%</span>
            </div>
          </div>
          
          <Slider
            value={[brightness]}
            onValueChange={handleBrightnessChange}
            min={20}
            max={100}
            step={5}
            className="w-full"
          />
          
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Moins d'éclat</span>
            <span>Plus d'éclat</span>
          </div>
          
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Réduisez l'éclat pour un confort visuel optimal, surtout en soirée
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
