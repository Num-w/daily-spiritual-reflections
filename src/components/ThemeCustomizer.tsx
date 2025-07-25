import React, { useState, useEffect } from 'react';
import { Palette, Sun, Moon, Monitor, Eye, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { BrightnessControl } from './BrightnessControl';

interface ThemeCustomizerProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

interface ThemeSettings {
  mode: 'light' | 'dark' | 'auto';
  accentColor: string;
  fontSize: number;
  lineHeight: number;
  borderRadius: number;
  animations: boolean;
  coloredCards: boolean;
  contrast: number;
}

export const ThemeCustomizer = ({ darkMode, setDarkMode }: ThemeCustomizerProps) => {
  const [settings, setSettings] = useState<ThemeSettings>({
    mode: 'auto',
    accentColor: 'blue',
    fontSize: 16,
    lineHeight: 1.5,
    borderRadius: 8,
    animations: true,
    coloredCards: true,
    contrast: 0
  });
  const [previewMode, setPreviewMode] = useState(false);
  const { toast } = useToast();

  const accentColors = [
    { name: 'Bleu', value: 'blue', hsl: '220 100% 50%', secondary: '220 100% 95%', dark: '220 100% 35%' },
    { name: 'Vert', value: 'green', hsl: '142 76% 36%', secondary: '142 76% 95%', dark: '142 76% 25%' },
    { name: 'Violet', value: 'purple', hsl: '262 83% 58%', secondary: '262 83% 95%', dark: '262 83% 40%' },
    { name: 'Orange', value: 'orange', hsl: '38 92% 50%', secondary: '38 92% 95%', dark: '38 92% 35%' },
    { name: 'Rose', value: 'pink', hsl: '322 65% 54%', secondary: '322 65% 95%', dark: '322 65% 40%' },
    { name: 'Indigo', value: 'indigo', hsl: '239 84% 67%', secondary: '239 84% 95%', dark: '239 84% 50%' }
  ];

  useEffect(() => {
    // Load saved theme settings
    const savedSettings = localStorage.getItem('themeSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
        applyTheme(parsed);
      } catch (error) {
        console.error('Error loading theme settings:', error);
      }
    }
  }, []);

  const applyTheme = (themeSettings: ThemeSettings) => {
    const root = document.documentElement;
    
    // Apply accent color
    const selectedColor = accentColors.find(c => c.value === themeSettings.accentColor);
    if (selectedColor) {
      root.style.setProperty('--primary', selectedColor.hsl);
      root.style.setProperty('--secondary', selectedColor.secondary);
      
      // Apply to various UI elements
      root.style.setProperty('--accent', selectedColor.hsl);
      root.style.setProperty('--ring', selectedColor.hsl);
      
      // Dark mode variations
      if (darkMode) {
        root.style.setProperty('--primary', selectedColor.dark);
        root.style.setProperty('--accent', selectedColor.dark);
      }
      
      // Update button colors
      const buttons = document.querySelectorAll('.btn-primary, .bg-blue-600, .bg-blue-500');
      buttons.forEach(button => {
        if (button instanceof HTMLElement) {
          button.style.backgroundColor = `hsl(${selectedColor.hsl})`;
        }
      });
    }

    // Apply typography
    root.style.setProperty('--font-size-base', `${themeSettings.fontSize}px`);
    root.style.setProperty('--line-height-base', themeSettings.lineHeight.toString());
    
    // Apply to body
    document.body.style.fontSize = `${themeSettings.fontSize}px`;
    document.body.style.lineHeight = themeSettings.lineHeight.toString();

    // Apply border radius
    root.style.setProperty('--radius', `${themeSettings.borderRadius}px`);

    // Apply animations
    if (!themeSettings.animations) {
      root.style.setProperty('--animation-duration', '0s');
      document.body.style.setProperty('transition', 'none');
    } else {
      root.style.setProperty('--animation-duration', '0.3s');
      document.body.style.removeProperty('transition');
    }

    // Apply contrast with orange saturation
    if (themeSettings.contrast > 0) {
      const orangeOpacity = themeSettings.contrast / 100;
      const orangeOverlay = `linear-gradient(rgba(255, 165, 0, ${orangeOpacity * 0.1}), rgba(255, 140, 0, ${orangeOpacity * 0.05}))`;
      
      if (darkMode) {
        document.body.style.background = `${orangeOverlay}, hsl(222.2 84% 4.9%)`;
      } else {
        document.body.style.background = `${orangeOverlay}, hsl(0 0% 98%)`;
      }
      
      // Adjust text contrast
      root.style.setProperty('--foreground-contrast', `hsl(${darkMode ? '210 40% ' + (98 - orangeOpacity * 10) + '%' : '222.2 84% ' + (4.9 + orangeOpacity * 10) + '%'})`);
    } else {
      // Reset background
      if (darkMode) {
        document.body.style.background = 'hsl(222.2 84% 4.9%)';
      } else {
        document.body.style.background = 'hsl(0 0% 98%)';
      }
      root.style.removeProperty('--foreground-contrast');
    }

    // Handle colored cards
    if (themeSettings.coloredCards && selectedColor) {
      const cards = document.querySelectorAll('[class*="bg-white"], [class*="bg-gray-800"]');
      cards.forEach(card => {
        if (card instanceof HTMLElement) {
          if (darkMode) {
            card.style.backgroundColor = `hsl(${selectedColor.hsl.split(' ')[0]} 20% 15%)`;
            card.style.borderColor = `hsl(${selectedColor.hsl})`;
          } else {
            card.style.backgroundColor = `hsl(${selectedColor.hsl.split(' ')[0]} 30% 98%)`;
            card.style.borderColor = `hsl(${selectedColor.secondary})`;
          }
        }
      });
    }

    // Handle auto mode
    if (themeSettings.mode === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setDarkMode(mediaQuery.matches);
      
      const handleChange = (e: MediaQueryListEvent) => {
        setDarkMode(e.matches);
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      setDarkMode(themeSettings.mode === 'dark');
    }
  };

  const updateSettings = (key: keyof ThemeSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    // Toujours appliquer le thème instantanément
    applyTheme(newSettings);
    
    // Sauvegarder seulement si pas en mode aperçu
    if (!previewMode) {
      localStorage.setItem('themeSettings', JSON.stringify(newSettings));
    }
  };

  const saveTheme = () => {
    localStorage.setItem('themeSettings', JSON.stringify(settings));
    applyTheme(settings);
    setPreviewMode(false);
    toast({
      title: "Thème sauvegardé",
      description: "Vos préférences de thème ont été appliquées",
    });
  };

  const resetTheme = () => {
    const defaultSettings: ThemeSettings = {
      mode: 'auto',
      accentColor: 'blue',
      fontSize: 16,
      lineHeight: 1.5,
      borderRadius: 8,
      animations: true,
      coloredCards: true,
      contrast: 0
    };
    
    setSettings(defaultSettings);
    localStorage.setItem('themeSettings', JSON.stringify(defaultSettings));
    applyTheme(defaultSettings);
    setPreviewMode(false);
    
    toast({
      title: "Thème réinitialisé",
      description: "Le thème par défaut a été restauré",
    });
  };

  const enablePreview = () => {
    setPreviewMode(true);
    applyTheme(settings);
    toast({
      title: "Mode aperçu activé",
      description: "Les changements ne sont pas encore sauvegardés",
    });
  };

  return (
    <div className="space-y-6">
      <Card className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Palette className="w-5 h-5" />
            <span>Personnalisation du thème</span>
          </CardTitle>
          {previewMode && (
            <div className="flex items-center space-x-2 text-sm text-orange-600 dark:text-orange-400">
              <Eye className="w-4 h-4" />
              <span>Mode aperçu - Cliquez sur "Sauvegarder" pour appliquer</span>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mode sombre/clair */}
          <div className="space-y-3">
            <label className="block text-sm font-medium">Mode d'affichage</label>
            <Select value={settings.mode} onValueChange={(value) => updateSettings('mode', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">
                  <div className="flex items-center space-x-2">
                    <Sun className="w-4 h-4" />
                    <span>Clair</span>
                  </div>
                </SelectItem>
                <SelectItem value="dark">
                  <div className="flex items-center space-x-2">
                    <Moon className="w-4 h-4" />
                    <span>Sombre</span>
                  </div>
                </SelectItem>
                <SelectItem value="auto">
                  <div className="flex items-center space-x-2">
                    <Monitor className="w-4 h-4" />
                    <span>Automatique</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Couleur d'accent */}
          <div className="space-y-3">
            <label className="block text-sm font-medium">Couleur d'accent</label>
            <div className="grid grid-cols-3 gap-2">
              {accentColors.map((color) => (
                <Button
                  key={color.value}
                  variant={settings.accentColor === color.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateSettings('accentColor', color.value)}
                  className="flex items-center space-x-2"
                  style={{
                    backgroundColor: settings.accentColor === color.value ? `hsl(${color.hsl})` : undefined,
                    borderColor: `hsl(${color.hsl})`
                  }}
                >
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: `hsl(${color.hsl})` }}
                  />
                  <span>{color.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Taille de police */}
          <div className="space-y-3">
            <label className="block text-sm font-medium">
              Taille de police: {settings.fontSize}px
            </label>
            <Slider
              value={[settings.fontSize]}
              onValueChange={([value]) => updateSettings('fontSize', value)}
              min={12}
              max={20}
              step={1}
              className="w-full"
            />
          </div>

          {/* Hauteur de ligne */}
          <div className="space-y-3">
            <label className="block text-sm font-medium">
              Hauteur de ligne: {settings.lineHeight}
            </label>
            <Slider
              value={[settings.lineHeight]}
              onValueChange={([value]) => updateSettings('lineHeight', value)}
              min={1.2}
              max={2.0}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* Rayon des bordures */}
          <div className="space-y-3">
            <label className="block text-sm font-medium">
              Arrondi des bordures: {settings.borderRadius}px
            </label>
            <Slider
              value={[settings.borderRadius]}
              onValueChange={([value]) => updateSettings('borderRadius', value)}
              min={0}
              max={16}
              step={1}
              className="w-full"
            />
          </div>

          {/* Contraste avec saturation orange */}
          <div className="space-y-3">
            <label className="block text-sm font-medium">
              Contraste (saturation orange): {settings.contrast}%
            </label>
            <Slider
              value={[settings.contrast]}
              onValueChange={([value]) => updateSettings('contrast', value)}
              min={0}
              max={100}
              step={5}
              className="w-full"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Ajoute une teinte orange subtile à l'arrière-plan pour améliorer le contraste
            </p>
          </div>

          {/* Options supplémentaires */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Animations</label>
              <Switch
                checked={settings.animations}
                onCheckedChange={(checked) => updateSettings('animations', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Cartes colorées</label>
              <Switch
                checked={settings.coloredCards}
                onCheckedChange={(checked) => updateSettings('coloredCards', checked)}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-2 pt-4">
            {!previewMode ? (
              <Button onClick={enablePreview} variant="outline" className="flex-1">
                <Eye className="w-4 h-4 mr-2" />
                Aperçu
              </Button>
            ) : (
              <Button onClick={saveTheme} className="flex-1">
                Sauvegarder
              </Button>
            )}
            
            <Button onClick={resetTheme} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Réinitialiser
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Nouveau contrôle de luminosité */}
      <BrightnessControl darkMode={darkMode} />
    </div>
  );
};
