import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonTextarea } from '@ionic/react';
import './Tab2.css';
import { useHistory } from 'react-router-dom';
import { RepositoryItem } from '../interfaces/RepositoryItem';
import { useState } from 'react';
import { createRepository } from '../services/GithubService';

const Tab2: React.FC = () => {

  const history = useHistory();
  const [repoFormData, setRepoFormData] = useState<RepositoryItem>({
    name: '',
    description: '',
    imageurl: null,
    owner: null,
    language: null,
  });

  const setRepoName = (value: string | null) => {
    setRepoFormData((prev) => ({ ...prev, name: value ?? '' }));
  };

  const setRepoDescription = (value: string | null) => {
    setRepoFormData((prev) => ({ ...prev, description: value ?? '' }));
  };

  const saveRepository = () => {
    if (repoFormData.name.trim() === '') {
      alert('El nombre del repositorio es obligatorio.');
      return;
    }
    createRepository(repoFormData)
      .then(() => {
        history.push('/tab1');
      }).catch(() => {
        alert('Hubo un error al crear el repositorio. Por favor, inténtalo de nuevo.');
      });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Formulario de Repositorio</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Formulario de Repositorio</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div className="form-container">
          <IonInput
            label="Nombre del repositorio"
            labelPlacement="floating"
            fill="outline"
            placeholder="android-project"
            className="form-field"
            value={repoFormData.name}
            onIonChange={(e) => setRepoName(e.detail.value as string | null)}
          />

          <IonTextarea
            label="Descripción del Repositorio"
            labelPlacement="floating"
            fill="outline"
            placeholder="Este es un Repositorio de Android"
            className="form-field"
            rows={6}
            value={repoFormData.description ?? ''}
            onIonChange={(e) => setRepoDescription(e.detail.value as string | null)}
          />

          <IonButton expand="block" className="form-field" onClick={saveRepository}>
            Guardar
          </IonButton>

        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;