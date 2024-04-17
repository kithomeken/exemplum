import React from "react"
import { Helmet } from "react-helmet"
import { Navigate } from "react-router"

export const RedirectToHome = () => {
    const homeRoute = '/home'
    return (
        <React.Fragment>
            <Helmet>
                redirecting...
            </Helmet>
            
            <Navigate replace to={homeRoute} />
        </React.Fragment>
    )
}