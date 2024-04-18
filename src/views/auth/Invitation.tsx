import { Helmet } from "react-helmet";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Navigate, useLocation, useParams } from "react-router";

import { getRedirectResult } from "firebase/auth";
import { useAppSelector } from "../../store/hooks";
import AxiosServices from "../../services/AxiosServices";
import { Loading } from "../../components/modules/Loading"
import StorageServices from "../../services/StorageServices";
import { firebaseAuth } from "../../firebase/firebaseConfigs";
import smallAsset from '../../assets/images/7117865_3371469.svg'
import { APPLICATION, AUTH_, STORAGE_KEYS } from "../../global/ConstantsRegistry";
import { G_onInputChangeHandler, G_onInputBlurHandler } from "../../components/lib/InputHandlers";
import { firebaseAuthActions, generateSanctumToken, resetAuth0 } from "../../store/auth/firebaseAuthActions";
import { DeviceInfo, classNames, emailValidator, passwordValidator } from "../../lib/modules/HelperFunctions";

export const Invitation = () => {
    const [state, setstate] = useState({
        status: 'pending',
        pwdVisibility: false,
        input: {
            email: '',
            password: '',
            confirm: '',
        },
        errors: {
            email: '',
            password: '',
            confirm: ''
        }
    })

    const location = useLocation()
    const dispatch: any = useDispatch();

    function parseQueryString(search: any) {
        const params = {};

        if (search) {
            search
                .slice(1) // Remove the leading '?'
                .split('&') // Split by '&' to get individual key-value pairs
                .forEach(pair => {
                    const [key, value] = pair.split('='); // Split each pair by '=' to get key and value
                    params[key] = decodeURIComponent(value || ''); // Decode URI component and assign to params
                });
        }

        return params;
    }

    const params = useParams();
    const locationState: any = location.state
    const auth0: any = useAppSelector(state => state.auth0)

    React.useEffect(() => {
        checkInvitationValidity()
    }, [])

    const checkInvitationValidity = async () => {
        let { status } = state

        try {
            const inviteValRoute = location.pathname + location.search
            const valResponse: any = await AxiosServices.httpPost(inviteValRoute, null)
            StorageServices.setLocalStorage(STORAGE_KEYS.ENTITY_HASH, params.hash)

            if (valResponse.data.success) {
                authRedirectResult()
                    .then(async (result) => {
                        if (!result) {
                            return;
                        }

                        const firebaseUser: any = result.user;
                        const accessToken = firebaseUser.accessToken;

                        dispatch({
                            type: AUTH_.FIREBASE_TOKEN,
                            response: {
                                accessToken: accessToken,
                                refreshToken: firebaseUser.stsTokenManager.refreshToken,
                                expirationTime: firebaseUser.stsTokenManager.expirationTime,
                            },
                        });

                        const props = {
                            deviceInfo: DeviceInfo(),
                        }
                        
                        generateSanctumToken(dispatch, accessToken, props)
                    })
                    .catch(() => {
                        dispatch(resetAuth0())
                        return null;
                    });

                status = 'fulfilled'
            } else {
                status = 'rejected'
            }
        } catch (error) {
            status = 'rejected'
        }

        setstate({
            ...state, status
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

    const onInputBlur = (e: any) => {
        if (!auth0.processing) {
            let output: any = G_onInputBlurHandler(e, auth0.processing, '')
            let { input } = state
            let { errors }: any = state

            dispatch(resetAuth0())
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
        } else if (input.password !== input.confirm) {
            errors.password = 'Passwords do not match';
            valid = false
        } else if (!passwordValidator(input.password)) {
            errors.password = 'Kindly set a strong password'
            valid = false
        }

        setstate({
            ...state, errors
        })

        return valid;
    };

    const passwordSignUpFormHandler = (e: any) => {
        e.preventDefault();

        if (!auth0.processing) {
            let passedValidation = validateForm()

            if (passedValidation) {
                dispatch(resetAuth0())
                setstate({
                    ...state, errors: {
                        email: '',
                        password: '',
                        confirm: ''
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

                dispatch(firebaseAuthActions(signInProps))
            }
        }
    };

    const signUpWithGoogle = () => {
        if (!auth0.processing) {
            dispatch(resetAuth0())
            setstate({
                ...state, errors: {
                    email: '',
                    confirm: '',
                    password: '',
                }, input: {
                    email: '',
                    confirm: '',
                    password: '',

                }
            })

            const signUpProps = {
                identity: 'google',
            }

            dispatch(firebaseAuthActions(signUpProps))
        }
    }

    if (auth0.authenticated) {
        const state = {
            from: locationState?.from,
            postAuth: true
        }

        const redirectRoute = locationState?.from === undefined ? '/home' : locationState?.from
        return <Navigate state={state} replace to={redirectRoute} />;
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

    return (
        <React.Fragment>
            <Helmet>
                <title>Invitation</title>
            </Helmet>

            <div className="flex flex-col md:flex-row justify-center items-center dark:bg-gray-800">
                <div className="wrapper w-full md:w-3/5 md:h-screen overflow-auto">
                    <section className="gx-container">
                        <div className="md:px-4 px-4">
                            <header className="landing-header">
                                <div className="landing pl-3 mb-0 text-left">
                                    <span className="odyssey py-3 text-left text-amber-500 nunito block">{APPLICATION.NAME}</span>
                                    <span className="text-stone-700 block text-left mt-0 mb-3">Hey there, you've been invited</span>
                                </div>
                            </header>

                            {
                                state.status === 'rejected' ? (
                                    <div className="bg-white px-4 pt-6 pb-4">
                                        <div className="flex flex-col pt-4 items-center">
                                            <div className="mx-auto flex-shrink-0 flex items-center justify-center mb-3 sm:mx-0 w-48">
                                                <img src={smallAsset} alt="broken_robot" width="auto" className="block text-center m-auto" />
                                            </div>

                                            <div className="mt-3 text-center m-auto text-slate-600">
                                                <span className="text-red-600 mb-2 block">
                                                    ERR_404: Resource Not Found
                                                </span>

                                                <div className="text-sm">
                                                    The resource either does not exists or it was moved to a new location
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : state.status === 'fulfilled' ? (
                                    <>
                                        <div className="px-3 py-4 text-sm mb-2">
                                            <div className="flex items-center pt-1 justify-center dark:bg-gray-800">
                                                <button type="button" onClick={signUpWithGoogle} className="gap-2 w-64 border-slate-300 dark:border-slate-700 text-stone-700 dark:text-stone-200 hover:border-stone-400 hover:text-slate-900 dark:hover:text-slate-300 transition duration-150 disabled:cursor-not-allowed text-sm rounded-md border shadow-sm px-4 py-2.5 focus:outline-none flex items-center justify-center" disabled={auth0.processing} style={{ height: '3rem' }}>
                                                    <img className="w-6 h-6" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo" />
                                                    <span className="pl-2">Sign up with Google</span>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex flex-row justify-center items-center align-middle py-2 px-10">
                                            <div className="flex-grow border-b border-amber-300"></div>
                                            <span className="flex-none text-stone-600 px-4">or</span>
                                            <div className="flex-grow border-b border-amber-300"></div>
                                        </div>

                                        <form className="space-y-3 shadow-none px-2 mb-3 md:w-4/5 md:px-6 m-auto" onSubmit={passwordSignUpFormHandler}>
                                            <div className="shadow-none space-y-px mb-4">
                                                <label htmlFor="email" className="block text-sm leading-6 text-stone-700 mb-1">Email:</label>

                                                <div className="relative mt-2 rounded shadow-sm">
                                                    <input type="email" name="email" id="email" placeholder="john.doe@email.com" autoComplete="off" disabled={auth0.processing ? true : false}
                                                        className={classNames(
                                                            'text-stone-900 ring-slate-300 placeholder:text-stone-500 focus:border-0 focus:outline-none focus:ring-amber-600 focus:outline-amber-500 hover:border-stone-400 border border-stone-300',
                                                            'block w-full rounded-md py-2 pl-3 pr-8  text-sm'
                                                        )} onChange={onChangeHandler} onBlur={onInputBlur} value={state.input.email} required style={{ height: '3rem' }} />

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

                                            <div className="shadow-none space-y-px mb-">
                                                <label htmlFor="password" className="block text-sm leading-6 text-stone-700 mb-1">Password:</label>

                                                <div className="relative mt-2 rounded shadow-sm">
                                                    <input type={state.pwdVisibility ? 'text' : 'password'} name="password" id="password" placeholder="********" autoComplete="off" disabled={auth0.processing ? true : false}
                                                        className={classNames(
                                                            'text-stone-900 ring-slate-300 placeholder:text-stone-500 focus:border-0 focus:outline-none focus:ring-amber-600 focus:outline-amber-500 hover:border-stone-400 border border-stone-300',
                                                            'block w-full rounded-md py-2 pl-3 pr-8  text-sm'
                                                        )} onChange={onChangeHandler} onBlur={onInputBlur} value={state.input.password} required style={{ height: '3rem' }} />

                                                    <div className="absolute inset-y-0 right-0 flex items-center w-8">
                                                        {
                                                            state.pwdVisibility ? (
                                                                <span className="fa-duotone fa-eye text-amber-600 fa-lg cursor-pointer" onClick={togglePasswordVisibility}></span>
                                                            ) : (
                                                                <span className="fa-duotone fa-eye-slash text-amber-600 fa-lg cursor-pointer" onClick={togglePasswordVisibility}></span>
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

                                            <div className="shadow-none space-y-px pb-3">
                                                <label htmlFor="confirm" className="block text-sm leading-6 text-stone-700 mb-1">Confirm Password:</label>

                                                <div className="relative mt-2 rounded shadow-sm">
                                                    <input type={state.pwdVisibility ? 'text' : 'password'} name="confirm" id="confirm" placeholder="********" autoComplete="off" disabled={auth0.processing ? true : false}
                                                        className={classNames(
                                                            'text-stone-900 ring-slate-300 placeholder:text-stone-500 focus:border-0 focus:outline-none focus:ring-amber-600 focus:outline-amber-500 hover:border-stone-400 border border-stone-300',
                                                            'block w-full rounded-md py-2 pl-3 pr-8  text-sm'
                                                        )} onChange={onChangeHandler} onBlur={onInputBlur} value={state.input.confirm} required style={{ height: '3rem' }} />
                                                </div>
                                            </div>

                                            <div className="pb-3 pt-3 flex justify-center">
                                                <button type="submit" className="w-44 disabled:cursor-not-allowed text-sm rounded-md border border-transparent shadow-sm px-4 py-2 bg-amber-500 text-white disabled:bg-amber-600 hover:bg-amber-600 focus:outline-none flex items-center justify-center" disabled={auth0.processing} style={{ height: '3rem' }}>
                                                    {auth0.processing ? (
                                                        <span className="flex flex-row items-center">
                                                            <i className="fad fa-spinner-third fa-xl fa-spin mr-2"></i>
                                                            <span>Signing Up...</span>
                                                        </span>
                                                    ) : (
                                                        <span>Sign Up</span>
                                                    )}
                                                </button>
                                            </div>
                                        </form>
                                    </>
                                ) : (
                                    <div className="w-full h-full flex flex-col justify-center">
                                        <div className="flex-grow">
                                            <Loading />
                                        </div>
                                    </div>
                                )
                            }

                            <div className="mx-auto py-3 text-center">
                                <p className="text-sm">
                                    © {new Date().getFullYear()}. Elevated Acts of Appreciation, <span className="text-amber-600 block">Tip by Tip.</span>
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </React.Fragment>
    )
}