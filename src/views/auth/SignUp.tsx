import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import { PasswordPolicy } from "./PasswordPolicy";
import { getRedirectResult } from "firebase/auth";
import { useAppSelector } from "../../store/hooks";
import { Navigate, useLocation } from "react-router";
import { TermsAndConditions } from "./TermsAndConditions";
import { Loading } from "../../components/modules/Loading";
import { firebaseAuth } from "../../firebase/firebaseConfigs";
import { APPLICATION, AUTH_ } from "../../global/ConstantsRegistry";
import colorfulLogo from "../../assets/images/1akbR3BuvCSqw5uGy.svg"
import { authenticationRoutes, postAuthRoutes } from "../../routes/routes";
import { Alt_FirebaseSSO_SignUp, resetAuth0 } from "../../store/auth/firebaseAuthActions";
import { G_onInputChangeHandler, G_onInputBlurHandler } from "../../components/lib/InputHandlers";
import { DeviceInfo, classNames, emailValidator, passwordValidator } from "../../lib/modules/HelperFunctions";


export const SignUp = () => {
    const [state, setstate] = useState({
        status: 'pending',
        acceptTerms: false,
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
        },
        show: {
            terms: false,
            pwdPol: false,
        }
    })

    const location = useLocation()
    const dispatch: any = useDispatch();
    const locationState: any = location.state
    const auth0: any = useAppSelector(state => state.auth0)

    const [altSignUp, setAltSignUp] = useState(false)

    const signInRoute: any = (
        authenticationRoutes.find(
            (routeName) => routeName.name === 'SIGN_IN_'
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
            .catch(() => {
                setstate({
                    ...state, status: 'fulfilled'
                })

                dispatch(resetAuth0())
                return null;
            });
    }, [location])

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
            let { acceptTerms } = state

            if (passedValidation) {
                if (!acceptTerms) {
                    toast.warning("Kindly read through and accept the terms and conditions", {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });

                    return
                }

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

                dispatch(Alt_FirebaseSSO_SignUp(signInProps))
            }
        }
    };

    const signUpWithGoogle = () => {
        if (!auth0.processing) {
            let { acceptTerms } = state

            if (!acceptTerms) {
                toast.warning("Kindly read through and accept the terms and conditions", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

                return
            }

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

            dispatch(Alt_FirebaseSSO_SignUp(signUpProps))
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

    const showOrHideTC = () => {
        if (!auth0.processing) {
            let { show } = state
            show.terms = !state.show.terms

            setstate({
                ...state, show
            })
        }
    }

    const showOrHidePasswordPolicy = () => {
        if (!auth0.processing) {
            let { show } = state
            show.pwdPol = !state.show.pwdPol

            setstate({
                ...state, show
            })
        }
    }

    const acceptTermsAndConditions = () => {
        if (!auth0.processing) {
            let { acceptTerms } = state
            acceptTerms = !state.acceptTerms

            setstate({
                ...state, acceptTerms
            })
        }
    }

    const toggleAltSignUp = () => {
        if (!auth0.processing) {
            setAltSignUp(!altSignUp)
        }
    }

    return (
        <React.Fragment>
            <Helmet>
                <title>Sign Up</title>
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
                    <div className="wrapper md:align-middle align-baseline wrapper-background w-full overflow-auto h-screen relative">
                        <div className="wrapper main-ht-bg w-full overflow-auto h-screen absolute top-0 left-0">
                            <div className="bg-black opacity-65 w-full"></div>
                        </div>

                        <section className="gx-container gx-900 shadow-md sm:h-auto px-4 w-full flex items-center justify-center">
                            <div className="flex md:flex-row bg-white flex-col rounded-md align-middle items-center md:w-[400px]">
                                <div className="py-4 md:px-6 px-6 w-full flex flex-col">
                                    <div className="w-full h-16 flex justify-center items-center align-middle">
                                        <img className="h-16 mx-auto" src={colorfulLogo} loading="lazy" alt="google logo" />
                                    </div>

                                    {
                                        altSignUp ? (
                                            <>
                                                <div className="w-full">
                                                    <button type="button" onClick={toggleAltSignUp} className="text-gray-500 text-sm cursor-pointer flex items-center pt-3 pb-2 align-middle gap-x-2">
                                                        <span className="fa-duotone fa-arrow-left fa-lg"></span>
                                                        Back
                                                    </button>
                                                </div>

                                                <div className="w-full pb-3">
                                                    <span className="text-gray-500 block text-lg">Sign Up</span>
                                                    <span className="text-gray-500 block text-sm">Enter your email and set a password</span>
                                                </div>

                                                <form className="w-full m-auto" onSubmit={passwordSignUpFormHandler}>
                                                    <div className="shadow-none mb-3 pb-3">
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

                                                    <div className="shadow-none mb-3 pb-3">
                                                        <div className="relative rounded shadow-sm">
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

                                                    <div className="shadow-none space-y-px mb-3">
                                                        <div className="relative mt-2 rounded shadow-sm">
                                                            <input type={state.pwdVisibility ? 'text' : 'password'} name="confirm" id="confirm" placeholder="********" autoComplete="off" disabled={auth0.processing ? true : false}
                                                                className={classNames(
                                                                    'text-stone-900 ring-slate-300 placeholder:text-stone-500 focus:border-0 focus:outline-none focus:ring-orange-600 focus:outline-orange-500 hover:border-stone-400 border border-stone-300',
                                                                    'block w-full rounded-md py-2 pl-3 pr-8 text-sm'
                                                                )} onChange={onChangeHandler} onBlur={onInputBlur} value={state.input.confirm} required />
                                                        </div>
                                                    </div>

                                                    <span onClick={showOrHidePasswordPolicy} className="text-stone-600 hover:text-orange-600 text-sm m-auto flex flex-row-reverse gap-x-1 align-middle items-center cursor-pointer">
                                                        <span>Password policy</span>
                                                        <span className="fa-regular fa-circle-info fa-lg"></span>
                                                    </span>

                                                    <div className="pb-3 pt-3 flex justify-center">
                                                        <button type="submit" className="w-44 disabled:cursor-not-allowed text-sm rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-500 text-white disabled:bg-orange-600 hover:bg-orange-600 focus:outline-none flex items-center justify-center" disabled={auth0.processing}>
                                                            {
                                                                auth0.processing && auth0.provider === 'password' ? (
                                                                    <span className="flex flex-row items-center">
                                                                        <i className="fad fa-spinner-third fa-xl fa-spin mr-2"></i>
                                                                        <span>Signing up...</span>
                                                                    </span>
                                                                ) : (
                                                                    <span>Sign Up</span>
                                                                )
                                                            }
                                                        </button>
                                                    </div>
                                                </form>
                                            </>
                                        ) : (
                                            <>
                                                <div className="w-full py-4">
                                                    <span className="text-stone-500 text-center block text-sm">Join us now and enjoy our services</span>
                                                </div>

                                                <div className="md:w-2/3 w-full mx-auto">
                                                    <button type="button" onClick={signUpWithGoogle} className="w-full border-stone-400 py-2 text-stone-700 hover:border-stone-400 hover:text-stone-900 transition duration-150 disabled:cursor-not-allowed text-sm rounded-md border shadow-sm focus:outline-none " disabled={auth0.processing}>
                                                        <span className="pl-2 block">
                                                            {
                                                                auth0.processing && auth0.provider === 'google' ? (
                                                                    <span className="flex flex-row items-center justify-center align-middle text-stone-600 gap-x-4">
                                                                        <i className="fad fa-spinner fa-xl fa-spin"></i>
                                                                        <span className="tracking-wider">Signing you up</span>
                                                                    </span>
                                                                ) : (
                                                                    <span className="flex items-center gap-x-3 px-4 justify-center align-middle">
                                                                        <img className="w-6 h-6" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo" />
                                                                        <span className="tracking-wider">Sign up with Google</span>
                                                                    </span>
                                                                )
                                                            }
                                                        </span>
                                                    </button>
                                                </div>

                                                <div className="flex flex-row justify-center items-center align-middle py-4 w-2/3 mx-auto">
                                                    <div className="flex-grow border-b border-stone-300"></div>
                                                    <span className="flex-none text-stone-500 text-sm px-4">or</span>
                                                    <div className="flex-grow border-b border-stone-300"></div>
                                                </div>

                                                <div className="md:w-2/3 w-full mx-auto pb-6">
                                                    <button type="button" onClick={toggleAltSignUp} className="w-full border-stone-400 py-2 text-stone-700 hover:border-stone-400 hover:text-stone-900 transition duration-150 disabled:cursor-not-allowed text-sm rounded-md border shadow-sm focus:outline-none " disabled={auth0.processing}>
                                                        <span className="pl-2 block">
                                                            <span className="flex items-center gap-x-3 px-4 justify-center align-middle">
                                                                <div className="w-6 h-6 flex items-center align-middle">
                                                                    <span className="fa-light fa-envelope fa-xl mx-auto"></span>
                                                                </div>

                                                                <span className="tracking-wider">Sign up with email</span>
                                                            </span>
                                                        </span>
                                                    </button>
                                                </div>
                                            </>
                                        )
                                    }

                                    <div className="text-sm pt-3 pb-1">
                                        <div className="relative flex justify-center align-middle items-center py-1 px-2">
                                            <p className="text-gray-500 text-center">
                                                By signing up, agreed to our <span className="text-orange-600 cursor-pointer hover:text-orange-700 hover:underline" onClick={showOrHideTC}>Terms & Conditions</span>
                                            </p>
                                        </div>
                                    </div>

                                    <span className="text-stone-800 text-sm m-auto flex gap-x-2 pt-2 pb-3 justify-center">
                                        <span>Already have an account?</span>
                                        <Link to={signInRoute} className="text-orange-600 hover:text-orange-700 hover:underline">Sign In</Link>
                                    </span>

                                    <div className="mx-auto py-3 text-center w-full border-t">
                                        <p className="text-sm text-stone-600">
                                            © {new Date().getFullYear()}. Elevated Acts of Appreciation, <span className="text-orange-600 block">Tip by Tip.</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                )
            }

            <TermsAndConditions
                show={state.show.terms}
                showOrHide={showOrHideTC}
            />

            <PasswordPolicy
                show={state.show.pwdPol}
                showOrHide={showOrHidePasswordPolicy}
            />
        </React.Fragment>
    )
}