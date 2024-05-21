import React, { useState } from "react"

import { Empty } from "../errors/Empty"
import { ERR_404 } from "../errors/ERR_404"
import { ERR_500 } from "../errors/ERR_500"
import ReactTable from "../../lib/hooks/ReactTable"
import HttpServices from "../../services/HttpServices"
import { ADMINISTRATION } from "../../api/API_Registry"
import { Loading } from "../../components/modules/Loading"
import { DateFormating } from "../../lib/modules/HelperFunctions"

export const MpesaExceptions = () => {
    const [state, setstate] = useState({
        uuid: null,
        httpStatus: 200,
        status: 'pending',
        data: {
            exceptions: null,
        },
    })

    React.useEffect(() => {
        fetchMpesaExceptions()
    }, [])

    const fetchMpesaExceptions = async () => {
        let { data } = state
        let { status } = state
        let { httpStatus } = state

        try {
            const mpesaXceptions: any = await HttpServices.httpGet(ADMINISTRATION.MPESA_EXCEPTIONS)
            httpStatus = mpesaXceptions.status

            if (mpesaXceptions.data.success) {
                data.exceptions = mpesaXceptions.data.payload.exceptions
                status = 'fulfilled'
            } else {
                status = 'rejected'
            }
        } catch (error) {
            httpStatus = 500
            status = 'rejected'
        }

        setstate({
            ...state, status, data, httpStatus
        })
    }

    const exceptionsColumns = React.useMemo(
        () => [
            {
                Header: 'Module',
                id: 'Xy5RvKs3',
                accessor: (data: { module: any }) => (
                    <span className="text-sm font-normal text-slate-800 whitespace-nowrap dark:text-gray-400">
                        {data.module}
                    </span>
                ),
            },
            {
                Header: 'Exception Date',
                id: 'fJ7iS2oE4n',
                accessor: (data: { created_at: any }) => (
                    <span className="text-sm font-normal text-gray-500 whitespace-nowrap dark:text-gray-400">
                        {DateFormating(data.created_at)}
                    </span>
                )
            },
            {
                Header: 'Error Code',
                id: '6pAqW8tC',
                accessor: (data: { error_code: any, error_message: any }) => (
                    <span className="flex flex-row gap-x-1">
                        <span className="text-slate-700 text-sm">
                            {data.error_code}:
                        </span>

                        <span className="text-sm font-normal text-gray-500 whitespace-nowrap dark:text-gray-400">
                            {data.error_message}
                        </span>
                    </span>
                ),
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
                                        MPESA Exceptions

                                        <span className="py-2 block text-sm font-normal text-gray-500 dark:text-gray-400">
                                            Comprehensive log of all exceptional occurrences and errors related to MPESA transactions, providing insights for troubleshooting and resolution.
                                        </span>
                                    </p>
                                </div>

                                <div className="flex mb-4 w-full">
                                    {
                                        state.data.exceptions.length < 1 ? (
                                            <Empty description={'No contributions have been made at the moment...'} />
                                        ) : (
                                            <div className="w-full overflow-x-auto sm:rounded-lg">
                                                <ReactTable columns={exceptionsColumns} data={state.data.exceptions} />
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