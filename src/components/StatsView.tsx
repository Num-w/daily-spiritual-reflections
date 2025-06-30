
import React from 'react';
import { TrendingUp, Mic, Calendar, BookOpen } from 'lucide-react';

interface StatsViewProps {
  darkMode: boolean;
}

export const StatsView = ({ darkMode }: StatsViewProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold animate-fade-in">Statistiques</h2>
      
      <div className="grid grid-cols-2 gap-4">
        {[
          { value: '47', label: 'Méditations totales', icon: BookOpen, color: 'blue', bgColor: 'blue-50' },
          { value: '12', label: 'Cette semaine', icon: TrendingUp, color: 'green', bgColor: 'green-50' },
          { value: '5', label: 'Sermons préparés', icon: Mic, color: 'purple', bgColor: 'purple-50' },
          { value: '23', label: 'Jours consécutifs', icon: Calendar, color: 'yellow', bgColor: 'yellow-50' }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index}
              className={`p-4 rounded-lg transition-all duration-300 hover:scale-105 transform animate-fade-in ${
                darkMode ? 'bg-gray-800' : `bg-${stat.bgColor}`
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
                <Icon className={`w-8 h-8 text-${stat.color}-600`} />
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Monthly chart */}
      <div className={`p-6 rounded-lg border transition-all duration-300 hover:shadow-lg animate-fade-in ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`} style={{ animationDelay: '400ms' }}>
        <h3 className="font-medium mb-4">Méditations par mois</h3>
        <div className="h-40 flex items-end space-x-2">
          {[12, 15, 18, 22, 19, 25, 28, 24, 30, 26, 22, 20].map((value, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-blue-500 rounded-t transition-all duration-500 hover:bg-blue-600"
                style={{ 
                  height: `${(value / 30) * 100}%`,
                  animationDelay: `${index * 50}ms`
                }}
              />
              <span className="text-xs mt-2 text-gray-500">
                {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][index]}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Top books */}
      <div className={`p-6 rounded-lg border transition-all duration-300 hover:shadow-lg animate-fade-in ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`} style={{ animationDelay: '600ms' }}>
        <h3 className="font-medium mb-4">Livres les plus médités</h3>
        <div className="space-y-3">
          {[
            { book: 'Psaumes', count: 15, percentage: 85 },
            { book: 'Jean', count: 12, percentage: 65 },
            { book: 'Matthieu', count: 8, percentage: 45 },
            { book: 'Romains', count: 6, percentage: 35 },
            { book: 'Proverbes', count: 4, percentage: 25 }
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="font-medium">{item.book}</span>
              <div className="flex items-center space-x-3">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                    style={{ 
                      width: `${item.percentage}%`,
                      animationDelay: `${index * 100 + 800}ms`
                    }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-8">{item.count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
