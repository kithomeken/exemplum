import React from "react";
import { Home } from "../views/Home";
import { SignIn } from "../views/auth/SignIn";
import { SignUp } from "../views/auth/SignUp";
import { Routes_Interface } from "../lib/modules/routesInterface";
import { Index } from "../views/Index";

export const authenticationRoutes: Array<Routes_Interface> = [
    { 
        path: "/", 
        element: <Index />, 
        caseSensitive: true, 
        name: 'IDX_' 
    },
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