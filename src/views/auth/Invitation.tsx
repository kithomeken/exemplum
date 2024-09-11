import { Helmet } from "react-helmet";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Navigate, useLocation, useParams } from "react-router";

import { ERR_404 } from "../errors/ERR_404";
import { ERR_500 } from "../errors/ERR_500";
import { PasswordPolicy } from "./PasswordPolicy";
import { getRedirectResult } from "firebase/auth";
import { useAppSelector } from "../../store/hooks";
import { postAuthRoutes } from "../../routes/routes";
import AxiosServices from "../../services/AxiosServices";
import { TermsAndConditions } from "./TermsAndConditions";
import { Loading } from "../../components/modules/Loading"
import StorageServices from "../../services/StorageServices";
import { firebaseAuth } from "../../firebase/firebaseConfigs";
import connecting from '../../assets/images/53059e12f79a42c5e4b259b50d1412c1.svg'
import { APPLICATION, AUTH_, STORAGE_KEYS, STYLE } from "../../global/ConstantsRegistry";
import { Alt_FirebaseSSO_SignIn, Alt_FirebaseSSO_SignUp, resetAuth0 } from "../../store/auth/firebaseAuthActions";
import { G_onInputChangeHandler, G_onInputBlurHandler } from "../../components/lib/InputHandlers";
import { DeviceInfo, classNames, emailValidator, passwordValidator } from "../../lib/modules/HelperFunctions";

