import React from "react";

import { Yeat } from "../views/home/Yeat";
import { Home } from "../views/home/Home";
import { SignIn } from "../views/auth/SignIn";
import { SignUp } from "../views/auth/SignUp";
import { Entity } from "../views/settings/Entity";
import { PreFlight } from "../views/auth/PreFlight";
import { Invitation } from "../views/auth/Invitation";
import { EntityPayIn } from "../views/home/EntityPayIn";
import { AllEntities } from "../views/admin/AllEntities";
import { EmailActions } from "../views/auth/EmailActions";
import { IdentityCheck } from "../views/home/IdentityCheck";
import { ChangeEmail } from "../views/settings/ChangeEmail";
import { RedirectToHome } from "../views/home/RedirectToHome";
import { UserManagement } from "../views/admin/UserManagement";
import { PreflightCheck } from "../views/admin/PreflightCheck";
import { EntityProfile } from "../views/settings/EntityProfile";
import { MpesaExceptions } from "../views/admin/MpesaExceptions";
import { Routes_Interface } from "../lib/modules/routesInterface";
import { PasswordRecovery } from "../views/auth/PasswordRecovery";
import { TransactionPayIn } from "../views/admin/TransactionPayIn";
import { AccountSuspended } from "../views/errors/AccountSuspended";
import { PostAuthentication } from "../views/auth/PostAuthentication";
import { IdentityOnboarding } from "../views/home/IdentityOnboarding";
import { OnboardingRequests } from "../views/admin/OnboardingRequests";
import { TransactionPayOuts } from "../views/admin/TransactionPayOuts";
import { WithdrawalRequests } from "../views/admin/WithdrawalRequests";
import { AccountManagement } from "../views/settings/AccountManagement";
import { IdentityVerification } from "../views/home/IdentityVerification";

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
        path: "/auth/password-recovery",
        element: <PasswordRecovery />,
        caseSensitive: true,
        name: 'FORGOT_PWD_'
    },
    {
        path: "/auth/invitation/:hash",
        element: <Invitation />,
        caseSensitive: true,
        name: 'AUTH_INVITE_'
    },
    {
        path: "/pre-flight/check",
        element: <PreFlight />,
        caseSensitive: true,
        name: 'PREFLIGHT_'
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
    {
        path: "/yeat",
        element: <Yeat />,
        caseSensitive: true,
        name: 'YEAT_'
    },

]

export const standardRoutes: Array<Routes_Interface> = [
    {
        path: "/u/artist/home",
        element: <Home />,
        caseSensitive: true,
        name: 'PERIPH_HOME_'
    },
]

export const standardErrorRoutes: Array<Routes_Interface> = [
    {
        path: "/u/artist/_/identity/account-suspended",
        element: <AccountSuspended />,
        caseSensitive: true,
        name: 'SUSP_ACC'
    },
    {
        path: "/u/artist/_/identity/account-verification",
        element: <IdentityVerification />,
        caseSensitive: true,
        name: 'IDENTITY_VERF_'
    },
]

export const standardSettingsRoutes: Array<Routes_Interface> = [
    {
        path: "/u/settings/account/profile",
        element: <AccountManagement />,
        activeMenu: 'Y',
        caseSensitive: true,
        name: 'CNF_ACC_ID_'
    },
    {
        path: "/u/settings/entity/profile",
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

export const administrativeRoutes: Array<Routes_Interface> = [
    {
        path: "/default/a/home",
        element: <PreflightCheck />,
        activeMenu: 'N',
        caseSensitive: true,
        name: 'CORE_HOME_'
    },
    {
        path: "/default/a/onboarding/requests",
        element: <OnboardingRequests />,
        activeMenu: 'N',
        caseSensitive: true,
        name: 'CORE_ONBOARDING_'
    },
    {
        path: "/default/a/onboarding/entities",
        element: <AllEntities />,
        activeMenu: 'N',
        caseSensitive: true,
        name: 'CORE_ENTITIES_'
    },
    {
        path: "/default/a/onboarding/user-management",
        element: <UserManagement />,
        activeMenu: 'N',
        caseSensitive: true,
        name: 'CORE_USERS_'
    },
    {
        path: "/default/a/payments/requests",
        element: <WithdrawalRequests />,
        activeMenu: 'N',
        caseSensitive: true,
        name: 'CORE_PAYMENTS_'
    },
    {
        path: "/default/a/transactions/payouts",
        element: <TransactionPayOuts />,
        activeMenu: 'N',
        caseSensitive: true,
        name: 'CORE_TXN_PAYOUTS_'
    },
    {
        path: "/default/a/transactions/contributions",
        element: <TransactionPayIn />,
        activeMenu: 'N',
        caseSensitive: true,
        name: 'CORE_TXN_PAYIN_'
    },
    {
        path: "/default/a/core/mpesa/exceptions",
        element: <MpesaExceptions />,
        activeMenu: 'N',
        caseSensitive: true,
        name: 'CORE_MPESA_EXCS_'
    },
]
