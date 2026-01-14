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
import './Login.css'
import AuthService from '../services/AuthService';


const Login: React.FC = () => {

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
        window.location.href = '/tab1';
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
            <IonContent fullscreen className = "ion-padding"/>
                <div className="login-container">
                    <IonIcon icon={logoGithub} className="login-logo"/>
                    <h1> Inicio de sesion GitHub</h1>
                    <form className="login-form" onSubmit={handleLogin}>
                        <IonInput 
                            className="Login field"
                            label="Usuario de github"
                            labelPlacement="floating"
                            fill="outline"
                            type="text"
                            value= {username}
                            onIonInput={e => setUsername(e.detail.value!)}
                            required   
                        />
                        <IonInput
                            className="Login field"
                            label="Token de Github"
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
                        className="Iniciar Sesion">
                        </IonButton>
                        <IonText color="medium" className="login-hint">
                            <p>Ingresa tu usuario y tu Token de Github</p>
                        </IonText>
                    </form>
                </div>
        </IonPage>
    );
}
export default Login;