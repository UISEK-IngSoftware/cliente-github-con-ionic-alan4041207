const TOKEN_KEY = 'github_auth_token';
const USERNAME_KEY = 'github_auth_username';

class AuthService{
    private listeners: Array<(isAuth: boolean) => void> = [];

    login(username: string, token: string){
        if(username && token){
            this.logout();
            localStorage.setItem(USERNAME_KEY, username);
            localStorage.setItem(TOKEN_KEY, token);
            this.notifyListeners(true);
            return true;
        }
        return false;
    }

    logout(){
        localStorage.removeItem(USERNAME_KEY);
        localStorage.removeItem(TOKEN_KEY);
        this.notifyListeners(false);
    }

    addAuthListener(listener: (isAuth: boolean) => void) {
        this.listeners.push(listener);
    }

    removeAuthListener(listener: (isAuth: boolean) => void) {
        this.listeners = this.listeners.filter(l => l !== listener);
    }

    private notifyListeners(isAuth: boolean) {
        this.listeners.forEach(listener => listener(isAuth));
    }
    isAuthenticated(): boolean{
        return localStorage.getItem(TOKEN_KEY) !== null &&
               localStorage.getItem(USERNAME_KEY) !== null;
    }
    getToken(){
        return localStorage.getItem(TOKEN_KEY);

    }

    getUsername(){
        return localStorage.getItem(USERNAME_KEY);
    }

    getAuthHeader(){
        const token = this.getToken();
        const username = this.getUsername();
        if(token && username){
          return 'Bearer ' + token;
        }
        return null;
    }
}
export default new AuthService();