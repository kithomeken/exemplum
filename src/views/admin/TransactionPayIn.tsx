import React, { useState } from "react"

import { Empty } from "../errors/Empty"
import { ERR_404 } from "../errors/ERR_404"
import { ERR_500 } from "../errors/ERR_500"
import ReactTable from "../../lib/hooks/ReactTable"
import HttpServices from "../../services/HttpServices"
import { ADMINISTRATION } from "../../api/API_Registry"
import { Loading } from "../../components/modules/Loading"
import { DateFormating, formatAmount } from "../../lib/modules/HelperFunctions"

export const TransactionPayIn = () => {
    const [state, setstate] = useState({
        uuid: null,
        httpStatus: 200,
        status: 'pending',
        data: {
            payin: null,
        },
        show: {
            payoutPanel: false,
        },
    })

    React.useEffect(() => {
        fetchTransactionPayIn()
    }, [])

    const showOrHidePaymentDetailsPanel = (uuidX: string) => {
        let { show } = state
        let { uuid } = state
        let { status } = state

        show.payoutPanel = !state.show.payoutPanel
        uuid = uuidX
        status = 'fulfilled'

        setstate({
            ...state, show, uuid, status
        })
    }

    const fetchTransactionPayIn = async () => {
        let { data } = state
        let { status } = state
        let { httpStatus } = state

        try {
            const response: any = await HttpServices.httpGet(ADMINISTRATION.TXN_PAYIN)
            httpStatus = response.status

            if (response.data.success) {
                data.payin = response.data.payload.payin

                Object.keys(data.payin).forEach(function (key) {
                    data.payin[key].amount = formatAmount(parseFloat(data.payin[key].amount))
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
                    <span className="text-sm font-normal text-slate-800 whitespace-nowrap dark:text-gray-400">
                        {data.name}
                    </span>
                ),
            },
            {
                Header: 'Amount',
                id: 'sQ4eR8zT3j',
                accessor: (data: { amount: any }) => (
                    <span className="flex flex-row align-middle items-center pc-1 px-1.5 text-sm">
                        <span className="pr-2">KES</span>
                        <span className="text-stone-700">{data.amount.split('.')[0]}</span>
                        <span className="text-stone-400">.{data.amount.split('.')[1]}</span>
                    </span>
                ),
            },
            {
                Header: 'Receipt',
                id: 'tU6dM1rH2x',
                accessor: (data: { receipt: any }) => (
                    <span>
                        <span className="text-sm font-normal text-gray-500 whitespace-nowrap dark:text-gray-400">
                            {data.receipt}
                        </span>
                    </span>
                ),
            },
            {
                Header: 'Phone Number',
                id: 'uwdoi3r3UH',
                accessor: (data: { msisdn: any }) => (
                    <span>
                        <span className="text-sm font-normal text-gray-500 whitespace-nowrap dark:text-gray-400">
                            {data.msisdn}
                        </span>
                    </span>
                ),
            },
            {
                Header: 'Transaction Date',
                id: 'fJ7iS2oE4n',
                accessor: (data: { tran_date: any }) => (
                    <span className="text-sm font-normal text-gray-500 whitespace-nowrap dark:text-gray-400">
                        {DateFormating(data.tran_date)}
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
                                        Fan Contributions

                                        <span className="py-2 block text-sm font-normal text-gray-500 dark:text-gray-400">
                                            MPESA contributions to various entities by their fans
                                        </span>
                                    </p>
                                </div>

                                <div className="flex mb-4 w-full">
                                    {
                                        state.data.payin.length < 1 ? (
                                            <Empty description={'No contributions have been made at the moment...'} />
                                        ) : (
                                            <div className="w-full overflow-x-auto sm:rounded-lg">
                                                <ReactTable columns={columns} data={state.data.payin} />
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
        </React.Fragment>
    )
}