import axios from "axios"

import { store } from "../store/store"
import Crypto from "../security/Crypto"
import CookieServices from "./CookieServices"
import { API_DOMAIN } from "../api/API_Controller"
import { COOKIE_KEYS } from "../global/ConstantsRegistry"
import { DeviceInfo } from "../lib/modules/HelperFunctions"
import { revokeAuthSession } from "../store/auth/firebaseAuthActions"

class HttpServices {
    protected decryptSanctumTokenCookie() {
        const cipherText = CookieServices.get(COOKIE_KEYS.SANCTUM)

        return (cipherText != null)
            ? Crypto.decryptDataUsingAES256(cipherText)
            : null
    }

    async httpGet(url: string) {
        try {
            const GET_API_URL = API_DOMAIN + url
            return await axios.get(GET_API_URL, this.axiosInstanceHeaders())
        } catch (error: any) {
            let ERR = {
                status: error.response?.status,
                message: error.message,
                code: error.code
            }

            if (axios.isAxiosError(error)) {
                // Handle Axios-specific errors
                let statusCode = error.response?.status;

                if (statusCode === 401) {
                    return this.revokeAuthenticatedSession();
                } else {
                    return ERR;
                }
            } else {
                // Handle other types of errors
                return ERR;
            }
        }
    }

    async httpPost(url: string, data: any, options: any = null) {
        try {
            const finalOptions = Object.assign(this.axiosInstanceHeaders(), options)
            const POST_API_URL = API_DOMAIN + url

            return await axios.post(POST_API_URL, data, finalOptions);
        } catch (error: any) {
            const ERR = {
                status: error.response?.status,
                message: error.message,
                code: error.code
            }

            if (axios.isAxiosError(error)) {
                // Handle Axios-specific errors
                let statusCode = error.response?.status;

                if (statusCode === 401) {
                    return this.revokeAuthenticatedSession();
                } else {
                    return ERR;
                }
            } else {
                // Handle other types of errors
                return ERR;
            }
        }
    }

    async httpMultipartForm(url: string, data: any, options: any = null) {
        try {
            const finalOptions = Object.assign(this.axiosInstanceMultipartHeaders(), options)
            const POST_API_URL = API_DOMAIN + url

            return await axios.post(POST_API_URL, data, finalOptions);
        } catch (error: any) {
            const ERR = {
                status: error.response?.status,
                message: error.message,
                code: error.code
            }

            if (axios.isAxiosError(error)) {
                // Handle Axios-specific errors
                let statusCode = error.response?.status;

                if (statusCode === 401) {
                    return this.revokeAuthenticatedSession();
                } else {
                    return ERR;
                }
            } else {
                // Handle other types of errors
                return ERR;
            }
        }
    }

    async httpPut(url: string, data: any, options: any = null) {
        try {
            const finalOptions = Object.assign(this.axiosInstanceHeaders(), options)
            const PUT_API_URL = API_DOMAIN + url

            return await axios.put(PUT_API_URL, data, finalOptions);
        } catch (error: any) {
            const ERR = {
                status: error.response?.status,
                message: error.message,
                code: error.code
            }

            if (axios.isAxiosError(error)) {
                // Handle Axios-specific errors
                let statusCode = error.response?.status;

                if (statusCode === 401) {
                    return this.revokeAuthenticatedSession();
                } else {
                    return ERR;
                }
            } else {
                // Handle other types of errors
                return ERR;
            }
        }
    }

    async httpDelete(url: string, options: any = null) {
        try {
            const finalOptions = Object.assign(this.axiosInstanceHeaders(), options)
            const DEL_API_URL = API_DOMAIN + url

            return await axios.delete(DEL_API_URL, finalOptions);
        } catch (error: any) {
            const ERR = {
                status: error.response?.status,
                message: error.message,
                code: error.code
            }

            if (axios.isAxiosError(error)) {
                // Handle Axios-specific errors
                let statusCode = error.response?.status;

                if (statusCode === 401) {
                    return this.revokeAuthenticatedSession();
                } else {
                    return ERR;
                }
            } else {
                // Handle other types of errors
                return ERR;
            }
        }
    }

    async httpPostWithoutData(url: string, data: any = null, options: any = null) {
        try {
            const finalOptions = Object.assign(this.axiosInstanceHeaders(), options)
            const POST_API_URL = API_DOMAIN + url

            return await axios.post(POST_API_URL, data, finalOptions);
        } catch (error: any) {
            const ERR = {
                status: error.response?.status,
                message: error.message,
                code: error.code
            }

            if (axios.isAxiosError(error)) {
                // Handle Axios-specific errors
                let statusCode = error.response?.status;

                if (statusCode === 401) {
                    return this.revokeAuthenticatedSession();
                } else {
                    return ERR;
                }
            } else {
                // Handle other types of errors
                return ERR;
            }
        }
    }

    axiosInstanceHeaders() {
        const deviceData = DeviceInfo()

        return {
            headers: {
                'User-Device': deviceData,
                'Content-Type': 'application/json',
                Authorization: "Bearer " + this.decryptSanctumTokenCookie(),
            }
        }
    }

    axiosInstanceMultipartHeaders() {
        const deviceData = DeviceInfo()

        return {
            headers: {
                'User-Device': deviceData,
                'Content-Type': 'multipart/form-data',
                Authorization: "Bearer " + this.decryptSanctumTokenCookie(),
            }
        }
    }

    revokeAuthenticatedSession() {
        console.log('Revoking authentication');
        store.dispatch(revokeAuthSession())
    }
}

export default new HttpServices()

