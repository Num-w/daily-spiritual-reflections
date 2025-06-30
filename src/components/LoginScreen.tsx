
import React, { useState } from 'react';
import { BookOpen, Lock, Sun, Moon } from 'lucide-react';

interface LoginScreenProps {
  onUnlock: () => void;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

export const LoginScreen = ({ onUnlock, darkMode, setDarkMode }: LoginScreenProps) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'meditation') {
      onUnlock();
    } else {
      setError('Mot de passe incorrect');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
      darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'
    }`}>
      <div className={`p-8 rounded-2xl shadow-2xl w-full max-w-md animate-fade-in ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="text-center mb-8">
          <div className="animate-pulse">
            <BookOpen className={`w-16 h-16 mx-auto mb-4 ${
              darkMode ? 'text-blue-400' : 'text-blue-600'
            }`} />
          </div>
          <h1 className={`text-3xl font-bold ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}>
            Daily Meditations
          </h1>
          <p className={`mt-2 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Votre journal spirituel personnel
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-blue-500 ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
              }`}
              placeholder="Entrez votre mot de passe"
            />
            {error && (
              <p className="text-red-500 text-sm mt-1 animate-fade-in">{error}</p>
            )}
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            <Lock className="w-4 h-4 inline mr-2" />
            Se connecter
          </button>
        </form>
        
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
              darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <p className="text-xs text-gray-500">Demo: mot de passe = "meditation"</p>
        </div>
      </div>
    </div>
  );
};
