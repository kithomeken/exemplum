import { toast } from "react-toastify"
import React, { useState } from "react"
import { useDispatch } from "react-redux"
import PhoneInput, { isValidPhoneNumber, parsePhoneNumber } from 'react-phone-number-input'

import { useAppSelector } from "../../store/hooks"
import '../../assets/css/react_phone_number_input.css'
import StorageServices from "../../services/StorageServices"
import serviceCenter from "../../assets/images/306d5d0d0d19094f8a82a61578f3e9a9.svg"
import { APPLICATION, CONFIG_MAX_WIDTH, STORAGE_KEYS } from "../../global/ConstantsRegistry"
import { addMSISDN_ToProfile, modifyMSISDN_, resetIdentity } from "../../store/identityCheckActions"

export const IdentityContact = () => {
    const [state, setstate] = useState({
        status: 'pending',
        data: {
            artistTypes: null
        },
        input: {
            msisdn: '',
        },
        errors: {
            msisdn: '',
        },
    })

    React.useEffect(() => {
        overrideCheck()
    }, [])

    const dispatch: any = useDispatch();
    const idC_State: any = useAppSelector(state => state.idC)
    const auth0: any = useAppSelector(state => state.auth0)
    const PRc1_ = StorageServices.getLocalStorage(STORAGE_KEYS.PRc0_OVERRIDE)

    const overrideCheck = () => {
        dispatch(resetIdentity())

        setstate(prev => ({
            ...prev,
            input: {
                ...prev.input,
                msisdn: PRc1_ ? auth0.identity.msisdn : ''
            }
        }));
    }

    const onPhoneInputChange = (e: any) => {
        if (!idC_State.processing) {
            let { input } = state
            input.msisdn = e

            setstate({
                ...state, input
            })
        }
    }

    const onPhoneInputBlur = (e: any) => {
        if (!idC_State.processing) {
            let { errors } = state
            const validPhone = isValidPhoneNumber(e.target.value)
            const phoneNumber = parsePhoneNumber(e.target.value)

            if (phoneNumber) {
                if (phoneNumber.country !== 'KE') {
                    errors.msisdn = 'Only (KE) phone numbers allowed'

                    setstate({
                        ...state, errors
                    })

                    return
                }
            }

            if (!validPhone) {
                errors.msisdn = 'Kindly add a valid phone number'
            } else {
                errors.msisdn = ''
            }

            setstate({
                ...state, errors
            })
        }
    }

    const msisdnFormHandler = (e: any) => {
        e.preventDefault()

        if (!idC_State.processing) {
            let { input } = state
            let { errors } = state

            if (input.msisdn.length < 13) {
                errors.msisdn = "Kindly add a valid phone number"

                setstate({
                    ...state, errors
                })

                return
            }

            if (errors.msisdn.length > 1) {
                toast.warning("Kindly clear the errors before proceeding", {
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

            const identProps = {
                dataDump: {
                    msisdn: input.msisdn,
                    msisdn_: auth0.identity.msisdn,
                }
            }

            PRc1_ ? dispatch(modifyMSISDN_(identProps))
                : dispatch(addMSISDN_ToProfile(identProps))
        }
    }

    return (
        <React.Fragment>
            <div className="wrapper md:align-middle align-baseline w-full overflow-auto md:h-screen h-auto">
                <section className="gx-container md:h-screen rounded-md w-full flex items-center justify-center" style={CONFIG_MAX_WIDTH}>
                    <div className="flex md:flex-row flex-col align-middle items-center w-full md:pb-0 pb-10">
                        <div className="md:basis-3/5 md:px-8 px-8 w-full py-6 overflow-auto">
                            <span className="text-2xl self-start text-orange-500 tracking-wider leading-7 block mb-2 md:pt-0 pt-4">{APPLICATION.NAME}</span>

                            <div className="flex flex-row w-full align-middle justitfy-between items-center md:hidden">
                                <div className="w-48 pt-4 mx-auto pb-3">
                                    <img src={serviceCenter} alt={"pana_calling"} width="auto" className="block text-center m-auto" />
                                </div>
                            </div>

                            {
                                !PRc1_ ? (
                                    <div className="w-32 md:float-start float-right">
                                        <div className="w-full py-4 grid grid-cols-3 gap-x-2">
                                            <div className="rounded-md h-2 shadow-lg bg-orange-600"></div>
                                            <div className="rounded-md h-2 shadow-lg bg-orange-600"></div>
                                            <div className="rounded-md h-2 shadow-lg bg-orange-400"></div>
                                        </div>

                                        <span className="text-sm text-stone-500 md:text-start text-right block">
                                            2 of 3
                                        </span>
                                    </div>
                                ) : null
                            }

                            <div className="w-full text-sm text-stone-600 float-right mb-3">
                                <span className="block py-4 text-xl md:text-2xl">
                                    Secure Your Account

                                    <span className="text-sm pt-4 pb-2 text-stone-600 block">
                                        {PRc1_ ? 'Modify ' : 'Add '} your phone number for secure cash withdrawals and easy contact in case of issues.
                                    </span>
                                </span>
                            </div>

                            <div className="md:w-3/5 flex flex-col w-full mb-4">
                                <form className="space-y-4 w-full" onSubmit={msisdnFormHandler}>
                                    <div className="w-full">
                                        <label htmlFor="msisdn" className="block text-sm leading-6 text-gray-500 mb-2">Phone Number:</label>

                                        <PhoneInput
                                            international
                                            defaultCountry='KE'
                                            className="border border-gray-300 px-3 py-1 rounded"
                                            placeholder="Enter phone number"
                                            value={state.input.msisdn}
                                            onChange={onPhoneInputChange}
                                            onBlur={onPhoneInputBlur}
                                            error={state.input.msisdn ? (isValidPhoneNumber(state.input.msisdn) ? undefined : 'Invalid phone number') : 'Phone number required'}
                                        />

                                        {
                                            state.errors.msisdn.length > 0 &&
                                            <span className='invalid-feedback text-xs text-red-600 pl-0'>
                                                {state.errors.msisdn}
                                            </span>
                                        }

                                        {
                                            idC_State.error && (
                                                <span className='invalid-feedback text-xs text-red-600 pl-0'>
                                                    {idC_State.error}
                                                </span>
                                            )
                                        }
                                    </div>

                                    <div className="mb-3 pt-3 px-0">
                                        <button className="bg-orange-600 float-right relative min-w-28 py-1.5 px-4 border border-transparent text-sm rounded-md text-white hover:bg-orange-700 focus:outline-none focus:ring-0 focus:ring-offset-2 focus:bg-orange-700" type="submit">
                                            {
                                                idC_State.processing ? (
                                                    <i className="fad fa-spinner-third fa-xl fa-spin py-2.5"></i>
                                                ) : (
                                                    PRc1_ ? (
                                                        <div className="flex justify-center align-middle items-center gap-x-3">
                                                            Apply Changes
                                                        </div>
                                                    ) : (
                                                        <div className="flex justify-center align-middle items-center gap-x-3">
                                                            Next
                                                            <i className="fa-duotone fa-arrow-right fa-lg"></i>
                                                        </div>
                                                    )
                                                )
                                            }
                                        </button>
                                    </div>
                                </form>
                            </div>

                            <div className="mx-auto pb-3 pt-10 text-center">
                                <p className="text-sm text-stone-500">
                                    <span className="text-orange-600">Big Fan</span> © {new Date().getFullYear()} All Right Reserved.
                                </p>
                            </div>
                        </div>

                        <div className="md:basis-2/5 hidden md:block h-screen px-4 py-6">
                            <img className="h-full rounded-2xl" src={serviceCenter} alt={"pana_calling"} loading="lazy" />
                        </div>
                    </div>
                </section>
            </div>
        </React.Fragment>
    )
}