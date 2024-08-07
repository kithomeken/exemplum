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
                id: 'Yo3sm5Lri4',
                accessor: (data: { module: any }) => (
                    <span className="text-sm font-normal text-slate-800 whitespace-nowrap">
                        {data.module}
                    </span>
                ),
            },
            {
                Header: 'Type',
                id: 'tHmMTe3py9',
                accessor: (data: { exception: any }) => (
                    <span className="text-slate-600 text-sm">
                        {data.exception}
                    </span>
                ),
            },
            {
                Header: 'Message',
                id: 'SKql82t39z',
                accessor: (data: { message: any }) => (
                    <span className="text-sm font-normal text-gray-500 whitespace-nowrap">
                        {data.message}
                    </span>
                ),
            },
            {
                Header: 'Date',
                id: 'mR7PtX0LEE',
                accessor: (data: { created_at: any }) => (
                    <span className="text-sm font-normal text-gray-500 whitespace-nowrap">
                        {DateFormating(data.created_at)}
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
                                        MPESA Exceptions

                                        <span className="py-2 block text-sm font-normal text-gray-500 dark:text-gray-400">
                                            Comprehensive log of all exceptional occurrences and errors related to MPESA transactions, providing insights for troubleshooting and resolution.
                                        </span>
                                    </p>
                                </div>

                                <div className="flex mb-4 w-full">
                                    {
                                        state.data.exceptions.length < 1 ? (
                                            <div className="w-full overflow-x-auto sm:rounded-lg">
                                                <Empty description={'No contributions have been made at the moment...'} />
                                            </div>
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