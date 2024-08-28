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
    PFg0_STATE:         '__bgfPFg0',
    ACCOUNT_DATA:       '__bgfAc1D',
    ENCRYPTION_KEY:     '__bgfKYc0',
    ENCRYPTION_IV:      '__bgfC0iV',
    ACC_VERIFIED:       '__bgf3vRF',
    ONBOARDING_STATUS:  '__bgf0nBg',
    PFg0_OVERRIDE:      '__bgf0PFg1',
    PRc0_OVERRIDE:      '__bgf0PRc1',

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
    MAIL_VRF:   '__bgfXRs0',
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
    PRc0:               'PRc0_SET',
    RESET_:             'PRc0_RESET',
    PRc0_OVRD:          'PRc0_OVRD',
    PRc0_UPDATE:        'PRc0_UPDATE',
    PROCESSING:         'PRc0_EXECUTING',
    PRc0_EXCEPTION:     'PRc0_EXCEPTION',
    PRc0_COMPLETED:     'PRc0_COMPLETED',
}

export const PREFLIGHT_ = {
    PFg0:               'PFg0_SET',
    RESET_:             'PFg0_RESET',
    PFg0_FIN:           'PFg0_FIN',
    PFg0_OVRD:          'PFg0_OVRD',
    PFg0_UPDATE:        'PFg0_UPDATE',
    PROCESSING:         'PFg0_EXECUTING',
    PFg0_EXCEPTION:     'PFg0_EXCEPTION',
    CKPIT_TOKEN:        'CKPIT_TOKEN',
    CKPIT_EXECPTION:    'CKPIT_EXECPTION',
}