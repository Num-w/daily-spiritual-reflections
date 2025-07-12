import React, { useState } from 'react';
import { Download, FileText, Database, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface DataExporterProps {
  darkMode: boolean;
  meditations: any[];
  sermons: any[];
}

export const DataExporter = ({ darkMode, meditations, sermons }: DataExporterProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const exportToJSON = async () => {
    setIsExporting(true);
    try {
      const data = {
        meditations,
        sermons,
        exportDate: new Date().toISOString(),
        totalMeditations: meditations.length,
        totalSermons: sermons.length,
        version: "1.0"
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { 
        type: 'application/json' 
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `meditations-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Export réussi",
        description: "Vos données ont été exportées en JSON",
      });
    } catch (error) {
      toast({
        title: "Erreur d'export",
        description: "Impossible d'exporter les données",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const exportToCSV = async () => {
    setIsExporting(true);
    try {
      // Export des méditations en CSV
      const csvHeaders = 'Date,Titre,Verset,Résumé,Commentaires,Tags\n';
      const csvData = meditations.map(m => 
        `"${m.date}","${m.title}","${m.verse}","${m.summary?.replace(/"/g, '""') || ''}","${m.comments?.replace(/"/g, '""') || ''}","${m.tags?.join(', ') || ''}"`
      ).join('\n');

      const blob = new Blob([csvHeaders + csvData], { 
        type: 'text/csv;charset=utf-8;' 
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `meditations-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Export CSV réussi",
        description: "Vos méditations ont été exportées en CSV",
      });
    } catch (error) {
      toast({
        title: "Erreur d'export CSV",
        description: "Impossible d'exporter en CSV",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const exportStats = async () => {
    setIsExporting(true);
    try {
      const stats = {
        totalMeditations: meditations.length,
        totalSermons: sermons.length,
        meditationsByMonth: {},
        topTags: {},
        exportDate: new Date().toISOString()
      };

      // Calculer les statistiques par mois
      meditations.forEach(m => {
        const month = m.date?.substring(0, 7) || 'Inconnu';
        stats.meditationsByMonth[month] = (stats.meditationsByMonth[month] || 0) + 1;
      });

      // Calculer les tags les plus utilisés
      meditations.forEach(m => {
        m.tags?.forEach(tag => {
          stats.topTags[tag] = (stats.topTags[tag] || 0) + 1;
        });
      });

      const blob = new Blob([JSON.stringify(stats, null, 2)], { 
        type: 'application/json' 
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `statistiques-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Statistiques exportées",
        description: "Vos statistiques ont été exportées",
      });
    } catch (error) {
      toast({
        title: "Erreur d'export",
        description: "Impossible d'exporter les statistiques",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-3">
      <Button 
        onClick={exportToJSON}
        disabled={isExporting}
        variant="outline" 
        className="w-full justify-start"
      >
        <Database className="w-4 h-4 mr-2" />
        {isExporting ? 'Export en cours...' : 'Exporter tout (JSON)'}
      </Button>
      
      <Button 
        onClick={exportToCSV}
        disabled={isExporting}
        variant="outline" 
        className="w-full justify-start"
      >
        <FileText className="w-4 h-4 mr-2" />
        {isExporting ? 'Export en cours...' : 'Exporter méditations (CSV)'}
      </Button>
      
      <Button 
        onClick={exportStats}
        disabled={isExporting}
        variant="outline" 
        className="w-full justify-start"
      >
        <Calendar className="w-4 h-4 mr-2" />
        {isExporting ? 'Export en cours...' : 'Exporter statistiques'}
      </Button>
      
      <div className="text-xs text-gray-500 mt-2">
        Total: {meditations.length} méditations, {sermons.length} sermons
      </div>
    </div>
  );
};