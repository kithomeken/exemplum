const baseURLs = {
    development: {
        FQDN: 'https://api.bigfan.theapplication.online',
        API: 'https://api.bigfan.theapplication.online/api',
        APP: 'https://bigfan.theapplication.online'
    },
    production: process.env.PROD_LVL === '0' ? {
        FQDN: 'https://api-vrs.bigfan.co.ke',
        API: 'https://api-vrs.bigfan.co.ke/api',
        APP: 'https://bigfan.co.ke'
    } : {
        FQDN: 'https://api.bigfan.theapplication.online',
        API: 'https://api.bigfan.theapplication.online/api',
        APP: 'https://bigfan.theapplication.online'
    }
};

export const API_Controller = () => {
    const environment = process.env.NODE_ENV === 'production' ? 'production' : 'development';
    return baseURLs[environment];
};

export const { FQDN, API, APP } = API_Controller();
export const API_DOMAIN = API;