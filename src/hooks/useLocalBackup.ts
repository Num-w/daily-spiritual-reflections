import { useState, useEffect } from 'react';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';

export const useLocalBackup = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [backupPath, setBackupPath] = useState<string | null>(null);

  const initializeBackupFolder = async () => {
    try {
      // Vérifier si on est sur une plateforme mobile
      if (!Capacitor.isNativePlatform()) {
        console.log('Plateforme web - sauvegarde locale non disponible');
        return;
      }

      // Créer le dossier principal de l'application
      const appFolderName = 'SpiritualReflections';
      
      try {
        await Filesystem.mkdir({
          path: appFolderName,
          directory: Directory.ExternalStorage,
          recursive: true
        });
      } catch (error) {
        // Le dossier existe déjà, c'est normal
      }

      // Créer le sous-dossier de sauvegarde
      const backupFolderName = `${appFolderName}/Backup`;
      
      try {
        await Filesystem.mkdir({
          path: backupFolderName,
          directory: Directory.ExternalStorage,
          recursive: true
        });
      } catch (error) {
        // Le dossier existe déjà, c'est normal
      }

      // Obtenir le chemin complet
      const result = await Filesystem.getUri({
        directory: Directory.ExternalStorage,
        path: backupFolderName
      });

      setBackupPath(result.uri);
      setIsInitialized(true);
      
      console.log('Dossier de sauvegarde créé:', result.uri);
      
    } catch (error) {
      console.error('Erreur lors de la création du dossier de sauvegarde:', error);
    }
  };

  const saveBackupFile = async (filename: string, data: any) => {
    try {
      if (!Capacitor.isNativePlatform()) {
        throw new Error('Sauvegarde locale disponible uniquement sur mobile');
      }

      const jsonData = JSON.stringify(data, null, 2);
      const timestamp = new Date().toISOString().split('T')[0];
      const fullFilename = `${timestamp}_${filename}`;

      await Filesystem.writeFile({
        path: `SpiritualReflections/Backup/${fullFilename}`,
        data: jsonData,
        directory: Directory.ExternalStorage,
        encoding: 'utf8' as any
      });

      return fullFilename;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      throw error;
    }
  };

  const listBackupFiles = async () => {
    try {
      if (!Capacitor.isNativePlatform()) {
        return [];
      }

      const result = await Filesystem.readdir({
        path: 'SpiritualReflections/Backup',
        directory: Directory.ExternalStorage
      });

      return result.files
        .filter(file => file.name.endsWith('.json') || !file.name.includes('.'))
        .sort((a, b) => b.name.localeCompare(a.name));
    } catch (error) {
      console.error('Erreur lors de la lecture des sauvegardes:', error);
      return [];
    }
  };

  const loadBackupFile = async (filename: string) => {
    try {
      if (!Capacitor.isNativePlatform()) {
        throw new Error('Chargement local disponible uniquement sur mobile');
      }

      const result = await Filesystem.readFile({
        path: `SpiritualReflections/Backup/${filename}`,
        directory: Directory.ExternalStorage,
        encoding: 'utf8' as any
      });

      return JSON.parse(result.data as string);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      throw error;
    }
  };

  const createAutoBackup = async (meditations: any[], sermons: any[]) => {
    try {
      const backupData = {
        meditations,
        sermons,
        exportDate: new Date().toISOString(),
        version: '1.0'
      };

      const filename = await saveBackupFile('auto_backup.json', backupData);
      console.log('Sauvegarde automatique créée:', filename);
      return filename;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde automatique:', error);
      throw error;
    }
  };

  useEffect(() => {
    initializeBackupFolder();
  }, []);

  return {
    isInitialized,
    backupPath,
    saveBackupFile,
    listBackupFiles,
    loadBackupFile,
    createAutoBackup,
    initializeBackupFolder
  };
};