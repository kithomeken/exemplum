import React from "react"
import { toast } from "react-toastify"
import { useDispatch } from "react-redux"

import { useAppSelector } from "../../store/hooks"
import { Loading } from "../../components/modules/Loading"
import StorageServices from "../../services/StorageServices"
import { firebaseAuth } from "../../firebase/firebaseConfigs"
import { classNames } from "../../lib/modules/HelperFunctions"
import mainAsset from "../../assets/images/illustration_3647294.svg"
import { captainIdentityLog } from "../../store/identityCheckActions"
import { onAuthStateChanged, sendEmailVerification } from "firebase/auth"
import { APPLICATION, CONFIG_MAX_WIDTH, STORAGE_KEYS } from "../../global/ConstantsRegistry"
import { G_onInputChangeHandler, G_onInputBlurHandler } from "../../components/lib/InputHandlers"

export const CNF_gA = () => {
    const [state, setstate] = React.useState({
        httpStatus: 200,
        status: 'pending',
        keepName: true,
        data: {
            email: '',
            display_name: '',
            emailVerified: false,
        },
        input: {
            first_name: '',
            last_name: '',
        },
        errors: {
            first_name: '',
            last_name: '',
        },
        process: {
            type: '',
            state: false,
        }
    })

    React.useEffect(() => {
        identityVerificationStatus()
    })

    const dispatch: any = useDispatch();
    const auth0: any = useAppSelector(state => state.auth0)
    const idC_State: any = useAppSelector(state => state.idC)

    const identityVerificationStatus = () => {
        let { data } = state
        let { status } = state
        let { httpStatus } = state

        /* 
        * Fetch Firebase identity data for
        * verification check
        */
        onAuthStateChanged(firebaseAuth,
            currentUser => {
                data.email = currentUser.email
                data.display_name = currentUser.displayName
                data.emailVerified = currentUser.emailVerified

                let verifiedA = currentUser.emailVerified ? '0' : '1'
                StorageServices.setLocalStorage(STORAGE_KEYS.ACC_VERIFIED, verifiedA)

                setstate({
                    ...state, status: 'fulfilled', data
                })
            },
            error => {
                console.error(error)
                httpStatus = 500
                status = 'rejected'

                setstate({
                    ...state, status, httpStatus, data
                })
            }
        );
    }

    const keepOrChangeDisplayName = () => {
        if (!idC_State.processing) {
            setstate({
                ...state, keepName: !state.keepName
            })
        }
    }

    const onChangeHandler = (e: any) => {
        if (!idC_State.processing) {
            let output: any = G_onInputChangeHandler(e, idC_State.processing)
            let { input } = state
            let { errors }: any = state

            switch (e.target.name) {
                case 'identifier':
                    output.value = output.value.toUpperCase()
                    break;

                default:
                    break;
            }

            input[e.target.name] = output.value
            errors[e.target.name] = output.error

            setstate({
                ...state, input, errors
            })
        }
    }

    const onInputBlur = (e: any) => {
        if (!idC_State.processing) {
            let { input } = state
            let { errors }: any = state

            let output: any = G_onInputBlurHandler(e, idC_State.processing, '')

            input[e.target.name] = output.value
            errors[e.target.name] = output.error

            setstate({
                ...state, input, errors
            })
        }
    }

    function formValidation() {
        let valid = true;

        let { input } = state
        let { errors } = state
        let { keepName } = state

        if (!keepName) {
            if (!input.first_name.trim()) {
                errors.first_name = 'First name cannot be empty';
                valid = false
            }

            if (!input.last_name.trim()) {
                errors.last_name = 'Last name cannot be empty';
                valid = false
            }
        }

        return valid
    }

    const onFormSubmitHandler = (e: any) => {
        e.preventDefault()
        let { data } = state

        if (!idC_State.processing) {
            let validity = formValidation()

            if (validity) {
                let identProps = null

                if (state.keepName) {
                    identProps = {
                        dataDump: {
                            keepName: state.keepName,
                            display_name: data.display_name,
                        }
                    }
                } else {
                    identProps = {
                        dataDump: {
                            keepName: state.keepName,
                            last_name: state.input.last_name,
                            first_name: state.input.first_name,
                        }
                    }
                }

                dispatch(captainIdentityLog(identProps))
            }
        }
    }

    const resendEmailVerification = () => {
        let { process } = state
        let { httpStatus } = state

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
                    httpStatus = 500
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
                        ...state, process, httpStatus
                    })
                });;
        }
    }

    const checkEmailVerification = () => {
        let { process } = state
        let { data } = state

        if (!process.state) {
            process.state = true
            process.type = 'verify'

            setstate({
                ...state, process
            })

            onAuthStateChanged(firebaseAuth,
                currentUser => {
                    data.email = currentUser.email
                    data.display_name = currentUser.displayName
                    data.emailVerified = currentUser.emailVerified

                    let verifiedA = currentUser.emailVerified ? '0' : '1'
                    StorageServices.setLocalStorage(STORAGE_KEYS.ACC_VERIFIED, verifiedA)

                    process.state = false

                    toast.success("Email verification complete", {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });

                    setstate({
                        ...state, process, data
                    })
                },
                error => {
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
                        ...state, process, data
                    })
                }
            );
        }
    }

    return (
        <React.Fragment>
            <div className="wrapper md:align-middle align-baseline w-full overflow-auto md:h-screen h-auto">
                <section className={`gx-container md:h-screen rounded-md w-full flex ${state.status === 'pending' ? 'md:items-center' : null} justify-center`} style={CONFIG_MAX_WIDTH}>
                    <div className="flex md:flex-row flex-col align-middle md:items-center w-full md:pb-0 pb-10">
                        <div className="md:basis-3/5 md:px-6 px-8 w-full py-6 overflow-auto">
                            {
                                state.status === 'rejected' ? (
                                    <>

                                    </>
                                ) : state.status === 'fulfilled' ? (
                                    <>
                                        <span className="text-2xl self-start text-orange-500 tracking-wider leading-7 block mb-2 md:pt-0 pt-4">{APPLICATION.NAME}</span>

                                        <div className="flex flex-row w-full align-middle justitfy-between items-center md:hidden">
                                            <div className="w-48 pt-4 mx-auto pb-3">
                                                <img src={mainAsset} alt={"hello_i'm_carol"} width="auto" className="block text-center m-auto" />
                                            </div>
                                        </div>

                                        <div className="w-full text-sm text-stone-600 float-right mb-4">
                                            <span className="text-base md:text-lg pt-4 text-stone-800 block">
                                                <span className="w-full text-start text-base flex md:gap-x-2 flex-col gap-y-1 align-middle">
                                                    <span className="text-orange-600 text-sm">
                                                        Pre-flight Check #2:
                                                    </span>

                                                    {
                                                        state.data.emailVerified ? (
                                                            <span>Let's put a name to your account.</span>
                                                        ) : (
                                                            <span>Before we put a name on your account, let's verify your email.</span>
                                                        )
                                                    }

                                                </span>
                                            </span>
                                        </div>

                                        {
                                            state.data.emailVerified ? (
                                                <div className="flex flex-col mb-3 w-full">
                                                    <form className="md:spac shadow-none mb-3" onSubmit={onFormSubmitHandler}>
                                                        {
                                                            auth0.provider === 'password' ? (
                                                                <div className="md:mb-2 flex flex-col md:flex-row md:space-x-4 pt-1">
                                                                    <div className="w-full md:w-1/2 mb-3">
                                                                        <label htmlFor="first_name" className="block text-sm leading-6 text-stone-600 mb-1">First Name:</label>

                                                                        <div className="relative mt-2 rounded shadow-sm">
                                                                            <input type="text" name="first_name" id="first_name" placeholder="First Name" autoComplete="off"
                                                                                className={classNames(
                                                                                    state.errors.first_name.length > 0 ?
                                                                                        'text-red-900 ring-slate-300 placeholder:text-red-400 focus:ring-red-600 border border-red-600 focus:outline-red-500' :
                                                                                        'text-stone-900 ring-slate-300 placeholder:text-stone-400 focus:border-0 focus:outline-none focus:ring-orange-600 focus:outline-orange-500 hover:border-stone-400 border border-stone-300',
                                                                                    'block w-full rounded-md py-2 pl-3 pr-8  text-sm'
                                                                                )} onChange={onChangeHandler} value={state.input.first_name} onBlur={onInputBlur} required />
                                                                            <div className="absolute inset-y-0 right-0 flex items-center w-8">
                                                                                {
                                                                                    state.errors.first_name.length > 0 ? (
                                                                                        <span className="fa-duotone text-red-500 fa-circle-exclamation fa-lg"></span>
                                                                                    ) : null
                                                                                }
                                                                            </div>
                                                                        </div>

                                                                        {
                                                                            state.errors.first_name.length > 0 ? (
                                                                                <span className='invalid-feedback text-xs text-red-600 pl-0'>
                                                                                    {state.errors.first_name}
                                                                                </span>
                                                                            ) : null
                                                                        }
                                                                    </div>

                                                                    <div className="w-full md:w-1/2 mb-3">
                                                                        <label htmlFor="last_name" className="block text-sm leading-6 text-stone-700 mb-1">Last Name:</label>

                                                                        <div className="relative mt-2 rounded shadow-sm">
                                                                            <input type="text" name="last_name" id="last_name" placeholder="Last Name" autoComplete="off"
                                                                                className={classNames(
                                                                                    state.errors.last_name.length > 0 ?
                                                                                        'text-red-900 ring-slate-300 placeholder:text-red-400 focus:ring-red-600 border border-red-600 focus:outline-red-500' :
                                                                                        'text-stone-900 ring-slate-300 placeholder:text-stone-400 focus:border-0 focus:outline-none focus:ring-orange-600 focus:outline-orange-500 hover:border-stone-400 border border-stone-300',
                                                                                    'block w-full rounded-md py-2 pl-3 pr-8  text-sm'
                                                                                )} onChange={onChangeHandler} value={state.input.last_name} onBlur={onInputBlur} required />
                                                                            <div className="absolute inset-y-0 right-0 flex items-center w-8">
                                                                                {
                                                                                    state.errors.last_name.length > 0 ? (
                                                                                        <span className="fa-duotone text-red-500 fa-circle-exclamation fa-lg"></span>
                                                                                    ) : null
                                                                                }
                                                                            </div>
                                                                        </div>

                                                                        {
                                                                            state.errors.last_name.length > 0 ? (
                                                                                <span className='invalid-feedback text-xs text-red-600 pl-0'>
                                                                                    {state.errors.last_name}
                                                                                </span>
                                                                            ) : null
                                                                        }
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                state.keepName ? (
                                                                    <div className="py-2 px-3 border-2 border-orange-300 border-dashed rounded-md mb-4">
                                                                        <div className="flex flex-row align-middle justify-center items-center text-orange-700 px-2 gap-x-3 py-3">
                                                                            <img className="w-8 h-8 md:block hidden" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo" />

                                                                            <div className="flex-auto">
                                                                                <span className="text-sm block text-gray-600">
                                                                                    We'll set your name to <span className="text-orange-600">{state.data.display_name}</span> as provided by your Google sign-in.
                                                                                </span>
                                                                            </div>
                                                                        </div>

                                                                        <div className="flex flex-row align-middle gap-x-3 items-center text-stone-600 px-2 pt-1 pb-2">
                                                                            <div className="w-8 h-8 md:hidden">
                                                                                <i className="fab fa-google fa-xl"></i>
                                                                            </div>

                                                                            <div className="flex-grow flex flex-row-reverse align-middle gap-x-4 items-center text-stone-600 md:px-2 pt-1 pb-2">
                                                                                <button onClick={keepOrChangeDisplayName} className="text-sm flex-none md:px-2 shadow-none hover:text-orange-600 py-2 md:py-1 bg-inherit hover:underline hover:cursor-pointer sm:w-auto sm:text-sm">
                                                                                    Change name
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <>
                                                                        <div className="flex flex-row-reverse align-middle items-center text-orange-600 px-2">
                                                                            <span onClick={keepOrChangeDisplayName} className="text-sm flex-none shadow-none py-1 mb-2 bg-inherit hover:underline hover:cursor-pointer sm:w-auto sm:text-sm">
                                                                                Retain the name from Google sign-in
                                                                            </span>
                                                                        </div>

                                                                        <div className="md:mb-2 flex flex-col md:flex-row md:space-x-4 pt-1">
                                                                            <div className="w-full md:w-1/2 mb-3">
                                                                                <label htmlFor="first_name" className="block text-sm leading-6 text-stone-600 mb-1">First Name:</label>

                                                                                <div className="relative mt-2 rounded shadow-sm">
                                                                                    <input type="text" name="first_name" id="first_name" placeholder="First Name" autoComplete="off"
                                                                                        className={classNames(
                                                                                            state.errors.first_name.length > 0 ?
                                                                                                'text-red-900 ring-slate-300 placeholder:text-red-400 focus:ring-red-600 border border-red-600 focus:outline-red-500' :
                                                                                                'text-stone-900 ring-slate-300 placeholder:text-stone-400 focus:border-0 focus:outline-none focus:ring-orange-600 focus:outline-orange-500 hover:border-stone-400 border border-stone-300',
                                                                                            'block w-full rounded-md py-2 pl-3 pr-8  text-sm'
                                                                                        )} onChange={onChangeHandler} value={state.input.first_name} onBlur={onInputBlur} required />
                                                                                    <div className="absolute inset-y-0 right-0 flex items-center w-8">
                                                                                        {
                                                                                            state.errors.first_name.length > 0 ? (
                                                                                                <span className="fa-duotone text-red-500 fa-circle-exclamation fa-lg"></span>
                                                                                            ) : null
                                                                                        }
                                                                                    </div>
                                                                                </div>

                                                                                {
                                                                                    state.errors.first_name.length > 0 ? (
                                                                                        <span className='invalid-feedback text-xs text-red-600 pl-0'>
                                                                                            {state.errors.first_name}
                                                                                        </span>
                                                                                    ) : null
                                                                                }
                                                                            </div>

                                                                            <div className="w-full md:w-1/2 mb-3">
                                                                                <label htmlFor="last_name" className="block text-sm leading-6 text-stone-700 mb-1">Last Name:</label>

                                                                                <div className="relative mt-2 rounded shadow-sm">
                                                                                    <input type="text" name="last_name" id="last_name" placeholder="Last Name" autoComplete="off"
                                                                                        className={classNames(
                                                                                            state.errors.last_name.length > 0 ?
                                                                                                'text-red-900 ring-slate-300 placeholder:text-red-400 focus:ring-red-600 border border-red-600 focus:outline-red-500' :
                                                                                                'text-stone-900 ring-slate-300 placeholder:text-stone-400 focus:border-0 focus:outline-none focus:ring-orange-600 focus:outline-orange-500 hover:border-stone-400 border border-stone-300',
                                                                                            'block w-full rounded-md py-2 pl-3 pr-8  text-sm'
                                                                                        )} onChange={onChangeHandler} value={state.input.last_name} onBlur={onInputBlur} required />
                                                                                    <div className="absolute inset-y-0 right-0 flex items-center w-8">
                                                                                        {
                                                                                            state.errors.last_name.length > 0 ? (
                                                                                                <span className="fa-duotone text-red-500 fa-circle-exclamation fa-lg"></span>
                                                                                            ) : null
                                                                                        }
                                                                                    </div>
                                                                                </div>

                                                                                {
                                                                                    state.errors.last_name.length > 0 ? (
                                                                                        <span className='invalid-feedback text-xs text-red-600 pl-0'>
                                                                                            {state.errors.last_name}
                                                                                        </span>
                                                                                    ) : null
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    </>
                                                                )
                                                            )
                                                        }

                                                        <div className="mb-3 pt-3 md:px-3 px-0">
                                                            <button className="bg-orange-600 float-right relative w-28 py-1.5 px-4 border border-transparent text-sm rounded-md text-white hover:bg-orange-700 focus:outline-none focus:ring-0 focus:ring-offset-2 focus:bg-orange-700" type="submit">
                                                                {
                                                                    idC_State.processing ? (
                                                                        <i className="fad fa-spinner-third fa-xl fa-spin py-2.5"></i>
                                                                    ) : (
                                                                        <div className="flex justify-center align-middle items-center gap-x-3">
                                                                            Proceed
                                                                        </div>
                                                                    )
                                                                }
                                                            </button>
                                                        </div>
                                                    </form>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="flex flex-col w-full align-middle justitfy-between items-center">
                                                        <span className="text-sm md:text-base md:pt-4 text-stone-600 md:text-stone-800 block">
                                                            <span className="block pt-2">
                                                                A verification email was sent to <span className="text-orange-600">{state.data.email}</span>, kindly check your email to proceed.
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
                                                </>
                                            )
                                        }



                                        <div className="mx-auto py-3 text-center">
                                            <p className="text-sm text-stone-500">
                                                © {new Date().getFullYear()}. Elevated Acts of Appreciation, <span className="text-orange-600 block">Tip by Tip.</span>
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <Loading />
                                    </>
                                )
                            }
                        </div>

                        <div className="md:basis-2/5 hidden md:block h-screen px-4 py-6">
                            <img className="h-full rounded-2xl" src={mainAsset} alt={"hello_i'm_carol"} loading="lazy" />
                        </div>
                    </div>
                </section>
            </div >
        </React.Fragment >
    )
}