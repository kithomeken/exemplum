import axios from "axios"

import Crypto from "../security/Crypto"
import CookieServices from "./CookieServices"
import { API_DOMAIN } from "../api/API_Controller"
import { COOKIE_KEYS } from "../global/ConstantsRegistry"
import { DeviceInfo } from "../lib/modules/HelperFunctions"

class AxiosServices {
    protected decryptSanctumTokenCookie() {
        const cipherText = CookieServices.get(COOKIE_KEYS.SANCTUM)

        return (cipherText != null)
            ? Crypto.decryptDataUsingAES256(cipherText)
            : null
    }

    async httpGet(url: any) {
        try {
            const options: any = null
            const finalOptions = Object.assign(this.axiosInstanceHeaders(), options)
            const POST_API_URL = API_DOMAIN + url

            return await axios.get(POST_API_URL, finalOptions);
        } catch (error: any) {
            console.error('Axios.httpGet:', error);

            const ERR = {
                status: error.response?.status,
                message: error.message,
                code: error.code
            }

            return ERR;
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
        const deviceData = DeviceInfo()

        return {
            headers: {
                'User-Device': deviceData,
                'Content-Type': 'application/json',
                Authorization: "Bearer " + this.decryptSanctumTokenCookie(),
            }
        }
    }
}

export default new AxiosServices()