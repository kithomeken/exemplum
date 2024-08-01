import React from 'react';
import { Navigate } from 'react-router';

import Crypto from '../../security/Crypto';
import StorageServices from '../../services/StorageServices';
import { STORAGE_KEYS } from '../../global/ConstantsRegistry';
import { administrativeRoutes, standardRoutes } from '../../routes/routes';

export const IdentityCheck = () => {
    const encryptedKeyString = StorageServices.getLocalStorage(STORAGE_KEYS.ACCOUNT_DATA);

    if (!encryptedKeyString) {
        return <Navigate to="/auth/sign-in" replace />;
    }

    const storageObject = JSON.parse(encryptedKeyString);
    let identityData = Crypto.decryptDataUsingAES256(storageObject);
    identityData = JSON.parse(identityData);

    const homeRoute = identityData.type === 'A' 
        ? administrativeRoutes.find(route => route.name === 'CORE_HOME_')?.path 
        : standardRoutes.find(route => route.name === 'PERIPH_HOME_')?.path

    return <Navigate to={homeRoute} replace />;
};