import { toast } from "react-toastify"
import React, { useState } from "react"

import { Empty } from "../errors/Empty"
import { ACCOUNT } from "../../api/API_Registry"
import ReactTable from "../../lib/hooks/ReactTable"
import HttpServices from "../../services/HttpServices"
import { Loading } from "../../components/modules/Loading"
import { API_RouteReplace, DateFormating, classNames, formatAmount, humanReadableDate, minimalistDateFormat } from "../../lib/modules/HelperFunctions"

export const MoneyOut = () => {
    const [state, setstate] = useState({
        action: '',
        show: false,
        posting: false,
        status: 'pending',
        data: {
            requests: null,
            money_out: null,
        }
    })

    const [isPosting, setIsPosting] = useState(false);
    const [actionMode, setActionMode] = useState({
        action: '',
        posting: false,
    });

    React.useEffect(() => {
        moneyOutTransactions()
    }, [])

    const moneyOutTransactions = async () => {
        let { status } = state
        let { data } = state

        try {
            const response: any = await HttpServices.httpGet(ACCOUNT.MONEY_OUT_TRANSACTIONS)

            if (response.data.success) {
                status = 'fulfilled'
                data.requests = response.data.payload.requests
                data.money_out = response.data.payload.out

                Object.keys(data.money_out).forEach(function (key) {
                    data.money_out[key].amount = formatAmount(parseFloat(data.money_out[key].amount))
                })

                Object.keys(data.requests).forEach(function (key) {
                    data.requests[key].gross = formatAmount(parseFloat(data.requests[key].gross))
                })
            } else {
                status = 'rejected'
            }
        } catch (error) {
            status = 'fulfilled'
            console.log(error);
        }

        setstate({
            ...state, data, status
        })
    }

    const approveOrRejectRequestCheck = async (actionR: string) => {
        let { data } = state

        if (!isPosting) {
            try {
                let actionApiRoute = actionR === 'A' ? ACCOUNT.REQUEST_APPROVAL : ACCOUNT.REQUEST_REJECTION
                actionApiRoute = API_RouteReplace(actionApiRoute, ':request', data.requests[0].r_uuid)

                console.log('WXW223', data);


                const actionResponse: any = await HttpServices.httpPostWithoutData(actionApiRoute)
                console.log('EUB_3435', actionMode);

                if (actionResponse.data.success) {
                    moneyOutTransactions()
                } else {
                    toast.error(actionResponse.data.error.message, {
                        position: "top-right",
                        autoClose: 7000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }
            } catch (error) {
                console.log(error);
                toast.error('Something went wrong. Could not process request', {
                    position: "top-right",
                    autoClose: 7000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }

            // setIsPosting(false)
        }
    }


    const approvePendingRequest = async (actionR: string) => {
        console.log('IU3D30', 'posting');
    }

    const columns = React.useMemo(
        () => [
            {
                Header: 'Pending',
                id: 'TRC_R001',
                accessor: (data: any) => (
                    data.a_uuid ? (
                        <div className="px-0 w-full">
                            <div className="flex flex-col md:flex-row gap-y-3 md:gap-x-4 pt-2">
                                <div className="w-full flex-grow flex flex-col md:pr-3 align-middle gap-y-2 md:pl-4 md:basis-1/2">
                                    <div className="w-full flex flex-row md:pr-3 align-middle items-center gap-x-3 md:pl-4 md:basis-1/2">
                                        <div className="basis-1/2">
                                            <span className=" py-0 px-1.5 text-stone-500 text-xs">
                                                Ksh.
                                            </span>

                                            <span className="py- px-1.5 text-2xl">
                                                <span className="text-stone-700">{data.gross.split('.')[0]}</span>
                                                <span className="text-stone-400">.{data.gross.split('.')[1]}</span>
                                            </span>
                                        </div>

                                        <div className="basis-1/2">
                                            <span className="block mb-0 text-sm text-slate-500 basis-1/2 text-right md:">
                                                {humanReadableDate(data.created_at)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="w-full md:block hidden flex-row align-middle items-center md:pl-3 md:basis-1/2">
                                        <div className="basis-1/2">
                                            <div className="basis-1/2">
                                                {
                                                    data.status === 'P' ? (
                                                        <span className="inline-flex items-center mr-2 rounded-md px-2 text-sm text-orange-600">
                                                            Pending your approval
                                                        </span>
                                                    ) : data.status === 'A' ? (
                                                        <span className="inline-flex items-center mr-2 rounded-md px-2 text-sm text-emerald-600">
                                                            You approved the withdrawal request
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center mr-2 rounded-md px-2 text-sm text-red-600">
                                                            You rejected the request
                                                        </span>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-full flex-row align-middle hidden md:block px-3 items-center">
                                        {
                                            data.status === 'P' ? (
                                                <div className="w-full flex flex-row gap-x-4 pt-1 align-middle items-center">
                                                    <div className="basis-1/2">
                                                        <span onClick={() => approveOrRejectRequestCheck('A')} className="text-green-600 w-full py-2 px-4 text-sm flex flex-row border border-green-600 items-center justify-center text-center rounded-md cursor-pointer bg-white hover:bg-green-200 focus:outline-none">
                                                            {
                                                                actionMode.posting && actionMode.action === 'A' ? (
                                                                    <span>
                                                                        <i className="fa-duotone fa-spinner-third animate-spin mr-2 fa-lg"></i>
                                                                        Approving
                                                                    </span>
                                                                ) : (
                                                                    <span>
                                                                        <i className="fa-duotone fa-badge-check mr-2 fa-lg"></i>
                                                                        Approve
                                                                    </span>
                                                                )
                                                            }
                                                        </span>
                                                    </div>

                                                    <div className="basis-1/2">
                                                        <span onClick={() => approveOrRejectRequestCheck('D')} className="text-red-600 w-full py-2 px-4 text-sm flex flex-row border border-red-600 items-center justify-center text-center rounded-md bg-white hover:bg-red-200 focus:outline-none">
                                                            {
                                                                !isPosting && state.action === 'R' ? (
                                                                    <span>
                                                                        <i className="fa-duotone fa-spinner-third animate-spin mr-2 fa-lg"></i>
                                                                        Rejecting
                                                                    </span>
                                                                ) : (
                                                                    <span>
                                                                        <i className="fa-duotone fa-ban mr-2 fa-lg"></i>
                                                                        Reject
                                                                    </span>
                                                                )
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                            ) : null
                                        }
                                    </div>
                                </div>

                                <div className="w-full md:hidden flex flex-row align-middle items-center md:pl-3 md:basis-1/2">
                                    <div className="basis-1/2">
                                        <div className="basis-1/2">
                                            {
                                                data.status === 'P' ? (
                                                    <span className="inline-flex items-center mr-2 rounded-md px-2 text-sm text-orange-600">
                                                        Pending your approval
                                                    </span>
                                                ) : data.status === 'A' ? (
                                                    <span className="inline-flex items-center mr-2 rounded-md px-2 text-sm text-emerald-600">
                                                        You approved the withdrawal request
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center mr-2 rounded-md px-2 text-sm text-red-600">
                                                        You rejected the request
                                                    </span>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>

                                <div className="py-3 px-3 md:basis-1/2 w-full border-2 border-gray-300 border-dashed rounded-md">
                                    <div className="flex flex-row w-full align-middle items-center">
                                        <div className="basis-2/3 text-stone-500 text-sm">
                                            <span className=" py-1 block mb-2">
                                                <span className="hidden md:inline-block">Amount to Receive:</span>
                                                <span className="md:hidden">You'll Receive:</span>
                                            </span>

                                            <span className=" py-1 block mb-2">
                                                <span className="hidden md:inline-block">Processing Fee ({data.comm_rate}%):</span>
                                                <span className="md:hidden">Processing Fee ({data.comm_rate}%):</span>
                                            </span>

                                            <span className=" py-1 block mb-2">
                                                <span className="hidden md:inline-block">Mpesa Transaction Costs:</span>
                                                <span className="md:hidden">Mpesa Transaction Costs:</span>
                                            </span>
                                        </div>

                                        <div className="basis-1/3 text-stone-600 text-right">
                                            <span className=" py-1 block mb-2 capitalize">
                                                {formatAmount(parseFloat(data.amount_payable))}
                                            </span>

                                            <span className=" py-1 block mb-2 capitalize">
                                                {formatAmount(parseFloat(data.comm_amount))}
                                            </span>

                                            <span className=" py-1 block mb-2 capitalize">
                                                {formatAmount(parseFloat(data.mpesa_b2c_fee))}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-y-4 pt-4">
                                {
                                    data.status === 'P' ? (
                                        <div className="w-full flex flex-row md:pr-3 gap-x-4 mb-4 align-middle items-center md:basis-1/2">
                                            <div className="basis-1/2">
                                                <span onClick={() => approvePendingRequest('A')} className="text-green-600 w-full py-2 px-4 sm:hidden text-sm flex flex-row border border-green-600 items-center justify-center text-center rounded-md bg-white hover:bg-green-200 focus:outline-none">
                                                    {
                                                        state.show ? (
                                                            <span>
                                                                <i className="fa-duotone fa-spinner-third animate-spin mr-2 fa-lg"></i>
                                                                Approving
                                                            </span>
                                                        ) : (
                                                            <span>
                                                                <i className="fa-duotone fa-badge-check mr-2 fa-lg"></i>
                                                                Approve
                                                            </span>
                                                        )
                                                    }
                                                </span>
                                            </div>

                                            <div className="basis-1/2">
                                                <button type="button" className="text-red-600 w-full py-2 px-4 sm:hidden text-sm flex flex-row border border-red-600 items-center justify-center text-center rounded-md bg-white hover:bg-red-200 focus:outline-none">
                                                    <i className="fa-duotone fa-ban mr-2 fa-lg"></i>
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                    ) : null
                                }
                            </div>
                        </div>
                    ) : (
                        <div className="px-0 w-full">
                            <div className="flex flex-col md:flex-row gap-y-4 md:gap-x-4 pt-2">
                                <div className="w-full flex-grow flex flex-col md:pr-3 align-middle gap-y- md:pl-4 md:basis-1/2">
                                    <div className="w-full flex flex-row align-middle items-center gap-x-3 md:px-3 md:basis-1/2">
                                        <div className="basis-1/2">
                                            <span className=" py-0 px-1.5 text-stone-500 text-xs">
                                                Ksh.
                                            </span>

                                            <span className="py- px-1.5 text-2xl">
                                                <span className="text-stone-700">{data.gross.split('.')[0]}</span>
                                                <span className="text-stone-400">.{data.gross.split('.')[1]}</span>
                                            </span>
                                        </div>

                                        <div className="basis-1/2">
                                            <span className="block mb-0 text-sm text-slate-500 basis-1/2 text-right md:">
                                                {humanReadableDate(data.created_at)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="w-full md:flex hidden flex-col-reverse align-middle gap-x-3 items-cnter md:px-3 md:basis-1/2">
                                        <div className="basis-1/2">
                                            {
                                                data.status === 'P' ? (
                                                    <span className="inline-flex items-center mr-2 rounded bg-orange-100 px-3 text-sm text-orange-600 ring-1 ring-inset ring-orange-500/20">
                                                        {
                                                            data.meta.app < data.meta.all ? (
                                                                <span>Pending approval from members</span>
                                                            ) : (
                                                                <span>Pending admin's approval</span>
                                                            )
                                                        }
                                                    </span>
                                                ) : data.status === 'A' ? (
                                                    <span className="inline-flex items-center mr-2 rounded bg-emerald-100 px-3 text-sm text-emerald-600 ring-1 ring-inset ring-emerald-500/20">
                                                        Approved
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center mr-2 rounded bg-red-100 px-3 text-sm text-red-600 ring-1 ring-inset ring-red-500/10">
                                                        Rejected
                                                    </span>
                                                )
                                            }
                                        </div>

                                        <div className="basis-1/2">
                                            <span className={
                                                classNames(
                                                    data.meta.app < data.meta.all ? 'text-orange-500' : 'text-emerald-500',
                                                    'text-sm'
                                                )
                                            }>
                                                {
                                                    data.meta.app < data.meta.all ? (
                                                        <span>{data.meta.app}/{data.meta.all}</span>
                                                    ) : (
                                                        <span>All</span>
                                                    )
                                                } members approved
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full md:hidden flex flex-col align-middle items-ceter gap-y-2 md:pl-3 md:basis-1/2">
                                    <div className="basis-1/2">
                                        {
                                            data.status === 'P' ? (
                                                <span className="inline-flex items-center mr-2 rounded bg-orange-100 px-3 text-sm text-orange-600 ring-1 ring-inset ring-orange-500/20">
                                                    {
                                                        data.meta.app < data.meta.all ? (
                                                            <span>Pending approval from members</span>
                                                        ) : (
                                                            <span>Pending admin's approval</span>
                                                        )
                                                    }
                                                </span>
                                            ) : data.status === 'A' ? (
                                                <span className="inline-flex items-center mr-2 rounded bg-emerald-100 px-3 text-sm text-emerald-600 ring-1 ring-inset ring-emerald-500/20">
                                                    Approved
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center mr-2 rounded bg-red-100 px-3 text-sm text-red-600 ring-1 ring-inset ring-red-500/10">
                                                    Rejected
                                                </span>
                                            )
                                        }
                                    </div>

                                    <div className="basis-1/2">
                                        <span className={
                                            classNames(
                                                data.meta.app < data.meta.all ? 'text-orange-500' : 'text-emerald-500',
                                                'text-sm'
                                            )
                                        }>
                                            {
                                                data.meta.app < data.meta.all ? (
                                                    <span>{data.meta.app}/{data.meta.all}</span>
                                                ) : (
                                                    <span>All</span>
                                                )
                                            } members approved
                                        </span>
                                    </div>
                                </div>

                                <div className="py- px-3 md:basis-1/2 w-full border-2 mb-3 border-gray-300 border-dashed rounded-md">
                                    <div className="flex flex-row w-full align-middle items-center">
                                        <div className="basis-2/3 text-stone-500 text-sm">
                                            <span className=" py-1 block mb-2">
                                                <span className="hidden md:inline-block">Amount to Receive:</span>
                                                <span className="md:hidden">You'll Receive:</span>
                                            </span>

                                            <span className=" py-1 block mb-2">
                                                <span className="hidden md:inline-block">Processing Fee ({data.comm_rate}%):</span>
                                                <span className="md:hidden">Processing Fee ({data.comm_rate}%):</span>
                                            </span>

                                            <span className=" py-1 block mb-2">
                                                <span className="hidden md:inline-block">Mpesa Transaction Cost:</span>
                                                <span className="md:hidden">Mpesa Transaction Cost:</span>
                                            </span>
                                        </div>

                                        <div className="basis-1/3 text-stone-600 text-right">
                                            <span className=" py-1 block mb-2 capitalize">
                                                {formatAmount(parseFloat(data.amount_payable))}
                                            </span>

                                            <span className=" py-1 block mb-2 capitalize">
                                                {formatAmount(parseFloat(data.comm_amount))}
                                            </span>

                                            <span className=" py-1 block mb-2 capitalize">
                                                {formatAmount(parseFloat(data.mpesa_b2c_fee))}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )

                ),
            },
        ],
        []
    )

    const fulfilledTransactions = React.useMemo(
        () => [
            {
                Header: 'Paid Out',
                id: 'FXd-Wc00',
                accessor: (data: any) => (
                    <div className="px-0 w-full">
                        <div className="md:grid md:grid-cols-4 flex-col gap-x-3 md:gap-y-0 space-y-2 align-middle items-center justify-between w-full text-sm py-1 md:py-0">
                            <span className="text-orange-600 md:block flex flex-row w-full md:mb-0 mb-1">
                                <div className="basis-1/2 md:w-auto">
                                    {
                                        data.receipt === null ? (
                                            <span>-</span>
                                        ) : (
                                            data.receipt
                                        )
                                    }
                                </div>

                                <span className="md:block mb-0 text-sm text-slate-500 text-start hidden">
                                    {DateFormating(data.created_at)}
                                </span>

                                <div className="md:w-auto basis-1/2 md:hidden">
                                    {
                                        data.result_code === null || data.result_code === undefined ? (
                                            <span className="bg-yellow-100 text-yellow-800 text-xs py-1 px-2 rounded float-right gap-x-2 align-middle items-center w-auto">
                                                <span className="hidden md:inline-block">Pending Payment</span>
                                                <span className="md:hidden">Pending</span>
                                            </span>
                                        ) : (
                                            data.result_code === '0' ? (
                                                <span className="bg-emerald-100 text-emerald-700 text-xs py-1 px-2 rounded float-right gap-x-2 align-middle items-center w-auto">
                                                    <span className="hidden md:inline-block">Payment Fulfilled</span>
                                                    <span className="md:hidden">Payment Fulfilled</span>
                                                </span>
                                            ) : (
                                                <span className="bg-yellow-100 text-yellow-800 text-xs py-1 px-2 rounded float-right gap-x-2 align-middle items-center w-auto">
                                                    <span className="hidden md:inline-block">Pending Payment</span>
                                                    <span className="md:hidden">Pending Payment</span>
                                                </span>
                                            )
                                        )
                                    }
                                </div>
                            </span>

                            <span className="text-stone-600">
                                {data.msisdn}
                            </span>

                            <div className="w-auto flex flex-col">
                                <div className="flex flex-row align-middle items-center gap-x-1.5">
                                    <span className="text-stone-500 text-xs">
                                        Ksh.
                                    </span>

                                    <span className="text-lg">
                                        <span className="text-stone-700">{data.amount.split('.')[0]}</span>
                                        <span className="text-stone-400">.{data.amount.split('.')[1]}</span>
                                    </span>
                                </div>

                                <div className="flex flex-row align-middle items-center gap-x-1.5">
                                    <span className="text-stone-500 text-xs">
                                        Ksh.
                                    </span>

                                    <span className="text-sm">
                                        <span className="text-stone-500">{data.mpesa_b2c_fee}</span>
                                    </span>
                                    TXN Charge
                                </div>
                            </div>

                            <div className="w-auto hidden md:block">
                                {
                                    data.result_code === null || data.result_code === undefined ? (
                                        <span className="bg-yellow-100 text-stone-700 text-xs py-1 px-2 rounded inline-flex gap-x-2 align-middle items-center w-auto">
                                            <span className="hidden md:inline-block">Pending Payment</span>
                                            <span className="md:hidden">Pending</span>
                                        </span>
                                    ) : (
                                        data.result_code === '0' ? (
                                            <span className="bg-emerald-100 text-emerald-700 text-xs py-1 px-2 rounded inline-flex gap-x-2 align-middle items-center w-auto">
                                                <span className="hidden md:inline-block">Payment Fulfilled</span>
                                                <span className="md:hidden">Payment Fulfilled</span>
                                            </span>
                                        ) : (
                                            <span className="bg-yellow-100 text-stone-700 text-xs py-1 px-2 rounded inline-flex gap-x-2 align-middle items-center w-auto">
                                                <span className="hidden md:inline-block">Pending Payment</span>
                                                <span className="md:hidden">Pending Payment</span>
                                            </span>
                                        )
                                    )
                                }
                            </div>
                        </div>
                    </div>
                ),
            },
        ],
        []
    )

    return (
        <React.Fragment>
            {
                state.status === 'rejected' ? (
                    null
                ) : state.status === 'fulfilled' ? (
                    <div className="py-4">
                        <h2 className="text-lg leading-7 text-orange-600 sm:text-lg sm: mb-2">
                            Withdrawal Request
                        </h2>

                        <div className="w-12/12">
                            <p className="text-sm form-group text-gray-500">
                                Withdrawals requests to move money from your wallet
                            </p>
                        </div>


                        {
                            state.data.requests.length < 1 ? (
                                <div className="mb-3">
                                    <div className="flex m-auto w-full md:w- flex-col md:flex-row md:space-x-4 justify-center px-6 py-4 border-2 border-stone-300 border-dashed rounded-md">
                                        <div className="space-y-6 text-center">
                                            <div className="text-sm w-full text-stone-600">
                                                <p className="pb-2 text-lg">
                                                    No pending withdrawal requests found
                                                </p>
                                                <p className="text-sm text-gray-500 pb-1">
                                                    Make a withdrawal today to access your funds.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full">
                                    <ReactTable columns={columns} data={state.data.requests} />
                                </div>
                            )
                        }

                        <div className="w-12/12">
                            <p className="text-sm pt-3 form-group text-orange-500">
                                Paid out withdrawal requets
                            </p>
                        </div>

                        <div className="w-full">
                            {
                                state.data.money_out.length < 1 ? (
                                    <div className="py-4">
                                        <Empty title="No withdrawal transactions found" description={""} />
                                    </div>
                                ) : (
                                    <div className="w-full">
                                        <ReactTable columns={fulfilledTransactions} data={state.data.money_out} />
                                    </div>
                                )
                            }
                        </div>
                    </div>
                ) : (
                    <div className="py-4">
                        <Loading />
                    </div>
                )
            }
        </React.Fragment>
    )
}