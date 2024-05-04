const baseURLs = {
    development: {
        FQDN: 'https://api.bigfan.theapplication.online',
        API: 'https://api.bigfan.theapplication.online/api',
        APP: 'https://bigfan.theapplication.online'
    },
    production: {
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