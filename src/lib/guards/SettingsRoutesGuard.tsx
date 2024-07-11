import React from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import Auth from "./Auth";
import { useAppSelector } from "../../store/hooks";
import { classNames } from "../modules/HelperFunctions";
import { Header } from "../../components/layouts/Header";
import StorageServices from "../../services/StorageServices";
import { revokeAuthSession } from "../../store/auth/firebaseAuthActions";
import { APPLICATION, CONFIG_MARGIN_TOP, STORAGE_KEYS, STYLE } from "../../global/ConstantsRegistry";
import { standardErrorRoutes, standardSettingsRoutes } from "../../routes/routes";

export default function SettingsRoutesGuard() {
    const location: any = useLocation();
    const dispatch: any = useDispatch();

    const currentLocation = location.pathname;
    const state = { from: currentLocation };

    const auth0 = useAppSelector((state) => state.auth0);
    const sessionState = Auth.checkAuthentication(auth0);

    if (!sessionState.authenticated) {
        if (sessionState.status.resetSession) {
            dispatch(revokeAuthSession());
            return;
        } else {
            return <Navigate to="/auth/sign-in" replace state={state} />;
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

        if (accountVerified === "1") {
            const identityVerificationRoute: any = (
                standardErrorRoutes.find(
                    (routeName) => routeName.name === 'IDENTITY_VERF_')
            )?.path

            return <Navigate to={identityVerificationRoute} replace />;
        }
    }

    const settingsRoutes = (route: any) => {
        const configRoute: any = (
            standardSettingsRoutes.find(
                (routeName) => routeName.name === route)
        )?.path

        return configRoute;
    };

    const routePs0t = (targetRoute: any) => {
        for (const item of standardSettingsRoutes) {
            if (item.path && targetRoute.startsWith(item.path)) {
                return item.name;
            }
        }
        return null;
    };

    const Ps0tMenuLink = (menu: any, sT0: any) => {
        const Ps0t = routePs0t(location.pathname);
        return (
            <Link
                to={settingsRoutes(sT0)}
                className={classNames(
                    Ps0t === sT0
                        ? "text-orange-700 bg-orange-100"
                        : "text-slate-700 hover:bg-slate-100",
                    "text-sm items-center w-full text-left py-2 px-6 rounded-md my-1"
                )}
            >
                <span className="flex flex-row align-middle items-center">
                    <span className="flex-auto">{menu}</span>
                </span>
            </Link>
        );
    };

    return (
        <div>
            <div className="flex h-screen">

                <Header />

                <div className="flex flex-col w-full h-screen mx-auto" style={STYLE.MAX_WIDTH}>
                    <div className="w-full flex-grow py-3 pt-16" style={CONFIG_MARGIN_TOP}>
                        <main className="h-full px-4 overflow-y-auto">
                            <div className="h-full mx-auto pb-16 px-2 py-2">

                                <Outlet />

                                <div className="mx-auto md:py-4 py-6 text-center block w-full">
                                    <p className="text-sm text-stone-500 pb-4">
                                        <span className="text-orange-600">{APPLICATION.NAME}</span> © {new Date().getFullYear()}.
                                        Elevated Acts of Appreciation, <span className="text-orange-600 block">Tip by Tip.</span>
                                    </p>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </div>
    );
}
