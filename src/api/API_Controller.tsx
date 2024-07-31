const baseURLs = {
    API: process.env.REACT_APP_API,
    APP: process.env.REACT_APP_APP,
    FQDN: process.env.REACT_APP_FQDN,
};

export const API_Controller = () => {
    return baseURLs;
};

export const { FQDN, API, APP } = API_Controller();
export const API_DOMAIN = API;