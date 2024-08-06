import React, { useState } from "react"

import { Empty } from "../errors/Empty"
import { ERR_404 } from "../errors/ERR_404"
import { ERR_500 } from "../errors/ERR_500"
import { PaymentDetails } from "./PaymentDetails"
import ReactTable from "../../lib/hooks/ReactTable"
import HttpServices from "../../services/HttpServices"
import { ADMINISTRATION } from "../../api/API_Registry"
import { Loading } from "../../components/modules/Loading"
import { formatAmount, humanReadableDate } from "../../lib/modules/HelperFunctions"

export const WithdrawalRequests = () => {
    const [state, setstate] = useState({
        uuid: null,
        httpStatus: 200,
        status: 'pending',
        data: {
            payments: null,
        },
        show: {
            paymentPanel: false,
        },
    })

    React.useEffect(() => {
        fetchPaymentRequests()
    }, [])

    const showOrHidePaymentDetailsPanel = (uuidX: string) => {
        let { show } = state
        let { uuid } = state
        let { status } = state

        show.paymentPanel = !state.show.paymentPanel
        uuid = uuidX
        status = 'fulfilled'

        setstate({
            ...state, show, uuid, status
        })
    }

    const fetchPaymentRequests = async () => {
        let { data } = state
        let { status } = state
        let { httpStatus } = state

        try {
            const response: any = await HttpServices.httpGet(ADMINISTRATION.ALL_PAYMENTS)
            httpStatus = response.status

            if (response.data.success) {
                data.payments = response.data.payload.payments

                Object.keys(data.payments).forEach(function (key) {
                    data.payments[key].gross = formatAmount(parseFloat(data.payments[key].gross))
                    data.payments[key].amount_payable = formatAmount(parseFloat(data.payments[key].amount_payable))
                })

                status = 'fulfilled'
            } else {
                status = 'rejected'
            }
        } catch (error) {
            status = 'rejected'
        }

        setstate({
            ...state, status, data, httpStatus
        })
    }

    const columns = React.useMemo(
        () => [
            {
                Header: 'Entity',
                id: 'oL2hX0Dp3R',
                accessor: (data: { name: any }) => (
                    <span className="block text-slate-800 text-sm py-1">
                        {data.name}
                    </span>
                ),
            },
            {
                Header: 'Amount',
                id: 'sQ4eR8zT3j',
                accessor: (data: { gross: any }) => (
                    <span className="flex flex-row align-middle items-center">
                        <span className="pc-1 px-1.5 text-sm">
                            <span className="text-stone-700">{data.gross.split('.')[0]}</span>
                            <span className="text-stone-400">.{data.gross.split('.')[1]}</span>
                        </span>
                    </span>
                ),
            },
            {
                Header: 'Status',
                id: 'g8F7A1kH5l',
                accessor: (data: { status: any, txn: any }) => (
                    <span>
                        {
                            data.status === 'P' ? (
                                <span className="bg-purple-100 text-purple-800 text-xs mr-2 px-2.5 py-0.5 rounded-md border border-purple-100 dark:bg-gray-700 dark:border-purple-500 dark:text-purple-400">
                                    <span className="hidden md:inline-block">New Request</span>
                                    <span className="md:hidden">New</span>
                                </span>
                            ) : data.status === 'R' ? (
                                <span className="bg-red-100 text-red-800 text-xs mr-2 px-2.5 py-0.5 rounded-md border border-red-100 dark:border-red-400 dark:bg-gray-700 dark:text-red-400">
                                    <span className="hidden md:inline-block">Rejected</span>
                                    <span className="md:hidden">Rejected</span>
                                </span>
                            ) : (
                                data.txn === '0' ? (
                                    <span className="bg-green-100 text-green-800 text-xs mr-2 px-2.5 py-0.5 rounded-md dark:bg-gray-700 dark:text-green-400 border border-green-100 dark:border-green-500">
                                        <span className="hidden md:inline-block">Account Settled</span>
                                        <span className="md:hidden">Paid</span>
                                    </span>
                                ) : data.txn === null ? (
                                    <span className="bg-green-100 text-green-800 text-xs mr-2 px-2.5 py-0.5 rounded-md dark:bg-gray-700 dark:text-green-400 border border-green-100 dark:border-green-500">
                                        <span className="hidden md:inline-block">Approved</span>
                                        <span className="md:hidden">Approved</span>
                                    </span>
                                ) : (
                                    <span className="bg-red-100 text-red-800 text-xs mr-2 px-2.5 py-0.5 rounded-md border border-red-100 dark:border-red-400 dark:bg-gray-700 dark:text-red-400">
                                        <span className="hidden md:inline-block">Payment Error</span>
                                        <span className="md:hidden">Payment Error</span>
                                    </span>
                                )
                            )
                        }
                    </span>
                ),
            },
            {
                Header: 'Reference',
                id: 'tU6dM1rH2x',
                accessor: (data: { account: any }) => (
                    <span>
                        <span className="text-sm font-normal text-gray-500 whitespace-nowrap dark:text-gray-400">
                            {data.account}
                        </span>
                    </span>
                ),
            },
            {
                Header: 'Request Date',
                id: 'fJ7iS2oE4n',
                accessor: (data: { created_at: any }) => (
                    <span className="text-sm font-normal text-gray-500 whitespace-nowrap dark:text-gray-400">
                        {humanReadableDate(data.created_at)}
                    </span>
                )
            },
            {
                Header: '-',
                id: 'cK1aV8pB9o',
                accessor: (data: { uuid: any }) => (
                    <span onClick={() => showOrHidePaymentDetailsPanel(data.uuid)} className="text-amber-600 m-auto hover:underline text-right block float-right cursor-pointer hover:text-amber-900 text-xs">
                        View
                    </span>
                )
            },
        ],
        []
    )

    return (
        <React.Fragment>
            {
                state.status === 'rejected' ? (
                    <div className="w-full flex-grow">
                        <div className={`w-full pb-3 mx-auto bg-white border rounded h-full`}>
                            <div className="py-3 px-4 w-full">
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
                            </div>
                        </div>
                    </div>
                ) : state.status === 'fulfilled' ? (
                    <div className="w-full flex-grow">
                        <div className={`w-full pb-3 mx-auto bg-white border rounded h-full`}>
                            <div className="py-3 px-4">
                                <div className="flex items-center">
                                    <p className="text-xl flex-auto text-amber-600 mb-2 font-bold dark:text-white">
                                        Withdrawal Requests

                                        <span className="py-2 block text-sm font-normal text-gray-500 dark:text-gray-400">
                                            List of all entity funds withdrawal
                                        </span>
                                    </p>
                                </div>

                                <div className="flex mb-4 w-full">
                                    {
                                        state.data.payments.length < 1 ? (
                                            <div className="w-full overflow-x-auto sm:rounded-lg">
                                                <Empty description={'You do not have any payment requests at the moment'} />
                                            </div>
                                        ) : (
                                            <div className="w-full overflow-x-auto sm:rounded-lg">
                                                <ReactTable columns={columns} data={state.data.payments} />
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="w-full h-full flex flex-col justify-center">
                        <div className="flex-grow">
                            <Loading />
                        </div>
                    </div>
                )
            }

            <PaymentDetails
                uuid={state.uuid}
                show={state.show.paymentPanel}
                showOrHide={showOrHidePaymentDetailsPanel}
            />
        </React.Fragment>
    )
}