import { IonItem, IonLabel, IonThumbnail, IonButton, IonIcon } from '@ionic/react';
import { createOutline, trashOutline } from 'ionicons/icons';
import './RepoItem.css';
import { RepositoryItem } from '../interfaces/RepositoryItem';

interface RepoItemProps {
  repo: RepositoryItem;
  onDelete?: (repo: RepositoryItem) => void;
  onEdit?: (repo: RepositoryItem) => void;
}

const RepoItem: React.FC<RepoItemProps> = ({ repo, onDelete, onEdit }) => {
  return (
    <IonItem>
        <IonThumbnail slot="start">
            <img src={repo.imageurl|| "https://i.pinimg.com/736x/06/44/69/0644695c31b934311a6a80e1064485bf.jpg"} alt={repo.name}/>
        </IonThumbnail>
        <IonLabel>
           <h2>{repo.name}</h2>
           <p>{repo.description}</p>
           <p>Propietario: {repo.owner}</p>
           <p>Lenguaje: {repo.language}</p>
        </IonLabel>
        <IonButton
          slot="end"
          fill="clear"
          color="primary"
          onClick={(e) => {
            e.stopPropagation();
            onEdit?.(repo);
          }}
        >
          <IonIcon icon={createOutline} />
        </IonButton>
        <IonButton
          slot="end"
          fill="clear"
          color="danger"
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.(repo);
          }}
        >
          <IonIcon icon={trashOutline} />
        </IonButton>
    </IonItem>

  );
};

export default RepoItem;
