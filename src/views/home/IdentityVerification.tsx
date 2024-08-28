import { toast } from "react-toastify"
import React, { useState } from "react"
import { useDispatch } from "react-redux"
import { Navigate } from "react-router-dom"
import { onAuthStateChanged, sendEmailVerification } from "firebase/auth"

import { ERR_404 } from "../errors/ERR_404"
import { ERR_500 } from "../errors/ERR_500"
import { standardRoutes } from "../../routes/routes"
import { Loading } from "../../components/modules/Loading"
import CookieServices from "../../services/CookieServices"
import StorageServices from "../../services/StorageServices"
import { firebaseAuth } from "../../firebase/firebaseConfigs"
import { revokeAuthSession } from "../../store/auth/firebaseAuthActions"
import invitation from "../../assets/images/1bb38b1912d0c7dbfb5b02cb3d30e0ad.svg"
import { APPLICATION, CONFIG_MAX_WIDTH, COOKIE_KEYS, STORAGE_KEYS } from "../../global/ConstantsRegistry"

export const IdentityVerification = () => {
    const [state, setstate] = useState({
        verified: false,
        httpStatus: 200,
        status: 'pending',
        process: {
            type: '',
            state: false,
        }
    })

    const dispatch: any = useDispatch()
    const [verified, setVerified] = useState('0')

    const homePeripheralRoute: any = (
        standardRoutes.find(
            (routeName) => routeName.name === 'PERIPH_HOME_')
    )?.path

    React.useEffect(() => {
        identityVerificationStatus()
    }, [])

    const identityVerificationStatus = () => {
        let { status } = state
        let { httpStatus } = state

        /* 
         * Fetch Firebase identity data for
         * verification check
        */
        onAuthStateChanged(firebaseAuth,
            currentUser => {
                let verifiedA = '0'

                if (!currentUser.emailVerified) {
                    /* 
                     * Send a mail verification email
                     * Set the coookie after it has sent verification mail
                     * Remove the cookie after the verification
                    */

                    verifiedA = '1'
                    const RSN_ = CookieServices.get(COOKIE_KEYS.MAIL_VRF)

                    if (RSN_ === undefined || RSN_ === null) {
                        sendEmailVerification(firebaseAuth.currentUser)
                            .then(() => {
                                console.log('Email verification sent');
                                CookieServices.setTimed(COOKIE_KEYS.MAIL_VRF, 'RSN_', 20, COOKIE_KEYS.OPTIONS)
                            })
                            .catch((error) => {
                                console.log(error);

                                toast.error('Something went wrong. Kindly try again later', {
                                    position: "top-right",
                                    autoClose: 5000,
                                    hideProgressBar: false,
                                    closeOnClick: true,
                                    pauseOnHover: true,
                                    draggable: true,
                                    progress: undefined,
                                });
                            });
                    }
                }

                status = 'fulfilled'
                setVerified(verifiedA)
                StorageServices.setLocalStorage(STORAGE_KEYS.ACC_VERIFIED, verifiedA)

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
    }

    const resendEmailVerification = () => {
        let { process } = state

        if (!process.state) {
            process.state = true
            process.type = 'resend'

            setstate({
                ...state, process
            })

            sendEmailVerification(firebaseAuth.currentUser)
                .then(() => {
                    process.state = false

                    setstate({
                        ...state, process
                    })

                    toast.success("Your verification email is on its way.", {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                })
                .catch((error) => {
                    process.state = false
                    const errorCode = error.code;
                    let errorMessage = error.message;

                    if (errorCode === 'auth/too-many-requests') {
                        errorMessage = 'Excessive requests sent. Please wait a moment before trying again.'
                    } else {
                        errorMessage = 'Something went wrong. Kindly try again later'
                    }

                    toast.error(errorMessage, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });

                    setstate({
                        ...state, process
                    })
                });;
        }
    }

    const accountSignOutHandler = () => {
        dispatch(revokeAuthSession())
    }

    const checkEmailVerification = async () => {
        let { process } = state

        if (!process.state) {
            process.state = true
            process.type = 'verify'

            setstate({
                ...state, process
            })

            try {
                const currentUser = firebaseAuth.currentUser;
                await currentUser.reload()

                process.state = false
                let verifiedA = currentUser.emailVerified ? '0' : '1'
                StorageServices.setLocalStorage(STORAGE_KEYS.ACC_VERIFIED, verifiedA)

                if (currentUser.emailVerified) {
                    CookieServices.remove(COOKIE_KEYS.MAIL_VRF)

                    window.location.reload()

                    toast.success("Email verification complete", {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                } else {
                    toast.error("Email has not been verified. Please verify it to proceed.", {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }

                setstate({
                    ...state, process
                })
            } catch (error) {
                console.error(error)
                process.state = false
                const errorMessage = 'Email verification failed. Try again later...'

                toast.error(errorMessage, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

                setstate({
                    ...state, process
                })
            }
        }
    }

    return (
        <React.Fragment>
            {
                state.status === 'rejected' ? (
                    <div className="py-3 px-4 w-full">
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
                    verified === '0' ? (
                        /* 
                         * Identity has been verified
                         * Proceed to artist/entity home page
                        */
                        <Navigate to={homePeripheralRoute} replace />
                    ) : (
                        <div className="wrapper md:align-middle align-baseline w-full overflow-auto md:h-screen h-auto">
                            <section className="gx-container rounded-md md:h-screen sm:h-auto w-full" style={CONFIG_MAX_WIDTH}>
                                <div className="flex md:flex-row flex-col align-middle items-center w-full md:h-screen h-auto md:pb-0">
                                    <div className="md:basis-1/2 md:px-6 px-6 w-full pt-8">
                                        <span className="text-2xl self-start text-orange-500 tracking-wider leading-7 block mb-2 md:pt-0 pt-4">{APPLICATION.NAME}</span>

                                        <div className="flex flex-row w-full align-middle justitfy-between items-center md:hidden">
                                            <div className="w-60 pt-4 mx-auto pb-3">
                                                <img src={invitation} alt={"invitation"} width="auto" className="block text-center m-auto" />
                                            </div>
                                        </div>

                                        <div className="w-full text-sm text-stone-600 float-right">
                                            <span className="block py-4 text-xl md:text-2xl">
                                                Verification pending

                                                <span className="text-base pt-4 text-stone-600 md:text-stone-800 block">
                                                    <span className="block pt-2">
                                                        A verification email was sent to <span className="text-orange-600">{firebaseAuth.currentUser.email}</span>, kindly check your email to complete verification.
                                                    </span>
                                                </span>
                                            </span>
                                        </div>

                                        <div className="w-full flex flex-row-reverse pt-4 md:pb-8 pb-4 md:px-3 px-0 border-b-2 border-dashed">
                                            <div className="flex-grow flex flex-row-reverse align-middle gap-x-3 items-center text-stone-600 md:px-2 pt-1 pb-2">
                                                <button type="button" onClick={checkEmailVerification} className="disabled:cursor-not-allowed disabled:hover:no-underline text-sm flex-none md:px-2 disabled:hover:text-inherit shadow-none hover:text-orange-600 py-2 md:py-1 bg-inherit hover:underline hover:cursor-pointer sm:w-auto sm:text-sm" disabled={state.process.state}>
                                                    {
                                                        state.process.type === 'verify' && state.process.state ? (
                                                            <div className="flex justify-center align-middle items-center text-orange-600 animate-pulse">
                                                                Verifying...
                                                            </div>
                                                        ) : (
                                                            <div className="flex justify-center align-middle items-center">
                                                                Check Verification
                                                            </div>
                                                        )
                                                    }
                                                </button>

                                                <button type="button" onClick={resendEmailVerification} className="disabled:cursor-not-allowed text-sm flex-none md:px-2 shadow-none hover:text-orange-600 py-2 md:py-1 bg-inherit disabled:hover:text-inherit hover:underline disabled:hover:no-underline hover:cursor-pointer sm:w-auto sm:text-sm" disabled={state.process.state}>
                                                    {
                                                        state.process.type === 'resend' && state.process.state ? (
                                                            <div className="flex justify-center align-middle items-center text-orange-600 animate-pulse">
                                                                Resending...
                                                            </div>
                                                        ) : (
                                                            <div className="flex justify-center align-middle items-center">
                                                                Resend Mail
                                                            </div>
                                                        )
                                                    }
                                                </button>
                                            </div>
                                        </div>

                                        <div className="w-full flex flex-row-reverse pt-6 pb-4 px-3 md:px-0">
                                            <span onClick={accountSignOutHandler} className="text-sm flex flex-row gap-x-3align-middle items-center shadow-none bg-inherit text-red-600 hover:text-red-700 hover:cursor-pointer hover:underline mr-2 sm:w-auto sm:text-sm">
                                                Sign Out
                                            </span>
                                        </div>

                                        <div className="w-full text-stone-600 pb-4 pt-2 px-3 md:px-0">
                                            <p className="text-xs text-center block">
                                                In case of any issue, reach out to our admin at <span className="text-orange-600">support@bigfan.co.ke</span>
                                            </p>
                                        </div>

                                        <div className="mx-auto md:py-3 py-6 text-center">
                                            <p className="text-sm text-stone-500 pb-4">
                                                © {new Date().getFullYear()}. Elevated Acts of Appreciation, <span className="text-orange-600 block">Tip by Tip.</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="md:basis-1/2 hidden md:block px-4 pt-8">
                                        <img className="h-full rounded-2xl" src={invitation} alt={"invitation"} loading="lazy" />
                                    </div>
                                </div>
                            </section>
                        </div>
                    )
                ) : (
                    <div className="w-full h-screen -mt-20 flex flex-col justify-center align-middle items-center px-4">
                        <Loading />
                    </div>
                )
            }

        </React.Fragment>
    )
}