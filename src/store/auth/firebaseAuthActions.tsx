import {
    GoogleAuthProvider,
    signInWithRedirect,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    signInWithPopup,
} from "firebase/auth";

import { AUTH, PREFLIGHT } from "../../api/API_Registry";
import { AUTH_, PREFLIGHT_, STORAGE_KEYS } from "../../global/ConstantsRegistry";
import AxiosServices from "../../services/AxiosServices";
import { firebaseAuth } from "../../firebase/firebaseConfigs";
import StorageServices from "../../services/StorageServices";

interface FirebaseProps {
    identity: any,
    deviceInfo?: any,
    credentials?: any,
    locationState?: any,
}

export function firebaseAuthActions(propsIn: FirebaseProps) {
    return (dispatch: (arg0: { type: string; response: any }) => void) => {
        const firebaseProps = { ...propsIn }

        dispatch({
            type: AUTH_.PROCESSING,
            response: {
                provider: firebaseProps.identity,
                redirect: false,
            },
        });

        if (firebaseProps.identity === 'password') {
            emailPasswordSignUp(dispatch, firebaseProps)
        } else {
            firebaseAuth.useDeviceLanguage();
            const provider = new GoogleAuthProvider();
            signInWithRedirect(firebaseAuth, provider)
        }
    }
}

export function Alt_FirebaseSSO_SignIn(propsIn: FirebaseProps) {
    return async (dispatch: (arg0: { type: string; response: any }) => void) => {
        const firebaseProps = { ...propsIn }

        dispatch({
            type: AUTH_.PROCESSING,
            response: {
                provider: firebaseProps.identity,
                redirect: false,
            },
        });

        if (firebaseProps.identity === 'password') {
            emailPasswordSignIn(dispatch, firebaseProps)
        } else {
            googleProviderSignInWithPopUp(dispatch, firebaseProps)
        }
    }
}

export function Alt_FirebaseSSO_SignUp(propsIn: FirebaseProps) {
    return async (dispatch: (arg0: { type: string; response: any }) => void) => {
        const firebaseProps = { ...propsIn }

        dispatch({
            type: AUTH_.PROCESSING,
            response: {
                provider: firebaseProps.identity,
                redirect: false,
            },
        });

        if (firebaseProps.identity === 'password') {
            emailPasswordSignUp(dispatch, firebaseProps)
        } else {
            googleProviderSignInWithPopUp(dispatch, firebaseProps)
        }
    }
}

async function googleProviderSignInWithPopUp(dispatch: any, _firebaseProps: any) {
    try {
        firebaseAuth.useDeviceLanguage();
        const provider = new GoogleAuthProvider();
        const popupResponse: any = await signInWithPopup(firebaseAuth, provider)
    
        if (popupResponse.user.stsTokenManager.accessToken) {
            const firebaseUser: any = popupResponse.user;
    
            dispatch({
                type: AUTH_.FIREBASE_TOKEN,
                response: {
                    accessToken: firebaseUser.accessToken,
                    refreshToken: firebaseUser.stsTokenManager.refreshToken,
                    expirationTime: firebaseUser.stsTokenManager.expirationTime,
                },
            });
        } else {
            console.log('EMPT');
        }
    } catch (error: any) {
        const errorCode = error.code;
        let errorMessage = error.message;
        let popUpErrors = [
            'auth/popup-blocked',
            'auth/popup-closed-by-user',
            'auth/cancelled-popup-request',
        ]

        if (errorCode === 'auth/user-not-found') {
            errorMessage = "Sorry, we couldn't sign you in. Please check your credentials"
        } else if (errorCode === 'auth/wrong-password') {
            errorMessage = "Sorry, we couldn't sign you in. Please check your credentials"
        } else if (errorCode === 'auth/user-disabled') {
            errorMessage = 'Your account has been disabled. Please contact support for assistance.'
        } else if (errorCode === 'auth/account-exists-with-different-credential') {
            errorMessage = "Email is associated with a different sign-in method. Please sign in using the method originally used."
        } else if (errorCode === 'auth/requires-recent-login') {
            errorMessage = "Your session has expired. Please sign in again to continue."
        } else if (popUpErrors.includes(errorCode)) {
            errorMessage = 'Google sign-in process cancelled by user'
        } else {
            errorMessage = null
        }

        dispatch({
            type: AUTH_.FIREBASE_EXCEPTION,
            response: errorMessage,
        });
    }

}

async function emailPasswordSignIn(dispatch: any, firebaseProps: any) {
    /* 
     * Firebase Authentication:
     * Authentication using email and password
     * 
    */
    const credentials = firebaseProps.credentials

    await signInWithEmailAndPassword(firebaseAuth, credentials.email, credentials.password)
        .then((userCredential: any) => {
            const firebaseUser = userCredential.user;

            dispatch({
                type: AUTH_.FIREBASE_TOKEN,
                response: {
                    accessToken: firebaseUser.accessToken,
                    refreshToken: firebaseUser.stsTokenManager.refreshToken,
                    expirationTime: firebaseUser.stsTokenManager.expirationTime,
                },
            });
        })
        .catch((error) => {
            const errorCode = error.code;
            let errorMessage = error.message;

            if (errorCode === 'auth/user-not-found') {
                errorMessage = "Sorry, we couldn't sign you in. Please check your credentials"
            } else if (errorCode === 'auth/wrong-password') {
                errorMessage = "Sorry, we couldn't sign you in. Please check your credentials"
            } else if (errorCode === 'auth/user-disabled') {
                errorMessage = 'Your account has been disabled. Please contact support for assistance.'
            } else if (errorCode === 'auth/account-exists-with-different-credential') {
                errorMessage = "Email is associated with a different sign-in method. Please sign in using the method originally used."
            } else if (errorCode === 'auth/requires-recent-login') {
                errorMessage = "Your session has expired. Please sign in again to continue."
            } else {
                errorMessage = "Sorry, we couldn't sign you in. Please check your credentials"
            }

            dispatch({
                type: AUTH_.FIREBASE_EXCEPTION,
                response: errorMessage,
            });
        });
}

