import React, { useState } from "react"

import { Empty } from "../errors/Empty"
import { ACCOUNT } from "../../api/API_Registry"
import ReactTable from "../../lib/hooks/ReactTable"
import HttpServices from "../../services/HttpServices"
import { Loading } from "../../components/modules/Loading"
import { humanReadableDate } from "../../lib/modules/HelperFunctions"

export const MoneyIn = () => {
    const [state, setstate] = useState({
        status: 'pending',
        data: {
            money_in: null
        }
    })

    React.useEffect(() => {
        moneyInTransactions()
    }, [])

    const moneyInTransactions = async () => {
        let { status } = state
        let { data } = state

        try {
            const response: any = await HttpServices.httpGet(ACCOUNT.MONEY_IN_TRANSACTIONS)

            if (response.data.success) {
                status = 'fulfilled'
                data.money_in = response.data.payload.in
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

    const columns = React.useMemo(
        () => [
            {
                Header: 'Paid In',
                id: 'FXd-Wc00',
                accessor: (data: any) => (
                    <>
                        <div className="px-0 w-full">
                            <div className="md:grid md:grid-cols-4 flex-col gap-x-3 md:gap-y-0 space-y-2 align-middle items-center justify-between w-full text-sm py-1 md:py-0">
                                <span className="text-orange-600 md:block flex flex-row w-full md:mb-0 mb-1">
                                    <div className="basis-1/2 md:w-auto">
                                        {data.receipt}
                                    </div>

                                    <span className="md:block mb-0 text-sm text-slate-500 text-start hidden">
                                        {humanReadableDate(data.tran_date)}
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

                                <div className="w-auto">
                                    <div className="flex flex-row align-middle items-center gap-x-1.5">
                                        <span className="text-stone-500 text-xs">
                                            KES.
                                        </span>

                                        <span className="text-lg">
                                            <span className="text-stone-700">{data.gross.split('.')[0]}</span>
                                            <span className="text-stone-400">.{data.gross.split('.')[1]}</span>
                                        </span>
                                    </div>
                                </div>

                                <div className="w-auto flex flex-col">
                                    <div className="flex flex-row align-middle items-center gap-x-1.5">
                                        <span className="text-stone-500 text-xs">
                                            KES.
                                        </span>

                                        <span className="text-sm">
                                            <span className="text-stone-500">{data.amount}</span>
                                        </span>
                                        Credited to A/c
                                    </div>

                                    <div className="flex flex-row align-middle items-center gap-x-1.5">
                                        <span className="text-stone-500 text-xs">
                                            KES.
                                        </span>

                                        <span className="text-sm">
                                            <span className="text-stone-500">{data.comm_amount}</span>
                                        </span>
                                        Comm Charged
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
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
                            Money In
                        </h2>

                        <div className="w-12/12">
                            <p className="text-sm form-group text-gray-500">
                                All the contributions from your fans.
                            </p>
                        </div>

                        {
                            state.data.money_in.length < 1 ? (
                                <div className="py-4">
                                    <Empty title="No transactions found" description={"We're sure some coins will come trickling in soon..."} />
                                </div>
                            ) : (
                                <div className="w-full">
                                    <ReactTable columns={columns} data={state.data.money_in} />
                                </div>
                            )
                        }
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