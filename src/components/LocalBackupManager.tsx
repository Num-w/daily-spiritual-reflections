import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { useLocalBackup } from '../hooks/useLocalBackup';
import { useToast } from './ui/use-toast';
import { 
  FolderOpen, 
  Download, 
  Upload, 
  Smartphone, 
  Clock,
  FileText,
  Trash2
} from 'lucide-react';
import { Capacitor } from '@capacitor/core';

interface LocalBackupManagerProps {
  darkMode: boolean;
  meditations: any[];
  sermons: any[];
  onImportMeditations: (meditations: any[]) => void;
  onImportSermons: (sermons: any[]) => void;
}

export const LocalBackupManager: React.FC<LocalBackupManagerProps> = ({
  darkMode,
  meditations,
  sermons,
  onImportMeditations,
  onImportSermons
}) => {
  const [backupFiles, setBackupFiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const {
    isInitialized,
    backupPath,
    saveBackupFile,
    listBackupFiles,
    loadBackupFile,
    createAutoBackup
  } = useLocalBackup();

  const loadBackupList = async () => {
    try {
      const files = await listBackupFiles();
      setBackupFiles(files);
    } catch (error) {
      console.error('Erreur lors du chargement des sauvegardes:', error);
    }
  };

  useEffect(() => {
    if (isInitialized) {
      loadBackupList();
    }
  }, [isInitialized]);

  const handleCreateBackup = async () => {
    setIsLoading(true);
    try {
      const timestamp = new Date().toLocaleString('fr-FR').replace(/[/:]/g, '-');
      const filename = await createAutoBackup(meditations, sermons);
      
      toast({
        title: "Sauvegarde créée",
        description: `Sauvegarde locale créée avec succès`,
      });
      
      await loadBackupList();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la création de la sauvegarde",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestoreBackup = async (filename: string) => {
    setIsLoading(true);
    try {
      const backupData = await loadBackupFile(filename);
      
      if (backupData.meditations) {
        onImportMeditations(backupData.meditations);
      }
      
      if (backupData.sermons) {
        onImportSermons(backupData.sermons);
      }
      
      toast({
        title: "Restauration réussie",
        description: `Données restaurées depuis ${filename}`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la restauration",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!Capacitor.isNativePlatform()) {
    return (
      <div className={`p-4 rounded-lg border ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="flex items-center gap-3 mb-3">
          <Smartphone className="w-5 h-5 text-orange-500" />
          <h3 className="text-lg font-semibold">Sauvegarde Locale</h3>
        </div>
        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          La sauvegarde locale n'est disponible que sur l'application mobile Android/iOS.
        </p>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-lg border ${
      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <FolderOpen className="w-5 h-5 text-green-500" />
        <h3 className="text-lg font-semibold">Sauvegarde Locale</h3>
      </div>

      {isInitialized && backupPath && (
        <div className={`p-3 rounded mb-4 text-xs ${
          darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
        }`}>
          <p><strong>Dossier:</strong> /SpiritualReflections/Backup/</p>
          <p className="mt-1">Les sauvegardes sont stockées dans la mémoire de votre appareil</p>
        </div>
      )}

      <div className="space-y-3">
        <Button 
          onClick={handleCreateBackup}
          disabled={isLoading || !isInitialized}
          className="w-full"
          variant="outline"
        >
          <Download className="w-4 h-4 mr-2" />
          {isLoading ? 'Création...' : 'Créer une sauvegarde'}
        </Button>

        {backupFiles.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Sauvegardes disponibles:</h4>
            {backupFiles.map((file) => (
              <div 
                key={file.name}
                className={`p-3 rounded border flex items-center justify-between ${
                  darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <div>
                    <p className="font-medium text-sm">{file.name}</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {new Date(file.mtime || Date.now()).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleRestoreBackup(file.name)}
                  disabled={isLoading}
                >
                  <Upload className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};