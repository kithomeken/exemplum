import { Helmet } from "react-helmet"
import React, { useState } from "react"
import { Link, Navigate, useLocation } from "react-router-dom"
import { applyActionCode, confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth"

import { ERR_500 } from "../errors/ERR_500"
import { PasswordPolicy } from "./PasswordPolicy"
import { GenericError } from "../errors/GenericError"
import { Loading } from "../../components/modules/Loading"
import { firebaseAuth } from "../../firebase/firebaseConfigs"
import emptyBox from "../../assets/images/12704364_5041143.svg"
import rockOn from "../../assets/images/6f666c6b94695e15346964a4aa2532e8.svg"
import { CONFIG_MAX_WIDTH, APPLICATION } from "../../global/ConstantsRegistry"
import { classNames, passwordValidator } from "../../lib/modules/HelperFunctions"
import { G_onInputBlurHandler, G_onInputChangeHandler } from "../../components/lib/InputHandlers"
import { AUTH } from "../../api/API_Registry"
import HttpServices from "../../services/HttpServices"

export const EmailActions = () => {
    const [state, setstate] = useState({
        posting: false,
        actionMode: '',
        httpStatus: 200,
        status: 'pending',
        pwdVisibility: false,
        data: null,
        input: {
            email: '',
            password: '',
            confirm: '',
        },
        errors: {
            password: '',
            confirm: ''
        },
        show: {
            pwdPol: false,
        }
    })

    const location = useLocation()
    const [actionCode, setActionCode] = useState(null)
    const [authRedirect, setAuthRedirect] = useState(false)

    const [parState, setParState] = useState({
        email: '',
        password: '',
        autoSignIn: false,
    })

    const [postExec, setPostExec] = useState({
        status: null,
        message: null
    })

    React.useEffect(() => {
        parseQueryString()
    }, [])

    React.useEffect(() => {
        let timer: any

        if (postExec.status === 0) {
            timer = setTimeout(() => {
                setAuthRedirect(true)
            }, 6000);
        }

        // Cleanup the timer if the component unmounts or if activityTriggered changes
        return () => clearTimeout(timer);
    }, [postExec]);

    function parseQueryString() {
        const params = {};
        let { data } = state
        let search = location.search

        if (search) {
            search
                .slice(1) // Remove the leading '?'
                .split('&') // Split by '&' to get individual key-value pairs
                .forEach(pair => {
                    const [key, value] = pair.split('='); // Split each pair by '=' to get key and value
                    params[key] = decodeURIComponent(value || ''); // Decode URI component and assign to params
                });
        }

        data = params;
        setActionCode(data.oobCode)
        const actionMode = data.mode

        switch (actionMode) {
            case 'resetPassword':
                handleResetPassword(data.oobCode, data.lang, actionMode);
                break;

            case 'verifyEmail':
                handleVerifyEmail(data.oobCode, data.lang, actionMode);
                break;

            case 'recoverEmail':
                // handleRecoverEmail(auth, actionCode, lang);
                break;

            default:
            // Error: invalid mode.
        }

        return params;
    }

    function handleVerifyEmail(actionCode: any, lang: any, actionMode: any) {
        let { status } = state
        let { httpStatus } = state
        firebaseAuth.languageCode = lang

        applyActionCode(firebaseAuth, actionCode).then((resp) => {
            status = 'fulfilled'

            setstate({
                ...state, status, httpStatus, actionMode
            })

            // TODO: Display a confirmation message to the user.
            // You could also provide the user with a link back to the app.

            // TODO: If a continue URL is available, display a button which on
            // click redirects the user back to the app via continueUrl with
            // additional state determined from that URL's parameters.
        }).catch((error) => {
            status = 'rejected'
            const errorCode = error.code;
            let errorMessage = error.message;

            let popUpErrors = [
                'auth/user-disabled',
                'auth/expired-action-code',
                'auth/invalid-action-code',
            ]

            if (popUpErrors.includes(errorCode)) {
                httpStatus = 403
            } else {
                httpStatus = 500
                errorMessage = null
            }

            setstate({
                ...state, status, httpStatus, actionMode
            })
        });
    }

    function handleResetPassword(actionCode: any, lang: any, actionMode: any) {
        let { input } = state
        let { status } = state
        let { httpStatus } = state
        firebaseAuth.languageCode = lang

        verifyPasswordResetCode(firebaseAuth, actionCode).then((email) => {
            status = 'fulfilled'
            input.email = email

            setstate({
                ...state, status, httpStatus, actionMode, input
            })
        }).catch((error) => {
            status = 'rejected'
            const errorCode = error.code;

            let popUpErrors = [
                'auth/user-disabled',
                'auth/expired-action-code',
                'auth/invalid-action-code',
            ]

            if (popUpErrors.includes(errorCode)) {
                httpStatus = 403
            } else {
                httpStatus = 500
            }

            setstate({
                ...state, status, httpStatus, actionMode
            })
        });
    }

    function handlePasswordChange() {
        let { input } = state

        confirmPasswordReset(firebaseAuth, actionCode, input.password).then((resp) => {
            // Invalidate all current/previous user's access token
            accessTokenInvalidation()

            setParState({
                autoSignIn: true,
                email: input.email,
                password: input.password
            })

            setPostExec({
                status: 0,
                message: null
            })
        }).catch((error) => {
            const errorCode = error.code;
            let errorMessage = error.message;
            console.log(errorMessage);

            let popUpErrors = [
                'auth/expired-action-code',
                'auth/invalid-action-code',
            ]

            if (errorCode === 'auth/user-disabled') {
                errorMessage = 'Your account was been disabled.'
            } else if (popUpErrors.includes(errorCode)) {
                errorMessage = 'The password reset link you followed is either broken or has expired. Please request a new password reset link'
            } else {
                errorMessage = APPLICATION.ERR_MSG
            }

            setPostExec({
                status: 1,
                message: errorMessage
            })
        });
    }

    const onChangeHandler = (e: any) => {
        let { posting } = state

        if (!posting) {
            let output: any = G_onInputChangeHandler(e, posting)
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
        let { posting } = state

        if (!posting) {
            let output: any = G_onInputBlurHandler(e, posting, '')
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
        let { posting } = state

        if (!posting) {
            setstate({
                ...state, pwdVisibility: !state.pwdVisibility
            })
        }
    };

    const showOrHidePasswordPolicy = () => {
        let { posting } = state

        if (!posting) {
            let { show } = state
            show.pwdPol = !state.show.pwdPol

            setstate({
                ...state, show
            })
        }
    }

    const validateForm = () => {
        let valid = true
        let { input } = state
        let { errors } = state;

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

    const passwordResetFormHandler = (e: any) => {
        e.preventDefault()
        let { posting } = state

        if (!posting) {
            let passedValidation = validateForm()

            if (passedValidation) {
                setstate({
                    ...state, posting: true
                })

                handlePasswordChange()
            }
        }
    }

    const accessTokenInvalidation = async() => {
        let { input } = state

        try {
            let formData = new FormData()
            formData.append('email', input.email)

            await HttpServices.httpPost(AUTH.TOKEN_INVALIDATION, formData)
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <React.Fragment>
            {
                state.status === 'rejected' ? (
                    state.httpStatus === 403 ? (
                        state.actionMode === 'verifyEmail' ? (
                            <GenericError
                                description={"The verification link you followed is either broken or has expired. Please request a new verification link."}
                            />
                        ) : state.actionMode === 'resetPassword' ? (
                            <GenericError
                                description={"The password reset link you followed is either broken or has expired. Please request a new password reset link."}
                            />
                        ) : state.actionMode === 'recoverEmail' ? (
                            <GenericError
                                description={"The verification link you followed is probably broken or the lifespan has expired. Kindly request for a new invitation link"}
                            />
                        ) : null
                    ) : (
                        <ERR_500 />
                    )
                ) : state.status === 'fulfilled' ? (
                    state.actionMode === 'verifyEmail' ? (
                        <>
                            <Helmet>
                                <title>Account Verification</title>
                            </Helmet>

                            <div className="w-full h-screen flex flex-col justify-center align-middle items-center">
                                <div className="mx-auto my-2 px-4 flex flex-col">
                                    <img src={emptyBox} alt="broken_robot" width="auto" className="block text-center m-auto w-68" />

                                    <div className="text-center m-auto text-slate-600 py-2 md:w-96">
                                        <span className="text-orange-600 mb-2 block">
                                            Verification Successful
                                        </span>

                                        <div className="text-sm">
                                            Your email has been successfully verified. You can now enjoy full access to our services
                                        </div>
                                    </div>

                                    <span className="text-sm text-stone-500 block py-3">
                                        In case of any issue,reach out to our support team at <span className="text-orange-600">support@email.com</span>
                                    </span>

                                    <div className="mx-auto md:py-4 py-6 text-center block w-full">
                                        <p className="text-sm text-stone-500 pb-4">
                                            <span className="text-orange-600">{APPLICATION.NAME}</span> © {new Date().getFullYear()}.
                                            Elevated Acts of Appreciation, <span className="text-orange-600 block">Tip by Tip.</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : state.actionMode === 'resetPassword' ? (
                        <>
                            <Helmet>
                                <title>Password Reset</title>
                            </Helmet>

                            {
                                postExec.status === 1 ? (
                                    <GenericError
                                        title="Password Reset Failed"
                                        description={postExec}
                                    />
                                ) : postExec.status === 0 ? (
                                    authRedirect ? (
                                        <Navigate to={'/auth/sign-in'} state={parState} replace />
                                    ) : (
                                        <div className="w-full h-screen flex flex-col justify-center align-middle items-center">
                                            <div className="mx-auto my-2 px-4 flex flex-col">
                                                <img src={rockOn} alt="rock_on" width="auto" className="block text-center m-auto w-80" />

                                                <div className="text-center m-auto text-slate-600 py-2 md:w-96">
                                                    <span className="text-orange-600 mb-2 block">
                                                        Password Reset Successful
                                                    </span>

                                                    <div className="text-sm">
                                                        Your password has been update, and we'll automatically sign you in shortly.
                                                    </div>
                                                </div>

                                                <div className="mx-auto md:py-4 py-6 text-center block w-full">
                                                    <p className="text-sm text-stone-500 pb-4">
                                                        <span className="text-orange-600">{APPLICATION.NAME}</span> © {new Date().getFullYear()}.
                                                        Elevated Acts of Appreciation, <span className="text-orange-600 block">Tip by Tip.</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )

                                ) : (
                                    <div className="wrapper md:align-middle align-baseline w-full overflow-auto md:h-screen h-auto">
                                        <section className="gx-container rounded-md md:h-screen h-full w-full" style={CONFIG_MAX_WIDTH}>
                                            <div className="flex md:flex-row flex-col align-middle items-center w-full md:h-screen h-auto md:pb-0 justify-center">
                                                <div className="md:basis-3/5 md:px-6 px-6 w-full md:pt-8 flex flex-col md:py-6 pt-8">
                                                    <Link to={"/"} className="text-2xl self-start text-orange-500 tracking-wider leading-7 block mb-2 md:pt-0">{APPLICATION.NAME}</Link>

                                                    <div className="w-full text-sm text-stone-600 float-right pb-4">
                                                        <span className="block py-3 text-xl md:text-2xl">
                                                            Set New Password

                                                            <span className="text-base pt-4 text-stone-500 block">
                                                                Ensure that your new password is different from the previous one for better security.
                                                            </span>
                                                        </span>
                                                    </div>

                                                    <form className="w-full md:w-3/5" onSubmit={passwordResetFormHandler}>
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
                                                                <input type={state.pwdVisibility ? 'text' : 'password'} name="confirm" id="confirm" placeholder="********" autoComplete="off" disabled={state.posting ? true : false}
                                                                    className={classNames(
                                                                        'text-stone-900 ring-slate-300 placeholder:text-stone-500 focus:border-0 focus:outline-none focus:ring-orange-600 focus:outline-orange-500 hover:border-stone-400 border border-stone-300',
                                                                        'block w-full rounded-md py-2 pl-3 pr-8 text-sm'
                                                                    )} onChange={onChangeHandler} onBlur={onInputBlur} value={state.input.confirm} required />
                                                            </div>
                                                        </div>

                                                        <div className="py-4 flex md:flex-row flex-col gap-x-3 gap-y-4">
                                                            <button type="submit" className="md:basis-1/2 w-44 disabled:cursor-not-allowed text-sm rounded-md border border-transparent shadow-sm px-4 py-1.5 bg-orange-500 text-white disabled:bg-orange-600 hover:bg-orange-600 focus:outline-none flex items-center justify-center" disabled={state.posting}>
                                                                {
                                                                    state.posting ? (
                                                                        <span className="flex flex-row items-center">
                                                                            <i className="fad fa-spinner-third fa-xl fa-spin mr-2"></i>
                                                                            <span>Updating...</span>
                                                                        </span>
                                                                    ) : (
                                                                        <span>Update Password</span>
                                                                    )
                                                                }
                                                            </button>

                                                            <span onClick={showOrHidePasswordPolicy} className="text-stone-600 md:basis-1/2 w-full hover:text-orange-600 text-sm m-auto flex flex-row-reverse gap-x-1 align-middle items-center cursor-pointer">
                                                                <span>Password policy</span>
                                                                <span className="fa-regular fa-circle-info fa-lg"></span>
                                                            </span>
                                                        </div>
                                                    </form>


                                                    <span className="text-sm text-stone-500 block py-3">
                                                        In case of any issue,reach out to our support team at <span className="text-orange-600">support@email.com</span>
                                                    </span>

                                                    <div className="mx-auto md:py-4 py-6 text-center block w-full">
                                                        <p className="text-sm text-stone-500 pb-4">
                                                            <span className="text-orange-600">{APPLICATION.NAME}</span> © {new Date().getFullYear()}.
                                                            Elevated Acts of Appreciation, <span className="text-orange-600 block">Tip by Tip.</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                                    </div>
                                )
                            }
                        </>
                    ) : state.actionMode === 'recoverEmail' ? (
                        <></>
                    ) : null
                ) : (
                    <div className="w-full h-screen flex flex-col justify-center align-middle items-center">
                        <Loading />
                    </div>
                )
            }

            <PasswordPolicy
                show={state.show.pwdPol}
                showOrHide={showOrHidePasswordPolicy}
            />
        </React.Fragment >
    )
}