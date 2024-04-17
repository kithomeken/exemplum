import React from "react";
import { useDispatch } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import Auth from "./Auth";
import { useAppSelector } from "../../store/hooks";
import { Header } from "../../components/layouts/Header";
import StorageServices from "../../services/StorageServices";
import { standardErrorRoutes } from "../../routes/errorRoutes";
import { revokeAuthSession } from "../../store/auth/firebaseAuthActions";
import { CONFIG_MARGIN_TOP, STORAGE_KEYS } from "../../global/ConstantsRegistry";

const StandardRoutesGuard = () => {
    const location: any = useLocation();
    const dispatch: any = useDispatch();
    const { pathname: currentLocation } = location;

    const auth0 = useAppSelector((state) => state.auth0);
    const sessionState = Auth.checkAuthentication(auth0);

    if (!sessionState.authenticated) {
        if (sessionState.status.resetSession) {
            dispatch(revokeAuthSession());
            return null;
        } else {
            return <Navigate to="/auth/sign-in" replace state={{ from: currentLocation }} />;
        }
    } else {
        if (sessionState.status.disabled) {
            const suspendAccountRoute: any = (
                standardErrorRoutes.find(
                    (routeName) => routeName.name === 'SUSP_ACC')
            )?.path

            return <Navigate to={suspendAccountRoute} replace />;
        }

        const accountVerified = StorageServices.getLocalStorage(STORAGE_KEYS.ACC_VERIFIED);

        if (accountVerified === '1') {
            const identityVerificationRoute: any = (
                standardErrorRoutes.find(
                    (routeName) => routeName.name === 'IDENTITY_VERF_')
            )?.path

            return <Navigate to={identityVerificationRoute} replace />;
        }
    }

    return (
        <div>
            <div className="flex h-screen">
                <Header />
                <div className="flex flex-col w-full h-screen">
                    <div className="w-full overflow-y-auto" style={CONFIG_MARGIN_TOP}>
                        <div className="kiOAkj">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StandardRoutesGuard;