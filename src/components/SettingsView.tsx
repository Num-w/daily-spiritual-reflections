
import React from 'react';
import { Palette, Bell, Upload, Lock, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SettingsViewProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

export const SettingsView = ({ darkMode, setDarkMode }: SettingsViewProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4 animate-fade-in">Paramètres</h2>
        
        <div className="space-y-4">
          {/* Appearance */}
          <div className={`p-4 rounded-lg border transition-all duration-300 hover:shadow-lg animate-fade-in ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <h3 className="font-medium mb-3 flex items-center">
              <Palette className="w-5 h-5 mr-2" />
              Apparence
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Mode sombre</span>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`w-12 h-6 rounded-full transition-all duration-300 transform hover:scale-105 ${
                    darkMode ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-all duration-300 flex items-center justify-center ${
                    darkMode ? 'translate-x-6' : 'translate-x-0.5'
                  }`}>
                    {darkMode ? <Moon className="w-3 h-3 text-blue-600" /> : <Sun className="w-3 h-3 text-gray-600" />}
                  </div>
                </button>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Taille de police</label>
                <select className={`w-full px-3 py-2 rounded-lg border transition-colors duration-200 ${
                  darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}>
                  <option>Petite</option>
                  <option>Normale</option>
                  <option>Grande</option>
                  <option>Très grande</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className={`p-4 rounded-lg border transition-all duration-300 hover:shadow-lg animate-fade-in ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`} style={{ animationDelay: '100ms' }}>
            <h3 className="font-medium mb-3 flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              Rappels
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Rappel matin</span>
                <button className="w-12 h-6 rounded-full bg-blue-600 transition-all duration-200 hover:scale-105">
                  <div className="w-5 h-5 rounded-full bg-white translate-x-6 transition-transform duration-200" />
                </button>
              </div>
              <input
                type="time"
                defaultValue="07:00"
                className={`w-full px-3 py-2 rounded-lg border transition-colors duration-200 ${
                  darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
              />
            </div>
          </div>

          {/* Backup */}
          <div className={`p-4 rounded-lg border transition-all duration-300 hover:shadow-lg animate-fade-in ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`} style={{ animationDelay: '200ms' }}>
            <h3 className="font-medium mb-3 flex items-center">
              <Upload className="w-5 h-5 mr-2" />
              Sauvegarde
            </h3>
            <div className="space-y-3">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105">
                Synchroniser avec Google Drive
              </Button>
              <Button variant="outline" className="w-full py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105">
                Exporter toutes les données
              </Button>
              <div className="text-xs text-gray-500">
                Dernière sauvegarde: Aujourd'hui à 14:32
              </div>
            </div>
          </div>

          {/* Security */}
          <div className={`p-4 rounded-lg border transition-all duration-300 hover:shadow-lg animate-fade-in ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`} style={{ animationDelay: '300ms' }}>
            <h3 className="font-medium mb-3 flex items-center">
              <Lock className="w-5 h-5 mr-2" />
              Sécurité
            </h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105">
                Changer le mot de passe
              </Button>
              <div className="flex items-center justify-between">
                <span>Verrouillage automatique</span>
                <button className="w-12 h-6 rounded-full bg-blue-600 transition-all duration-200 hover:scale-105">
                  <div className="w-5 h-5 rounded-full bg-white translate-x-6 transition-transform duration-200" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
