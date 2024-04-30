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
import { CONFIG_MARGIN_TOP, STORAGE_KEYS } from "../../global/ConstantsRegistry";
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
                        ? "text-amber-700 bg-amber-100"
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

                <div className="flex flex-col w-full h-screen">
                    <div className="w-full overflow-y-auto" style={CONFIG_MARGIN_TOP}>
                        <div className="kiOAkj">
                            <div className="flex flex-col w-full md:flex-row overflow-hidden">
                                <div className="flex-shrink-0 w-full md:w-56">
                                    <div className="p-4">
                                        <h1 className="text-xl text-stone-600 font-medium tracking-wider">
                                            Settings
                                        </h1>
                                    </div>

                                    <nav className="flex flex-col px-3">
                                        {Ps0tMenuLink("Account Profile", "CNF_ACC_ID_")}
                                        {Ps0tMenuLink("Change Email", "CNF_EMAIL_CHNG_")}
                                        {Ps0tMenuLink("Entity", "CNF_ENTITY_")}
                                    </nav>
                                </div>

                                <div className="flex-1 overflow-hidden py-3 h-screen pt-20 -mt-16">
                                    <main className="flex-1 h-full px-4 overflow-y-auto border-gray-200 md:border-l">
                                        <div className="container h-full mx-auto border-t md:border-t-0 pb-16 px-2 py-2">

                                            <Outlet />

                                        </div>
                                    </main>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
