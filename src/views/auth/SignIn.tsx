import { Helmet } from "react-helmet";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { getRedirectResult } from "firebase/auth";
import { Link, Navigate, useLocation } from "react-router-dom";

import { ERR_404 } from "../errors/ERR_404";
import { ERR_500 } from "../errors/ERR_500";
import { useAppSelector } from "../../store/hooks";
import { PREFLIGHT } from "../../api/API_Registry";
import { AUTH_ } from "../../global/ConstantsRegistry";
import AxiosServices from "../../services/AxiosServices";
import { Loading } from "../../components/modules/Loading";
import { firebaseAuth } from "../../firebase/firebaseConfigs";
import test000 from '../../assets/images/Main Web Logo-01.svg'
import Rock_Band_Image from '../../assets/images/ozxKsl3R991Y0nTyu.svg'
import { authenticationRoutes, postAuthRoutes } from "../../routes/routes";
import { resetAuth0, Alt_FirebaseSSO_SignIn } from "../../store/auth/firebaseAuthActions";
import { emailValidator, DeviceInfo, classNames } from "../../lib/modules/HelperFunctions";
import { G_onInputChangeHandler, G_onInputBlurHandler } from "../../components/lib/InputHandlers";

export const SignIn = () => {
    const [state, setstate] = useState({
        pwdVisibility: false,
        status: 'pending',
        httpStatus: 200,
        data: {
            inspection: null
        },
        input: {
            email: '',
            password: ''
        }, errors: {
            email: '',
            password: ''
        }
    })

    const location = useLocation()
    const dispatch: any = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false)
    const [altSignIn, setAltSignIn] = useState(false)

    const locationState: any = location.state
    const auth0: any = useAppSelector(state => state.auth0)

    const signUpRoute: any = (
        authenticationRoutes.find(
            (routeName) => routeName.name === 'SIGN_UP_'
        )
    )?.path

    const forgotRoute: any = (
        authenticationRoutes.find(
            (routeName) => routeName.name === 'FORGOT_PWD_'
        )
    )?.path

    const preflightRoute: any = (
        authenticationRoutes.find(
            (routeName) => routeName.name === 'PREFLIGHT_'
        )
    )?.path

    React.useEffect(() => {
        preflightInspection()
    }, [])

    const preflightInspection = async () => {
        let { data } = state
        let { status } = state
        let { httpStatus } = state

        try {
            const preflightResp: any = await AxiosServices.httpGet(PREFLIGHT.COCKPIT_INSP)
            const payload: any = preflightResp.data.payload
            httpStatus = preflightResp.status

            if (preflightResp.data.success) {
                authRedirectResult()
                    .then(async (result) => {
                        if (!result) {
                            data.inspection = payload.inspection
                            status = data.inspection.cockpit === 'passed' ? 'rejected' : 'fulfilled'

                            setstate({
                                ...state, status, data, httpStatus
                            })

                            dispatch(resetAuth0())

                            if (locationState?.autoSignIn) {
                                autoSignInHandler()
                            }

                            setIsLoaded(true)
                            return;
                        }

                        data.inspection = payload.inspection
                        const firebaseUser: any = result.user;

                        dispatch({
                            type: AUTH_.FIREBASE_TOKEN,
                            response: {
                                accessToken: firebaseUser.accessToken,
                                refreshToken: firebaseUser.stsTokenManager.refreshToken,
                                expirationTime: firebaseUser.stsTokenManager.expirationTime,
                            },
                        });

                        setstate({
                            ...state, status: 'fulfilled', httpStatus
                        })

                        setIsLoaded(true)
                        return
                    })
                    .catch((error) => {
                        httpStatus = 500
                        setIsLoaded(true)

                        setstate({
                            ...state, status: 'fulfilled', httpStatus
                        })

                        dispatch(resetAuth0())
                        return null;
                    });
            } else {
                status = 'rejected'
            }
        } catch (error) {
            httpStatus = 500
            status = 'rejected'
        }

        setstate({
            ...state, status, httpStatus
        })
    }

    const onChangeHandler = (e: any) => {
        if (!auth0.processing) {
            let output: any = G_onInputChangeHandler(e, auth0.processing)
            let { input } = state
            let { errors }: any = state

            input[e.target.name] = output.value
            errors[e.target.name] = output.error

            setstate({
                ...state, input, errors
            })
        }
    }

    const togglePasswordVisibility = () => {
        if (!auth0.processing) {
            setstate({
                ...state, pwdVisibility: !state.pwdVisibility
            })
        }
    };

    const onInputBlur = (e: any) => {
        if (!auth0.processing) {
            dispatch(resetAuth0())
            let output: any = G_onInputBlurHandler(e, auth0.processing, '')
            let { input } = state
            let { errors }: any = state

            dispatch(resetAuth0())
            input[e.target.name] = output.value

            setstate({
                ...state, input, errors
            })
        }
    }

    const validateForm = () => {
        let valid = true
        let { input } = state
        let { errors } = state;

        if (!input.email) {
            errors.email = 'Please provide a email address'
            valid = false
        } else if (!emailValidator(input.email)) {
            errors.email = 'Please provide a valid email address'
            valid = false
        }

        if (!input.password) {
            errors.password = 'Please provide a password';
            valid = false
        }

        setstate({
            ...state, errors
        })

        return valid;
    };

    const autoSignInHandler = () => {
        if (!auth0.processing) {
            dispatch(resetAuth0())

            const autoSignInProps = {
                identity: 'password',
                deviceInfo: DeviceInfo(),
                credentials: {
                    email: locationState.email,
                    password: locationState.password,
                }
            }

            dispatch(Alt_FirebaseSSO_SignIn(autoSignInProps))
        }
    }

    const passwordSignInFormHandler = (e: any) => {
        e.preventDefault();

        if (!auth0.processing) {
            let passedValidation = validateForm()

            if (passedValidation) {
                dispatch(resetAuth0())
                setstate({
                    ...state, errors: {
                        email: '',
                        password: '',
                    }
                })

                const signInProps = {
                    identity: 'password',
                    deviceInfo: DeviceInfo(),
                    credentials: {
                        email: state.input.email,
                        password: state.input.password,
                    }
                }

                dispatch(Alt_FirebaseSSO_SignIn(signInProps))
            }
        }
    };

    const signInWithGoogle = () => {
        if (!auth0.processing) {
            dispatch(resetAuth0())
            setstate({
                ...state, errors: {
                    email: '',
                    password: '',
                }, input: {
                    email: '',
                    password: '',
                }
            })

            const signInProps = {
                identity: 'google',
            }

            dispatch(Alt_FirebaseSSO_SignIn(signInProps))
        }
    }

    if (auth0.sso) {
        const state = {
            from: locationState?.from,
            postAuth: true
        }

        const postAuthenticatoinRoute: any = (
            postAuthRoutes.find(
                (routeName) => routeName.name === 'AUTH_IDENTITY_')
        )?.path

        return <Navigate to={postAuthenticatoinRoute} replace state={state} />;
    }

    const authRedirectResult = async () => {
        try {
            const user = await getRedirectResult(firebaseAuth);

            return user;
        } catch (error) {
            const errorCode = error.code;
            let errorMessage = error.message;
            let popUpErrors = [
                'auth/popup-blocked',
                'auth/popup-closed-by-user',
                'auth/cancelled-popup-request',
            ]

            if (errorCode === 'auth/user-not-found') {
                errorMessage = "Sorry, we couldn't sign you in. Please check your credentials"
            } else if (errorCode === 'auth/wrong-password') {
                errorMessage = "Sorry, we couldn't sign you in. Please check your credentials"
            } else if (errorCode === 'auth/user-disabled') {
                errorMessage = 'Your account has been disabled. Please contact support for assistance.'
            } else if (errorCode === 'auth/account-exists-with-different-credential') {
                errorMessage = "Email is associated with a different sign-in method. Please sign in using the method originally used."
            } else if (errorCode === 'auth/requires-recent-login') {
                errorMessage = "Your session has expired. Please sign in again to continue."
            } else if (popUpErrors.includes(errorCode)) {
                errorMessage = 'Google sign-in process cancelled by user'
            } else {
                errorMessage = null
            }

            dispatch({
                type: AUTH_.FIREBASE_EXCEPTION,
                response: errorMessage,
            });

            return null;
        }
    };

    const toggleAltSignIn = () => {
        if (!auth0.processing) {
            setAltSignIn(!altSignIn)
        }
    }

    return (
        <React.Fragment>
            <Helmet>
                <title>Sign In</title>
            </Helmet>

            {
                state.status === 'rejected' ? (
                    state.httpStatus === 200 ? (
                        <>
                            <Navigate replace to={preflightRoute} />
                        </>
                    ) : (
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
                    )
                ) : state.status === 'fulfilled' ? (
                    <div className="wrapper md:align-middle align-baseline wrapper-background w-full overflow-auto h-screen relative">
                        <div className="wrapper main-bg w-full overflow-auto h-screen absolute  top-0 left-0">
                            <div className="bg-black opacity-65 w-full"></div>
                        </div>

                        <section className="gx-container gx-900 h-screen sm:h-auto w-full flex items-center justify-center">
                            <div className="flex md:flex-row flex-col align-middle items-center w-full">
                                <div className={`md:basis-2/5 py-4 md:px-6 px-8 w-full transform transition-transform duration-1000 ease-out ${isLoaded ? 'translate-x-0' : '-translate-x-full'}`}>
                                    {/* <span className="text-2xl self-start text-white tracking-wider leading-7 block">{APPLICATION.NAME}</span> */}
                                    <div className="w-full h-20 flex items-center -ml-3 align-middle">
                                        <img className="h-20 mx-auto" src={test000} loading="lazy" alt="google logo" />
                                    </div>

                                    {
                                        altSignIn ? (
                                            <>
                                                <div className="w-full">
                                                    <button type="button" onClick={toggleAltSignIn} className="text-white text-sm cursor-pointer flex items-center pt-3 align-middle gap-x-2">
                                                        <span className="fa-duotone fa-arrow-left fa-lg"></span>
                                                        Back
                                                    </button>
                                                </div>

                                                <div className="w-full py-6">
                                                    <span className="text-white block text-lg">Sign In</span>
                                                    <span className="text-white block text-sm">Enter your email and password</span>
                                                </div>

                                                <form className="w-full m-auto" onSubmit={passwordSignInFormHandler}>
                                                    <div className="shadow-none mb-4 pb-3">
                                                        <div className="relative rounded shadow-sm">
                                                            <input type="email" name="email" id="email" placeholder="john.doe@email.com" autoComplete="off"
                                                                className={classNames(
                                                                    'text-slate-600 ring-slate-300 placeholder:text-slate-600 focus:border-0 focus:outline-none focus:ring-orange-600 focus:outline-orange-500 hover:border-white border border-white',
                                                                    'block w-full rounded-md py-2 pl-3 pr-8 text-sm'
                                                                )} onChange={onChangeHandler} onBlur={onInputBlur} value={state.input.email} required />

                                                        </div>

                                                        {
                                                            state.errors.email && (
                                                                <span className='invalid-feedback text-xs text-red-600 pl-0'>
                                                                    {state.errors.email}
                                                                </span>
                                                            )
                                                        }

                                                        {
                                                            auth0.error && (
                                                                <span className='invalid-feedback text-xs text-red-600 pl-0'>
                                                                    {auth0.error}
                                                                </span>
                                                            )
                                                        }
                                                    </div>

                                                    <div className="shadow-none space-y-px">
                                                        <div className="relative mt-2 rounded shadow-sm">
                                                            <input type={state.pwdVisibility ? 'text' : 'password'} name="password" id="password" placeholder="********" autoComplete="off"
                                                                className={classNames(
                                                                    'text-slate-600 ring-slate-300 placeholder:text-slate-600 focus:border-0 focus:outline-none focus:ring-orange-600 focus:outline-orange-500 hover:border-white border border-white',
                                                                    'block w-full rounded-md py-2 pl-3 pr-8 text-sm'
                                                                )} onChange={onChangeHandler} onBlur={onInputBlur} value={state.input.password} required />

                                                            <div className="absolute inset-y-0 right-0 flex items-center w-8">
                                                                {
                                                                    state.pwdVisibility ? (
                                                                        <span className="fa-duotone fa-eye text-orange-600 fa-lg cursor-pointer" onClick={togglePasswordVisibility}></span>
                                                                    ) : (
                                                                        <span className="fa-duotone fa-eye-slash text-orange-600 fa-lg cursor-pointer" onClick={togglePasswordVisibility}></span>
                                                                    )
                                                                }
                                                            </div>
                                                        </div>

                                                        {
                                                            state.errors.password && (
                                                                <span className='invalid-feedback text-xs text-red-600 pl-0'>
                                                                    {state.errors.password}
                                                                </span>
                                                            )
                                                        }
                                                    </div>

                                                    <div className="text-sm pt-4 pb-1">
                                                        <Link to={forgotRoute} className="text-right block text-white hover:text-white hover:underline">
                                                            <span className="font-small">
                                                                Forgot password?
                                                            </span>
                                                        </Link>
                                                    </div>

                                                    <div className="pb-3 pt-3 flex justify-center">
                                                        <button type="submit" className="w-44 disabled:cursor-not-allowed text-sm rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-500 text-white disabled:bg-orange-600 hover:bg-orange-600 focus:outline-none flex items-center justify-center" disabled={auth0.processing}>
                                                            {
                                                                auth0.processing && auth0.provider === 'password' ? (
                                                                    <span className="flex flex-row items-center">
                                                                        <i className="fad fa-spinner-third fa-xl fa-spin mr-2"></i>
                                                                        <span>Signing In...</span>
                                                                    </span>
                                                                ) : (
                                                                    <span>Sign In</span>
                                                                )
                                                            }
                                                        </button>
                                                    </div>
                                                </form>
                                            </>
                                        ) : (
                                            <>
                                                <div className="w-full">
                                                    <span className="text-white block text-lg">Sign In</span>
                                                    <span className="text-white block text-sm">Continue with Google or enter your details</span>
                                                </div>

                                                <div className="w-full">
                                                    <button type="button" onClick={signInWithGoogle} className="w-full border-white py-2 text-white hover:border-white hover:text-white transition duration-150 disabled:cursor-not-allowed text-sm rounded-md border shadow-sm focus:outline-none " disabled={auth0.processing}>
                                                        <span className="pl-2 block">
                                                            {
                                                                auth0.processing && auth0.provider === 'google' ? (
                                                                    <span className="flex flex-row items-center justify-center align-middle text-white gap-x-4">
                                                                        <i className="fad fa-spinner fa-xl fa-spin"></i>
                                                                        <span className="tracking-wider">Signing you in</span>
                                                                    </span>
                                                                ) : (
                                                                    <span className="flex items-center gap-x-3 px-4 justify-center align-middle">
                                                                        <img className="w-6 h-6" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo" />
                                                                        <span className="tracking-wider">Sign in with Google</span>
                                                                    </span>
                                                                )
                                                            }
                                                        </span>
                                                    </button>
                                                </div>

                                                <div className="flex flex-row justify-center items-center align-middle py-6">
                                                    <div className="flex-grow border-b border-white"></div>
                                                    <span className="flex-none text-white text-sm px-4">or</span>
                                                    <div className="flex-grow border-b border-white"></div>
                                                </div>

                                                <div className="w-full">
                                                    <button type="button" onClick={toggleAltSignIn} className="w-full border-white py-2 text-white hover:border-white hover:text-white transition duration-150 disabled:cursor-not-allowed text-sm rounded-md border shadow-sm focus:outline-none " disabled={auth0.processing}>
                                                        <span className="pl-2 block">
                                                            <span className="flex items-center gap-x-3 px-4 justify-center align-middle">
                                                                <div className="w-6 h-6 flex items-center align-middle">
                                                                    <span className="fa-light fa-envelope fa-xl mx-auto"></span>
                                                                </div>

                                                                <span className="tracking-wider">Sign in with email</span>
                                                            </span>
                                                        </span>
                                                    </button>
                                                </div>
                                            </>
                                        )
                                    }

                                    <div className="mx-auto py-3 text-center">
                                        <p className="text-sm text-white">
                                            <span className="text-orange-600">Big Fan</span> © {new Date().getFullYear()} All Right Reserved.
                                        </p>
                                    </div>

                                    <span className="text-white text-sm m-auto flex gap-x-2 py-2">
                                        <span>Don't have an account?</span>
                                        <Link to={signUpRoute} className="text-orange-500 hover:text-orange-700 hover:underline">Sign Up</Link>
                                    </span>
                                </div>

                                <div className="md:basis-3/5 hidden md:block">
                                    <img className="h-full" src={Rock_Band_Image} loading="lazy" alt="rock_band" />
                                </div>
                            </div>
                        </section>
                    </div>
                ) : (
                    <div className="wrapper md:align-middle align-baseline w-full overflow-auto md:h-screen h-auto">
                        <section className="gx-container md:h-screen h-auto rounded-md w-full flex items-center justify-center">
                            <div className="flex md:flex-row flex-col align-middle items-center w-full md:pb-0 pb-10">
                                <div className="w-full h-1/2 flex flex-col justify-center">
                                    <div className="flex-grow pt-8">
                                        <Loading />
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                )
            }
        </React.Fragment>
    )
}