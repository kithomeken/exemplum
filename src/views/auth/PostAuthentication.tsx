import { Helmet } from "react-helmet"
import React, { useEffect } from "react"
import { useDispatch } from "react-redux"
import { onAuthStateChanged } from "firebase/auth"
import { useAppSelector } from "../../store/hooks"
import { useLocation, Navigate } from "react-router"

import { Loading } from "../../components/modules/Loading"
import { firebaseAuth } from "../../firebase/firebaseConfigs"
import { DeviceInfo } from "../../lib/modules/HelperFunctions"
import { beneficiarySanctumToken, benefactorSanctumToken } from "../../store/auth/firebaseAuthActions"

export const PostAuthentication = () => {
    useEffect(() => {
        postFirebaseAuthentication()
    }, [])

    const location = useLocation()
    const dispatch: any = useDispatch();

    const locationState: any = location.state
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
                if (locationState?.beneficiary) {
                    const beneficiaryProps = {
                        deviceInfo: DeviceInfo(),
                        beneficiary: locationState?.beneficiary,
                    }

                    beneficiarySanctumToken(dispatch, firebaseUser.accessToken, beneficiaryProps)
                } else {
                    benefactorSanctumToken(dispatch, firebaseUser.accessToken, postAuthProps)
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