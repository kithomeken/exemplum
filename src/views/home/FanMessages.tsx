import React from "react"

import { ACCOUNT } from "../../api/API_Registry"
import HttpServices from "../../services/HttpServices"
import { Loading } from "../../components/modules/Loading"
import { formatAmount, humanReadableDate } from "../../lib/modules/HelperFunctions"
import ReactTable from "../../lib/hooks/ReactTable"


export const FanMessages = () => {
    const [state, setstate] = React.useState({
        status: 'pending',
        data: {
            messages: null
        },
    })

    React.useEffect(() => {
        fetchFanMessages()
    }, [])

    const fetchFanMessages = async () => {
        let { data } = state
        let { status } = state

        try {
            const response: any = await HttpServices.httpGet(ACCOUNT.FAN_MESSAGES)

            if (response.data.success) {
                status = 'fulfilled'
                data.messages = response.data.payload.messages

                Object.keys(data.messages).forEach(function (key) {
                    data.messages[key].amount = formatAmount(parseFloat(data.messages[key].amount))
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

    const columns = React.useMemo(
        () => [
            {
                Header: 'Fan Messages',
                id: 'BnZ-XoIJIYa',
                accessor: (data: any) => (
                    <>
                        <div className="px-0 w-full">
                            <span className="text-stone-600 block py-1-5 text-wrap text-sm">
                                {data.note}
                            </span>

                            <div className="md:grid md:grid-cols-4 flex-col gap-x-3 md:gap-y-0 space-y-2 align-middle items-center justify-between w-full text-sm py-1 md:py-0">
                                <span className="text-orange-600 md:block flex flex-row w-full md:mb-0 mb-1">
                                    <div className="basis-1/2 md:w-auto">
                                        {data.message}
                                    </div>

                                    <span className="md:block mb-0 text-sm text-slate-500 text-start hidden">
                                        {humanReadableDate(data.tran_date)}
                                    </span>
                                </span>

                                <span className="text-stone-600 flex flex-col gap-y-1">
                                    {data.msisdn}
                                </span>

                                <div className="w-auto">
                                    <div className="flex flex-row align-middle items-center gap-x-1.5">
                                        <span className="text-stone-500 text-xs">
                                            Donated KES.
                                        </span>

                                        <span className="text-lg">
                                            <span className="text-stone-700">{data.amount.split('.')[0]}</span>
                                            <span className="text-stone-400">.{data.amount.split('.')[1]}</span>
                                        </span>
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
                            Fan Messages
                        </h2>

                        <div className="w-12/12">
                            <p className="text-sm form-group text-gray-500">
                                Messages from your fans
                            </p>
                        </div>

                        {
                            state.data.messages.length < 1 ? (
                                <div className="mb-3">
                                    <div className="flex m-auto w-full md:w- flex-col md:flex-row md:space-x-4 justify-center px-6 py-4 border-2 border-stone-300 border-dashed rounded-md">
                                        <div className="space-y-6 text-center">
                                            <div className="text-sm w-full text-stone-600">
                                                <p className="pb-2 text-lg">
                                                    No fan messages found
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full">
                                    <ReactTable columns={columns} data={state.data.messages} />
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