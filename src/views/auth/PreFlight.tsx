import React from "react"
import { Helmet } from "react-helmet"
import { useDispatch } from "react-redux"
import { Navigate } from "react-router-dom"
import { getRedirectResult } from "firebase/auth"

import { ERR_404 } from "../errors/ERR_404"
import { ERR_500 } from "../errors/ERR_500"
import { PasswordPolicy } from "./PasswordPolicy"
import { PREFLIGHT } from "../../api/API_Registry"
import { useAppSelector } from "../../store/hooks"
import { postAuthRoutes } from "../../routes/routes"
import AxiosServices from "../../services/AxiosServices"
import { Loading } from "../../components/modules/Loading"
import { firebaseAuth } from "../../firebase/firebaseConfigs"
import { classNames } from "../../lib/modules/HelperFunctions"
import smallAsset from "../../assets/images/illustration_178786105.svg"
import { Alt_FirebaseSSO_SignIn, resetAuth0 } from "../../store/auth/firebaseAuthActions"
import { APPLICATION, AUTH_, CONFIG_MAX_WIDTH, STYLE } from "../../global/ConstantsRegistry"
import { G_onInputChangeHandler, G_onInputBlurHandler } from "../../components/lib/InputHandlers"

export const PreFlight = () => {
    const [state, setstate] = React.useState({
        httpStatus: 200,
        redirect: false,
        status: 'pending',
        data: {
            inspection: null
        },
        password: {
            form: false,
            policy: false,
            visibility: false
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
    })

    const dispatch: any = useDispatch();
    const auth0: any = useAppSelector(state => state.auth0)

    React.useEffect(() => {
        preflightInspection()
    }, [])

    const preflightInspection = async () => {
        let { data } = state
        let { input } = state
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
                            status = data.inspection.cockpit === 'passed' ? 'fulfilled' : 'rejected'

                            setstate({
                                ...state, status, data, httpStatus
                            })

                            dispatch(resetAuth0())
                            return;
                        }

                        data.inspection = payload.inspection
                        const firebaseUser: any = result.user;

                        if (data.inspection.cockpit === 'passed') {
                            status = 'fulfilled'

                            dispatch({
                                type: AUTH_.FIREBASE_TOKEN,
                                response: {
                                    accessToken: firebaseUser.accessToken,
                                    refreshToken: firebaseUser.stsTokenManager.refreshToken,
                                    expirationTime: firebaseUser.stsTokenManager.expirationTime,
                                },
                            });
                        } else {
                            status = 'rejected'
                        }

                        setstate({
                            ...state, status, data, input, httpStatus
                        })

                        return
                    })
                    .catch((error) => {
                        input.email = ''

                        setstate({
                            ...state, status: 'fulfilled', data, input, httpStatus
                        })

                        dispatch(resetAuth0())
                        return null;
                    });
            } else {
                status = 'rejected'
            }
        } catch (error) {
            status = 'rejected'
            httpStatus = 500
        }

        setstate({
            ...state, status, httpStatus
        })
    }

    const toggleAlternativeSignUp = () => {
        if (!auth0.processing) {
            let { password } = state
            password.form = !state.password.form

            setstate({
                ...state, password
            })
        }
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
            let { password } = state
            password.visibility = !state.password.visibility

            setstate({
                ...state, password
            })
        }
    }

    const togglePasswordPolicy = () => {
        if (!auth0.processing) {
            let { password } = state
            password.policy = !state.password.policy

            setstate({
                ...state, password
            })
        }
    }

    const signInWithGoogle = () => {
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

            const signInProps = {
                identity: 'google',
            }

            dispatch(Alt_FirebaseSSO_SignIn(signInProps))
        }
    }

    if (auth0.sso) {
        const state = {
            cockpit_SSO: true
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
                <title>Big Fan Launch</title>
            </Helmet>

            {
                state.status === 'rejected' ? (
                    state.httpStatus === 200 ? (
                        <>
                            <Navigate replace to="/auth/sign-in" />
                        </>
                    ) : (
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
                    )
                ) : state.status === 'fulfilled' ? (
                    <div className="wrapper md:align-middle align-baseline w-full overflow-auto md:h-screen h-auto">
                        <section className="gx-container md:h-screen rounded-md w-full flex items-center justify-center" style={CONFIG_MAX_WIDTH}>
                            <div className="flex md:flex-row flex-col align-middle items-center w-full md:pb-0 pb-10">
                                <div className="md:basis-3/5 md:px-6 px-8 w-full flex flex-col py-6 overflow-auto">
                                    <span className="text-lg self-start text-stone-500 tracking-wider leading-7 block pt-3 md:pt-0">
                                        Hi there,
                                    </span>

                                    <div className="flex flex-row align-middle items-center gap-x-3 md:pb-3">
                                        <span className="text-xl text-stone-500 md:text-start text-start block">
                                            Welcome to <span className="text-orange-500">{APPLICATION.NAME}</span>.
                                        </span>
                                    </div>

                                    <div className="flex flex-row w-full align-middle justitfy-between items-center md:hidden">
                                        <div className="w-60 pt-4 mx-auto pb-3">
                                            <img src={smallAsset} alt={"connecting_teams_rafiki"} width="auto" className="block text-center m-auto" />
                                        </div>
                                    </div>

                                    <div className="w-full text-sm text-stone-600 float-right">
                                        <span className="block py-4 text-base md:text-lg">
                                            Before we take off, let's run through some quick pre-flight checks to ensure everything is ready for a smooth launch.

                                            <span className="text-base md:text-lg pt-4 text-stone-500 block">
                                                <span className=" text-base flex md:gap-x-2 md:flex-row flex-col gap-y-1 align-middle md:items-center">
                                                    <span className="text-orange-600 text-sm">
                                                        Pre-flight Check #1:
                                                    </span>

                                                    Let's set up your account.
                                                </span>
                                            </span>
                                        </span>
                                    </div>

                                    {
                                        state.password.form ? (
                                            <div className="w-full block m-auto py-3">
                                                <form className="w-full m-auto md:w-2/3 flex flex-col" /* onSubmit={passwordEmailInvitationHandler} */>
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
                                                            <input type={state.password.visibility ? 'text' : 'password'} name="password" id="password" placeholder="********" autoComplete="off"
                                                                className={classNames(
                                                                    'text-stone-900 ring-slate-300 placeholder:text-stone-500 focus:border-0 focus:outline-none focus:ring-orange-600 focus:outline-orange-500 hover:border-stone-400 border border-stone-300',
                                                                    'block w-full rounded-md py-2 pl-3 pr-8 text-sm'
                                                                )} onChange={onChangeHandler} onBlur={onInputBlur} value={state.input.password} required />

                                                            <div className="absolute inset-y-0 right-0 flex items-center w-8">
                                                                {
                                                                    state.password.visibility ? (
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
                                                            <input type={state.password.visibility ? 'text' : 'password'} name="confirm" id="confirm" placeholder="********" autoComplete="off" disabled={auth0.processing ? true : false}
                                                                className={classNames(
                                                                    'text-stone-900 ring-slate-300 placeholder:text-stone-500 focus:border-0 focus:outline-none focus:ring-orange-600 focus:outline-orange-500 hover:border-stone-400 border border-stone-300',
                                                                    'block w-full rounded-md py-2 pl-3 pr-8 text-sm'
                                                                )} onChange={onChangeHandler} onBlur={onInputBlur} value={state.input.confirm} required />
                                                        </div>
                                                    </div>

                                                    <div className="w-full py-2">
                                                        <span onClick={togglePasswordPolicy} className="text-stone-600 hover:text-orange-600 text-sm m-auto flex flex-row-reverse gap-x-1 align-middle items-center cursor-pointer">
                                                            <span>Password policy</span>
                                                            <span className="fa-regular fa-circle-info fa-lg"></span>
                                                        </span>
                                                    </div>

                                                    <div className="pt-3 flex justify-center">
                                                        <button type="submit" className="w-44 disabled:cursor-not-allowed text-sm rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-500 text-white disabled:bg-orange-600 hover:bg-orange-600 focus:outline-none flex items-center justify-center" disabled={auth0.processing}>
                                                            {
                                                                auth0.processing && auth0.provider === 'password' ? (
                                                                    <span className="flex flex-row items-center">
                                                                        <i className="fad fa-spinner-third fa-xl fa-spin mr-2"></i>
                                                                        <span>Creating...</span>
                                                                    </span>
                                                                ) : (
                                                                    <span>Create</span>
                                                                )
                                                            }
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        ) : (
                                            <div className="w-full md:w-1/2 mx-auto py-4">
                                                <div className="w-full">
                                                    <button type="button" onClick={signInWithGoogle} className="w-full border-stone-400 py-2 text-stone-700 hover:text-orange-600 hover:border-orange-600 transition duration-150 disabled:cursor-not-allowed text-sm rounded-md border shadow-sm focus:outline-none " disabled={auth0.processing}>
                                                        <span className="pl-2 block">
                                                            {
                                                                auth0.processing && auth0.provider === 'google' ? (
                                                                    <span className="flex flex-row items-center justify-center align-middle text-stone-600 gap-x-4">
                                                                        <i className="fad fa-spinner fa-xl fa-spin"></i>
                                                                        <span className="tracking-wider">Signing you up</span>
                                                                    </span>
                                                                ) : (
                                                                    <span className="flex items-center gap-x-3 px-4 justify-center align-middle">
                                                                        <i className="fab fa-google fa-xl"></i>
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
                                                    <button type="button" onClick={toggleAlternativeSignUp} className="w-full border-stone-400 py-2 text-stone-700 hover:text-orange-600 hover:border-orange-600 transition duration-150 disabled:cursor-not-allowed text-sm rounded-md border shadow-sm focus:outline-none " disabled={auth0.processing}>
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

                                    <div className="mx-auto py-3 text-center">
                                        <p className="text-sm text-stone-500 md:pb-0">
                                            © {new Date().getFullYear()}. Elevated Acts of Appreciation, <span className="text-orange-600 block">Tip by Tip.</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="md:basis-2/5 hidden md:block h-screen px-4 py-6">
                                    <img className="h-full bg-orange-100 rounded-2xl" src={smallAsset} alt={"hello_i'm_carol"} loading="lazy" />
                                </div>
                            </div>
                        </section>
                    </div>
                ) : (
                    <div className="wrapper md:align-middle align-baseline w-full overflow-auto md:h-screen h-auto">
                        <section className="gx-container md:h-screen h-auto rounded-md w-full flex items-center justify-center" style={STYLE.MAX_WIDTH}>
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

            <PasswordPolicy
                show={state.password.policy}
                showOrHide={togglePasswordPolicy}
            />
        </React.Fragment>
    )
}