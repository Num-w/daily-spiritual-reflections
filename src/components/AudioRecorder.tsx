import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, Download, Settings, Trash2, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useLocalBackup } from '@/hooks/useLocalBackup';

interface AudioRecording {
  id: string;
  name: string;
  url: string;
  duration: number;
  format: string;
  size: number;
  date: string;
  quality: string;
}

interface AudioRecorderProps {
  darkMode: boolean;
}

export const AudioRecorder = ({ darkMode }: AudioRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordings, setRecordings] = useState<AudioRecording[]>([]);
  const [currentRecording, setCurrentRecording] = useState<AudioRecording | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [playingId, setPlayingId] = useState<string | null>(null);
  
  // Settings
  const [format, setFormat] = useState('webm');
  const [quality, setQuality] = useState('high');
  const [noiseReduction, setNoiseReduction] = useState(true);
  const [echoCancellation, setEchoCancellation] = useState(true);
  const [autoGain, setAutoGain] = useState(true);
  const [sampleRate, setSampleRate] = useState(44100);
  const [bitRate, setBitRate] = useState(128);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const { toast } = useToast();
  const { saveBackupFile } = useLocalBackup();

  // Format options with mime types
  const formatOptions = {
    'webm': { mime: 'audio/webm;codecs=opus', ext: '.webm' },
    'mp4': { mime: 'audio/mp4', ext: '.m4a' },
    'wav': { mime: 'audio/wav', ext: '.wav' }
  };

  // Quality settings
  const qualitySettings = {
    'low': { sampleRate: 22050, bitRate: 64 },
    'medium': { sampleRate: 44100, bitRate: 128 },
    'high': { sampleRate: 48000, bitRate: 192 },
    'ultra': { sampleRate: 96000, bitRate: 320 }
  };

  useEffect(() => {
    // Load saved recordings
    const saved = localStorage.getItem('audioRecordings');
    if (saved) {
      setRecordings(JSON.parse(saved));
    }

    return () => {
      stopRecording();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      const constraints = {
        audio: {
          sampleRate: qualitySettings[quality as keyof typeof qualitySettings].sampleRate,
          echoCancellation,
          noiseSuppression: noiseReduction,
          autoGainControl: autoGain,
          channelCount: 2
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      const options: MediaRecorderOptions = {
        mimeType: formatOptions[format as keyof typeof formatOptions].mime
      };

      if (format !== 'wav') {
        options.audioBitsPerSecond = qualitySettings[quality as keyof typeof qualitySettings].bitRate * 1000;
      }

      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { 
          type: formatOptions[format as keyof typeof formatOptions].mime 
        });
        
        const url = URL.createObjectURL(blob);
        const now = new Date();
        const fileName = `Enregistrement_${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}-${now.getMinutes().toString().padStart(2, '0')}${formatOptions[format as keyof typeof formatOptions].ext}`;
        
        const recording: AudioRecording = {
          id: Date.now().toString(),
          name: fileName,
          url,
          duration: recordingTime,
          format: format.toUpperCase(),
          size: blob.size,
          date: now.toISOString(),
          quality
        };

        const newRecordings = [...recordings, recording];
        setRecordings(newRecordings);
        localStorage.setItem('audioRecordings', JSON.stringify(newRecordings));
        
        // Save to device storage
        try {
          // Convert blob to base64 for mobile storage
          const reader = new FileReader();
          reader.onloadend = async () => {
            try {
              await saveBackupFile(`audio_${fileName}`, {
                fileName,
                audioData: reader.result,
                duration: recordingTime,
                format,
                quality,
                date: now.toISOString()
              });
              toast({
                title: "Enregistrement sauvegardé",
                description: `${fileName} enregistré localement avec succès`
              });
            } catch (error) {
              toast({
                title: "Erreur de sauvegarde",
                description: "Impossible de sauvegarder sur l'appareil",
                variant: "destructive"
              });
            }
          };
          reader.readAsDataURL(blob);
        } catch (error) {
          toast({
            title: "Erreur de sauvegarde",
            description: "Impossible de sauvegarder sur l'appareil",
            variant: "destructive"
          });
        }

        setCurrentRecording(recording);
        setRecordingTime(0);
      };

      mediaRecorder.start(1000);
      setIsRecording(true);
      setIsPaused(false);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      toast({
        title: "Enregistrement démarré",
        description: `Format: ${format.toUpperCase()} | Qualité: ${quality}`
      });

    } catch (error) {
      toast({
        title: "Erreur d'accès au microphone",
        description: "Veuillez autoriser l'accès au microphone",
        variant: "destructive"
      });
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        timerRef.current = setInterval(() => {
          setRecordingTime(prev => prev + 1);
        }, 1000);
      } else {
        mediaRecorderRef.current.pause();
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      }
      setIsPaused(!isPaused);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
  };

  const playRecording = (recording: AudioRecording) => {
    if (playingId === recording.id) {
      if (audioRef.current) {
        audioRef.current.pause();
        setPlayingId(null);
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      const audio = new Audio(recording.url);
      audioRef.current = audio;
      audio.play();
      setPlayingId(recording.id);
      
      audio.onended = () => {
        setPlayingId(null);
      };
    }
  };

  const downloadRecording = (recording: AudioRecording) => {
    const a = document.createElement('a');
    a.href = recording.url;
    a.download = recording.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const deleteRecording = (id: string) => {
    const newRecordings = recordings.filter(r => r.id !== id);
    setRecordings(newRecordings);
    localStorage.setItem('audioRecordings', JSON.stringify(newRecordings));
    
    if (playingId === id && audioRef.current) {
      audioRef.current.pause();
      setPlayingId(null);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="recorder" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="recorder">Enregistreur</TabsTrigger>
            <TabsTrigger value="recordings">Enregistrements</TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
          </TabsList>

          <TabsContent value="recorder" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="w-5 h-5" />
                  Enregistrement Audio Intelligent
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Recording Controls */}
                <div className="text-center space-y-4">
                  <div className="text-6xl font-mono">
                    {formatDuration(recordingTime)}
                  </div>
                  
                  <div className="flex justify-center gap-4">
                    {!isRecording ? (
                      <Button
                        onClick={startRecording}
                        size="lg"
                        className="rounded-full w-16 h-16 bg-red-500 hover:bg-red-600"
                      >
                        <Mic className="w-6 h-6" />
                      </Button>
                    ) : (
                      <>
                        <Button
                          onClick={pauseRecording}
                          size="lg"
                          variant="outline"
                          className="rounded-full w-16 h-16"
                        >
                          {isPaused ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
                        </Button>
                        <Button
                          onClick={stopRecording}
                          size="lg"
                          className="rounded-full w-16 h-16 bg-gray-600 hover:bg-gray-700"
                        >
                          <Square className="w-6 h-6" />
                        </Button>
                      </>
                    )}
                  </div>

                  {isRecording && (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-muted-foreground">
                        {isPaused ? 'Enregistrement en pause' : 'Enregistrement en cours...'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Current Settings Display */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <Badge variant="outline">{format.toUpperCase()}</Badge>
                    <p className="text-xs text-muted-foreground mt-1">Format</p>
                  </div>
                  <div className="text-center">
                    <Badge variant="outline">{quality}</Badge>
                    <p className="text-xs text-muted-foreground mt-1">Qualité</p>
                  </div>
                  <div className="text-center">
                    <Badge variant="outline">{sampleRate / 1000}kHz</Badge>
                    <p className="text-xs text-muted-foreground mt-1">Échantillonnage</p>
                  </div>
                  <div className="text-center">
                    <Badge variant="outline">{bitRate}kbps</Badge>
                    <p className="text-xs text-muted-foreground mt-1">Débit</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recordings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FolderOpen className="w-5 h-5" />
                  Mes Enregistrements ({recordings.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recordings.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Aucun enregistrement disponible
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recordings.map((recording) => (
                      <div key={recording.id} className="border rounded-lg p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium truncate">{recording.name}</h3>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">{recording.format}</Badge>
                            <Badge variant="outline">{recording.quality}</Badge>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{formatDuration(recording.duration)}</span>
                          <span>{formatFileSize(recording.size)}</span>
                          <span>{new Date(recording.date).toLocaleDateString()}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => playRecording(recording)}
                          >
                            {playingId === recording.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => downloadRecording(recording)}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteRecording(recording.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Paramètres d'Enregistrement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6">
                  <div className="space-y-2">
                    <Label>Format d'enregistrement</Label>
                    <Select value={format} onValueChange={setFormat}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="webm">WebM (Recommandé)</SelectItem>
                        <SelectItem value="mp4">M4A (Compatible)</SelectItem>
                        <SelectItem value="wav">WAV (Haute qualité)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Qualité audio</Label>
                    <Select value={quality} onValueChange={(value) => {
                      setQuality(value);
                      const settings = qualitySettings[value as keyof typeof qualitySettings];
                      setSampleRate(settings.sampleRate);
                      setBitRate(settings.bitRate);
                    }}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Basse (22kHz, 64kbps)</SelectItem>
                        <SelectItem value="medium">Moyenne (44kHz, 128kbps)</SelectItem>
                        <SelectItem value="high">Haute (48kHz, 192kbps)</SelectItem>
                        <SelectItem value="ultra">Ultra (96kHz, 320kbps)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Améliorations audio</h4>
                    
                    <div className="flex items-center justify-between">
                      <Label>Réduction de bruit</Label>
                      <Switch 
                        checked={noiseReduction} 
                        onCheckedChange={setNoiseReduction}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Annulation d'écho</Label>
                      <Switch 
                        checked={echoCancellation} 
                        onCheckedChange={setEchoCancellation}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Contrôle automatique du gain</Label>
                      <Switch 
                        checked={autoGain} 
                        onCheckedChange={setAutoGain}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Paramètres avancés</h4>
                    
                    <div className="space-y-2">
                      <Label>Fréquence d'échantillonnage: {sampleRate / 1000}kHz</Label>
                      <Slider
                        value={[sampleRate]}
                        onValueChange={([value]) => setSampleRate(value)}
                        min={22050}
                        max={96000}
                        step={22050}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Débit binaire: {bitRate}kbps</Label>
                      <Slider
                        value={[bitRate]}
                        onValueChange={([value]) => setBitRate(value)}
                        min={64}
                        max={320}
                        step={64}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};