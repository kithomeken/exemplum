
export const AUTH_SIGN_IN = '/v1/account/auth/sign-in';
export const AUTH_SIGN_OUT = '/v1/account/auth/0-token/invalidate';
export const AUTH_FORGOT_PASSWORD = '';
export const CSRF_COOKIE_ROUTE = '/sanctum/csrf-cookie';

/***************************
* Authentication API Routes
***************************/

export const AUTH = {
    FIREBASE_SSO: '/v1/identity/auth/firebase-sso',
    META_CHECK:   '/v1/identity/account/meta/check',
    PRE_META_01:  '/v1/identity/account/meta/identifier/check',
    PRE_META_03:  '/v1/identity/account/meta/artist_name/check',
    ID_META_01:   '/v1/identity/account/meta/display_name',
    ID_META_02:   '/v1/identity/account/meta/msisdn',
    ARTIST_TYPES: '/v1/identity/account/meta/artist/types',
    ID_META_03:   '/v1/identity/account/meta/artist',
    ENTITY_EXPANSION: '/v1/identity/account/meta/entity/expansion'
};

export const SIGN_UP = {
    ONBOARD: '/v1/account/auth/sign-up',
    CHECK_EMAIL: '/v1/account/auth/sign-up/check/email',
    CHECK_IDENTIFIER: '/v1/account/auth/sign-up/check/identifier',
    CHECK_STAGE_NAME: '/v1/account/auth/sign-up/check/stage-name',
    ACCOUNT_ACTIVATION: '/u/account/:uuid/email/verification/:hash'
};

/***************************
* Account Profile API Routes
***************************/

export const ACCOUNT = {
    PROFILE: '/v1/account/auth/profile',
    ARTIST_DETAILS: '/v1/account/artist/details',
    STK_PUSH_NOFITICATION: '/v1/contribution/stk-push/notification',
    MONEY_IN_TRANSACTIONS: '/v1/account/entity/mpesa/transactions/list/money-in',
    MONEY_OUT_TRANSACTIONS: '/v1/account/entity/mpesa/transactions/list/money-out',
    VALIDATE_WITHDRAWAL: '/v1/account/entity/mpesa/transactions/withdrawal/check',
    REQUEST_WITHDRAWAL: '/v1/account/entity/mpesa/transactions/withdrawal/request',
    REQUEST_APPROVAL: '/v1/account/entity/mpesa/transactions/withdrawal/request/:request/approve',
    REQUEST_REJECTION: '/v1/account/entity/mpesa/transactions/withdrawal/request/:request/reject',
    // Other routes to be reviewed later on
};

/***************************
* Admin API Routes
***************************/

export const ADMINISTRATION = {
    DASH_METRICS: '/v1/admin/mertics/earned-commissions',
    TOP_ACTIVE_ENT: '/v1/admin/mertics/entities/top-active',
    OTHER_STATISCAL: '/v1/admin/mertics/statistics/others',
    DISBURSED_FNDS: '/v1/admin/mertics/statistics/funds/disbursed',
    ALL_REQUETS: '/v1/admin/onboarding/requests/all',
    REQUETS_DETAILS: '/v1/admin/onboarding/requests/:uuid',
    ACTION_REQUETS: '/v1/admin/onboarding/requests/:uuid/action',
    ALL_ENTITIES: '/v1/admin/onboarding/entities',
    ALL_USERS: '/v1/admin/onboarding/users-management',
    USER_DETAILS: '/v1/admin/onboarding/users-management/:uuid',
    SUSPEND_USER: '/v1/admin/onboarding/users-management/:uuid/suspend',
    REINSTATE_USER: '/v1/admin/onboarding/users-management/:uuid/reinstate',
    MPESA_EXCEPTIONS: '/v1/admin/payments/mpesa/exceptions',
    ALL_PAYMENTS: '/v1/admin/payments/requests/all',
    PAYMENT_DETAILS: '/v1/admin/payments/requests/:uuid',
    PAYMENT_ACTION: '/v1/admin/payments/requests/:uuid/action',
    TXN_PAYOUTS: '/v1/admin/payments/transactions/payouts/all',
    TXN_PAYIN: '/v1/admin/payments/transactions/payin/all',
    SRCH_USERS: '/v1/admin/onboarding/users-management/search'
};

/***************************
* Access Control API Routes
***************************/

export const ACCESS_CONTROL = {
    CHECK_AUTHORIZATION: ''
};
