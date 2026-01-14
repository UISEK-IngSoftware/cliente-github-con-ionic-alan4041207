import React from 'react';
import { setupIonicReact } from '@ionic/react';
import {
    IonApp,
    IonIcon,
    IonLabel,
    IonRouterOutlet,
    IonTabBar,
    IonTabButton,
    IonTabs
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect } from 'react-router-dom';
import Tab1 from './pages/Tab1';
import Tab2 from './pages/Tab2';
import Tab3 from './pages/Tab3';
import { logoGithub, addCircle, personCircle } from 'ionicons/icons';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import AuthService from './services/AuthService';
import Login from './pages/Login';

setupIonicReact();
const App: React.FC = () => {
  const isAuthenticated=AuthService.isAuthenticated();
  return(<IonApp>
    <IonReactRouter>

      <IonRouterOutlet>
        <Route exact path="/login">
        <Login />
        </Route>
        <Route>
        {isAuthenticated ? (
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/repositorio">
              <Tab1 />
            </Route>
            <Route exact path="/crear-repo">
              <Tab2 />
            </Route>
            <Route exact path="/perfil">
              <Tab3 />
            </Route>
            <Route exact path="/">
              <Redirect to="/repositorio" />
            </Route>
          </IonRouterOutlet>

          <IonTabBar slot="bottom">
            <IonTabButton tab="repositorio" href="/repositorio">
              <IonIcon icon={logoGithub} />
              <IonLabel>Repositorio</IonLabel>
            </IonTabButton>

            <IonTabButton tab="crear-repo" href="/crear-repo">
              <IonIcon icon={addCircle} />
              <IonLabel>Crear Repo</IonLabel>
            </IonTabButton>

            <IonTabButton tab="perfil" href="/perfil">
              <IonIcon icon={personCircle} />
              <IonLabel>Perfil</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
        ) : (
          <Redirect to="/login" />
        )}
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
  );
};

export default App;
