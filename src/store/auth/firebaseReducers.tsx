import { signOut } from "firebase/auth";
import { firebaseAuth } from "../../firebase/firebaseConfigs";
import { AUTH_, COOKIE_KEYS, PREFLIGHT_, STORAGE_KEYS } from "../../global/ConstantsRegistry";
import { encryptAndStoreCookie, encryptAndStoreLS } from "../../lib/modules/HelperFunctions";
import CookieServices from "../../services/CookieServices";
import StorageServices from "../../services/StorageServices";

const initialState = {
    sso: false,
    error: null,
    provider: '',
    identity: null,
    processing: false,
    authenticated: false,
}

export const firebaseAuthReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case AUTH_.RESET_:
            return {
                ...state,
                sso: false,
                error: null,
                processing: false,
                authenticated: false,
            }

        case AUTH_.PROCESSING:
            return {
                ...state,
                sso: false,
                error: null,
                processing: true,
                authenticated: false,
                provider: action.response.provider,
            }

        case AUTH_.FIREBASE_TOKEN:
            const firebaseResponse = action.response
            StorageServices.setLocalStorage(STORAGE_KEYS.FIREBASE_RFSH, firebaseResponse.refreshToken)

            return {
                ...state,
                sso: true,
                processing: true,
                authenticated: false,
            }

        case AUTH_.FIREBASE_EXCEPTION:
            signOut(firebaseAuth).then(() => {
                // Sign-out successful.
            }).catch((error) => {
                // An error happened.
            });

            return {
                ...state,
                sso: false,
                processing: false,
                authenticated: false,
                error: action.response
            }

        case PREFLIGHT_.CKPIT_TOKEN:
            const cockpitPayload = action.response.payload
            let kapitan = cockpitPayload.identity
            kapitan.acid = kapitan.uuid

            const kapitanObject = {
                uid: kapitan.uid,
                email: kapitan.email,
                msisdn: kapitan.msisdn,
                provider: kapitan.provider_id,
                display_name: kapitan.display_name,
            }

            encryptAndStoreLS(STORAGE_KEYS.ACCOUNT_DATA, kapitan)

            if (cockpitPayload.token) {
                // If response contains token, set it                
                encryptAndStoreCookie(COOKIE_KEYS.SANCTUM, cockpitPayload.token)
            }

            return {
                ...state,
                sso: true,
                processing: false,
                authenticated: true,
                identity: kapitanObject
            }


        case PREFLIGHT_.CKPIT_EXECPTION:
            CookieServices.remove(COOKIE_KEYS.SANCTUM)
            StorageServices.removeLocalStorage(STORAGE_KEYS.ACCOUNT_DATA)

            signOut(firebaseAuth).then(() => {
                // Sign-out successful.
            }).catch((error) => {
                // An error happened.
            });

            return {
                ...state,
                sso: false,
                processing: false,
                authenticated: false,
                error: action.response
            }

        case AUTH_.SANCTUM_TOKEN:
            const payload = action.response.payload
            let identity = payload.identity
            identity.acid = identity.uuid

            const identityObject = {
                uid: identity.uid,
                email: identity.email,
                msisdn: identity.msisdn,
                provider: identity.provider_id,
                display_name: identity.display_name,
            }

            encryptAndStoreLS(STORAGE_KEYS.ACCOUNT_DATA, identity)

            if (payload.token) {
                // If response contains token, set it                
                encryptAndStoreCookie(COOKIE_KEYS.SANCTUM, payload.token)
            }

            return {
                ...state,
                sso: true,
                processing: false,
                authenticated: true,
                identity: identityObject
            }

        case AUTH_.SANCTUM_EXCEPTION:
            CookieServices.remove(COOKIE_KEYS.SANCTUM)
            StorageServices.removeLocalStorage(STORAGE_KEYS.ACCOUNT_DATA)

            signOut(firebaseAuth).then(() => {
                // Sign-out successful.
            }).catch((error) => {
                // An error happened.
            });

            return {
                ...state,
                sso: false,
                processing: false,
                authenticated: false,
                error: action.response
            }

        case AUTH_.ID_META_01:
            let meta01Identity: any = action.response
            let displayName = null

            if (meta01Identity.keepName) {
                displayName = meta01Identity.display_name

                return {
                    ...state,
                    identity: {
                        ...state.identity,
                        display_name: displayName,
                        last_name: null,
                        first_name: null,
                    }
                }
            } else {
                displayName = meta01Identity.first_name + " " + meta01Identity.last_name

                return {
                    ...state,
                    identity: {
                        ...state.identity,
                        display_name: displayName,
                        last_name: meta01Identity.last_name,
                        first_name: meta01Identity.first_name,
                    }
                }
            }

        case AUTH_.ID_META_02:
            let meta02Identity: any = action.response

            return {
                ...state,
                identity: {
                    ...state.identity,
                    msisdn: meta02Identity.msisdn
                }
            }

        case AUTH_.ID_META_03:
            let meta03Identity: any = action.response

            return {
                ...state,
                identity: {
                    ...state.identity,
                    account: meta03Identity.account
                }
            }

        case AUTH_.REVOKE_SESSION:
            signOut(firebaseAuth).then(() => {
                // Sign-out successful.                
            }).catch((error) => {
                // An error happened.
            });

            CookieServices.remove(COOKIE_KEYS.SANCTUM)
            StorageServices.clearLocalStorage()

            return {
                ...state,
                sso: false,
                identity: null,
                authenticated: false,
            }

        default:
            return state
    }
}