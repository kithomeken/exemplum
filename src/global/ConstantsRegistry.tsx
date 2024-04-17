
import { API_Controller } from "../api/API_Controller"

/*
* Application Constants
* */
export const APPLICATION = {
    NAME: 'Big Fan',
    THEME: 'green',
    URL: API_Controller().APP,
    ERR_MSG: 'Something went wrong. Kindly try again later'
}


/*
* Local storage keys
*/
export const STORAGE_KEYS = {
    PRc0_STATE: '__PRc0',
    TIMEZONE: '__utmzZONE',
    BASIC_MENUS: '__utmmBSC',
    OTHER_MENUS: '__utmmOTH',
    ACCOUNT_DATA: '__utmzADTA',
    ENCRYPTION_KEY: '__utmeKYBSE',

    FIREBASE_RFSH: '__RfhS',
    ENTITY_TYPE: '__eNTY',
    ENTITY_HASH: '__enTHSh',
    ACC_VERIFIED:   '__veRF',
}


/*
* Secure Cookie keys
* */
export const COOKIE_KEYS = {
    UAID: '__utmcUAID',
    SANCTUM: '__utmcSNCT',
    OPTIONS: { path: '/', secure: true, sameSite: 'none' },
}


export const STYLE = {
    MAX_WIDTH: { maxWidth: '1024px' },
}

export const CONFIG_MAX_WIDTH = { maxWidth: '1024px' }
export const CONFIG_MARGIN_TOP = { marginTop: '64px' }

export const AUTH_ = {
    RESET_: 'RESET',
    PROCESSING: 'PROCESSING',
    SANCTUM_TOKEN: 'SANCTUM_TOKEN',
    REVOKE_SESSION: 'REVOKE_SESSION',
    FIREBASE_TOKEN: 'FIREBASE_TOKEN',
    SANCTUM_EXCEPTION: 'SANCTUM_EXCEPTION',
    FIREBASE_EXCEPTION: 'FIREBASE_EXCEPTION',

    ID_META_01: 'ID_META_01',
    ID_META_02: 'ID_META_02',
    ID_META_03: 'ID_META_03',
}


export const IDENTITY_ = {
    PRc0: 'PRc0_SET',
    RESET_: 'PRc0_RESET',
    PRc0_UPDATE: 'PRc0_UPDATE',
    PROCESSING: 'PRc0_EXECUTING',
    PRc0_EXCEPTION: 'PRc0_EXCEPTION',
    PRc0_COMPLETED: 'PRc0_COMPLETED',
}