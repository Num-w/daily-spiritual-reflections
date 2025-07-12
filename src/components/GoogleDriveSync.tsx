import React, { useState } from 'react';
import { Cloud, Check, CloudOff, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface GoogleDriveSyncProps {
  darkMode: boolean;
  meditations: any[];
  sermons: any[];
}

export const GoogleDriveSync = ({ darkMode, meditations, sermons }: GoogleDriveSyncProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const { toast } = useToast();

  const connectToGoogleDrive = async () => {
    setIsSyncing(true);
    try {
      // Simulation de connexion à Google Drive
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsConnected(true);
      setLastSync(new Date());
      toast({
        title: "Connexion réussie",
        description: "Votre compte Google Drive est maintenant connecté",
      });
    } catch (error) {
      toast({
        title: "Erreur de connexion",
        description: "Impossible de se connecter à Google Drive",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const syncToGoogleDrive = async () => {
    if (!isConnected) {
      toast({
        title: "Non connecté",
        description: "Veuillez d'abord vous connecter à Google Drive",
        variant: "destructive",
      });
      return;
    }

    setIsSyncing(true);
    try {
      const data = {
        meditations,
        sermons,
        exportDate: new Date().toISOString(),
        version: "1.0"
      };

      // Simulation de l'upload vers Google Drive
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Sauvegarder localement aussi
      localStorage.setItem('backup_data', JSON.stringify(data));
      setLastSync(new Date());
      
      toast({
        title: "Synchronisation réussie",
        description: `${meditations.length} méditations et ${sermons.length} sermons sauvegardés`,
      });
    } catch (error) {
      toast({
        title: "Erreur de synchronisation",
        description: "Impossible de synchroniser avec Google Drive",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className={`p-4 rounded-lg border ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {isConnected ? (
              <Check className="w-5 h-5 text-green-500" />
            ) : (
              <CloudOff className="w-5 h-5 text-gray-400" />
            )}
            <span className="font-medium">
              {isConnected ? 'Connecté à Google Drive' : 'Non connecté'}
            </span>
          </div>
          <div className={`w-3 h-3 rounded-full ${
            isConnected ? 'bg-green-500' : 'bg-gray-400'
          }`} />
        </div>

        {!isConnected ? (
          <Button 
            onClick={connectToGoogleDrive}
            disabled={isSyncing}
            className="w-full"
          >
            <Cloud className="w-4 h-4 mr-2" />
            {isSyncing ? 'Connexion...' : 'Se connecter à Google Drive'}
          </Button>
        ) : (
          <div className="space-y-3">
            <Button 
              onClick={syncToGoogleDrive}
              disabled={isSyncing}
              className="w-full"
            >
              <Upload className="w-4 h-4 mr-2" />
              {isSyncing ? 'Synchronisation...' : 'Synchroniser maintenant'}
            </Button>
            
            {lastSync && (
              <p className="text-xs text-gray-500">
                Dernière synchronisation: {lastSync.toLocaleDateString('fr-FR')} à {lastSync.toLocaleTimeString('fr-FR')}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};