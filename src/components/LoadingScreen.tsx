import React from 'react';
import { IonSpinner } from '@ionic/react';
import { logoGithub } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';
import './LoadingScreen.css';

const LoadingScreen: React.FC = () => {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="logo-container">
          <IonIcon icon={logoGithub} className="github-logo" />
        </div>
        <h1 className="app-title">GitHub Client</h1>
        <IonSpinner name="crescent" className="loading-spinner" />
        <p className="loading-text">Cargando aplicación...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
