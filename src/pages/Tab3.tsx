import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/react';
import { getUserInfo } from '../services/GithubService';

import './Tab3.css';
import { UserInfo } from '../interfaces/UserInfo';


const Tab3: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const loadUserInfo = async () => {
    try {
      const info = await getUserInfo();
      setUserInfo(info);
    } catch (err) {
      console.error('Error cargando información de usuario', err);
    }
  };

  useEffect(() => {
    loadUserInfo();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Perfil de usuario</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="profile-content">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Perfil</IonTitle>
          </IonToolbar>
        </IonHeader>

        <div className="profile-container">
          <IonCard className="profile-card">
            <div className="profile-avatar-container">
              <img
                alt={userInfo?.login ?? 'avatar'}
                src={userInfo?.avatar_url ?? 'https://via.placeholder.com/150'}
                className="profile-avatar"
              />
            </div>

            <IonCardHeader className="profile-header">
              <IonCardTitle className="profile-name">
                {userInfo?.name ?? userInfo?.login ?? 'Usuario'}
              </IonCardTitle>
              <IonCardSubtitle className="profile-username">
                @{userInfo?.login ?? '—'}
              </IonCardSubtitle>
            </IonCardHeader>

            <IonCardContent className="profile-bio">
              {userInfo?.bio ?? 'Sin biografía disponible'}
            </IonCardContent>
          </IonCard>
        </div>

      </IonContent>
    </IonPage>
  );
};

export default Tab3;