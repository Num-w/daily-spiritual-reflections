
import React, { useState } from 'react';
import { LoginScreen } from '@/components/LoginScreen';
import { MainApp } from '@/components/MainApp';

const Index = () => {
  const [isLocked, setIsLocked] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  if (isLocked) {
    return (
      <LoginScreen 
        onUnlock={() => setIsLocked(false)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
    );
  }

  return (
    <MainApp 
      onLock={() => setIsLocked(true)}
      darkMode={darkMode}
      setDarkMode={setDarkMode}
    />
  );
};

export default Index;
