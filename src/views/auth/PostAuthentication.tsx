import { Helmet } from "react-helmet"
import React, { useEffect } from "react"
import { useDispatch } from "react-redux"
import { onAuthStateChanged } from "firebase/auth"
import { useAppSelector } from "../../store/hooks"
import { useLocation, Navigate } from "react-router"

import { Loading } from "../../components/modules/Loading"
import { firebaseAuth } from "../../firebase/firebaseConfigs"
import { DeviceInfo } from "../../lib/modules/HelperFunctions"
import { generateSanctumToken } from "../../store/auth/firebaseAuthActions"

export const PostAuthentication = () => {
    useEffect(() => {
        postFirebaseAuthentication()
    }, [])

    const location = useLocation()
    const dispatch: any = useDispatch();
    const auth0: any = useAppSelector(state => state.auth0)

    const postAuthProps = {
        deviceInfo: DeviceInfo(),
    }

    const postFirebaseAuthentication = () => {
        onAuthStateChanged(firebaseAuth,
            currentUser => {
                if (currentUser === null) {
                    return
                }

                const firebaseUser: any = currentUser
                generateSanctumToken(dispatch, firebaseUser.accessToken, postAuthProps)
            },
            error => {
                console.error(error)
            }
        );
    }

    if (auth0.identity !== null && auth0.authenticated) {
        const locationState: any = location.state        

        if (locationState?.from === undefined) {
            return <Navigate replace to="/home" />
        } else {
            return <Navigate replace to={locationState.from} />
        }
    }

    return (
        <React.Fragment>
            <Helmet>
                <title>Redirecting... </title>
            </Helmet>

            <div className="wrapper">
                <section className="gx-container">
                    <Loading />
                </section>
            </div>
        </React.Fragment>
    )
}