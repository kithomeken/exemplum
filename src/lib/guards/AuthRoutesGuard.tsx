import { useDispatch } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router';

import Auth from './Auth';
import { useAppSelector } from '../../store/hooks';
import { standardErrorRoutes } from '../../routes/errorRoutes';
import { revokeAuthSession } from '../../store/auth/firebaseAuthActions';

export default function AuthRoutesGuard() {
    const location:any = useLocation();
    const dispatch: any = useDispatch();

    const auth0 = useAppSelector(state => state.auth0);
    const sessionState = Auth.checkAuthentication(auth0);

    if (!sessionState.authenticated) {
        if (sessionState.status.resetSession) {
            /* 
             * Redux session state is authenticated
             * but cookies are not set.
             * 
             * Reset session and start all-over again
            */
            dispatch(revokeAuthSession());
        }
    } else {
        if (!sessionState.identity) {
            /* 
             * Redux session state is authenticated
             * but cookies are not set.
             * 
             * Reset session and start all-over again
            */
            dispatch(revokeAuthSession());
            return null;
        }

        if (sessionState.status.disabled) {
            const suspendAccountRoute = standardErrorRoutes.find((route: any) => route.name === 'SUSP_ACC')?.path;
            return <Navigate to={suspendAccountRoute} replace />;
        }

        const locationState = location.state;
        const redirectTo = locationState ? locationState.from : '/home';
        return <Navigate to={redirectTo} replace />;
    }

    return <Outlet />;
}
