import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface PasswordManagerProps {
  darkMode: boolean;
  onPasswordChange: (newPassword: string) => void;
}

export const PasswordManager = ({ darkMode, onPasswordChange }: PasswordManagerProps) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const { toast } = useToast();

  const validatePassword = (password: string) => {
    const minLength = password.length >= 6;
    const hasNumber = /\d/.test(password);
    const hasLetter = /[a-zA-Z]/.test(password);
    
    return {
      minLength,
      hasNumber,
      hasLetter,
      isValid: minLength && hasNumber && hasLetter
    };
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Vérifier le mot de passe actuel
    const storedPassword = localStorage.getItem('app_password') || 'meditation';
    if (currentPassword !== storedPassword) {
      toast({
        title: "Erreur",
        description: "Mot de passe actuel incorrect",
        variant: "destructive",
      });
      return;
    }

    // Vérifier que les nouveaux mots de passe correspondent
    if (newPassword !== confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les nouveaux mots de passe ne correspondent pas",
        variant: "destructive",
      });
      return;
    }

    // Vérifier la validité du nouveau mot de passe
    const validation = validatePassword(newPassword);
    if (!validation.isValid) {
      toast({
        title: "Mot de passe faible",
        description: "Le mot de passe doit contenir au moins 6 caractères, une lettre et un chiffre",
        variant: "destructive",
      });
      return;
    }

    setIsChanging(true);
    try {
      // Simuler le changement de mot de passe
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      localStorage.setItem('app_password', newPassword);
      onPasswordChange(newPassword);
      
      toast({
        title: "Mot de passe modifié",
        description: "Votre mot de passe a été changé avec succès",
      });

      // Réinitialiser les champs
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de changer le mot de passe",
        variant: "destructive",
      });
    } finally {
      setIsChanging(false);
    }
  };

  const passwordValidation = validatePassword(newPassword);

  return (
    <form onSubmit={handlePasswordChange} className="space-y-4">
      <div>
        <label className={`block text-sm font-medium mb-2 ${
          darkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Mot de passe actuel
        </label>
        <div className="relative">
          <input
            type={showPasswords ? 'text' : 'password'}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className={`w-full px-3 py-2 pr-10 rounded-lg border transition-colors duration-200 ${
              darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
            }`}
            placeholder="Entrez votre mot de passe actuel"
            required
          />
          <button
            type="button"
            onClick={() => setShowPasswords(!showPasswords)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            {showPasswords ? (
              <EyeOff className="w-4 h-4 text-gray-400" />
            ) : (
              <Eye className="w-4 h-4 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      <div>
        <label className={`block text-sm font-medium mb-2 ${
          darkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Nouveau mot de passe
        </label>
        <input
          type={showPasswords ? 'text' : 'password'}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className={`w-full px-3 py-2 rounded-lg border transition-colors duration-200 ${
            darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
          }`}
          placeholder="Entrez un nouveau mot de passe"
          required
        />
        
        {newPassword && (
          <div className="mt-2 space-y-1">
            <div className={`flex items-center text-xs ${
              passwordValidation.minLength ? 'text-green-500' : 'text-red-500'
            }`}>
              {passwordValidation.minLength ? <Check className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />}
              Au moins 6 caractères
            </div>
            <div className={`flex items-center text-xs ${
              passwordValidation.hasLetter ? 'text-green-500' : 'text-red-500'
            }`}>
              {passwordValidation.hasLetter ? <Check className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />}
              Au moins une lettre
            </div>
            <div className={`flex items-center text-xs ${
              passwordValidation.hasNumber ? 'text-green-500' : 'text-red-500'
            }`}>
              {passwordValidation.hasNumber ? <Check className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />}
              Au moins un chiffre
            </div>
          </div>
        )}
      </div>

      <div>
        <label className={`block text-sm font-medium mb-2 ${
          darkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Confirmer le nouveau mot de passe
        </label>
        <input
          type={showPasswords ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={`w-full px-3 py-2 rounded-lg border transition-colors duration-200 ${
            darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
          } ${
            confirmPassword && newPassword !== confirmPassword 
              ? 'border-red-500' 
              : confirmPassword && newPassword === confirmPassword 
                ? 'border-green-500' 
                : ''
          }`}
          placeholder="Confirmez le nouveau mot de passe"
          required
        />
        {confirmPassword && newPassword !== confirmPassword && (
          <p className="text-red-500 text-xs mt-1">
            Les mots de passe ne correspondent pas
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isChanging || !passwordValidation.isValid || newPassword !== confirmPassword}
        className="w-full"
      >
        <Lock className="w-4 h-4 mr-2" />
        {isChanging ? 'Changement...' : 'Changer le mot de passe'}
      </Button>
    </form>
  );
};