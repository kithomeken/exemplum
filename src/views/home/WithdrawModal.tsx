import { toast } from "react-toastify"
import React, { FC, useState } from "react"

import { ACCOUNT } from "../../api/API_Registry"
import HttpServices from "../../services/HttpServices"
import { DynamicModal } from "../../lib/hooks/DynamicModal"
import { API_RouteReplace, classNames, formatAmount } from "../../lib/modules/HelperFunctions"
import { G_onInputBlurHandler, G_onInputChangeHandler } from "../../components/lib/InputHandlers"

interface props {
    show: boolean,
    entity: any,
    account: string,
    showOrHide: any,
}

export const WithdrawModal: FC<props> = ({ show, showOrHide, account, entity }) => {
    const [state, setstate] = useState({
        posting: false,
        show: false,
        status: 'pending',
        modal: {
            errorTitle: '',
            errorMessage: '',
        },
        summary: {
            fee: '0',
            receipt: '0',
            b2C_charge: '0',
        },
        data: {
            charges: null,
            pending: '',
            locked: '',
            bal: '',
            max: '',
            min: '',
            fee: '',
        },
        input: {
            amount: '',
            description: '',
        },
        errors: {
            amount: '',
            description: '',
        }
    })

    React.useEffect(() => {
        if (show) {
            cashWithdrawalValidation()
        }
    }, [show])

    const cashWithdrawalValidation = async () => {
        setstate({
            ...state, status: 'pending'
        })

        let { status } = state
        let { data } = state
        let { modal } = state

        try {
            const apiRoute = API_RouteReplace(ACCOUNT.VALIDATE_WITHDRAWAL, ':auid', account)
            const response: any = await HttpServices.httpPostWithoutData(apiRoute)

            if (response.data.success) {
                status = 'fulfilled'
                data.bal = response.data.payload.bal
                data.max = response.data.payload.max
                data.min = response.data.payload.min
                data.fee = response.data.payload.fee

                data.charges = response.data.payload.charges
                data.bal = formatAmount(parseFloat(data.bal))
            } else {
                status = 'rejected'
                modal.errorTitle = 'Could not process request'
                modal.errorMessage = response.data.error.message
            }
        } catch (error) {
            status = 'rejected'
            modal.errorTitle = "Oops! Something Went Wrong"
            modal.errorMessage = "We're sorry, but we're experiencing some technical difficulties. Please try again later..."
        }

        setstate({
            ...state, status, data, posting: false, modal,
            summary: { fee: '0', receipt: '0', b2C_charge: '0' },
            input: { amount: '', description: '' },
            errors: { amount: '', description: '' },
        })
    }

    function b2cBusinessCharge(amount: any) {
        let businessCharge = 0;
        let { data } = state

        // Iterate through the charges array
        data.charges.forEach((charge: any) => {
            const min = parseFloat(charge.min);
            const max = parseFloat(charge.max);

            // Check if the amount falls within the range
            if (amount >= min && amount <= max) {
                // Retrieve the business charge for the corresponding range
                businessCharge = parseFloat(charge.business);
            }
        });

        return businessCharge;
    }

    const onChangeHandler = (e: any) => {
        let output: any = G_onInputChangeHandler(e, state.posting)
        let { data } = state
        let { input } = state
        let { errors } = state
        let { summary } = state

        input[e.target.name] = output.value
        errors[e.target.name] = output.error

        let theAmount = output.value.replace(',', '')
        theAmount = theAmount.length < 1 ? '0' : theAmount

        let mpesaB2C_Charges = b2cBusinessCharge(theAmount)
        let processingFees = parseFloat(theAmount) * parseFloat(data.fee) / 100
        let receiptAmount = parseFloat(theAmount) - processingFees - mpesaB2C_Charges

        summary.fee = processingFees.toString()
        summary.receipt = receiptAmount.toString()
        summary.b2C_charge = mpesaB2C_Charges.toString()

        setstate({
            ...state, input, errors, summary
        })
    }

    const onInputBlur = (e: any) => {
        let output: any = G_onInputBlurHandler(e, state.posting, '')
        let { data } = state
        let { input } = state
        let { errors } = state
        let { summary } = state
        let { posting } = state

        if (!posting) {            
            switch (e.target.name) {
                case 'amount':
                    const withdrawalAmount = output.value.replace(',', '')
                    const walletBalanace = state.data.bal.replace(',', '')
                    const transactionMaxAmount = state.data.max
                    const transactionMinAmount = state.data.min

                    let theAmount = output.value.replace(',', '')
                    theAmount = theAmount.length < 1 ? '0' : theAmount

                    if (output.error.length < 1) {
                        if (parseFloat(withdrawalAmount) < parseFloat(transactionMinAmount)) {
                            // Maximum withdrawable amount per transaction
                            output.value = transactionMaxAmount
                            output.error = 'Minimum withdrawal amount per transaction is KES. ' + formatAmount(parseFloat(transactionMinAmount))
                            console.log('000');
                            
                        } else if (parseFloat(withdrawalAmount) > parseFloat(transactionMaxAmount)) {
                            // Maximum withdrawable amount per transaction
                            output.value = transactionMaxAmount
                            output.error = 'Maximum withdrawal amount per transaction is KES. ' + formatAmount(parseFloat(transactionMaxAmount))
                            console.log('111');
                            
                        } else if (parseFloat(withdrawalAmount) > parseFloat(walletBalanace)) {
                            // Maximum withdrawable amount as per wallet
                            output.value = walletBalanace
                            output.error = 'Maximum withdrawal amount is KES. ' + formatAmount(parseFloat(walletBalanace))
                            console.log('222');

                        } else {
                            let mpesaB2C_Charges = b2cBusinessCharge(theAmount)
                            let processingFees = parseFloat(theAmount) * parseFloat(data.fee) / 100
                            let receiptAmount = parseFloat(theAmount) - processingFees - mpesaB2C_Charges

                            summary.fee = processingFees.toString()
                            summary.receipt = receiptAmount.toString()
                            summary.b2C_charge = mpesaB2C_Charges.toString()

                            console.log('333');

                        }
                    }

                    console.log('e3oijdiewuhc3948y984', parseFloat(withdrawalAmount) > parseFloat(transactionMaxAmount));


                    input[e.target.name] = formatAmount(parseFloat(theAmount))
                    errors[e.target.name] = output.error
                    break;

                default:
                    input[e.target.name] = output.value
                    errors[e.target.name] = output.error
                    break;
            }

            setstate({
                ...state, input, errors, summary
            })
        }
    }

    function formValidation() {
        let valid = true
        let { input } = state
        let { errors } = state

        if (input.amount.length < 1) {
            errors.amount = "Kindly add the amount you'd wish to withdraw"
            valid = false
        } else {
            const amount = input.amount.replace(',', '')
            const isValidAmount = /^\d+(\.\d{1,2})?$/.test(amount);

            const walletBalanace = state.data.bal.replace(',', '')
            const transactionMaxAmount = state.data.max
            const transactionMinAmount = state.data.min

            if (!isValidAmount) {
                errors.amount = "Invalid amount format"
                valid = false
            } else {
                if (parseFloat(amount) < parseFloat(transactionMinAmount)) {
                    errors.amount = "Minimum withdrawal amount per transaction is KES. 100"
                    valid = false
                } else if (parseFloat(amount) > parseFloat(transactionMaxAmount)) {
                    errors.amount = "Maximum withdrawal amount per transaction is KES. " + formatAmount(parseFloat(transactionMaxAmount))
                    valid = false
                } else if (parseFloat(amount) > parseFloat(walletBalanace)) {
                    errors.amount = 'Maximum withdrawal amount is KES. ' + formatAmount(parseFloat(walletBalanace))
                    valid = false
                }
            }
        }

        if (input.description.length > 1) {
            if (input.description.length < 5) {
                errors.description = 'Summary description cannot be less than 5 characters'
                valid = false
            } else if (input.description.length > 200) {
                errors.description = 'Summary description cannot be more than 200 characters'
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
                    ...state, posting: true
                })

                cashWithdrawalRequest()
            }
        }
    }

    const cashWithdrawalRequest = async () => {
        let { modal } = state
        let { status } = state

        try {
            let { input } = state
            let formData = new FormData()
            formData.append("amount", input.amount.replace(',', ''))

            const withdrawResponse: any = await HttpServices.httpPost(ACCOUNT.REQUEST_WITHDRAWAL, formData)

            if (withdrawResponse.data.success) {
                toast.success(withdrawResponse.data.payload.message, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

                showOrHide()
            } else {
                status = 'rejected'
                modal.errorTitle = 'Could not process request'
                modal.errorMessage = withdrawResponse.data.error.message
            }
        } catch (error) {
            status = 'rejected'
            modal.errorTitle = "Oops! Something Went Wrong"
            modal.errorMessage = "We're sorry, but we're experiencing some technical difficulties. Please try again later..."
        }

        setstate({
            ...state, status, modal, posting: false
        })
    }

    return (
        <React.Fragment>
            <DynamicModal
                size={"md"}
                title={'Cash Withdrawal'}
                status={state.status}
                show={show}
                posting={state.posting}
                showOrHideModal={showOrHide}
                actionButton={"Submit For Approval"}
                error={{
                    title: state.modal.errorTitle,
                    message: state.modal.errorMessage
                }}
                onFormSubmitHandler={onFormSubmitHandler}
                formComponents={
                    <>

                        <div className="flex flex-col md:flex-col">
                            <div className="pb-2 md:basis-1/2 w-full py-1">
                                <span className="py-1 px-1.5 block text-xs text-stone-500">
                                    <i className="fa-light fa-wallet text-stone-500 fa-lg mr-2"></i>
                                    Available
                                </span>

                                <div className="w-full flex flex-row align-middle items-center py-">
                                    <span className="pc-1 px-1.5 text-stone-500 text-xs">
                                        KES.
                                    </span>

                                    <span className="pc-1 px-1.5 text-2xl">
                                        <span className="text-stone-700">{state.data.bal.split('.')[0]}</span>
                                        <span className="text-stone-400">.{state.data.bal.split('.')[1]}</span>
                                    </span>
                                </div>
                            </div>

                            <div className="pb-2 md:basis-1/2 w-full md:border-t-0 border-t-0">
                                <div className="shadow-none mb-4">
                                    <label htmlFor="amount" className="block text-xs leading-6 py-1 text-stone-500 mb-2">Withdrawal Amount:</label>

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
                                            <span className='invalid-feedback text-xs text-red-600'>
                                                {state.errors.amount}
                                            </span>
                                        ) : null
                                    }
                                </div>
                            </div>

                            <div className="py-3 px-3 mb-2 md:basis-1/2 w-full border-2 border-gray-300 border-dashed rounded-md">
                                <span className="text-orange-600 pb-2 block text-sm md:flex flex-row items-center">
                                    Summary
                                </span>

                                <div className="flex flex-row w-full align-middle items-center">
                                    <div className="basis-2/3 text-stone-500 text-sm">
                                        <span className=" py-1 block mb-2">
                                            <span className="hidden md:inline-block">Mpesa Transaction Costs:</span>
                                            <span className="md:hidden">Mpesa Transaction Costs:</span>
                                        </span>

                                        <span className=" py-1 block mb-2">
                                            <span className="hidden md:inline-block">Processing Fee ({state.data.fee}%):</span>
                                            <span className="md:hidden">Processing Fee ({state.data.fee}%):</span>
                                        </span>

                                        <span className=" py-1 block mb-2">
                                            <span className="hidden md:inline-block">Amount to Receive:</span>
                                            <span className="md:hidden">You'll Receive:</span>
                                        </span>
                                    </div>

                                    <div className="basis-1/3 text-stone-600 text-right">
                                        <span className=" py-1 block mb-2 capitalize">
                                            {formatAmount(parseFloat(state.summary.b2C_charge))}
                                        </span>

                                        <span className=" py-1 block mb-2 capitalize">
                                            {formatAmount(parseFloat(state.summary.fee))}
                                        </span>

                                        <span className=" py-1 block mb-2 capitalize">
                                            {formatAmount(parseFloat(state.summary.receipt))}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="py-3 w-full ">
                                {
                                    entity.max > 1 ? (
                                        <span className="text-stone-500 pb-2 block text-xs md:flex flex-row items-center">
                                            By submitting, this request will be sent for approval by your members and administrator before paying out.
                                        </span>
                                    ) : (
                                        <span className="text-stone-500 pb-2 block text-xs md:flex flex-row items-center">
                                            By submitting, this request will be sent for approval the administrator before paying out.
                                        </span>
                                    )
                                }
                            </div>
                        </div>
                    </>
                }
            />
        </React.Fragment>
    )
}