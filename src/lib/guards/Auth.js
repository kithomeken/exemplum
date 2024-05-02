import Crypto from '../../security/Crypto';
import StorageServices from '../../services/StorageServices';
import { STORAGE_KEYS, COOKIE_KEYS } from '../../global/ConstantsRegistry';

class Auth {
    checkAuthentication(auth0) {
        if (!auth0.authenticated) {
            // Redux session is not authenticated
            return {
                identity: false,
                authenticated: false,
                status: {
                    disabled: false,
                    resetSession: false
                }
            };
        }

        // Redux session state is authenticated 
        // Counter-check with available session cookies
        const sanctumCookie = this.getCookie(COOKIE_KEYS.SANCTUM);
        const encryptedKeyString = StorageServices.getLocalStorage(STORAGE_KEYS.ACCOUNT_DATA);

        if (sanctumCookie === null) {
            // Not authenticated. Reset account session
            return {
                identity: false,
                authenticated: false,
                status: {
                    disabled: false,
                    resetSession: true
                }
            };
        }

        // Authenticated
        if (encryptedKeyString === null) {
            // Pull account information using PostAuthentication
            return {
                identity: false,
                authenticated: true,
                status: {
                    disabled: false,
                    resetSession: false
                }
            };
        }

        const storageObject = JSON.parse(encryptedKeyString);
        const accountData = Crypto.decryptDataUsingAES256(storageObject);
        const jsonAccountInfo = JSON.parse(accountData);

        if (jsonAccountInfo.email === auth0.identity.email) {
            const sessionState = {
                identity: true,
                authenticated: true,
                status: {
                    disabled: jsonAccountInfo.active !== 'Y',
                    resetSession: false
                }
            };
            return sessionState;
        } 
        
        // Account info do not match. Redirect to PostAuth
        return {
            identity: false,
            authenticated: true,
            status: {
                disabled: false,
                resetSession: false
            }
        };
    }

    getCookie(cookieName) {
        const cookieArr = document.cookie.split(';');

        for (let i = 0; i < cookieArr.length; i++) {
            const cookiePair = cookieArr[i].split('=');

            if (cookieName === cookiePair[0].trim()) {
                return decodeURIComponent(cookiePair[1]);
            }
        }

        return null;
    }
}

export default new Auth();
