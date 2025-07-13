import React, { useState, useEffect } from 'react';
import { Bell, BellOff, Clock, Calendar, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface NotificationManagerProps {
  darkMode: boolean;
}

export const NotificationManager = ({ darkMode }: NotificationManagerProps) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [dailyReminder, setDailyReminder] = useState(true);
  const [reminderTime, setReminderTime] = useState('08:00');
  const [weeklyGoal, setWeeklyGoal] = useState(true);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const { toast } = useToast();

  useEffect(() => {
    // Check current notification permission
    if ('Notification' in window) {
      setPermission(Notification.permission);
      const savedNotifications = localStorage.getItem('notificationsEnabled');
      if (savedNotifications) {
        setNotificationsEnabled(JSON.parse(savedNotifications));
      }
      
      const savedDailyReminder = localStorage.getItem('dailyReminder');
      if (savedDailyReminder) {
        setDailyReminder(JSON.parse(savedDailyReminder));
      }
      
      const savedReminderTime = localStorage.getItem('reminderTime');
      if (savedReminderTime) {
        setReminderTime(savedReminderTime);
      }
    }
  }, []);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        setPermission(permission);
        
        if (permission === 'granted') {
          setNotificationsEnabled(true);
          localStorage.setItem('notificationsEnabled', 'true');
          
          // Send test notification
          new Notification('Réflexions Spirituelles', {
            body: 'Notifications activées avec succès !',
            icon: '/favicon.ico',
            badge: '/favicon.ico'
          });
          
          toast({
            title: "Notifications activées",
            description: "Vous recevrez des rappels pour vos méditations quotidiennes",
          });
        } else {
          toast({
            title: "Permission refusée",
            description: "Vous pouvez activer les notifications dans les paramètres de votre navigateur",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible d'activer les notifications",
          variant: "destructive",
        });
      }
    }
  };

  const disableNotifications = () => {
    setNotificationsEnabled(false);
    localStorage.setItem('notificationsEnabled', 'false');
    toast({
      title: "Notifications désactivées",
      description: "Vous ne recevrez plus de rappels automatiques",
    });
  };

  const scheduleNotification = () => {
    if (!notificationsEnabled || permission !== 'granted') return;

    // Schedule daily reminder
    if (dailyReminder) {
      const now = new Date();
      const [hours, minutes] = reminderTime.split(':');
      const scheduledTime = new Date();
      scheduledTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      // If time has passed today, schedule for tomorrow
      if (scheduledTime <= now) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }
      
      const timeUntilNotification = scheduledTime.getTime() - now.getTime();
      
      setTimeout(() => {
        new Notification('Temps de méditation', {
          body: 'C\'est l\'heure de votre méditation quotidienne 🙏',
          icon: '/favicon.ico',
          badge: '/favicon.ico'
        });
      }, timeUntilNotification);
    }
  };

  useEffect(() => {
    scheduleNotification();
  }, [notificationsEnabled, dailyReminder, reminderTime]);

  const updateDailyReminder = (enabled: boolean) => {
    setDailyReminder(enabled);
    localStorage.setItem('dailyReminder', enabled.toString());
  };

  const updateReminderTime = (time: string) => {
    setReminderTime(time);
    localStorage.setItem('reminderTime', time);
  };

  return (
    <Card className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Bell className="w-5 h-5" />
          <span>Notifications et Rappels</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Activation des notifications */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {notificationsEnabled ? (
              <Bell className="w-5 h-5 text-green-500" />
            ) : (
              <BellOff className="w-5 h-5 text-gray-400" />
            )}
            <div>
              <p className="font-medium">Notifications push</p>
              <p className="text-sm text-gray-500">
                {permission === 'granted' ? 'Autorisées' : 'Non autorisées'}
              </p>
            </div>
          </div>
          {!notificationsEnabled ? (
            <Button 
              onClick={requestNotificationPermission}
              disabled={permission === 'denied'}
            >
              Activer
            </Button>
          ) : (
            <Button 
              variant="outline" 
              onClick={disableNotifications}
            >
              Désactiver
            </Button>
          )}
        </div>

        {notificationsEnabled && (
          <>
            {/* Rappel quotidien */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Rappel quotidien</span>
                </div>
                <Switch
                  checked={dailyReminder}
                  onCheckedChange={updateDailyReminder}
                />
              </div>

              {dailyReminder && (
                <div className="ml-6">
                  <label className="block text-sm font-medium mb-2">
                    Heure du rappel
                  </label>
                  <Select value={reminderTime} onValueChange={updateReminderTime}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="06:00">06:00</SelectItem>
                      <SelectItem value="07:00">07:00</SelectItem>
                      <SelectItem value="08:00">08:00</SelectItem>
                      <SelectItem value="09:00">09:00</SelectItem>
                      <SelectItem value="18:00">18:00</SelectItem>
                      <SelectItem value="19:00">19:00</SelectItem>
                      <SelectItem value="20:00">20:00</SelectItem>
                      <SelectItem value="21:00">21:00</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Objectif hebdomadaire */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Rappel objectif hebdomadaire</span>
              </div>
              <Switch
                checked={weeklyGoal}
                onCheckedChange={setWeeklyGoal}
              />
            </div>
          </>
        )}

        {permission === 'denied' && (
          <div className="flex items-start space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <Smartphone className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-yellow-800">Notifications bloquées</p>
              <p className="text-yellow-700">
                Pour activer les notifications, allez dans les paramètres de votre navigateur
                et autorisez les notifications pour ce site.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};