
import React, { useState } from 'react';
import { Palette, Bell, Upload, Lock, Sun, Moon, Settings, Sparkles, Search, Share2, Globe } from 'lucide-react';
import { useLanguage, Language } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { GoogleDriveSync } from './GoogleDriveSync';
import { LocalBackupManager } from './LocalBackupManager';
import { DataExporter } from './DataExporter';
import { DataImporter } from './DataImporter';
import { PasswordManager } from './PasswordManager';
import { InnovativeFeatures } from './InnovativeFeatures';
import { NotificationManager } from './NotificationManager';
import { SearchSystem } from './SearchSystem';
import { ThemeCustomizer } from './ThemeCustomizer';

interface SettingsViewProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  meditations?: any[];
  sermons?: any[];
  onAddMeditation?: (meditation: any) => void;
  onEditMeditation?: (meditation: any) => void;
  onEditSermon?: (sermon: any) => void;
  onImportMeditations?: (meditations: any[]) => void;
  onImportSermons?: (sermons: any[]) => void;
}

export const SettingsView = ({ darkMode, setDarkMode, meditations = [], sermons = [], onAddMeditation, onEditMeditation, onEditSermon, onImportMeditations, onImportSermons }: SettingsViewProps) => {
  const { t, language, setLanguage } = useLanguage();
  const [showPasswordManager, setShowPasswordManager] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const handlePasswordChange = (newPassword: string) => {
    // Le mot de passe est déjà sauvegardé dans PasswordManager
    setShowPasswordManager(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4 animate-fade-in">{t('settings.title')}</h2>
        
        {/* Onglets */}
        <div className="flex space-x-1 mb-6 overflow-x-auto">
          {[
            { id: 'general', label: t('settings.general'), icon: Settings },
            { id: 'appearance', label: t('settings.appearance'), icon: Palette },
            { id: 'notifications', label: t('settings.notifications'), icon: Bell },
            { id: 'backup', label: t('settings.backup'), icon: Upload },
            { id: 'search', label: t('settings.search'), icon: Search },
            { id: 'features', label: t('settings.features'), icon: Sparkles }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700')
                  : (darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
        
        {activeTab === 'general' && (
        <div className="space-y-4">
          {/* Appearance */}
          <div className={`p-4 rounded-lg border transition-all duration-300 hover:shadow-lg animate-fade-in ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <h3 className="font-medium mb-3 flex items-center">
              <Palette className="w-5 h-5 mr-2" />
              {t('appearance.title')}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>{t('appearance.darkMode')}</span>
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
                <label className="block text-sm font-medium mb-2">{t('appearance.fontSize')}</label>
                <select className={`w-full px-3 py-2 rounded-lg border transition-colors duration-200 ${
                  darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}>
                  <option>{t('appearance.fontSize.small')}</option>
                  <option>{t('appearance.fontSize.normal')}</option>
                  <option>{t('appearance.fontSize.large')}</option>
                  <option>{t('appearance.fontSize.xlarge')}</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">{t('settings.language')}</label>
                <select 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as Language)}
                  className={`w-full px-3 py-2 rounded-lg border transition-colors duration-200 ${
                    darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                  }`}
                >
                  <option value="fr">{t('language.french')}</option>
                  <option value="en">{t('language.english')}</option>
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
              {t('notifications.title')}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>{t('notifications.morning')}</span>
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


          {/* Security */}
          <div className={`p-4 rounded-lg border transition-all duration-300 hover:shadow-lg animate-fade-in ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`} style={{ animationDelay: '300ms' }}>
            <h3 className="font-medium mb-3 flex items-center">
              <Lock className="w-5 h-5 mr-2" />
              {t('security.title')}
            </h3>
            <div className="space-y-3">
              {!showPasswordManager ? (
                <Button 
                  variant="outline" 
                  onClick={() => setShowPasswordManager(true)}
                  className="w-full py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
                >
                  {t('security.changePassword')}
                </Button>
              ) : (
                <div className="space-y-3">
                  <PasswordManager 
                    darkMode={darkMode} 
                    onPasswordChange={handlePasswordChange}
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => setShowPasswordManager(false)}
                    className="w-full"
                  >
                    {t('security.cancel')}
                  </Button>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span>{t('security.autoLock')}</span>
                <button className="w-12 h-6 rounded-full bg-blue-600 transition-all duration-200 hover:scale-105">
                  <div className="w-5 h-5 rounded-full bg-white translate-x-6 transition-transform duration-200" />
                </button>
              </div>
            </div>
          </div>
        </div>
        )}

        {activeTab === 'appearance' && (
          <ThemeCustomizer 
            darkMode={darkMode} 
            setDarkMode={setDarkMode} 
          />
        )}

        {activeTab === 'notifications' && (
          <NotificationManager 
            darkMode={darkMode} 
          />
        )}

        {activeTab === 'search' && (
          <SearchSystem 
            darkMode={darkMode} 
            meditations={meditations} 
            sermons={sermons} 
            onSelectMeditation={onEditMeditation || (() => {})}
            onSelectSermon={onEditSermon || (() => {})}
          />
        )}

        {activeTab === 'backup' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">{t('backup.export')}</h3>
                <DataExporter 
                  darkMode={darkMode}
                  meditations={meditations}
                  sermons={sermons}
                />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">{t('backup.import')}</h3>
                {onImportMeditations && onImportSermons && (
                  <DataImporter 
                    darkMode={darkMode}
                    onImportMeditations={onImportMeditations}
                    onImportSermons={onImportSermons}
                  />
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('backup.cloud')}</h3>
          <GoogleDriveSync 
            darkMode={darkMode}
            meditations={meditations}
            sermons={sermons}
          />
          
          <LocalBackupManager
            darkMode={darkMode}
            meditations={meditations}
            sermons={sermons}
            onImportMeditations={onImportMeditations}
            onImportSermons={onImportSermons}
          />
            </div>
          </div>
        )}

        {activeTab === 'features' && onAddMeditation && (
          <InnovativeFeatures 
            darkMode={darkMode} 
            meditations={meditations} 
            onAddMeditation={onAddMeditation}
          />
        )}
      </div>
    </div>
  );
};
