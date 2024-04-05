import React from "react";
import { Home } from "../views/Home";
import { SignIn } from "../views/SignIn";
import { SignUp } from "../views/SignUp";

interface Routes_Interface {
    name: string,
    path: string;
    element: any;
    activeMenu?: string;
    caseSensitive?: boolean;
    meta?: {
        resource?: string;
        action?: string;
    };
}

export const authRoutes: Array<Routes_Interface> = [
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
]

export const standardRoutes: Array<Routes_Interface> = [
    { 
        path: "/home", 
        element: <Home />, 
        caseSensitive: true, 
        name: 'HOME_' 
    },
]