import { Helmet } from "react-helmet"
import React, { useState } from "react"

import { AUTH } from "../../api/API_Registry"
import { useAppSelector } from "../../store/hooks"
import HttpServices from "../../services/HttpServices"
import { sendPasswordResetEmail } from "firebase/auth"
import { firebaseAuth } from "../../firebase/firebaseConfigs"
import sent from "../../assets/images/b0150150c01367a2eb2c9337c8a0f752.svg"
import forgot from "../../assets/images/99be4d5d0173d5720acec57040443dc.svg"
import { APPLICATION, CONFIG_MAX_WIDTH } from "../../global/ConstantsRegistry"
import { emailValidator, classNames, DeviceInfo } from "../../lib/modules/HelperFunctions"
import { G_onInputChangeHandler, G_onInputBlurHandler } from "../../components/lib/InputHandlers"
import { ERR_500 } from "../errors/ERR_500"
import { Link } from "react-router-dom"

export const PasswordRecovery = () => {
    const [state, setstate] = useState({
        posting: false,
        httpStatus: 100,
        status: 'pending',
        input: {
            email: '',
        }, errors: {
            email: '',
        }
    })

    const auth0: any = useAppSelector(state => state.auth0)

    const onChangeHandler = (e: any) => {
        let { posting } = state

        if (!posting) {
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
        let { posting } = state

        if (!posting) {
            let output: any = G_onInputBlurHandler(e, auth0.processing, '')
            let { input } = state
            let { errors }: any = state

            input[e.target.name] = output.value
            errors[e.target.name] = output.error

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

        setstate({
            ...state, errors
        })

        return valid;
    };

    const onFormSubmitHandler = (e: any) => {
        e.preventDefault()
        let { posting } = state

        if (!posting) {

            let passedValidation = validateForm()

            setstate({
                ...state, posting: true, httpStatus: 100
            })

            passwordRecoveryCheck()
        }
    }

    const resetAccountPassword = async () => {
        let { input } = state
        let { errors } = state

        sendPasswordResetEmail(firebaseAuth, input.email)
            .then((result: any) => {
                // Password reset email sent!
                // ..
                console.log(result);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;

                console.log(error);
            });
    }

    const passwordRecoveryCheck = async () => {
        let { input } = state
        let { errors } = state
        let { posting } = state
        let { httpStatus } = state

        try {
            let formData = new FormData()
            formData.append('email', input.email)
            formData.append('device_name', DeviceInfo())

            const recoveryResp: any = await HttpServices.httpPost(AUTH.PASSWD_RECOVERY, formData)
            const payload = recoveryResp.data.payload
            httpStatus = recoveryResp.status

            if (recoveryResp.data.success) {
                if (payload.identity.provider_id === 'google.com') {
                    httpStatus = 403
                } else {
                    resetAccountPassword()
                }
            } else {
                httpStatus = 404
            }

            posting = false
        } catch (error) {
            console.log(error);

            httpStatus = 500
            posting = false
        }

        setstate({
            ...state, httpStatus, errors, posting
        })
    }

    return (
        <React.Fragment>
            <Helmet>
                <title>Forgot Password?</title>
            </Helmet>

            <div className="wrapper md:align-middle align-baseline w-full overflow-auto md:h-screen h-auto">
                <section className="gx-container rounded-md md:h-screen h-full w-full" style={CONFIG_MAX_WIDTH}>
                    <div className="flex md:flex-row flex-col align-middle items-center w-full md:h-screen h-auto md:pb-0 justify-center">
                        {
                            state.httpStatus === 200 ? (
                                <>
                                    <div className="md:basis-2/3 md:px-6 px-6 w-full md:pt-8 flex flex-col text-center md:py-6 pt-8">
                                        <span className="text-2xl text-orange-500 tracking-wider leading-7 block mb-2 md:pt-0">Check Your Mail</span>

                                        <div className="flex flex-row w-full align-middle justitfy-between items-center">
                                            <div className="w-48 pt-4 mx-auto pb-3">
                                                <img src={sent} alt={"link_sent"} width="auto" className="block text-center m-auto" />
                                            </div>
                                        </div>

                                        <div className="w-full md:w-2/3 mx-auto text-sm text-stone-700 float-right">
                                            <span className="block py-4 text-lg md:text-lg">
                                                We've sent you and email with a link to reset your password.

                                                <span className="text-sm pt-4 text-stone-500 block">
                                                    <span className="block pt-2 pb-3">
                                                        Check your span and promotions folder if it doesn't appear in your main inbox.
                                                    </span>
                                                </span>
                                            </span>
                                        </div>

                                        <div className="mx-auto md:py-4 py-6 text-center block w-full">
                                            <p className="text-sm text-stone-500 pb-4">
                                                © {new Date().getFullYear()}. Elevated Acts of Appreciation, <span className="text-orange-600 block">Tip by Tip.</span>
                                            </p>
                                        </div>
                                    </div>
                                </>
                            ) : state.httpStatus === 500 ? (
                                <>
                                    <ERR_500 />
                                </>
                            ) : (
                                <>
                                    <div className="md:basis-2/3 md:px-6 px-6 w-full md:pt-8 flex flex-col md:py-6 pt-8">
                                        <Link to={"/"} className="text-2xl self-start text-orange-500 tracking-wider leading-7 block mb-2 md:pt-0">{APPLICATION.NAME}</Link>

                                        <div className="w-full text-sm text-stone-600 float-right">
                                            <span className="block py-4 text-xl md:text-2xl">
                                                Forgot Password?

                                                <span className="text-base pt-4 text-stone-500 block">
                                                    <span className="block pt-2 pb-3">
                                                        Enter the email that you used when you signed up to recover your password, and we'll send you a <span className="text-orange-500">password reset link.</span>
                                                    </span>
                                                </span>
                                            </span>
                                        </div>

                                        {
                                            state.httpStatus === 404 ? (
                                                <div className="px-2 md:py-2 border-l-2 bg-red-50 border-red-300 border-dashed rounded-sm mb-3">
                                                    <div className="flex flex-row align-middle items-center text-red-700 px-2">
                                                        <i className="fa-duotone fa-exclamation-circle fa-xl mt-1 text-red-700 flex-none"></i>

                                                        <div className="flex-auto ml-1 mt-1">
                                                            <span className="text-sm pl-3 block py-2 text-red-700">
                                                                The email you entered doesn't match our records. <span className="md:py-1 md:block">Please double-check and try again</span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : state.httpStatus === 403 ? (
                                                <div className="px-2 md:py-2 border-l-2 bg-orange-50 border-orange-300 border-dashed rounded-sm mb-3">
                                                    <div className="flex flex-row align-middle items-center text-orange-700 px-2">
                                                        <i className="fa-duotone fa-exclamation-circle fa-xl mt-1 text-orange-700 flex-none"></i>

                                                        <div className="flex-auto ml-1 mt-1">
                                                            <span className="text-sm pl-3 block py-2 text-orange-700">
                                                                Password recovery is disabled for users logged in via <span className="font-bold">Google accounts.</span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : null
                                        }

                                        <form className="w-full md:w-2/3 pt-3" onSubmit={onFormSubmitHandler}>
                                            <div className="shadow-none pb-3">
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
                                            </div>

                                            <div className="pb-3 pt-3 mb-3">
                                                <button type="submit" className="w-36 disabled:cursor-not-allowed text-sm rounded-md border border-transparent shadow-sm px-4 py-1.5 bg-orange-500 text-white disabled:bg-orange-600 hover:bg-orange-600 focus:outline-none flex items-center justify-center" disabled={auth0.processing}>
                                                    {
                                                        state.posting ? (
                                                            <span className="flex flex-row items-center">
                                                                <i className="fad fa-spinner-third fa-xl fa-spin mr-2"></i>
                                                                <span>Sending...</span>
                                                            </span>
                                                        ) : (
                                                            <span>Send Link</span>
                                                        )
                                                    }
                                                </button>
                                            </div>
                                        </form>

                                        <span className="text-sm text-stone-500 block">
                                            In case of any issue, reach out to our admin at <span className="text-orange-600">admin@email.com</span>
                                        </span>

                                        <div className="mx-auto md:py-4 py-6 text-center block w-full">
                                            <p className="text-sm text-stone-500 pb-4">
                                                © {new Date().getFullYear()}. Elevated Acts of Appreciation, <span className="text-orange-600 block">Tip by Tip.</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="md:basis-1/2 hidden md:block px-4 py-6 md:h-screen h-auto">
                                        <img className="h-full rounded-2xl bg-orange-100" src={forgot} alt={"forgot_passwd"} loading="lazy" />
                                    </div>
                                </>
                            )
                        }
                    </div>
                </section>
            </div >
        </React.Fragment >
    )
}