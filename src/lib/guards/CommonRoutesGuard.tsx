import React from "react";
import { useDispatch } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

import Auth from "./Auth";
import { useAppSelector } from "../../store/hooks";
import { standardErrorRoutes } from "../../routes/routes";
import { revokeAuthSession } from "../../store/auth/firebaseAuthActions";

const CommonRoutesGuard = () => {
    const dispatch: any = useDispatch();
    const auth0 = useAppSelector(state => state.auth0);
    const sessionState = Auth.checkAuthentication(auth0);

    if (!sessionState.authenticated) {
        if (sessionState.status.resetSession) {
            dispatch(revokeAuthSession());
            return null;
        } else {
            return <Navigate to="/auth/sign-in" replace />;
        }
    } else {
        if (sessionState.status.disabled) {
            const suspendAccountRoute: any = (
                standardErrorRoutes.find(
                    (routeName) => routeName.name === 'SUSP_ACC')
            )?.path

            return <Navigate to={suspendAccountRoute} replace />;
        }
    }

    return <Outlet />;
};

export default CommonRoutesGuard;