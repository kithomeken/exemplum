import React, { useState } from "react"
import { useDispatch } from "react-redux"
import PhoneInput, { isValidPhoneNumber, parsePhoneNumber } from 'react-phone-number-input'

import { ERR_404 } from "../errors/ERR_404"
import { ERR_500 } from "../errors/ERR_500"
import { useAppSelector } from "../../store/hooks"
import '../../assets/css/react_phone_number_input.css'
import { Loading } from "../../components/modules/Loading"
import { APPLICATION, CONFIG_MAX_WIDTH } from "../../global/ConstantsRegistry"
import serviceCenter from "../../assets/images/306d5d0d0d19094f8a82a61578f3e9a9.svg"
import { capitanSecuris, overridePFg0MetaStage } from "../../store/identityCheckActions"

export const CNF_gB = () => {
    const [state, setstate] = useState({
        httpStatus: 200,
        status: 'fulfilled',
        input: {
            msisdn: '',
        },
        errors: {
            msisdn: '',
        },
    })

    React.useEffect(() => {
        msisdnCheck()
    }, [])

    const dispatch: any = useDispatch();
    const idC_State: any = useAppSelector(state => state.idC)
    const auth0: any = useAppSelector(state => state.auth0)

    const msisdnCheck = () => {
        if (!idC_State.processing) {
            let { input } = state
            input.msisdn = auth0.identity.msisdn

            setstate({
                ...state, input
            })
        }
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

    function c0MP_FLvD() {
        let valid = true
        let { input } = state
        let { errors } = state

        const inputArray = Object.keys(input)
        const errorArray = Object.keys(errors)

        inputArray.forEach((inputObject) => {
            const msE = {
                target: {
                    required: true,
                    name: inputObject,
                    value: String(input[inputObject]).trim(),
                }
            }

            const validPhone = isValidPhoneNumber(msE.target.value)
            const phoneNumber = parsePhoneNumber(msE.target.value)

            if (phoneNumber) {
                if (phoneNumber.country !== 'KE') {
                    errors[inputObject] = 'Only (KE) phone numbers allowed'

                    setstate({
                        ...state, errors
                    })

                    return
                }
            }

            if (!validPhone) {
                errors[inputObject] = 'Kindly add a valid phone number'
            } else {
                errors[inputObject] = ''
            }

            setstate({
                ...state, errors
            })
        })

        errorArray.forEach((errorPnk) => {
            if (errors[errorPnk].length > 0) {
                valid = false
            }
        })

        return valid
    }

    const msisdnFormHandler = (e: any) => {
        e.preventDefault()

        if (!idC_State.processing) {
            let { input } = state
            let validity = c0MP_FLvD()

            if (validity) {
                const method = auth0.identity.msisdn === null ? 'POST' : 'PUT'

                const identProps = {
                    dataDump: {
                        msisdn: input.msisdn,
                        method: method
                    }
                }
                
                dispatch(capitanSecuris(identProps))
            }
        }
    }

    const overridePFg0 = (currentPFg0: any) => {
        if (!idC_State.processing) {
            dispatch(overridePFg0MetaStage(currentPFg0))
        }
    }

    return (
        <React.Fragment>
            {
                state.status === 'rejected' ? (
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
                ) : (
                    <div className="wrapper md:align-middle align-baseline w-full overflow-auto md:h-screen h-auto">
                        <section className={`gx-container md:h-screen rounded-md w-full flex ${state.status === 'pending' ? 'md:items-center' : null} justify-center`} style={CONFIG_MAX_WIDTH}>
                            <div className="flex md:flex-row flex-col align-middle md:items-center w-full md:pb-0 pb-10">
                                <div className="md:basis-3/5 md:px-6 px-6 w-full py-6 overflow-auto">
                                    {
                                        state.status === 'fulfilled' ? (
                                            <>
                                                <span className="text-2xl self-start text-orange-500 tracking-wider leading-7 block mb-3 md:pt-0 pt-4">{APPLICATION.NAME}</span>

                                                <div className="flex flex-row w-full align-middle justitfy-between items-center md:hidden">
                                                    <div className="w-48 pt-4 mx-auto pb-3">
                                                        <img src={serviceCenter} alt={"service_center"} width="auto" className="block text-center m-auto" />
                                                    </div>
                                                </div>

                                                <div className="w-full text-sm text-stone-600 float-right mb-4">
                                                    <span className="text-base md:text-lg pt-4 text-stone-800 block">
                                                        <span className="w-full text-start text-base  md:gap-x-2 gap-y-1 align-middle">
                                                            <span className="text-orange-600 text-sm block">
                                                                Pre-flight Check #3:
                                                            </span>

                                                            Add your phone number to secure your account
                                                        </span>
                                                    </span>
                                                </div>

                                                <div className=" flex flex-col w-full mb-4">
                                                    <form className="space-y-4 w-full" onSubmit={msisdnFormHandler}>
                                                        <div className="md:w-3/5 w-full">
                                                            <label htmlFor="msisdn" className="block text-sm leading-6 text-stone-600 mb-2">Phone Number:</label>

                                                            <PhoneInput
                                                                international
                                                                defaultCountry='KE'
                                                                className="border border-stone-300 px-3 py-1 rounded"
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
                                                                    <span className={`invalid-feedback text-xs text-red-600 pl-0`} hidden={state.errors.msisdn.length > 0 ? true : false}>
                                                                        {idC_State.error}
                                                                    </span>
                                                                )
                                                            }
                                                        </div>

                                                        <div className="mb-3 pt-3 px-0 w-full flex flex-row align-middle items-center gap-x-3 bg-sky-10">
                                                            <div className="flex-1 w-1/2">
                                                                <button onClick={() => overridePFg0(idC_State.PFg0)} className="text-orange-600 relative w-28 py-1.5 px-4 border border-transparent text-sm rounded-md bg-inherit hover:text-orange-700 focus:outline-none focus:ring-0 focus:ring-offset-2 focus:text-orange-700" type="button" disabled={idC_State.processing ? true : false}>
                                                                    <div className="flex justify-center align-middle items-center gap-x-3">
                                                                        <i className="fa-duotone fa-arrow-left fa-lg"></i>
                                                                        Previous
                                                                    </div>
                                                                </button>
                                                            </div>

                                                            <div className="flex-1 w-1/2">
                                                                <button className="bg-orange-600 float-right relative w-28 py-1.5 px-4 border border-transparent text-sm rounded-md text-white hover:bg-orange-700 focus:outline-none focus:ring-0 focus:ring-offset-2 focus:bg-orange-700" type="submit">
                                                                    {
                                                                        idC_State.processing ? (
                                                                            <i className="fad fa-spinner-third fa-xl fa-spin py-2.5"></i>
                                                                        ) : (
                                                                            <div className="flex justify-center align-middle items-center gap-x-3">
                                                                                Next
                                                                                <i className="fa-duotone fa-arrow-right fa-lg"></i>
                                                                            </div>
                                                                        )
                                                                    }
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>

                                                <div className="mx-auto py-3 text-center block w-full">
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
                                    <img className="h-full rounded-2xl" src={serviceCenter} alt={"service_center"} loading="lazy" />
                                </div>
                            </div>
                        </section>
                    </div >
                )
            }
        </React.Fragment>
    )
}