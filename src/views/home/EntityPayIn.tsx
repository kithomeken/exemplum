import { Helmet } from "react-helmet"
import React, { useState } from "react"
import { useParams } from "react-router"

import { ERR_404 } from "../errors/ERR_404"
import { ACCOUNT } from "../../api/API_Registry"
import HttpServices from "../../services/HttpServices"
import { Loading } from "../../components/modules/Loading"
import { APPLICATION } from "../../global/ConstantsRegistry"
import { API_RouteReplace, classNames, formatAmount } from "../../lib/modules/HelperFunctions"
import { G_onInputChangeHandler, G_onInputBlurHandler } from "../../components/lib/InputHandlers"

export const EntityPayIn = () => {
    const [state, setstate] = useState({
        status: 'pending',
        stkResponse: null,
        posting: false,
        data: {
            entity: null,
            limits: null,
        },
        input: {
            amount: '0',
            msisdn: ''
        },
        errors: {
            stkError: '',
            amount: '',
            msisdn: ''
        }
    })

    const params = useParams();

    React.useEffect(() => {
        fetchEntityDetails()
    }, [])

    const fetchEntityDetails = async () => {
        let { data } = state
        let { input } = state
        let { status } = state

        try {
            const entityRoute = API_RouteReplace(ACCOUNT.ENTITY_CONTR_DATA, ':uuid', params.uuid)
            const entityResponse: any = await HttpServices.httpGet(entityRoute)

            if (entityResponse.data.success) {
                status = 'fulfilled'
                data.entity = entityResponse.data.payload.entity
                data.limits = entityResponse.data.payload.limits

                input.amount = formatAmount(parseFloat(data.limits.min))
            } else {
                status = 'rejected'
            }
        } catch (error) {
            status = 'rejected'
        }

        setstate({
            ...state, status, data, input
        })
    }

    const onChangeHandler = (e: any) => {
        let output: any = G_onInputChangeHandler(e, state.posting)
        let { input } = state
        let { errors }: any = state

        input[e.target.name] = output.value
        errors[e.target.name] = output.error

        setstate({
            ...state, input, errors
        })
    }

    const onInputBlur = (e: any) => {
        let output: any = G_onInputBlurHandler(e, state.posting, '')
        let { input } = state
        let { errors }: any = state

        switch (e.target.name) {
            case 'amount':
                const transactionMinAmount = state.data.limits.min
                const transactionMaxAmount = state.data.limits.max

                let theAmount = output.value.replace(',', '')
                theAmount = theAmount.length < 1 ? '0' : theAmount

                if (output.error.length < 1) {
                    if (parseFloat(theAmount) > parseFloat(transactionMaxAmount)) {
                        // Maximum withdrawable amount per transaction
                        output.value = transactionMaxAmount
                        output.error = 'Maximum tipping amount is KES. ' + formatAmount(parseFloat(transactionMaxAmount))
                    } else if (parseFloat(theAmount) < parseFloat(transactionMinAmount)) {
                        // Maximum withdrawable amount as per wallet
                        output.value = transactionMinAmount
                        output.error = 'Minimum tipping amount is KES. ' + formatAmount(parseFloat(transactionMinAmount))
                    }
                }

                input[e.target.name] = formatAmount(parseFloat(theAmount))
                errors[e.target.name] = output.error
                break;

            default:
                input[e.target.name] = output.value
                errors[e.target.name] = output.error
                break;
        }

        setstate({
            ...state, input, errors
        })
    }

    function formValidation() {
        let valid = true
        let { data } = state
        let { input } = state
        let { errors } = state

        if (input.amount.length < 1) {
            errors.amount = "Kindly add the amount you'd wish to contribute"
            valid = false
        } else {
            const transactionMinAmount = data.limits.min
            const transactionMaxAmount = data.limits.max

            let theAmount = input.amount.replace(',', '')
            const isValidAmount = /^\d+(\.\d{1,2})?$/.test(theAmount);

            if (!isValidAmount) {
                errors.amount = "Invalid amount format"
                valid = false
            } else {
                if (parseFloat(theAmount) > parseFloat(transactionMaxAmount)) {
                    // Maximum contributable amount per transaction
                    errors.amount = 'Maximum tipping amount is KES. ' + formatAmount(parseFloat(transactionMaxAmount))
                    valid = false
                } else if (parseFloat(theAmount) < parseFloat(transactionMinAmount)) {
                    // Maximum contributable amount as per transaction
                    errors.amount = 'Minimum tipping amount is KES. ' + formatAmount(parseFloat(transactionMinAmount))
                    valid = false
                }
            }
        }

        if (input.msisdn.length > 1) {
            if (input.msisdn.length < 12) {
                errors.msisdn = 'Enter valid msisdn'
                valid = false
            } else if (input.msisdn.length > 12) {
                errors.msisdn = 'Enter valid msisdn'
                valid = false
            }
        }

        return valid
    }

    const onFormSubmitHandler = (e: any) => {
        e.preventDefault()
        let { posting } = state

        if (!posting) {
            const valid = formValidation()

            if (valid) {
                setstate({
                    ...state, posting: true, stkResponse: null
                })

                stkPushNotification()
            }
        }
    }

    const stkPushNotification = async () => {
        let { data } = state
        let { input } = state
        let { errors } = state
        let { posting } = state
        let { stkResponse } = state

        try {
            let formData = new FormData()

            formData.append("amount", input.amount.replace(',', ''))
            formData.append("msisdn", input.msisdn)
            formData.append("account", data.entity.account)

            const apiResponse: any = await HttpServices.httpPost(ACCOUNT.STK_PUSH_NOFITICATION, formData)
            console.log('UBD3-23', apiResponse.data);

            if (apiResponse.data.success) {
                // input.amount = ''
                // input.msisdn = ''
                const payload = apiResponse.data.payload

                stkResponse = payload.status
                errors.stkError = payload.status === 200 ? '' : payload.message
            } else {
                stkResponse = apiResponse.data.payload.status
                errors.stkError = apiResponse.data.payload.message
            }
        } catch (error) {
            console.log(error);
            stkResponse = 500
            errors.stkError = "Something went wrong, try again later"
        }

        posting = false

        setstate({
            ...state, posting, stkResponse, input, errors
        })
    }

    return (
        <React.Fragment>
            <Helmet>
                <title>{APPLICATION.NAME}</title>
            </Helmet>

            <div className="flex flex-col h-screen w-full">
                <div className={`w-full flex-none bg-gradient-to-r from-orange-100 to-orange-300 form-group mb-3 h-30`}>
                    <div className="kiOAkj sttng_strp h-24 px-12"></div>
                </div>

                <div className="flex-grow w-full kiOAkj px-12">
                    <section className="w-144 my-0 mx-auto py-8 z-0">
                        <div className="px-5">
                            <header className="landing-header">
                                <div className="landing pl-3 mb-0 text-left">
                                    <h2 className="odyssey text-left text-orange-500 nunito">
                                        {APPLICATION.NAME}
                                    </h2>
                                </div>
                            </header>

                            {
                                state.status === 'rejected' ? (
                                    <>
                                        <ERR_404
                                            compact={true}
                                        />
                                    </>
                                ) : state.status === 'fulfilled' ? (
                                    <>
                                        <form className="shadow-none px-2 mb-5" onSubmit={onFormSubmitHandler}>
                                            <div className="py-4">
                                                <span className="flex-grow px-1.5 block text-2xl text-orange-600 mb-2 capitalize">
                                                    {state.data.entity.name}
                                                </span>

                                                <span className="py-1 flex-grow px-1.5 block text-sm text-stone-600 mb-2 capitalize">
                                                    {state.data.entity.category}
                                                </span>
                                            </div>

                                            {
                                                state.stkResponse && (
                                                    state.stkResponse === 200 ? (
                                                        <div className="w-12/12 py-3">
                                                            <div className="rounded-md mb-2 border-0 border-green-400 bg-green-100 py-4 px-4">
                                                                <div className="flex flex-row align-middle items-center text-green-700">
                                                                    <i className="fa-duotone fa-badge-check fa-2x mt-1 text-green-700 flex-none"></i>

                                                                    <div className="flex-auto ml-1 mt-1">
                                                                        <span className="text-sm pl-3 block text-emerald-900 mb-1">
                                                                            Request Processed
                                                                        </span>

                                                                        <span className="text-sm pl-3 block text-emerald-700">
                                                                            Check your phone for the Mpesa prompt
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="w-12/12 py-3">
                                                            <div className="rounded-md mb-2 border-0 border-red-400 bg-red-100 py-4 px-4">
                                                                <div className="flex flex-row align-middle items-center text-red-700">
                                                                    <i className="fa-duotone fa-info-circle fa-2x mt-1 text-red-700 flex-none"></i>

                                                                    <div className="flex-auto ml-1 mt-1">
                                                                        <span className="text-sm pl-3 block text-red-900 mb-1">
                                                                            Could not process request
                                                                        </span>

                                                                        <span className="text-sm pl-3 block text-red-700">
                                                                            {state.errors.stkError}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                )
                                            }

                                            <div className="pb-2 md:basis-1/2 w-full pt-1 md:px-4">
                                                <div className="shadow-none mb-4">
                                                    <label htmlFor="msisdn" className="block text-xs leading-6 py-1 text-stone-500 mb-2">Phone Number:</label>

                                                    <div className="relative mt-2 rounded shadow-sm">
                                                        <input type="text" name="msisdn" id="msisdn" placeholder="2547XXXXXXXX" autoComplete="off"
                                                            className={classNames(
                                                                state.errors.msisdn.length > 0 ?
                                                                    'text-red-900 ring-slate-300 placeholder:text-red-400 focus:ring-red-600 border border-red-600 focus:outline-red-500' :
                                                                    'text-gray-900 ring-slate-300 placeholder:text-gray-400 focus:border-0 focus:outline-none focus:ring-orange-600 focus:outline-orange-500 hover:border-gray-400',
                                                                'block w-full rounded-md py-2 pl-3 pr-8 border border-gray-300 text-m'
                                                            )} onChange={onChangeHandler} value={state.input.msisdn} onBlur={onInputBlur} required />
                                                        <div className="absolute inset-y-0 right-0 flex items-center w-8">
                                                            {
                                                                state.errors.msisdn.length > 0 ? (
                                                                    <span className="fa-duotone text-red-500 fa-circle-exclamation fa-lg"></span>
                                                                ) : null
                                                            }
                                                        </div>
                                                    </div>

                                                    {
                                                        state.errors.msisdn.length > 0 ? (
                                                            <span className='invalid-feedback text-xs text-red-600 pl-0'>
                                                                {state.errors.msisdn}
                                                            </span>
                                                        ) : null
                                                    }
                                                </div>
                                            </div>

                                            <div className="pb-2 md:basis-1/2 w-full pt-1 md:px-4">
                                                <div className="shadow-none mb-4">
                                                    <label htmlFor="amount" className="block text-xs leading-6 py-1 text-stone-500 mb-2">Amount To Tip:</label>

                                                    <div className="relative mt-2 rounded shadow-sm">
                                                        <input type="text" name="amount" id="amount" placeholder="0.00" autoComplete="off"
                                                            className={classNames(
                                                                state.errors.amount.length > 0 ?
                                                                    'text-red-900 ring-slate-300 placeholder:text-red-400 focus:ring-red-600 border border-red-600 focus:outline-red-500' :
                                                                    'text-gray-900 ring-slate-300 placeholder:text-gray-400 focus:border-0 focus:outline-none focus:ring-orange-600 focus:outline-orange-500 hover:border-gray-400',
                                                                'block w-full rounded-md py-2 pl-3 pr-8 border border-gray-300 text-m'
                                                            )} onChange={onChangeHandler} value={state.input.amount} onBlur={onInputBlur} required />
                                                        <div className="absolute inset-y-0 right-0 flex items-center w-8">
                                                            {
                                                                state.errors.amount.length > 0 ? (
                                                                    <span className="fa-duotone text-red-500 fa-circle-exclamation fa-lg"></span>
                                                                ) : null
                                                            }
                                                        </div>
                                                    </div>

                                                    {
                                                        state.errors.amount.length > 0 ? (
                                                            <span className='invalid-feedback text-xs text-red-600 pl-0'>
                                                                {state.errors.amount}
                                                            </span>
                                                        ) : null
                                                    }
                                                </div>
                                            </div>

                                            <button type="submit" className="w-auto min-w-24 justify-center disabled:cursor-not-allowed text-sm rounded-md border border-transparent shadow-sm px-4 py-1-5 bg-orange-600 text-white disabled:bg-orange-600 hover:bg-orange-700 focus:outline-none" disabled={state.posting}>
                                                {
                                                    state.posting ? (
                                                        <span className="flex flex-row items-center h-5 justify-center">
                                                            <i className="fad fa-spinner-third fa-xl fa-spin"></i>
                                                        </span>
                                                    ) : (
                                                        <span>Contribute</span>
                                                    )
                                                }
                                            </button>
                                        </form>
                                    </>
                                ) : (
                                    <div className="w-full h-full flex flex-col justify-center">
                                        <div className="flex-grow">
                                            <Loading />
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </section>
                </div>
            </div>

        </React.Fragment>
    )
}