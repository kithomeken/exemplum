const baseURLs = {
    development: {
        FQDN: 'http://localhost:81/tippy/public',
        API: 'http://localhost:81/tippy/public/api',
        APP: 'http://localhost:3000'
    },
    production: {
        FQDN: 'https://api.theapplication.online',
        API: 'https://bigfan.theapplication.online/api',
        APP: 'https://bigfan.theapplication.online'
    }
};

export const API_Controller = () => {
    const environment = process.env.NODE_ENV === 'production' ? 'production' : 'development';
    return baseURLs[environment];
};

export const { FQDN, API, APP } = API_Controller();
export const API_DOMAIN = API;