import React, { useState, useRef } from 'react';
import { Upload, FileText, AlertCircle, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface DataImporterProps {
  darkMode: boolean;
  onImportMeditations: (meditations: any[]) => void;
  onImportSermons: (sermons: any[]) => void;
}

export const DataImporter = ({ darkMode, onImportMeditations, onImportSermons }: DataImporterProps) => {
  const [isImporting, setIsImporting] = useState(false);
  const [importPreview, setImportPreview] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        validateAndPreviewData(data);
      } catch (error) {
        toast({
          title: "Erreur de format",
          description: "Le fichier n'est pas un JSON valide",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  const validateAndPreviewData = (data: any) => {
    const preview = {
      meditations: 0,
      sermons: 0,
      valid: true,
      errors: []
    };

    if (data.meditations && Array.isArray(data.meditations)) {
      preview.meditations = data.meditations.length;
    } else if (Array.isArray(data)) {
      // Si c'est directement un tableau de méditations
      preview.meditations = data.length;
    } else {
      preview.errors.push("Aucune méditation trouvée");
    }

    if (data.sermons && Array.isArray(data.sermons)) {
      preview.sermons = data.sermons.length;
    }

    if (preview.meditations === 0 && preview.sermons === 0) {
      preview.valid = false;
      preview.errors.push("Aucune donnée valide trouvée");
    }

    setImportPreview({ data, ...preview });
  };

  const performImport = async () => {
    if (!importPreview) return;

    setIsImporting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const { data } = importPreview;
      
      if (data.meditations && Array.isArray(data.meditations)) {
        onImportMeditations(data.meditations);
      } else if (Array.isArray(data)) {
        onImportMeditations(data);
      }

      if (data.sermons && Array.isArray(data.sermons)) {
        onImportSermons(data.sermons);
      }

      toast({
        title: "Import réussi",
        description: `${importPreview.meditations} méditations et ${importPreview.sermons} sermons importés`,
      });

      setImportPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      toast({
        title: "Erreur d'import",
        description: "Impossible d'importer les données",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Card className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="w-5 h-5" />
          <span>Importer des données</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            className="w-full"
          >
            <FileText className="w-4 h-4 mr-2" />
            Sélectionner un fichier JSON
          </Button>
          <p className="text-xs text-gray-500 mt-2">
            Formats acceptés: JSON d'export de l'application
          </p>
        </div>

        {importPreview && (
          <div className={`p-4 rounded-lg border ${
            importPreview.valid 
              ? 'border-green-500 bg-green-50' 
              : 'border-red-500 bg-red-50'
          }`}>
            <div className="flex items-center space-x-2 mb-3">
              {importPreview.valid ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-500" />
              )}
              <span className="font-medium">
                {importPreview.valid ? 'Aperçu des données' : 'Erreurs détectées'}
              </span>
            </div>

            {importPreview.valid ? (
              <div className="space-y-2">
                <p className="text-sm">
                  📖 {importPreview.meditations} méditations à importer
                </p>
                <p className="text-sm">
                  🎤 {importPreview.sermons} sermons à importer
                </p>
                
                <Button
                  onClick={performImport}
                  disabled={isImporting}
                  className="w-full mt-3"
                >
                  {isImporting ? 'Importation...' : 'Confirmer l\'import'}
                </Button>
              </div>
            ) : (
              <div className="space-y-1">
                {importPreview.errors.map((error, index) => (
                  <p key={index} className="text-sm text-red-700">
                    • {error}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}

        <div className={`p-3 rounded-lg ${
          darkMode ? 'bg-gray-700' : 'bg-gray-100'
        }`}>
          <p className="text-sm font-medium mb-2">Format attendu:</p>
          <pre className="text-xs overflow-x-auto">
{`{
  "meditations": [...],
  "sermons": [...],
  "exportDate": "...",
  "version": "1.0"
}`}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
};