import { Helmet } from "react-helmet";
import React, { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";

import { useDispatch } from "react-redux";
import { useAppSelector } from "../../store/hooks";
import { getRedirectResult } from "firebase/auth";
import { Loading } from "../../components/modules/Loading";
import { firebaseAuth } from "../../firebase/firebaseConfigs";
import { AUTH_, APPLICATION } from "../../global/ConstantsRegistry";
import { authenticationRoutes, postAuthRoutes } from "../../routes/routes";
import Rock_Band_Image from '../../assets/images/a4f6dd9ebd724d8dcf29e1163ccf36cb.svg'
import { resetAuth0, Alt_FirebaseSSO_SignIn } from "../../store/auth/firebaseAuthActions";
import { emailValidator, DeviceInfo, classNames } from "../../lib/modules/HelperFunctions";
import { G_onInputChangeHandler, G_onInputBlurHandler } from "../../components/lib/InputHandlers";

export const SignIn = () => {
    const [state, setstate] = useState({
        pwdVisibility: false,
        status: 'pending',
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

    const locationState: any = location.state
    const auth0: any = useAppSelector(state => state.auth0)

    const signUpRoute: any = (
        authenticationRoutes.find(
            (routeName) => routeName.name === 'SIGN_UP_'
        )
    )?.path

    React.useEffect(() => {
        authRedirectResult()
            .then(async (result) => {
                if (!result) {
                    setstate({
                        ...state, status: 'fulfilled'
                    })

                    dispatch(resetAuth0())
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

                setstate({
                    ...state, status: 'fulfilled'
                })

                return
            })
            .catch((error) => {
                setstate({
                    ...state, status: 'fulfilled'
                })

                dispatch(resetAuth0())
                return null;
            });
    }, [dispatch])

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

    return (
        <React.Fragment>
            <Helmet>
                <title>Sign In</title>
            </Helmet>

            {
                state.status === 'pending' ? (
                    <div className="flex flex-col md:h-screen md:flex-row justify-center items-center">
                        <div className="w-full form-group px-12 mb-14">
                            <div className="w-full">
                                <div className="pt-10">
                                    <Loading />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="wrapper wrapper-background w-full overflow-auto h-screen md:p-6">
                        <section className="gx-container gx-900 bg-white shadow-md rounded-md h-screen sm:h-auto w-full flex items-center justify-center">
                            <div className="flex md:flex-row flex-col align-middle items-center w-full">
                                <div className="md:basis-2/5 py-4 md:px-6 px-8 w-full">
                                    <span className="text-2xl self-start text-orange-500 tracking-wider leading-7 block">{APPLICATION.NAME}</span>

                                    <div className="w-full py-6">
                                        <span className="text-stone-700 block text-lg">Sign In</span>
                                        <span className="text-stone-500 block text-sm">Continue with Google or enter your details</span>
                                    </div>

                                    <div className="w-full">
                                        <button type="button" onClick={signInWithGoogle} className="w-full border-stone-400 py-2 text-stone-700 hover:border-stone-400 hover:text-stone-900 transition duration-150 font-medium disabled:cursor-not-allowed text-sm rounded-md border shadow-sm focus:outline-none " disabled={auth0.processing}>
                                            <span className="pl-2 block">
                                                {
                                                    auth0.processing && auth0.provider === 'google' ? (
                                                        <span className="flex flex-row items-center justify-center align-middle text-stone-600 gap-x-4">
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
                                        <div className="flex-grow border-b border-stone-300"></div>
                                        <span className="flex-none text-stone-500 text-sm px-4">or</span>
                                        <div className="flex-grow border-b border-stone-300"></div>
                                    </div>

                                    <form className="w-full m-auto" onSubmit={passwordSignInFormHandler}>
                                        <div className="shadow-none mb-4 pb-3">
                                            <div className="relative rounded shadow-sm">
                                                <input type="email" name="email" id="email" placeholder="john.doe@email.com" autoComplete="off"
                                                    className={classNames(
                                                        'text-stone-900 ring-slate-300 placeholder:text-stone-500 focus:border-0 focus:outline-none focus:ring-orange-600 focus:outline-orange-500 hover:border-stone-400 border border-stone-300',
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
                                                        'text-stone-900 ring-slate-300 placeholder:text-stone-500 focus:border-0 focus:outline-none focus:ring-orange-600 focus:outline-orange-500 hover:border-stone-400 border border-stone-300',
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
                                            <a href="/auth/forgot-password" className="text-right block text-stone-600 hover:text-stone-700 hover:underline">
                                                <span className="font-small">
                                                    Forgot password?
                                                </span>
                                            </a>
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

                                    <div className="mx-auto py-3 text-center">
                                        <p className="text-sm text-stone-500">
                                            © {new Date().getFullYear()}. Elevated Acts of Appreciation, <span className="text-orange-600 block">Tip by Tip.</span>
                                        </p>
                                    </div>

                                    <span className="text-stone-800 text-sm m-auto flex gap-x-2 py-2">
                                        <span>Don't have an account?</span>
                                        <Link to={signUpRoute} className="text-orange-600 hover:text-orange-700 hover:underline">Sign Up</Link>
                                    </span>
                                </div>

                                <div className="md:basis-3/5 hidden md:block">
                                    <img className="h-full" src={Rock_Band_Image} loading="lazy" alt="rock_band" />
                                </div>
                            </div>
                        </section>
                    </div>
                )
            }
        </React.Fragment>
    )
}