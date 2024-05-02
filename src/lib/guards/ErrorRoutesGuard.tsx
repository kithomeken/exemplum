import React from "react";
import { useDispatch } from "react-redux";
import { Navigate, Outlet } from "react-router";

import Auth from "./Auth";
import { useAppSelector } from "../../store/hooks";
import { revokeAuthSession } from "../../store/auth/firebaseAuthActions";
import { CONFIG_MARGIN_TOP } from "../../global/ConstantsRegistry";
import { Header } from "../../components/layouts/Header";

export default function ErrorRoutesGuard() {
    const dispatch: any = useDispatch();
    const auth0 = useAppSelector(state => state.auth0);
    const sessionState = Auth.checkAuthentication(auth0);

    if (!sessionState.authenticated) {
        if (sessionState.status.resetSession) {
            dispatch(revokeAuthSession());
            return;
        } else {
            return <Navigate to="/auth/sign-in" replace />;
        }
    }

    return <Outlet />
}
