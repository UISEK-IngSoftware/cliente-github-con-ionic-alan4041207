import { IonContent, IonHeader, IonList, IonPage, IonTitle, IonToolbar, IonRefresher, IonRefresherContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, useIonViewWillEnter, IonAlert, IonModal, IonButton, IonInput, IonTextarea } from '@ionic/react';
import React, { useState } from 'react';
import './Tab1.css';
import RepoItem from '../components/RepoItem';
import { RepositoryItem } from '../interfaces/RepositoryItem';
import { fetchRepositories, deleteRepository, updateRepository } from '../services/GithubService';

const Tab1: React.FC = () => {
  const [repos, setRepos] = useState<RepositoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado para confirmación de eliminación
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [repoToDelete, setRepoToDelete] = useState<RepositoryItem | null>(null);

  // Estado para modal de edición
  const [showEditModal, setShowEditModal] = useState(false);
  const [repoToEdit, setRepoToEdit] = useState<RepositoryItem | null>(null);
  const [editFormData, setEditFormData] = useState({ name: '', description: '' });

  const loadRepos = async () => {
    try {
      setLoading(true);
      setError(null);
      const reposData = await fetchRepositories();
      setRepos(reposData);

      if (reposData.length === 0) {
        setError('No se encontraron repositorios o hay un problema con el token de GitHub. Revisa la consola del navegador.');
      }
    } catch (error) {
      console.error('Error al cargar repositorios:', error);
      setError('Error al conectar con GitHub. Verifica tu conexión y tu token.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async (event: CustomEvent) => {
    await loadRepos();
    event.detail.complete();
  };

  useIonViewWillEnter(() => {
    console.log("IonViewWillEnter - Cargando Repositorios");
    loadRepos();
  });

  const handleDeleteClick = (repo: RepositoryItem) => {
    setRepoToDelete(repo);
    setShowDeleteAlert(true);
  };

  const handleConfirmDelete = async () => {
    if (!repoToDelete || !repoToDelete.owner) {
      alert('No se puede eliminar el repositorio: información incompleta');
      return;
    }

    try {
      await deleteRepository(repoToDelete.owner, repoToDelete.name);
      // Actualizar la lista eliminando el repositorio
      setRepos(repos.filter(r => r.name !== repoToDelete.name));
      alert('Repositorio eliminado con éxito');
    } catch (error) {
      alert('Error al eliminar el repositorio. Verifica los permisos de tu token.');
    } finally {
      setShowDeleteAlert(false);
      setRepoToDelete(null);
    }
  };

  const handleEditClick = (repo: RepositoryItem) => {
    setRepoToEdit(repo);
    setEditFormData({
      name: repo.name,
      description: repo.description || ''
    });
    setShowEditModal(true);
  };

  const handleConfirmEdit = async () => {
    if (!repoToEdit || !repoToEdit.owner) {
      alert('No se puede editar el repositorio: información incompleta');
      return;
    }

    try {
      await updateRepository(repoToEdit.owner, repoToEdit.name, {
        name: editFormData.name,
        description: editFormData.description
      });

      // Recargar la lista de repositorios
      await loadRepos();
      alert('Repositorio actualizado con éxito');
      setShowEditModal(false);
    } catch (error) {
      alert('Error al actualizar el repositorio. Verifica los datos e intenta nuevamente.');
    }
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Repositorios</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Repositorios</IonTitle>
          </IonToolbar>
        </IonHeader>

        {loading ? (
          <div className="loading-container">
            <p>Cargando repositorios...</p>
          </div>
        ) : error ? (
          <IonCard color="warning" className="error-card">
            <IonCardHeader>
              <IonCardTitle>Problema con GitHub</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <p>{error}</p>
              <p style={{ marginTop: '10px', fontSize: '0.9em' }}>
                Asegúrate de:
              </p>
              <ul style={{ fontSize: '0.9em', marginLeft: '20px' }}>
                <li>Tener un token válido en el archivo .env</li>
                <li>Haber reiniciado el servidor después de crear el .env</li>
                <li>Que el token tenga el permiso 'repo'</li>
              </ul>
            </IonCardContent>
          </IonCard>
        ) : repos.length === 0 ? (
          <div className="loading-container">
            <p>No tienes repositorios todavía</p>
          </div>
        ) : (
          <IonList>
            {repos.map((repo, index) => (
              <RepoItem
                key={index}
                repo={repo}
                onDelete={handleDeleteClick}
                onEdit={handleEditClick}
              />
            ))}
          </IonList>
        )}

        {/* Alert de confirmación para eliminar */}
        <IonAlert
          isOpen={showDeleteAlert}
          onDidDismiss={() => setShowDeleteAlert(false)}
          header="Confirmar eliminación"
          message={`¿Estás seguro de que deseas eliminar el repositorio "${repoToDelete?.name}"? Esta acción no se puede deshacer.`}
          buttons={[
            {
              text: 'Cancelar',
              role: 'cancel'
            },
            {
              text: 'Eliminar',
              role: 'destructive',
              handler: handleConfirmDelete
            }
          ]}
        />

        {/* Modal de edición */}
        <IonModal isOpen={showEditModal} onDidDismiss={() => setShowEditModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Editar Repositorio</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonInput
              label="Nombre del repositorio"
              labelPlacement="floating"
              fill="outline"
              value={editFormData.name}
              onIonChange={(e) => setEditFormData({ ...editFormData, name: e.detail.value || '' })}
              className="ion-margin-bottom"
            />

            <IonTextarea
              label="Descripción"
              labelPlacement="floating"
              fill="outline"
              rows={6}
              value={editFormData.description}
              onIonChange={(e) => setEditFormData({ ...editFormData, description: e.detail.value || '' })}
              className="ion-margin-bottom"
            />

            <IonButton expand="block" onClick={handleConfirmEdit}>
              Guardar cambios
            </IonButton>
            <IonButton expand="block" fill="clear" onClick={() => setShowEditModal(false)}>
              Cancelar
            </IonButton>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
