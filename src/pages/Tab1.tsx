import { IonContent, IonHeader, IonList, IonPage, IonTitle, IonToolbar, useIonViewDidEnter } from '@ionic/react';
import React from 'react';
import { useState } from 'react';
import './Tab1.css';
import RepoItem from '../components/RepoItem';
import { RepositoryItem } from '../interfaces/RepositoryItem';
import { fetchRepositories } from '../services/GithubService';
const Tab1: React.FC = () => {
  const[repos,SetRepos]=React.useState<RepositoryItem[]>([]);
  const loadRepos= async()=>{
    const reposData= await fetchRepositories();
    SetRepos(reposData);
  };
  useIonViewDidEnter(()=>{
    console.log("IownViewDidEnter - Cargando Repositorios")
    loadRepos();
  });
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Repositorios</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Repositorios</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
        {repos.map((repos, index)=>
          <RepoItem 
          key={index}
          repo={repos}
          />)}

        </IonList>


      </IonContent>
    </IonPage>
  );
};

export default Tab1;
