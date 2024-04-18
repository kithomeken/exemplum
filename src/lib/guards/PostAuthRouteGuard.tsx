import { useDispatch } from "react-redux";
import { useLocation, Navigate, Outlet } from "react-router";

import Auth from "./Auth";
import { useAppSelector } from "../../store/hooks";
import { revokeAuthSession } from "../../store/auth/firebaseAuthActions";

export default function PostAuthRouteGuard() {
    const dispatch: any = useDispatch();
    const location: any = useLocation();

    const currentLocation = location.pathname;
    const state = { from: currentLocation };

    const auth0 = useAppSelector(state => state.auth0);
    const sessionState = Auth.checkAuthentication(auth0);    

    if (auth0.sso) {
        if (sessionState.identity) {
            const locationState = location.state || {};
            const redirectTo = locationState.from || "/home";
            
            return <Navigate to={redirectTo} replace />;
        }
    } else {
        if (sessionState.status.resetSession) {
            dispatch(revokeAuthSession());
            return;
        } else {
            return <Navigate to="/auth/sign-in" replace state={state} />;
        }
    }

    return <Outlet />;
}
