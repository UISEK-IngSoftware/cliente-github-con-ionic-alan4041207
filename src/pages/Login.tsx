import React, { useState } from 'react';
import {
  IonHeader,
  IonPage,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
  IonInput,
  IonText
} from "@ionic/react";
import { logoGithub } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import './Login.css'
import AuthService from '../services/AuthService';


const Login: React.FC = () => {
    const history = useHistory();
    const [username, setUsername] = useState('');
    const [token, setToken] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!username || !token) {
            setError('Por favor, ingresa tu usuario y token de GitHub.');
            return;
        }
        const success = AuthService.login(username, token);
        if(success){
            history.push('/repositorio');
        } else {
            setError('Error de autenticación. Verifica tus credenciales.');
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Login</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen className="ion-padding">
                <div className="login-container">
                    <IonIcon icon={logoGithub} className="login-logo"/>
                    <h1>Inicio de sesión GitHub</h1>
                    <form className="login-form" onSubmit={handleLogin}>
                        <IonInput
                            className="login-field"
                            label="Usuario de GitHub"
                            labelPlacement="floating"
                            fill="outline"
                            type="text"
                            value={username}
                            onIonInput={e => setUsername(e.detail.value!)}
                            required
                        />
                        <IonInput
                            className="login-field"
                            label="Token de GitHub"
                            labelPlacement="floating"
                            fill="outline"
                            type="password"
                            value={token}
                            onIonInput={e => setToken(e.detail.value!)}
                            required
                        />
                        {error && (
                            <IonText color="danger" className="error-message">
                                {error}
                            </IonText>
                        )}

                        <IonButton expand="block" type="submit"
                        className="login-button">
                            Iniciar Sesión
                        </IonButton>
                        <IonText color="medium" className="login-hint">
                            <p>Ingresa tu usuario y tu Token de GitHub</p>
                        </IonText>
                    </form>
                </div>
            </IonContent>
        </IonPage>
    );
}
export default Login;