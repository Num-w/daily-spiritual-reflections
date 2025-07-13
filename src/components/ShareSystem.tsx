import React, { useState } from 'react';
import { Share2, Copy, Mail, MessageCircle, Download, QrCode, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface ShareSystemProps {
  darkMode: boolean;
  meditation?: any;
  sermon?: any;
}

export const ShareSystem = ({ darkMode, meditation, sermon }: ShareSystemProps) => {
  const [copied, setCopied] = useState(false);
  const [customMessage, setCustomMessage] = useState('');
  const { toast } = useToast();

  const item = meditation || sermon;
  const itemType = meditation ? 'méditation' : 'sermon';

  const generateShareText = (includeCustomMessage = false) => {
    let shareText = '';
    
    if (meditation) {
      shareText = `🙏 ${meditation.title}\n\n📖 ${meditation.verse}\n\n"${meditation.content}"\n\n💭 ${meditation.summary}`;
      if (meditation.tags && meditation.tags.length > 0) {
        shareText += `\n\n🏷️ ${meditation.tags.join(', ')}`;
      }
    } else if (sermon) {
      shareText = `🎤 ${sermon.title}\n\n📚 Thème: ${sermon.theme}\n\n📅 ${new Date(sermon.date).toLocaleDateString('fr-FR')}`;
      if (sermon.outline) {
        shareText += `\n\n📋 Plan:\n${sermon.outline}`;
      }
    }

    if (includeCustomMessage && customMessage.trim()) {
      shareText = `${customMessage}\n\n${shareText}`;
    }

    shareText += '\n\n📱 Partagé depuis Réflexions Spirituelles';
    return shareText;
  };

  const copyToClipboard = async () => {
    const text = generateShareText(true);
    
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copié !",
        description: `Le contenu de la ${itemType} a été copié dans le presse-papier`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le texte",
        variant: "destructive",
      });
    }
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Partage: ${item.title}`);
    const body = encodeURIComponent(generateShareText(true));
    const mailtoUrl = `mailto:?subject=${subject}&body=${body}`;
    window.open(mailtoUrl, '_blank');
  };

  const shareViaWhatsApp = () => {
    const text = encodeURIComponent(generateShareText(true));
    const whatsappUrl = `https://wa.me/?text=${text}`;
    window.open(whatsappUrl, '_blank');
  };

  const shareViaSMS = () => {
    const text = encodeURIComponent(generateShareText(true));
    const smsUrl = `sms:?body=${text}`;
    window.open(smsUrl, '_blank');
  };

  const downloadAsFile = () => {
    const content = generateShareText(true);
    const filename = `${itemType}-${item.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Téléchargement",
      description: `La ${itemType} a été téléchargée en tant que fichier texte`,
    });
  };

  const shareViaWebAPI = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: generateShareText(true),
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          toast({
            title: "Erreur de partage",
            description: "Impossible de partager via l'API native",
            variant: "destructive",
          });
        }
      }
    } else {
      toast({
        title: "Partage non supporté",
        description: "Votre navigateur ne supporte pas l'API de partage natif",
        variant: "destructive",
      });
    }
  };

  const generateQRCode = () => {
    const text = generateShareText();
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`;
    
    const newWindow = window.open('', '_blank', 'width=300,height=300');
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head><title>QR Code - ${item.title}</title></head>
          <body style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; font-family: Arial, sans-serif;">
            <h3>QR Code - ${item.title}</h3>
            <img src="${qrCodeUrl}" alt="QR Code" style="border: 1px solid #ccc; padding: 10px;" />
            <p style="text-align: center; margin: 20px; font-size: 14px;">Scannez ce code QR pour accéder au contenu</p>
          </body>
        </html>
      `);
      newWindow.document.close();
    }
  };

  if (!item) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="w-4 h-4 mr-2" />
          Partager
        </Button>
      </DialogTrigger>
      <DialogContent className={`sm:max-w-md ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Share2 className="w-5 h-5" />
            <span>Partager cette {itemType}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Message personnalisé */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Message personnalisé (optionnel)
            </label>
            <Textarea
              placeholder="Ajoutez un message personnel avant de partager..."
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          {/* Aperçu du contenu */}
          <div className={`p-3 rounded-lg border text-sm ${
            darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
          }`}>
            <p className="font-medium mb-2">Aperçu du contenu à partager:</p>
            <div className="text-gray-600 dark:text-gray-400 max-h-32 overflow-y-auto">
              {generateShareText(true).substring(0, 200)}...
            </div>
          </div>

          {/* Options de partage */}
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              onClick={copyToClipboard}
              className="flex items-center justify-center space-x-2"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              <span>{copied ? 'Copié !' : 'Copier'}</span>
            </Button>

            <Button 
              variant="outline" 
              onClick={shareViaEmail}
              className="flex items-center justify-center space-x-2"
            >
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </Button>

            <Button 
              variant="outline" 
              onClick={shareViaWhatsApp}
              className="flex items-center justify-center space-x-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </Button>

            <Button 
              variant="outline" 
              onClick={downloadAsFile}
              className="flex items-center justify-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Télécharger</span>
            </Button>

            <Button 
              variant="outline" 
              onClick={generateQRCode}
              className="flex items-center justify-center space-x-2"
            >
              <QrCode className="w-4 h-4" />
              <span>QR Code</span>
            </Button>

            {navigator.share && (
              <Button 
                variant="outline" 
                onClick={shareViaWebAPI}
                className="flex items-center justify-center space-x-2"
              >
                <Share2 className="w-4 h-4" />
                <span>Partager</span>
              </Button>
            )}
          </div>

          {/* Partage SMS (mobile) */}
          <Button 
            variant="outline" 
            onClick={shareViaSMS}
            className="w-full flex items-center justify-center space-x-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Partager via SMS</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};