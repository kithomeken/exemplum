import { toast } from "react-toastify"
import React, { useState } from "react"
import { sendEmailVerification, updateEmail } from "firebase/auth";

import { ERR_404 } from "../errors/ERR_404"
import { ERR_500 } from "../errors/ERR_500"
import { ACCOUNT } from "../../api/API_Registry"
import { useAppSelector } from "../../store/hooks"
import HttpServices from "../../services/HttpServices"
import { Loading } from "../../components/modules/Loading"
import { firebaseAuth } from "../../firebase/firebaseConfigs";
import noActionRequired from '../../assets/images/7769792_3236194.svg'
import { DateFormating, classNames, emailValidator } from "../../lib/modules/HelperFunctions"
import { G_onInputChangeHandler, G_onInputBlurHandler } from "../../components/lib/InputHandlers"
import { Helmet } from "react-helmet";

export const ChangeEmail = () => {
    const [state, setstate] = useState({
        data: null,
        posting: false,
        httpStatus: 200,
        status: 'pending',
        input: {
            email: 'rado@email.com'
        },
        errors: {
            email: ''
        },
        process: {
            type: '',
            state: false,
        }
    })

    const auth0: any = useAppSelector(state => state.auth0)
    console.log('RRCV77678U', firebaseAuth.currentUser);

    React.useEffect(() => {
        fetchAccountEmailHistory()
    }, [])

    const fetchAccountEmailHistory = async () => {
        const providerId = auth0.provider
        let { status } = state

        if (providerId === 'password') {
            let { httpStatus } = state
            let { data } = state

            try {
                const response: any = await HttpServices.httpGet(ACCOUNT.EMAIL_HISTORY)
                httpStatus = response.status

                if (response.data.success) {
                    status = 'fulfilled'
                    data = response.data.payload
                } else {
                    status = 'rejected'
                }
            } catch (error) {
                console.log(error);
                status = 'rejected'
            }

            setstate({
                ...state, status, data, httpStatus
            })

            return
        }

        status = 'fulfilled'

        setstate({
            ...state, status
        })

        return
    }

    const emailChangesLeft = () => {
        const emailCount = state.data.emails.length
        const remainder = 4 - emailCount

        return remainder
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

    function validateEmail(emailToValidate: any) {
        let { data } = state

        for (let i = 0; i < data.emails.length; i++) {
            if (data.emails[i].email === emailToValidate) {
                return false;
            }
        }
        return true;
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
                    console.log('USBN909 0-03', errorCode);

                    if (errorCode === 'auth/too-many-requests') {
                        errorMessage = 'Too many requests for sent. Please try again later.'
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

    const onFormHandler = (e: any) => {
        e.preventDefault()
        let { posting } = state

        if (!posting) {
            let passedValidation = validateForm()
            let { posting } = state
            let { errors } = state
            let { input } = state

            if (passedValidation) {
                if ((validateEmail(input.email))) {
                    posting = true
                    changeAccountEmail()
                } else {
                    errors.email = 'This email is already present in your email history or has been used previously.'
                }

                setstate({
                    ...state, posting, errors
                })
            }
        }
    }

    const changeAccountEmail = () => {
        let { posting } = state
        let { errors } = state
        let { input } = state

        updateEmail(firebaseAuth.currentUser, input.email)
            .then(() => {
                // Post email update, send email verification mail
                sendEmailVerification(firebaseAuth.currentUser)
                    .then(() => {
                        posting = false

                        setstate({
                            ...state, posting, errors
                        })
                    });
            }).catch((error) => {
                posting = false
                const errorCode = error.code;
                let errorMessage = error.message;
                console.log('USBN909 0-03', errorCode);

                if (errorCode === 'auth/operation-not-allowed') {
                    errorMessage = 'Please verify the new email before changing email'
                } else {
                    errorMessage = 'Something went wrong. Kindly try again'
                }

                errors.email = errorMessage

                setstate({
                    ...state, posting, errors
                })
            });
    }

    return (
        <React.Fragment>
            <Helmet>
                <title>Change Email</title>
            </Helmet>

            <div className="w-full px-2">
                <p className="text-2xl text-amber-600 mb-3">
                    Change Email
                </p>

                {
                    auth0.provider === 'password' ? (
                        <>
                            {
                                state.status === 'rejected' ? (
                                    state.httpStatus === 404 ? (
                                        <ERR_404
                                            compact={true}
                                        />
                                    ) : (
                                        <ERR_500 />
                                    )
                                ) : state.status === 'fulfilled' ? (
                                    <>
                                        <p className="text-sm text-slate-500 mb-1">
                                            <span className="text-slate-700 mr-2">
                                                Current e-mail address:
                                            </span>

                                            <span className="text-amber-600 mr-2">
                                                {auth0.identity.email}
                                            </span>
                                        </p>

                                        {
                                            emailChangesLeft() === 0 ? (
                                                <div className="w-12/12 py-3">
                                                    <div className="rounded-md mb-2 border-0 border-sky-400 bg-sky-100 py-4 px-4">
                                                        <div className="flex flex-row text-sky-700">
                                                            <i className="fas fa-info-circle fa-lg mt-1 text-blue-700 flex-none"></i>

                                                            <div className="flex-auto ml-1">
                                                                <span className="text-sm pl-3 block text-blue-900 mb-1">
                                                                    No action required
                                                                </span>

                                                                <span className="text-sm pl-3 block text-blue-700">
                                                                    You've exhausted the maximum changes allowed for email addresses.
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                !firebaseAuth.currentUser.emailVerified ? (
                                                    <div className="w-/12 pt-3 pb-2">
                                                        <div className="mb-2 bg-sky-00 py-4 px-4 border-2 border-sky-300 border-dashed rounded-md">
                                                            <div className="flex flex-row align-middle items-center text-sky-700 px-2">
                                                                <i className="fa-duotone fa-info-circle fa-2x mt-1 text-blue-700 flex-none"></i>

                                                                <div className="flex-auto ml-1 mt-1">
                                                                    <span className="text-sm pl-3 block text-blue-900 mb-1">
                                                                        Verification pending
                                                                    </span>

                                                                    <span className="text-sm pl-3 block text-blue-700">
                                                                        A verification email was sent to <span className="text-slate-800">{state.data.emails[0].email}</span>, kindly check your email to complete the update.                                                        </span>
                                                                </div>
                                                            </div>

                                                            <div className="flex flex-row-reverse align-middle items-center pt-3">
                                                                {
                                                                    state.data.emails.length > 1 ? (
                                                                        <span className="text-sm flex-none shadow-none px-3 py-1 bg-inherit text-stone-600 hover:underline hover:cursor-pointer mr-2 sm:w-auto sm:text-sm">
                                                                            {
                                                                                state.process.type === 'undo' && state.process.state ? 'Undoing' : 'Undo email change'
                                                                            }
                                                                        </span>
                                                                    ) : null
                                                                }

                                                                <span onClick={resendEmailVerification} className="text-sm flex-none shadow-none px-3 py-1 bg-inherit text-stone-600 hover:underline hover:cursor-pointer mr-2 sm:w-auto sm:text-sm">
                                                                    {
                                                                        state.process.type === 'resend' && state.process.state ? 'Resending' : 'Resend email'
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="w-12/12 py-3">
                                                            <div className="rounded-md mb-2 border-0 border-amber-400 bg-amber-100 py-4 px-4">
                                                                <div className="flex flex-row items-center align-middle text-amber-600">
                                                                    <i className="fas fa-exclamation-circle fa-xl text-amber-600 flex-none"></i>

                                                                    <div className="flex-auto">
                                                                        <span className="text-sm pl-3 block">
                                                                            You can only change your email a maximum of 3 times.
                                                                            <span className="text-amber-700 block">Email changes left - {emailChangesLeft()}</span>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <form className="space-y-3 shadow-none mb-3 md:w-3/5" onSubmit={onFormHandler}>
                                                                <div className="shadow-none space-y-px mb-4">
                                                                    <label htmlFor="email" className="block text-sm leading-6 text-stone-700 mb-1">Email:</label>

                                                                    <div className="relative mt-2 rounded shadow-sm">
                                                                        <input type="email" name="email" id="email" placeholder="john.doe@email.com" autoComplete="off" disabled={state.posting ? true : false}
                                                                            className={classNames(
                                                                                'text-stone-900 ring-slate-300 placeholder:text-stone-500 focus:border-0 focus:outline-none focus:ring-amber-600 focus:outline-amber-500 hover:border-stone-400 border border-stone-300',
                                                                                'block w-full rounded-md py-2 pl-3 pr-8  text-sm'
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

                                                                <div className="w-full">
                                                                    <button type="submit" className="disabled:cursor-not-allowed text-sm rounded-md border border-transparent shadow-sm px-3 py-1.5 bg-amber-500 text-white disabled:bg-amber-600 hover:bg-amber-600 focus:outline-none flex items-center justify-center" disabled={state.posting}>
                                                                        {
                                                                            state.posting ? (
                                                                                <span className="flex flex-row items-center gap-x-2 px-2">
                                                                                    <i className="fad fa-spinner-third fa-xl fa-spin"></i>
                                                                                    <span>Updating...</span>
                                                                                </span>
                                                                            ) : (
                                                                                <span>Update Email</span>
                                                                            )
                                                                        }
                                                                    </button>
                                                                </div>
                                                            </form>
                                                        </div>
                                                    </>
                                                )
                                            )
                                        }

                                        <div className="w-full pl-1 pt-3">
                                            <p className="text-sm text-slate-700 mb-5">
                                                <span className="text-sm text-gray-500 block">
                                                    Your current and previous e-mail addresses that you've used
                                                </span>
                                            </p>

                                            {
                                                state.data.emails.map((account: any, index: any) => {
                                                    return (
                                                        <div key={index} className="flex flex-row border-y w-full divide-gray-200 align-middle py-1">
                                                            <div className="flex-auto">
                                                                <div className="py-2 whitespace-wrap">
                                                                    <span className="block text-stone-600 mb-1 text-sm">
                                                                        {account.email}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            <div className="w-40 flex align-middle items-center text-left flex-row">
                                                                <div className="py-2 whitespace-wrap">
                                                                    {
                                                                        state.data.verified === null && index === 0 ? (
                                                                            <span className="block text-orange-600 mb-1 text-xs">
                                                                                Pending Verification
                                                                            </span>
                                                                        ) : (
                                                                            account.email === auth0.identity.email ? (
                                                                                <span className="block text-emerald-700 mb-1 text-xs">
                                                                                    Current Email
                                                                                </span>
                                                                            ) : (
                                                                                <span className="block text-slate-600 mb-1 text-xs">
                                                                                    {DateFormating(account.created_at)}
                                                                                </span>
                                                                            )
                                                                        )
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </>
                                ) : (
                                    <div className="w-full h-full flex flex-col justify-center">
                                        <div className="flex-grow">
                                            <Loading />
                                        </div>
                                    </div>
                                )
                            }
                        </>
                    ) : (
                        <div className="bg-white px-4 pt-6 pb-4">
                            <div className="flex flex-col pt-4 items-center">
                                <div className="mx-auto flex-shrink-0 flex items-center justify-center mb-3 sm:mx-0 w-52">
                                    <img src={noActionRequired} alt="broken_robot" width="auto" className="block text-center m-auto" />
                                </div>

                                <div className="mt-3 text-center m-auto text-slate-600">
                                    <span className="text-amber-600 mb-2 block">
                                        Feature Not Supported
                                    </span>

                                    <div className="text-sm">
                                        This feature is not supported for users who signed in with a Google account at the moment.
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        </React.Fragment>
    )
}