import { Helmet } from "react-helmet"
import React, { useState } from "react"
import { Navigate } from "react-router"
import { useDispatch } from "react-redux"
import { onAuthStateChanged } from "firebase/auth"

import { ArtistHome } from "./ArtistHome"
import { ERR_404 } from "../errors/ERR_404"
import { ERR_500 } from "../errors/ERR_500"
import { AUTH } from "../../api/API_Registry"
import HttpServices from "../../services/HttpServices"
import { Loading } from "../../components/modules/Loading"
import StorageServices from "../../services/StorageServices"
import { firebaseAuth } from "../../firebase/firebaseConfigs"
import { STORAGE_KEYS } from "../../global/ConstantsRegistry"
import { setPRc0MetaStage } from "../../store/identityCheckActions"
import { commonRoutes, standardErrorRoutes } from "../../routes/routes"

export const Home = () => {
    const [state, setstate] = useState({
        verified: false,
        httpStatus: 200,
        status: 'pending',
        data: {
            PRc0: null,
            OnBD: null,
        },
        process: {
            type: '',
            state: false,
        }
    })

    const dispatch: any = useDispatch();
    const [verified, setVerified] = useState('0')

    const identityVerificationRoute: any = (
        standardErrorRoutes.find(
            (routeName) => routeName.name === 'IDENTITY_VERF_')
    )?.path

    const identityOnboardingRoute: any = (
        commonRoutes.find(
            (routeName) => routeName.name === 'IDENTITY_ONBRD_')
    )?.path

    React.useEffect(() => {
        identityProcessStateCheck()
    }, [])

    const identityProcessStateCheck = async () => {
        let { data } = state
        let { status } = state
        let { httpStatus } = state
        const PRc0State = StorageServices.getLocalStorage(STORAGE_KEYS.PRc0_STATE)
        const OnBDState = StorageServices.getLocalStorage(STORAGE_KEYS.ONBOARDING_STATUS)

        if (PRc0State === null && OnBDState === null) {
            /* 
             * Fetch PRc0 state
            */
            try {
                const metaCheckResp: any = await HttpServices.httpGet(AUTH.META_CHECK)
                httpStatus = metaCheckResp.status                

                if (metaCheckResp.data.success) {
                    data.PRc0 = metaCheckResp.data.payload.PRc0
                    data.OnBD = metaCheckResp.data.payload.OnBD
                    StorageServices.setLocalStorage(STORAGE_KEYS.ONBOARDING_STATUS, data.OnBD)

                    const metaCheckProps = {
                        dataDump: {
                            PRc0: data.PRc0,
                        }
                    }

                    dispatch(setPRc0MetaStage(metaCheckProps))

                    if (data.PRc0 === 'META_00' && data.OnBD === 'GLD') {
                        /* 
                         * Onboarding was completed.
                         * Fetch identity verification status
                        */
                        identityVerificationStatus()
                        return
                    }

                    /* 
                     * Onboarding was not completed. 
                     * Skip identity verification check. 
                     * Complete onboarding first
                    */
                    status = 'fulfilled'
                } else {
                    status = 'rejected'
                }
            } catch (error) {
                console.error(error);
                status = 'rejected'
                httpStatus = 500
            }
        } else {
            data.PRc0 = PRc0State
            data.OnBD = OnBDState

            if (data.PRc0 === 'META_00' && data.OnBD === 'GLD') {
                /* 
                 * Onboarding was completed.
                 * Fetch identity verification status
                */
                identityVerificationStatus()
                return
            }

            /* 
             * Onboarding was not completed. 
             * Skip identity verification check. 
             * Complete onboarding first
            */
            status = 'fulfilled'
        }

        setstate({
            ...state, status, data, httpStatus
        })
    }

    const identityVerificationStatus = () => {
        let { status } = state
        let { httpStatus } = state
        const accountVerified: any = StorageServices.getLocalStorage(STORAGE_KEYS.ACC_VERIFIED)

        if (accountVerified === null) {
            /* 
             * Fetch Firebase identity data for
             * verification check
            */
            onAuthStateChanged(firebaseAuth,
                currentUser => {
                    let verifiedA = currentUser.emailVerified ? '0' : '1'
                    StorageServices.setLocalStorage(STORAGE_KEYS.ACC_VERIFIED, verifiedA)

                    setVerified(verifiedA)
                    status = 'fulfilled'

                    setstate({
                        ...state, status
                    })
                },
                error => {
                    console.error(error)
                    httpStatus = 500
                    status = 'rejected'

                    setstate({
                        ...state, status, httpStatus
                    })
                }
            );

            return
        }

        setVerified(accountVerified)
        status = 'fulfilled'

        setstate({
            ...state, status
        })
    }

    return (
        <React.Fragment>
            <Helmet>
                <title>Home</title>
            </Helmet>

            {
                state.status === 'rejected' ? (
                    <div className="py-3 px-4">
                        <div className="flex items-center justify-center">
                            {
                                state.httpStatus === 404 ? (
                                    <ERR_404
                                        compact={true}
                                    />
                                ) : (
                                    <ERR_500 />
                                )
                            }
                        </div>
                    </div>
                ) : state.status === 'fulfilled' ? (
                    <>
                        {
                            state.data.PRc0 === 'META_00' && state.data.OnBD === 'GLD' ? (
                                verified === '0' ? (
                                    /* 
                                     * Identity has been verified
                                     * Proceed to artist/entity home page
                                    */
                                    <ArtistHome />
                                ) : (
                                    /* 
                                     * Identity has not been verified
                                     * Redirect to identity verification action page
                                    */
                                    <Navigate to={identityVerificationRoute} replace />
                                )
                            ) : (
                                /* 
                                 * Onboarding has not been completed. 
                                 * Complete onboarding first before any other action
                                */
                                <Navigate to={identityOnboardingRoute} replace />
                            )
                        }
                    </>
                ) : (
                    <div className="w-full h-screen -mt-20 flex flex-col justify-center align-middle items-center mx-4">
                        <Loading />
                    </div>
                )
            }
        </React.Fragment>
    )
}