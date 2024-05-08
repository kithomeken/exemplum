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
                    <div className="px-0 w-full">
                        <div className="flex flex-col md:flex-row">
                            <div className="w-full flex flex-row md:pr-3 align-middle items-center pb-2 md:py-0.5 md:basis-1/2">
                                <span className=" py-1 px-1.5 text-stone-500 text-xs">
                                    Ksh.
                                </span>

                                <span className=" py-1 px-1.5 text-2xl">
                                    <span className="text-stone-700">{data.amount.split('.')[0]}</span>
                                    <span className="text-stone-400">.{data.amount.split('.')[1]}</span>
                                </span>

                                <span className="block mb-0 text-sm text-slate-500 basis-1/2 text-right md:hidden">
                                    {humanReadableDate(data.tran_date)}
                                </span>
                            </div>

                            <div className="w-full flex flex-row align-middle items-center pb-2 md:pl-3 md:py-1 md:basis-1/2">
                                <div className="flex flex-row align-middle items-center w-full">
                                    <div className="basis-1/2">
                                        <span className="inline-flex items-center text-sm font-medium text-orange-600">
                                            <span className="text-orange-600 mr-2 pr-2 md:mr-4 md:pr-4 border-r">
                                                {data.receipt}
                                            </span>

                                            <span className="text-stone-600">
                                                {data.msisdn}
                                            </span>

                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <span className="md:block mb-0 text-sm text-slate-500 basis-1/2 text-start hidden px-1.5">
                            {humanReadableDate(data.tran_date)}
                        </span>
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