import { toast } from "react-toastify";
import React, { FC, useState } from "react"
import PhoneInput from 'react-phone-number-input'

import { ERR_404 } from "../errors/ERR_404"
import HttpServices from "../../services/HttpServices"
import { ADMINISTRATION } from "../../api/API_Registry"
import { Loading } from "../../components/modules/Loading"
import { BespokePanel } from "../../lib/hooks/BespokePanel"
import { Basic_Modal_Props } from "../../lib/modules/Interfaces"
import { G_onInputBlurHandler, G_onInputChangeHandler } from "../../components/lib/InputHandlers"
import { API_RouteReplace, DateFormating, classNames, formatAmount, getColorForLetter } from "../../lib/modules/HelperFunctions"
import { APPLICATION } from "../../global/ConstantsRegistry";

export const PaymentDetails: FC<Basic_Modal_Props> = ({ uuid, show, showOrHide }) => {
    const [state, setstate] = useState({
        posting: false,
        status: 'pending',
        show: {
            rejection: false
        },
        data: {
            nominated: null,
            payment: null,
            trans: null,
            meta: null,
        },
        input: {
            comment: ''
        },
        errors: {
            comment: ''
        }
    })

    React.useEffect(() => {
        if (show) {
            fetchPaymentDetails()
        }
    }, [show])

    const emptyOnChangeHandler = () => { }

    const fetchPaymentDetails = async () => {
        setstate({
            ...state, status: 'pending'
        })

        let { data } = state
        let { status } = state
        let { posting } = state

        try {
            let paymentDetailsRoute = null
            let paymentResponse: any = null

            paymentDetailsRoute = API_RouteReplace(ADMINISTRATION.PAYMENT_DETAILS, ':uuid', uuid)
            paymentResponse = await HttpServices.httpGet(paymentDetailsRoute)

            if (paymentResponse.data.success) {
                data.nominated = paymentResponse.data.payload.nomi
                data.payment = paymentResponse.data.payload.payment
                data.trans = paymentResponse.data.payload.trans
                data.meta = paymentResponse.data.payload.meta.meta

                data.payment.gross = formatAmount(parseFloat(data.payment.gross))
                data.payment.nett = formatAmount(parseFloat(data.payment.nett))
                data.payment.comm_amount = formatAmount(parseFloat(data.payment.comm_amount))
                data.payment.tax_amount = formatAmount(parseFloat(data.payment.tax_amount))

                status = 'fulfilled'
            } else {
                status = 'rejected'
            }

            posting = false
        } catch (error) {
            status = 'rejected'
            posting = false
        }

        setstate({
            ...state, status, data, posting
        })
    }

    const paymentRequestAction = (action: any) => {
        let { show } = state
        let { posting } = state

        if (!posting) {
            if (action === 'R') {
                let isValid = true
                let { input } = state
                let { errors } = state

                if (input.comment.length < 1) {
                    errors.comment = 'Kindly add a comment'
                    isValid = false
                } else if (input.comment.length < 5) {
                    errors.comment = 'Comment cannot be less than 5 characters'
                    isValid = false
                } else if (input.comment.length > 200) {
                    errors.comment = 'Comment cannot be more than 30 characters'
                    isValid = false
                } else {
                    errors.comment = ''
                }

                if (!isValid) {
                    setstate({
                        ...state, errors
                    })

                    return
                }
            }

            posting = true
            show.rejection = false

            setstate({
                ...state, posting, show
            })

            approveOrDeclinePaymentRequest(action)
        }
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

        input[e.target.name] = output.value
        errors[e.target.name] = output.error

        setstate({
            ...state, input, errors
        })
    }

    const showOrHideRejectionInput = () => {
        let { show } = state
        show.rejection = !state.show.rejection

        setstate({
            ...state, show
        })
    }

    const approveOrDeclinePaymentRequest = async (action: string) => {
        let { posting } = state

        try {
            let formData = new FormData()
            let paymentActionRoute = null
            let actionResponse: any = null

            formData.append('comment', state.input.comment)
            paymentActionRoute = API_RouteReplace(ADMINISTRATION.PAYMENT_ACTION, ':uuid', uuid)

            actionResponse = action === 'A' ?
                actionResponse = await HttpServices.httpPost(paymentActionRoute, null) :
                actionResponse = await HttpServices.httpPut(paymentActionRoute, formData)

            fetchPaymentDetails()
        } catch (error) {
            posting = false

            setstate({
                ...state, posting
            })
        }
    }

    const retryPaymentRequest = () => {
        let { posting } = state

        if (!posting) {
            posting = true

            setstate({
                ...state, posting
            })

            retryFailedPaymentTransaction()
        }
    }

    const retryFailedPaymentTransaction = async () => {
        let { posting } = state

        try {
            let retryPaymentRoute = API_RouteReplace(ADMINISTRATION.RETRY_FAILED_PYMNT, ':uuid', uuid)
            const retryResponse: any = await HttpServices.httpPost(retryPaymentRoute, null)

            if (retryResponse.data.success) {
                fetchPaymentDetails()
            } else {
                posting = false

                toast.error(APPLICATION.ERR_MSG, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        } catch (error) {
            posting = false

            toast.error(APPLICATION.ERR_MSG, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }

        setstate({
            ...state, posting
        })
    }

    return (
        <React.Fragment>
            <BespokePanel
                size="lg"
                show={show}
                title={"Payment Request"}
                showOrHidePanel={showOrHide}
                components={
                    <>
                        {
                            state.status === 'rejected' ? (
                                <div className="w-full form-group px-12 mb-14">
                                    <div className="w-full">
                                        <div className="pt-5">
                                            <ERR_404
                                                compact={true}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : state.status === 'fulfilled' ? (
                                <div className="w-full text-sm flex flex-col py-3">
                                    <div className="w-full flex flex-row align-middle items-center px-6 mb-3">
                                        <span className="pc-1 px-1 text-stone-500 text-xs">
                                            KES.
                                        </span>

                                        <span className="pc-1 px-1 text-3xl">
                                            <span className="text-stone-600">{state.data.payment.gross.split('.')[0]}</span>
                                            <span className="text-stone-400">.{state.data.payment.gross.split('.')[1]}</span>
                                        </span>
                                    </div>

                                    <div className="w-full flex flex-row align-middle items-center px-6 gap-x-3 pb-1">
                                        {
                                            state.data.payment.status === 'A' ? (
                                                <span className="bg-teal-200 text-teal-700 text-xs py-1 px-2 rounded">
                                                    <span className="hidden md:inline-block">Request Approved</span>
                                                    <span className="md:hidden">Approved</span>
                                                </span>
                                            ) : state.data.payment.status === 'P' ? (
                                                <span className="bg-sky-200 text-sky-700 text-xs py-1 px-1.5 rounded">
                                                    <span className="hidden md:inline-block">New Request</span>
                                                    <span className="md:hidden">New</span>
                                                </span>
                                            ) : (
                                                <span className="bg-red-500 text-white text-xs py-1 px-1.5 rounded">
                                                    <span className="hidden md:inline-block">Request Rejected</span>
                                                    <span className="md:hidden">Rejected</span>
                                                </span>
                                            )
                                        }

                                        {
                                            state.data.trans === null || state.data.trans === undefined ? (
                                                <span className="bg-yellow-200 text-yellow-700 text-xs py-1 px-1.5 rounded">
                                                    <span className="hidden md:inline-block">Outstanding</span>
                                                    <span className="md:hidden">Outstanding</span>
                                                </span>
                                            ) : (
                                                state.data.trans.resultCode === '0' ? (
                                                    <span className="bg-sky-200 text-blue-700 text-xs py-1 px-2 rounded">
                                                        <span className="hidden md:inline-block">Account Settled</span>
                                                        <span className="md:hidden">Settled</span>
                                                    </span>
                                                ) : (
                                                    <span className="bg-red-200 text-red-700 text-xs py-1 px-1.5 rounded">
                                                        <span className="hidden md:inline-block">Error Processing Payment</span>
                                                        <span className="md:hidden">Error Processing</span>
                                                    </span>
                                                )
                                            )
                                        }
                                    </div>

                                    {
                                        state.data.payment.status === 'R' ? (
                                            <div className={`w-full py-2 px-6 bg-red-50 mb-3 mt-3 transition-transform ease-in-out duration-500`}>
                                                <span className="text-sm mb-1 block text-red-600">
                                                    Rejection reason:
                                                </span>

                                                <span className="text-sm mb-2 block text-stone-600 py-2">
                                                    {state.data.payment.comments}
                                                </span>
                                            </div>
                                        ) : null
                                    }

                                    {
                                        state.show.rejection ? (
                                            <div className={`w-full py-2 px-6 bg-amber-50 my-3 transition-transform ease-in-out duration-500`}>
                                                <span className="text-sm mb-2 block text-stone-600">
                                                    Kindly add reason for rejecting request:
                                                </span>

                                                <div className="mb-2 flex flex-col md:w-12/12 md:space-x-4">
                                                    <div className="space-y-px">
                                                        <div className=" mt-2 rounded shadow-sm">
                                                            <textarea name="comment" id="comment" placeholder="Add Comment" autoComplete="off" rows={3}
                                                                className={classNames(
                                                                    state.errors.comment.length > 0 ?
                                                                        'text-red-900 ring-slate-300 placeholder:text-red-400 focus:ring-red-600 border border-red-600 focus:outline-red-500' :
                                                                        'text-gray-900 ring-slate-300 placeholder:text-gray-400 focus:outline-none focus:border-0 focus:ring-amber-600 focus:outline-amber-500 hover:border-gray-400',
                                                                    'block w-full rounded py-2 resize-none pl-3 pr-8 border border-gray-300 text-sm'
                                                                )} onChange={onChangeHandler} onBlur={onInputBlur} required={true} value={state.input.comment}></textarea>
                                                            <div className="absolute inset-y-0 right-0 top-0 pt-4 flex items-enter w-8">
                                                                {
                                                                    state.errors.comment.length > 0 ? (
                                                                        <span className="fa-duotone text-red-500 fa-circle-exclamation fa-lg"></span>
                                                                    ) : null
                                                                }
                                                            </div>
                                                        </div>

                                                        {
                                                            state.errors.comment.length > 0 ? (
                                                                <span className='invalid-feedback text-xs text-red-600 pl-0'>
                                                                    {state.errors.comment}
                                                                </span>
                                                            ) : null
                                                        }
                                                    </div>
                                                </div>

                                                <div className="mb-2 flex flex-row md:w-12/12 align-middle items-center justify-center">
                                                    <span onClick={showOrHideRejectionInput} className="text-sm flex-1 py-1 bg-inherit text-stone-500 hover:underline hover:cursor-pointer sm:w-auto sm:text-sm">
                                                        Cancel
                                                    </span>

                                                    <span onClick={() => paymentRequestAction('R')} className="text-sm flex-1 text-right py-1 bg-inherit text-red-600 hover:underline hover:cursor-pointer sm:w-auto sm:text-sm">
                                                        Reject Request
                                                    </span>
                                                </div>
                                            </div>
                                        ) : null
                                    }

                                    {
                                        state.data.trans && (
                                            state.data.trans.resultCode === '0' ? (
                                                <div className={`w-full py-2 px-6 bg-emerald-100 mt-3 transition-transform ease-in-out duration-500`}>
                                                    <div className="flex flex-row w-full align-middle items-center">
                                                        <div className="basis-1/2 text-gray-600 text-sm">
                                                            <span className=" py-1 block mb-2">
                                                                <span className="hidden md:inline-block">Transaction Status:</span>
                                                                <span className="md:hidden">Transaction Status:</span>
                                                            </span>
                                                        </div>

                                                        <div className="basis-1/2 text-emerald-600 text-right">
                                                            <span className=" py-1 block mb-2 capitalize">
                                                                <i className="fa-duotone fa-badge-check mr-2 fa-lg"></i>
                                                                Success
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-row w-full align-middle items-center">
                                                        <div className="basis-2/3 text-gray-600 text-sm">
                                                            <span className=" py-1 block mb-2">
                                                                <span className="hidden md:inline-block">Receipt #:</span>
                                                                <span className="md:hidden">Receipt #:</span>
                                                            </span>
                                                        </div>

                                                        <div className="basis-1/3 text-emerald-600 text-right">
                                                            <span className=" py-1 block mb-2 capitalize">
                                                                {state.data.trans.receipt}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-row w-full align-middle items-center">
                                                        <div className="basis-2/3 text-gray-600 text-sm">
                                                            <span className=" py-1 block mb-2">
                                                                <span className="hidden md:inline-block">Amount:</span>
                                                                <span className="md:hidden">Amount:</span>
                                                            </span>
                                                        </div>

                                                        <div className="basis-1/3 text-right">
                                                            <span className=" py-1 block mb-2 capitalize">
                                                                <div className="w-full flex flex-row-reverse align-middle items-center gap-x-2">
                                                                    <span className="text-base block">
                                                                        <span className="text-stone-600">{state.data.payment.nett.split('.')[0]}</span>
                                                                        <span className="text-stone-400">.{state.data.payment.nett.split('.')[1]}</span>
                                                                    </span>

                                                                    <span className="text-stone-500 text-sm block">
                                                                        KES.
                                                                    </span>
                                                                </div>
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-row w-full align-middle items-center">
                                                        <div className="basis-1/2 text-gray-600 text-sm">
                                                            <span className=" py-1 block mb-2">
                                                                <span className="hidden md:inline-block">Transaction Date:</span>
                                                                <span className="md:hidden">Transaction Date:</span>
                                                            </span>
                                                        </div>

                                                        <div className="basis-1/2 text-emerald-600 text-right">
                                                            <span className="block mb-2">
                                                                {DateFormating(state.data.trans.tran_date)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className={`w-full py-2 px-6 bg-red-100 mt-3 transition-transform ease-in-out duration-500`}>
                                                    <div className="flex flex-row w-full align-middle items-center">
                                                        <div className="basis-1/2 text-gray-600 text-sm">
                                                            <span className=" py-1 block mb-2">
                                                                <span className="hidden md:inline-block">Transaction Status:</span>
                                                                <span className="md:hidden">Transaction Status:</span>
                                                            </span>
                                                        </div>

                                                        <div className="basis-1/2 text-red-600 text-right">
                                                            <span className=" py-1 block mb-2 capitalize">
                                                                <i className="fa-duotone fa-circle-exclamation mr-2 fa-xl"></i>
                                                                Failed
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {
                                                        state.data.trans.receipt && (
                                                            <div className="flex flex-row w-full align-middle items-center">
                                                                <div className="basis-2/3 text-gray-600 text-sm">
                                                                    <span className=" py-1 block mb-2">
                                                                        <span className="hidden md:inline-block">Receipt #:</span>
                                                                        <span className="md:hidden">Receipt #:</span>
                                                                    </span>
                                                                </div>

                                                                <div className="basis-1/3 text-red-600 text-right">
                                                                    <span className=" py-1 block mb-2 capitalize">
                                                                        {state.data.trans.receipt}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )
                                                    }

                                                    <div className="flex flex-row w-full align-middle items-center">
                                                        <div className="basis-2/3 text-gray-600 text-sm">
                                                            <span className=" py-1 block mb-2">
                                                                <span className="hidden md:inline-block">Amount:</span>
                                                                <span className="md:hidden">Amount:</span>
                                                            </span>
                                                        </div>

                                                        <div className="basis-1/3 text-red-600 text-right">
                                                            <span className=" py-1 block mb-2 capitalize">
                                                                <div className="w-full flex flex-row-reverse align-middle items-center gap-x-2">
                                                                    <span className="text-base block">
                                                                        <span className="text-stone-600">{state.data.payment.nett.split('.')[0]}</span>
                                                                        <span className="text-stone-400">.{state.data.payment.nett.split('.')[1]}</span>
                                                                    </span>

                                                                    <span className="text-stone-500 text-sm block">
                                                                        KES.
                                                                    </span>
                                                                </div>
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {
                                                        state.data.trans.tran_date && (
                                                            <div className="flex flex-row w-full align-middle items-center">
                                                                <div className="basis-1/2 text-gray-600 text-sm">
                                                                    <span className=" py-1 block mb-2">
                                                                        <span className="hidden md:inline-block">Transaction Date:</span>
                                                                        <span className="md:hidden">Transaction Date:</span>
                                                                    </span>
                                                                </div>

                                                                <div className="basis-1/2 text-red-600 text-right">
                                                                    <span className="block mb-2">
                                                                        {DateFormating(state.data.trans.tran_date)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )
                                                    }

                                                    <div className="flex flex-col w-full align-middle items-center">
                                                        <div className="w-full text-gray-600 text-sm">
                                                            <span className=" py-1 block mb-1">
                                                                <span className="hidden md:inline-block">Result Description:</span>
                                                                <span className="md:hidden">Originator Id:</span>
                                                            </span>
                                                        </div>

                                                        <div className="w-full text-red-600">
                                                            <span className="block mb-2">
                                                                {state.data.trans.resultDesc}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        )
                                    }

                                    {
                                        state.posting ? (
                                            <div className="flex-none flex flex-row-reverse align-middle items-center py-2 mx-6 mb-6 border-b-2 border-dashed">
                                                <span className="text-sm flex-none shadow-none px-3 py-1.5 bg-inherit text-stone-500 sm:w-auto sm:text-sm">Recording your action...
                                                </span>
                                                <span className="fa-duotone text-stone-500 fa-spinner-third fa-xl block fa-spin"></span>
                                            </div>
                                        ) : (
                                            !state.show.rejection ? (
                                                state.data.payment.status === 'P' ? (
                                                    <div className="flex-none flex flex-row-reverse align-middle items-center py-2 mx-6 gap-x-3 mb-3 border-b-2 border-dashed">
                                                        {
                                                            state.data.meta.all === state.data.meta.app ? (
                                                                <>
                                                                    <span onClick={showOrHideRejectionInput} className="text-sm flex-none shadow-none py-1 bg-inherit text-red-600 hover:underline hover:cursor-pointer sm:w-auto sm:text-sm">
                                                                        Reject Request
                                                                    </span>

                                                                    <span onClick={() => paymentRequestAction('A')} className="text-sm flex-none shadow-none py-1 bg-inherit text-green-600 hover:underline hover:cursor-pointer sm:w-auto sm:text-sm">
                                                                        Approve Request {state.data.meta.all} /{state.data.meta.all}
                                                                    </span>
                                                                </>
                                                            ) : (
                                                                <div className="flex flex-row rounded-md w-full align-middle items-center bg-orange-100 py-2 my-2 px-6 transition-transform ease-in-out duration-500">
                                                                    <span className="py-2 block text-orange-600">
                                                                        Request approved by {state.data.meta.app} out of {state.data.meta.all} members
                                                                    </span>
                                                                </div>
                                                            )
                                                        }
                                                    </div>
                                                ) : (
                                                    state.data.trans === null ? (
                                                        <div className="flex-none flex flex-row-reverse align-middle items-center py-2 mx-6 gap-x-3 mb-3 border-b-2 border-dashed">
                                                        </div>
                                                    ) : (
                                                        state.data.trans.resultCode !== '0' ? (
                                                            <div className="flex flex-row-reverse w-full align-middle items-center bg-orange-50 py-2 mb-6 px-6 transition-transform ease-in-out duration-500">
                                                                <button type="button" onClick={retryPaymentRequest} className="block text-red-600 py-1 hover:underline">
                                                                    Retry Payment
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div className="flex-none flex flex-row-reverse align-middle items-center py-2 mx-6 gap-x-3 mb-3 border-b-2 border-dashed">
                                                            </div>
                                                        )
                                                    )
                                                )
                                            ) : (
                                                <div className="flex-none flex flex-row-reverse align-middle items-center py-2 mx-6 gap-x-3">
                                                </div>
                                            )
                                        )
                                    }

                                    <div className="flex-grow mx-6 overflow-y-auto">
                                        <h2 className="text-sm leading-7 text-amber-600 sm:text-lg sm: mb-2">
                                            Request Details
                                        </h2>

                                        <div className="flex flex-row align-middle w-full lg:w-12/12">
                                            <div className="basis-1/2 text-gray-500">
                                                <span className=" py-1 block mb-2.5">
                                                    <span className="hidden md:inline-block">Entity Name:</span>
                                                    <span className="md:hidden">Entity:</span>
                                                </span>

                                                <span className=" py-1 block mb-2.5">
                                                    <span className="hidden md:inline-block">Request Date:</span>
                                                    <span className="md:hidden">Request Date:</span>
                                                </span>

                                                <span className=" py-1 block mb-2.5">
                                                    <span className="hidden md:inline-block">Recipient:</span>
                                                    <span className="md:hidden">Recipient:</span>
                                                </span>

                                                <span className=" py-1 block mb-2.5">
                                                    <span className="hidden md:inline-block">Recipient's Phone:</span>
                                                    <span className="md:hidden">Phone:</span>
                                                </span>

                                                <span className=" py-1 block mb-2.5">
                                                    <span className="hidden md:inline-block">Reciept Amount:</span>
                                                    <span className="md:hidden">Receipt Amount:</span>
                                                </span>

                                                <span className=" py-1 block mb-2.5">
                                                    <span className="hidden md:inline-block">Payment Method:</span>
                                                    <span className="md:hidden">Payment Method:</span>
                                                </span>
                                            </div>

                                            <div className="basis-1/2 text-stone-800">
                                                <span className=" py-1 block mb-2.5">
                                                    {state.data.payment.name}
                                                </span>

                                                <span className=" py-1 block mb-2.5">
                                                    {DateFormating(state.data.payment.created_at)}
                                                </span>

                                                <div className="flex items-center gap-x-3 align-middle flex-row mb-2.5">
                                                    <span className={`h-7 w-7 rounded-full flex flex-row align-middle items-center justify-center ${getColorForLetter(state.data.nominated.display_name.charAt(0))} text-white`}>
                                                        {state.data.nominated.display_name.charAt(0)}
                                                    </span>

                                                    <span className="block text-right">
                                                        {state.data.nominated.display_name}
                                                    </span>
                                                </div>

                                                <span className="py-1 lowercase text-right block mb-2.5">
                                                    <PhoneInput
                                                        international
                                                        readOnly={true}
                                                        disabled={true}
                                                        defaultCountry="KE"
                                                        onChange={emptyOnChangeHandler}
                                                        value={state.data.nominated.msisdn}
                                                    />
                                                </span>

                                                <span className=" py-1 block mb-2.5">
                                                    <div className="w-full flex flex-row align-middle items-center">
                                                        <span className="text-stone-500 text-sm block">
                                                            KES.
                                                        </span>

                                                        <span className="px-1 text-sm block">
                                                            <span className="text-stone-600">{state.data.payment.nett.split('.')[0]}</span>
                                                            <span className="text-stone-400">.{state.data.payment.nett.split('.')[1]}</span>
                                                        </span>
                                                    </div>
                                                </span>

                                                <span className=" py-1 block mb-2.5">
                                                    MPESA
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pb-4 flex-grow px-6 py-3 overflow-y-auto">
                                        <div className="py-3 px-4 mb-2 md:basis-1/2 w-full border-2 border-orange-300 border-dashed rounded-md">
                                            <span className="text-orange-500 pb-2 block text-sm md:flex flex-row items-center">
                                                Deductions and Fees Summary
                                            </span>

                                            <div className="flex flex-row w-full align-middle items-center">
                                                <div className="basis-2/3 text-stone-500 text-sm">
                                                    <span className=" py-1 block mb-2">
                                                        <span className="hidden md:inline-block">Transaction Costs:</span>
                                                        <span className="md:hidden">Transaction Costs:</span>
                                                    </span>

                                                    <span className=" py-1 block mb-2">
                                                        <span className="hidden md:inline-block">Our Processing Fees:</span>
                                                        <span className="md:hidden">Our Fees:</span>
                                                    </span>

                                                    <span className=" py-1 block mb-2">
                                                        <span className="hidden md:inline-block">Tax Amount:</span>
                                                        <span className="md:hidden">Tax Amount:</span>
                                                    </span>

                                                    <span className=" py-1 block mb-2">
                                                        <span className="hidden md:inline-block">Reciept Amount:</span>
                                                        <span className="md:hidden">Reciept Amount:</span>
                                                    </span>
                                                </div>

                                                <div className="basis-1/3 text-stone-600 text-right">
                                                    <span className=" py-1 block mb-2 capitalize">
                                                        {formatAmount(parseFloat(state.data.payment.mpesa_b2c_fee))}
                                                    </span>

                                                    <span className=" py-1 block mb-2 capitalize">
                                                        {state.data.payment.comm_amount}
                                                    </span>

                                                    <span className=" py-1 block mb-2 capitalize">
                                                        {state.data.payment.tax_amount}
                                                    </span>

                                                    <span className=" py-1 block mb-2 capitalize">
                                                        {state.data.payment.nett}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full form-group px-12 mb-14">
                                    <div className="w-full">
                                        <div className="pt-10">
                                            <Loading />
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    </>
                }
            />
        </React.Fragment>
    )
}