async function emailPasswordSignUp(dispatch: any, firebaseProps: any) {
    /* 
     * Firebase Authentication:
     * Authentication using email and password
     * 
    */
    const credentials = firebaseProps.credentials

    await createUserWithEmailAndPassword(firebaseAuth, credentials.email, credentials.password)
        .then((userCredential: any) => {
            const firebaseUser = userCredential.user;

            dispatch({
                type: AUTH_.FIREBASE_TOKEN,
                response: {
                    accessToken: firebaseUser.accessToken,
                    refreshToken: firebaseUser.stsTokenManager.refreshToken,
                    expirationTime: firebaseUser.stsTokenManager.expirationTime,
                },
            });
        })
        .catch((error) => {
            const errorCode = error.code;
            let errorMessage = error.message;

            if (errorCode === 'auth/email-already-in-use') {
                errorMessage = 'Email is already associated with an account.'
            } else if (errorCode === 'auth/invalid-email') {
                errorMessage = 'Please provide a valid email address'
            } else if (errorCode === 'auth/weak-password') {
                errorMessage = 'Kindly set a strong password '
            } else if (errorCode === 'auth/operation-not-allowed') {
                errorMessage = 'Something went wrong. Kindly try again'
            } else {
                errorMessage = 'Something went wrong. Kindly try again'
            }

            dispatch({
                type: AUTH_.FIREBASE_EXCEPTION,
                response: errorMessage,
            });
        });
}

export async function benefactorSanctumToken(dispatch: any, accessToken: any, firebaseProps: any) {
    try {
        let formData = new FormData()
        formData.append('idToken', accessToken)
        formData.append('device_name', firebaseProps.deviceInfo)
        formData.append('hash', StorageServices.getLocalStorage(STORAGE_KEYS.ENTITY_HASH))

        const apiResponse: any = await AxiosServices.httpPost(AUTH.SSO_BENEFACTORS, formData)

        if (apiResponse.data.success) {
            dispatch({
                type: AUTH_.SANCTUM_TOKEN,
                response: apiResponse.data,
            });
        } else {
            dispatch({
                type: AUTH_.SANCTUM_EXCEPTION,
                response: 'Something went wrong, try again...',
            });
        }
    } catch (error) {
        dispatch({
            type: AUTH_.SANCTUM_EXCEPTION,
            response: 'Something went wrong, try again...',
        });
    }
}

export async function preflightCockpitToken(dispatch: any, accessToken: any, firebaseProps: any) {
    try {
        let formData = new FormData()
        formData.append('idToken', accessToken)
        formData.append('device_name', firebaseProps.deviceInfo)
        formData.append('hash', StorageServices.getLocalStorage(STORAGE_KEYS.ENTITY_HASH))

        const apiResponse: any = await AxiosServices.httpPost(PREFLIGHT.COCKPIT_SSO, formData)

        if (apiResponse.data.success) {
            dispatch({
                type: PREFLIGHT_.CKPIT_TOKEN,
                response: apiResponse.data,
            });
        } else {
            dispatch({
                type: PREFLIGHT_.CKPIT_EXECPTION,
                response: 'Something went wrong, try again...',
            });
        }
    } catch (error) {
        dispatch({
            type: PREFLIGHT_.CKPIT_EXECPTION,
            response: 'Something went wrong, try again...',
        });
    }
}

export async function beneficiarySanctumToken(dispatch: any, accessToken: any, firebaseProps: any) {
    try {
        let formData = new FormData()
        formData.append('idToken', accessToken)
        formData.append('device_name', firebaseProps.deviceInfo)
        formData.append('beneficiary', firebaseProps.beneficiary)
        formData.append('hash', StorageServices.getLocalStorage(STORAGE_KEYS.ENTITY_HASH))

        const apiResponse: any = await AxiosServices.httpPost(AUTH.SSO_BENEFICIARIES, formData)

        if (apiResponse.data.success) {
            dispatch({
                type: AUTH_.SANCTUM_TOKEN,
                response: apiResponse.data,
            });
        } else {
            dispatch({
                type: AUTH_.SANCTUM_EXCEPTION,
                response: 'Something went wrong, try again...',
            });
        }
    } catch (error) {
        dispatch({
            type: AUTH_.SANCTUM_EXCEPTION,
            response: 'Something went wrong, try again...',
        });
    }
}

export function resetAuth0() {
    return (dispatch: (arg0: { type: string; response: any }) => void) => {
        dispatch({
            type: AUTH_.RESET_,
            response: {
                redirect: false,
            },
        });
    }
}

export const revokeAuthSession = () => {
    return (dispatch: (arg0: { type: string; response: any; }) => void) => {
        signOut(firebaseAuth).then(() => {
            // Sign-out successful.
        }).catch((error) => {
            // An error happened.
        });

        dispatch({
            type: AUTH_.REVOKE_SESSION,
            response: null,
        });
    }
}
