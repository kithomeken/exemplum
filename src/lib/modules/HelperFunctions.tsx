import axios from 'axios';
import Moment from 'moment';
import { browserName, deviceType, engineName, engineVersion, osName, osVersion } from 'react-device-detect';

import Crypto from '../../security/Crypto';
import { FQDN } from '../../api/API_Controller';
import CookieServices from '../../services/CookieServices';
import { COOKIE_KEYS } from '../../global/ConstantsRegistry';
import StorageServices from '../../services/StorageServices';

export function API_RouteReplace(apiRoute: string, findT: string, replaceT: any) {
    return apiRoute.replace(findT, replaceT)
}

export function DateFormating(dateString: any) {
    return Moment(dateString).format('MMM D, YYYY h:mm A')
}

export function minimalistDateFormat(dateString: any) {
    return Moment(dateString).format('DD MMM YYYY')
}

export function humanReadableDate(dateString: any) {
    return Moment(dateString).fromNow();
}

export function DeviceInfo() {
    const osPart = `${osName} ${osVersion}`;
    const browserPart = `${browserName}/${engineName}`;

    return deviceType + ': ' + osPart + ' ' + browserPart + ' ' + engineVersion
}

export function sanctumAxiosInstance() {
    const cipherText = CookieServices.get(COOKIE_KEYS.SANCTUM)

    const axiosInstance = axios.create({
        headers: {
            'content-type': 'application/json',
            Authorization: "Bearer " + Crypto.decryptDataUsingAES256(cipherText)
        },
    });

    return axiosInstance
}

export function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export function titleCase(str: string) {
    return str.toLowerCase().split(' ').map((word) => {
        return word[0].toUpperCase() + word.slice(1)
    }).join(' ')
}

export function capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function encryptAndStoreCookie(key: string, data: any) {
    const encryptedData = Crypto.encryptDataUsingAES256(data)
    CookieServices.set(key, encryptedData, COOKIE_KEYS.OPTIONS)
}

export function encryptAndStoreLS(key: string, data: any) {
    // Local Storage data encryption and storage
    const strData = JSON.stringify(data);
    const encryptedData = Crypto.encryptDataUsingAES256(strData);

    StorageServices.setLocalStorage(key, JSON.stringify(encryptedData));
};

export function readDecryptAndParseLS(key: string) {
    const encryptedKeyString = StorageServices.getLocalStorage(key)
    const storageObject = JSON.parse(encryptedKeyString)

    const deStorageObject = Crypto.decryptDataUsingAES256(storageObject)
    return JSON.parse(deStorageObject)
}

export function getRandomObjectFromArray(array: any[]) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

export function renderArtistDocuments(documentName: string) {
    return FQDN + '/files/documents/' + documentName
}

export function formatAmount(amount: number) {
    return amount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};

export function maskNumber(number: any) {
    // Convert number to a string
    let numberString = number.toString();

    // Check if the string has at least 6 characters
    if (numberString.length >= 6) {
        // Extract the first 6 characters
        let prefix = numberString.substring(0, 6);

        // Replace the remaining characters with '*'
        let maskedNumber = prefix + '****' + numberString.substring(10);

        // Convert the masked string back to a number
        return parseInt(maskedNumber, 10);
    }

    // Return the original number if it doesn't have at least 6 characters
    return number;
}

export function passwordValidator(password: string) {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#()\-[\]{}_\-+='\\|;:'",.<>\/~])[A-Za-z\d@$!%*?&#()\-[\]{}_\-+='\\|;:'",.<>\/~]{8,}$/;
    return strongPasswordRegex.test(password);
}

export function nameValidator(tValue: string) {
    if (tValue.match(new RegExp('[`!@#$%^&*()_+\-=\[\]{};:"\\|,.<>\/?~]'))) {
        return false
    } else {
        /* 
         * Remove allowed special characters then test for numbers
        */
        tValue = tValue.replace("'", '')
        tValue = tValue.replace(" ", '')

        if (!tValue.match(new RegExp('[A-Z]')) || !tValue.match(new RegExp('[a-z]'))) {
            return false
        }
    }

    return true
}

export function emailValidator(tValue) {
    let lastAtPos = tValue.lastIndexOf('@')
    let lastDotPos = tValue.lastIndexOf('.')

    if (!(lastAtPos < lastDotPos && lastAtPos > 0 && tValue.indexOf('@@') === -1 && lastDotPos > 2 && (tValue.length - lastDotPos) > 2)) {
        return false
    }

    return true
}

export function getColorForLetter(letter: string) {
    const colorGroups = [
        ['A', 'B', 'C', 'D', 'E'],
        ['F', 'G', 'H', 'I', 'J'],
        ['K', 'L', 'M', 'N', 'O'],
        ['P', 'Q', 'R', 'S', 'T'],
        ['U', 'V', 'W', 'X', 'Y', 'Z']
    ];

    const colors = ['bg-green-600', 'bg-cyan-600', 'bg-rose-700', 'bg-orange-500', 'bg-fuchsia-700'];
    const groupIndex = colorGroups.findIndex(group => group.includes(letter.toUpperCase()));
    return groupIndex !== -1 ? colors[groupIndex] : 'bg-gray-500'; // Default to gray if not found
}
