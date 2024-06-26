import { API_Controller } from "../api/API_Controller"

export const CONFIG_MAX_WIDTH = { maxWidth: '1024px' }
export const CONFIG_MARGIN_TOP = { marginTop: '64px' }

export const STYLE = {
    MAX_WIDTH:  { maxWidth: '1024px' },
    MARGIN_TOP: { marginTop: '64px' }
}

/*
* Application Constants
* */
export const APPLICATION = {
    NAME:       'Big Fan',
    THEME:      '#F59E0B',
    URL:        API_Controller().APP,
    ERR_MSG:    'There was an error processing your request.'
}


/*
* Local Storage Keys
*/
export const STORAGE_KEYS = {
    PRc0_STATE:         '__bgfPRc0',
    ACCOUNT_DATA:       '__bgfAc1D',
    ENCRYPTION_KEY:     '__bgfKYc0',
    ENCRYPTION_IV:      '__bgfC0iV',
    ACC_VERIFIED:       '__bgf3vRF',
    ONBOARDING_STATUS:  '__bgf0nBg',

    FIREBASE_RFSH:      '__RfhS',
    ENTITY_TYPE:        '__enTY',
    ENTITY_HASH:        '__enHS',
}


/*
* Secure Cookie Keys
* */
export const COOKIE_KEYS = {
    UAID:       '__bgfUa1D',
    SANCTUM:    '__bgfSnC7',
    OPTIONS:    { path: '/', secure: true, sameSite: 'none' },
}


export const AUTH_ = {
    RESET_:             'RESET',
    PROCESSING:         'PROCESSING',
    SANCTUM_TOKEN:      'SANCTUM_TOKEN',
    REVOKE_SESSION:     'REVOKE_SESSION',
    FIREBASE_TOKEN:     'FIREBASE_TOKEN',
    SANCTUM_EXCEPTION:  'SANCTUM_EXCEPTION',
    FIREBASE_EXCEPTION: 'FIREBASE_EXCEPTION',

    ID_META_01:         'ID_META_01',
    ID_META_02:         'ID_META_02',
    ID_META_03:         'ID_META_03',
}


export const IDENTITY_ = {
    PRc0:           'PRc0_SET',
    RESET_:         'PRc0_RESET',
    PRc0_UPDATE:    'PRc0_UPDATE',
    PROCESSING:     'PRc0_EXECUTING',
    PRc0_EXCEPTION: 'PRc0_EXCEPTION',
    PRc0_COMPLETED: 'PRc0_COMPLETED',
}