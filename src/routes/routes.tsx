import { Home } from "../views/home/Home";
import { SignIn } from "../views/auth/SignIn";
import { SignUp } from "../views/auth/SignUp";
import { Entity } from "../views/settings/Entity";
import { Invitation } from "../views/auth/Invitation";
import { EntityPayIn } from "../views/home/EntityPayIn";
import IdentityCheck from "../views/home/IdentityCheck";
import { EmailActions } from "../views/auth/EmailActions";
import { ChangeEmail } from "../views/settings/ChangeEmail";
import { RedirectToHome } from "../views/home/RedirectToHome";
import { EntityProfile } from "../views/settings/EntityProfile";
import { Routes_Interface } from "../lib/modules/routesInterface";
import { PostAuthentication } from "../views/auth/PostAuthentication";
import { IdentityOnboarding } from "../views/home/IdentityOnboarding";
import { IdentityVerification } from "../views/home/IdentityVerification";
import { AccountManagement } from "../views/settings/AccountManagement";

export const authenticationRoutes: Array<Routes_Interface> = [
    {
        path: "/auth/sign-in", 
        element: <SignIn />, 
        caseSensitive: true, 
        name: 'SIGN_IN_' 
    },
    {
        path: "/auth/sign-up", 
        element: <SignUp />, 
        caseSensitive: true, 
        name: 'SIGN_UP_' 
    },
    { 
        path: "/auth/invitation/:hash", 
        element: <Invitation />, 
        caseSensitive: true, 
        name: 'AUTH_INVITE_' 
    },
]

export const postAuthRoutes: Array<Routes_Interface> = [
    { 
        path: "/auth/_/identity/check", 
        element: <PostAuthentication />, 
        caseSensitive: true, 
        name: 'AUTH_IDENTITY_' 
    },
]

export const commonRoutes: Array<Routes_Interface> = [
    { 
        path: "/", 
        element: <RedirectToHome />, 
        caseSensitive: true, 
        name: 'INDEX_' 
    },
    {
        path: "/home",
        element: <IdentityCheck />,
        caseSensitive: true,
        name: 'HOME_'
    },
    { 
        path: "/u/artist/_/identity/onboarding", 
        element: <IdentityOnboarding />, 
        caseSensitive: true, 
        name: 'IDENTITY_ONBRD_' 
    },
]

export const genericRoutes: Array<Routes_Interface> = [
    {
        path: "_/auth/action/email",
        element: <EmailActions />,
        caseSensitive: true,
        name: 'EMAIL_ACTION_'
    },
    {
        path: "/entity/:uuid",
        element: <EntityPayIn />,
        caseSensitive: true,
        name: 'ENTITY_0_'
    },
]

export const standardRoutes: Array<Routes_Interface> = [
    { 
        path: "/u/artist/home", 
        element: <Home />, 
        caseSensitive: true, 
        name: 'PERIPH_HOME_' 
    },
    { 
        path: "/u/default/account/profile", 
        element: <AccountManagement />, 
        caseSensitive: true, 
        name: 'ACCOUNT_PROFILE' 
    },
]

export const standardErrorRoutes: Array<Routes_Interface> = [
    { 
        path: "/u/artist/_/identity/account-verification", 
        element: <IdentityVerification />, 
        caseSensitive: true, 
        name: 'IDENTITY_VERF_' 
    },
]

export const administrativeRoutes: Array<Routes_Interface> = [

]

export const standardSettingsRoutes: Array<Routes_Interface> = [
    {
        path: "/u/settings/account/profile", 
        element: <EntityProfile />, 
        activeMenu: 'Y', 
        caseSensitive: true, 
        name: 'CNF_ACC_ID_' 
    },
    {
        path: "/u/settings/email/change", 
        element: <ChangeEmail />, 
        activeMenu: 'Y', 
        caseSensitive: true, 
        name: 'CNF_EMAIL_CHNG_' 
    },
    {
        path: "/u/settings/entity", 
        element: <Entity />, 
        activeMenu: 'Y', 
        caseSensitive: true, 
        name: 'CNF_ENTITY_' 
    },
]