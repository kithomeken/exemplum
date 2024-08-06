import { Helmet } from "react-helmet"
import React, { useEffect } from "react"
import { useDispatch } from "react-redux"
import { onAuthStateChanged } from "firebase/auth"
import { useLocation, Navigate } from "react-router"

import { useAppSelector } from "../../store/hooks"
import { Loading } from "../../components/modules/Loading"
import { firebaseAuth } from "../../firebase/firebaseConfigs"
import { DeviceInfo } from "../../lib/modules/HelperFunctions"
import {
    beneficiarySanctumToken,
    benefactorSanctumToken,
    preflightCockpitToken
} from "../../store/auth/firebaseAuthActions"

export const PostAuthentication = () => {
    useEffect(() => {
        postFirebaseAuthentication()
    }, [])

    const location = useLocation()
    const dispatch: any = useDispatch();

    const locationState: any = location.state
    const auth0: any = useAppSelector(state => state.auth0)

    const postFirebaseAuthentication = () => {
        onAuthStateChanged(firebaseAuth,
            currentUser => {
                if (currentUser === null) {
                    return
                }

                const firebaseUser: any = currentUser
                let ssoTokens: any = {
                    deviceInfo: DeviceInfo(),
                }

                if (locationState?.cockpit_SSO) {
                    /* 
                     * Pre-flight firebase SSO
                     */
                    preflightCockpitToken(dispatch, firebaseUser.accessToken, ssoTokens)
                } else {
                    if (locationState?.beneficiary) {
                        const beneficiary = locationState?.beneficiary
                        ssoTokens.beneficiary = beneficiary
                        
                        beneficiarySanctumToken(dispatch, firebaseUser.accessToken, ssoTokens)
                    } else {
                        benefactorSanctumToken(dispatch, firebaseUser.accessToken, ssoTokens)
                    }
                }
            },
            error => {
                console.error(error)
            }
        );
    }

    if (auth0.identity !== null && auth0.authenticated) {
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

            <div className="w-full h-screen flex flex-col justify-center align-middle items-center">
                <Loading />
            </div>
        </React.Fragment>
    )
}