export const Invitation = () => {
    const [state, setstate] = useState({
        httpStatus: 200,
        status: 'pending',
        pwdVisibility: false,
        data: {
            beneficiary: '',
        },
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
            email: false,
            terms: false,
            passwd: false,
        }
    })

    const params = useParams();
    const location = useLocation()
    const dispatch: any = useDispatch();
    const locationState: any = location.state
    const auth0: any = useAppSelector(state => state.auth0)

    React.useEffect(() => {
        checkInvitationValidity()
    }, [])

    const checkInvitationValidity = async () => {
        let { data } = state
        let { input } = state
        let { status } = state

        try {
            const inviteValRoute = location.pathname + location.search
            const valResponse: any = await AxiosServices.httpPost(inviteValRoute, null)
            StorageServices.setLocalStorage(STORAGE_KEYS.ENTITY_HASH, params.hash)

            if (valResponse.data.success) {
                authRedirectResult()
                    .then(async (result) => {
                        if (!result) {
                            input.email = valResponse.data.payload.beneficiary
                            data.beneficiary = valResponse.data.payload.beneficiary

                            setstate({
                                ...state, status: 'fulfilled', data, input
                            })

                            dispatch(resetAuth0())
                            return;
                        }

                        const firebaseUser: any = result.user;
                        const accessToken = firebaseUser.accessToken;
                        input.email = valResponse.data.payload.beneficiary
                        data.beneficiary = valResponse.data.payload.beneficiary

                        dispatch({
                            type: AUTH_.FIREBASE_TOKEN,
                            response: {
                                accessToken: accessToken,
                                refreshToken: firebaseUser.stsTokenManager.refreshToken,
                                expirationTime: firebaseUser.stsTokenManager.expirationTime,
                            },
                        });

                        setstate({
                            ...state, status: 'fulfilled', data, input
                        })

                        return
                    })
                    .catch(() => {
                        data.beneficiary = ''
                        input.email = ''

                        setstate({
                            ...state, status: 'fulfilled', data, input
                        })

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

    const toggleAlternativeSignUp = () => {
        if (!auth0.processing) {
            let { show } = state
            show.email = !state.show.email

            setstate({
                ...state, show
            })
        }
    }

    const toggleTermsAndConditions = () => {
        if (!auth0.processing) {
            let { show } = state
            show.terms = !state.show.terms

            setstate({
                ...state, show
            })
        }
    }

    const togglePasswordPolicy = () => {
        if (!auth0.processing) {
            let { show } = state
            show.passwd = !state.show.passwd

            setstate({
                ...state, show
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

    const passwordEmailInvitationHandler = (e: any) => {
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

                const invitationProps = {
                    identity: 'password',
                    deviceInfo: DeviceInfo(),
                    credentials: {
                        email: state.input.email,
                        password: state.input.password,
                    }
                }

                dispatch(Alt_FirebaseSSO_SignUp(invitationProps))
            }
        }
    };

    const invitationWithGoogle = () => {
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

            dispatch(Alt_FirebaseSSO_SignIn(signUpProps))
        }
    }

    if (auth0.sso) {
        let {data} = state

        const auxState = {
            beneficiary: data.beneficiary,
            from: locationState?.from,
            postAuth: true
        }

        const postAuthenticationRoute: any = (
            postAuthRoutes.find(
                (routeName) => routeName.name === 'AUTH_IDENTITY_')
        )?.path

        return <Navigate to={postAuthenticationRoute} replace state={auxState} />;
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
                <title>Welcome to {APPLICATION.NAME}</title>
            </Helmet>

            <div className="wrapper md:align-middle align-baseline w-full overflow-auto md:h-screen h-auto">
                <section className="gx-container md:h-screen h-auto rounded-md w-full flex items-center justify-center" style={STYLE.MAX_WIDTH}>
                    <div className="flex md:flex-row flex-col align-middle items-center w-full md:pb-0 pb-10">
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
                                <>
                                    <div className="md:basis-3/5 md:px-6 px-6 w-full py-6 pb-6 flex flex-col">
                                        <span className="text-2xl self-start text-stone-500 tracking-wider leading-7 block pt-3 md:pt-0">
                                            Hi there,
                                        </span>

                                        <div className="flex flex-row align-middle items-center gap-x-3 pt-2 md:pb-3">
                                            <span className="text-xl text-stone-500 md:text-start text-right block">
                                                Step into <span className="text-orange-500">{APPLICATION.NAME}</span>.
                                            </span>
                                        </div>

                                        <div className="flex flex-row w-full align-middle justitfy-between items-center md:hidden">
                                            <div className="w-60 pt-4 mx-auto pb-3">
                                                <img src={connecting} alt={"connecting_teams_rafiki"} width="auto" className="block text-center m-auto" />
                                            </div>
                                        </div>

                                        <div className="w-full text-sm text-stone-600 float-right">
                                            <span className="block py-4 text-lg md:text-xl">
                                                You've been invited to join our community and we're thrilled to get you started
                                                {/* We're thrilled to have you join our community and can't wait to get you started. */}

                                                <span className="text-base md:text-lg pt-4 text-stone-500 block">
                                                    <span className="block">
                                                        First things first, let's set up your account.

                                                        {
                                                            state.show.email ? null : (
                                                                <span className="block text-sm py-2">Pick your preferred sign-in method</span>
                                                            )
                                                        }
                                                    </span>
                                                </span>
                                            </span>
                                        </div>

                                        <div className="w-full py-3 block">
                                            {
                                                state.show.email ? (
                                                    <div className="w-full block m-auto">
                                                        <form className="w-full m-auto md:w-2/3 " onSubmit={passwordEmailInvitationHandler}>
                                                            <span className="block text-sm pb-4 text-stone-500">Enter your email and preferred password</span>

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

                                                            <span onClick={togglePasswordPolicy} className="text-stone-600 hover:text-orange-600 text-sm m-auto flex flex-row-reverse gap-x-1 align-middle items-center cursor-pointer">
                                                                <span>Password policy</span>
                                                                <span className="fa-regular fa-circle-info fa-lg"></span>
                                                            </span>

                                                            <div className="pt-3 flex justify-center">
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
                                                    </div>
                                                ) : (
                                                    <div className="w-full md:w-1/2 mx-auto pb-4">
                                                        <div className="w-full">
                                                            <button type="button" onClick={invitationWithGoogle} className="w-full border-stone-400 py-2 text-stone-700 hover:border-stone-400 hover:text-stone-900 transition duration-150 disabled:cursor-not-allowed text-sm rounded-md border shadow-sm focus:outline-none " disabled={auth0.processing}>
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

                                                        <div className="flex flex-row justify-center items-center align-middle py-6">
                                                            <div className="flex-grow border-b border-stone-300"></div>
                                                            <span className="flex-none text-stone-500 text-sm px-4">or</span>
                                                            <div className="flex-grow border-b border-stone-300"></div>
                                                        </div>

                                                        <div className="w-full">
                                                            <button type="button" onClick={toggleAlternativeSignUp} className="w-full border-stone-400 py-2 text-stone-700 hover:border-stone-400 hover:text-stone-900 transition duration-150 disabled:cursor-not-allowed text-sm rounded-md border shadow-sm focus:outline-none " disabled={auth0.processing}>
                                                                <span className="pl-2 block">
                                                                    <span className="flex items-center gap-x-3 px-4 justify-center align-middle">
                                                                        <span className="tracking-wider">Continue with email</span>
                                                                    </span>
                                                                </span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        </div>

                                        <div className="text-sm pt-3 pb-2 w-full border-b-2 border-dashed">
                                            <div className="relative flex gap-x-3 align-middle items-center py-1 px-2">
                                                <div className="text-sm leading-6 text-center w-full">
                                                    <p className="text-gray-600">
                                                        By creating an account, you agree with our <span className="text-orange-600 cursor-pointer hover:text-orange-700 hover:underline" onClick={toggleTermsAndConditions}>Terms & Conditions</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mx-auto py-3 text-center">
                                            <p className="text-sm text-stone-500 md:pb-0">
                                                © {new Date().getFullYear()}. Elevated Acts of Appreciation, <span className="text-orange-600 block">Tip by Tip.</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="md:basis-2/5 hidden md:block h-screen px-4 py-6">
                                        <img className="h-full rounded-2xl" src={connecting} alt={"connecting_teams_rafiki"} loading="lazy" />
                                    </div>
                                </>
                            ) : (
                                <div className="w-full h-1/2 flex flex-col justify-center">
                                    <div className="flex-grow pt-8">
                                        <Loading />
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </section>
            </div>

            <TermsAndConditions
                show={state.show.terms}
                showOrHide={toggleTermsAndConditions}
            />

            <PasswordPolicy
                show={state.show.passwd}
                showOrHide={togglePasswordPolicy}
            />
        </React.Fragment>
    )
}