import { IonItem, IonLabel,IonThumbnail } from '@ionic/react';
import './RepoItem.css';
import { RepositoryItem } from '../interfaces/RepositoryItem';


const RepoItem: React.FC<{repo:RepositoryItem}> = ({ repo }) => {
  return ( 
    <IonItem>
        <IonThumbnail slot="start"> 
            <img src={repo.imageurl|| "https://i.pinimg.com/736x/06/44/69/0644695c31b934311a6a80e1064485bf.jpg"} alt={repo.name}/>
        </IonThumbnail>
        <IonLabel>
           <h2>{repo.name}</h2>
           <p>{repo.description}</p>
           <p>Propietario:{repo.owner}</p>
           <p>Lenguaje:{repo.language}</p>
           </IonLabel>
    </IonItem>
    
  );
};

export default RepoItem;
