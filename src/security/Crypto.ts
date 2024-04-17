import crypto from 'crypto-js';

import EncryptionKeys from "./EncryptionKeys"
import StorageServices from "../services/StorageServices";

class Crypto {
    generateRandomIV() {
        const randomBytes = crypto.lib.WordArray.random(16);
        const iv = crypto.enc.Hex.stringify(randomBytes);

        return iv;
    }

    encryptDataUsingAES256(plainText: any) {
        let iv: any = this.generateRandomIV();
        let key = EncryptionKeys.getKeyBase()
        
        const cipherText =  crypto.AES.encrypt(plainText, key, {
            keySize: 128 / 8,
            iv: iv,
            mode: crypto.mode.CBC,
            padding: crypto.pad.Pkcs7
        }).toString();

        const result = {
            iv: iv,
            data: cipherText,
        };

        return result;
    }

    decryptDataUsingAES256(encryptedData: any) {
        try {
            const iv = encryptedData.iv;
            let key = EncryptionKeys.getKeyBase()            

            return crypto.AES.decrypt(encryptedData.data, key, {
                keySize: 128 / 8,
                iv: iv,
                mode: crypto.mode.CBC,
                padding: crypto.pad.Pkcs7
            }).toString(crypto.enc.Utf8)
        } catch (e) {
            /*
            * Encryption keys used to decrypt the data
            * do not match the keys used when encrypting
            * the data.
            *
            * Fallback: Clear existing key and prompt
            * user to sign in afresh setting new
            * encryption keys.
            * */

            StorageServices.clearLocalStorage()            
            /*
            * TODO: Clear sanctum cookie too.
            * */
        }
    }
}

export default new Crypto()