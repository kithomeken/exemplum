import axios from "axios"

import Crypto from "../security/Crypto"
import CookieServices from "./CookieServices"
import { API_DOMAIN } from "../api/API_Controller"
import { COOKIE_KEYS } from "../global/ConstantsRegistry"

class AxiosServices {
    protected decryptSanctumTokenCookie() {
        const cipherText = CookieServices.get(COOKIE_KEYS.SANCTUM)

        return (cipherText != null)
            ? Crypto.decryptDataUsingAES256(cipherText)
            : null
    }

    fetchData(route: any) {
        try {
            const apiRoute = API_DOMAIN + route
            return axios.get(apiRoute, this.axiosInstanceHeaders())
        } catch (error) {
            return (error.response !== undefined) ? error.response : error;
        }
    }

    async httpPost(url: string, data: any) {
        try {
            const options: any = null
            const finalOptions = Object.assign(this.axiosInstanceHeaders(), options)
            const POST_API_URL = API_DOMAIN + url

            return await axios.post(POST_API_URL, data, finalOptions);
        } catch (error: any) {
            console.error('Axios.httpPost:', error);

            const ERR = {
                status: error.response?.status,
                message: error.message,
                code: error.code
            }

            return ERR;
        }
    }

    axiosInstanceHeaders() {        
        return {
            headers: {
                'Content-Type': 'application/json',
                Authorization: "Bearer " + this.decryptSanctumTokenCookie(),
            }
        }
    }
}

export default new AxiosServices()