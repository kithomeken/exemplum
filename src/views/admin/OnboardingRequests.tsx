import React, { useState } from "react"

import { Empty } from "../errors/Empty"
import { ERR_404 } from "../errors/ERR_404"
import { ERR_500 } from "../errors/ERR_500"
import { RequestDetails } from "./RequestDetails"
import ReactTable from "../../lib/hooks/ReactTable"
import HttpServices from "../../services/HttpServices"
import { ADMINISTRATION } from "../../api/API_Registry"
import { Loading } from "../../components/modules/Loading"
import { humanReadableDate } from "../../lib/modules/HelperFunctions"

export const OnboardingRequests = () => {
    const [state, setstate] = useState({
        uuid: null,
        httpStatus: 200,
        status: 'pending',
        data: {
            onboarding: null,
        },
        show: {
            requestPanel: false,
        },
    })

    React.useEffect(() => {
        fetchOnboardingRequests()
    }, [])

    const fetchOnboardingRequests = async () => {
        let { data } = state
        let { status } = state
        let { httpStatus } = state

        try {
            const response: any = await HttpServices.httpGet(ADMINISTRATION.ALL_REQUETS)
            httpStatus = response.status

            if (response.data.success) {
                data.onboarding = response.data.payload.requests
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

    const showOrHideRequestDetailsPanel = (uuidX: string) => {
        let { show } = state
        let { uuid } = state
        let { status } = state

        show.requestPanel = !state.show.requestPanel
        uuid = uuidX
        status = 'fulfilled'

        setstate({
            ...state, show, uuid, status
        })
    }

    const columns = React.useMemo(
        () => [
            {
                Header: 'Entity',
                id: 'cl74wb4y7',
                accessor: (data: { name: any }) => (
                    <span className="flex flex-row align-middle items-center">
                        <span className="block text-slate-800 text-sm py-1">
                            {data.name}
                        </span>
                    </span>
                ),
            },
            {
                Header: 'Status',
                id: 'n9YpE3zK0q',
                accessor: (data: { status: any }) => (
                    <span>
                        {
                            data.status === 'A' ? (
                                <span className="bg-green-100 text-green-800 text-xs mr-2 px-2.5 py-0.5 rounded-md dark:bg-gray-700 dark:text-green-400 border border-green-100 dark:border-green-500">
                                    <span className="hidden md:inline-block">Approved</span>
                                    <span className="md:hidden">Approved</span>
                                </span>
                            ) : data.status === 'P' ? (
                                <span className="bg-purple-100 text-purple-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-md border border-purple-100 dark:bg-gray-700 dark:border-purple-500 dark:text-purple-400">
                                    <span className="hidden md:inline-block">New Request</span>
                                    <span className="md:hidden">New</span>
                                </span>
                            ) : (
                                <span className="bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-md border border-red-100 dark:border-red-400 dark:bg-gray-700 dark:text-red-400">
                                    <span className="hidden md:inline-block">Rejected</span>
                                    <span className="md:hidden">Rejected</span>
                                </span>
                            )
                        }
                    </span>
                ),
            },
            {
                Header: 'Type',
                id: 'cle22tk3i',
                accessor: (data: { type: any }) => (
                    <span>
                        <span className="text-sm font-normal text-gray-500 whitespace-nowrap dark:text-gray-400">
                            {data.type}
                        </span>
                    </span>
                ),
            },
            {
                Header: 'Request Date',
                id: 'jhfbcinsakdnwq',
                accessor: (data: { created_at: any }) => (
                    <span className="text-sm font-normal text-gray-500 whitespace-nowrap dark:text-gray-400">
                        {humanReadableDate(data.created_at)}
                    </span>
                )
            },
            {
                Header: '-',
                id: 'ihbs87rvhb3298',
                accessor: (data: { uuid: any }) => (
                    <span onClick={() => showOrHideRequestDetailsPanel(data.uuid)} className="text-amber-600 m-auto hover:underline text-right block float-right cursor-pointer hover:text-amber-900 text-xs">
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
                                        Onboarding Requests

                                        <span className="py-2 block text-sm font-normal text-gray-500 dark:text-gray-400">
                                            List of client onboarding requests
                                        </span>
                                    </p>
                                </div>

                                <div className="flex mb-4 w-full">
                                    {
                                        state.data.onboarding.length < 1 ? (
                                            <Empty description={'You do not have any onboarding requests at the moment'} />
                                        ) : (
                                            <div className="w-full overflow-x-auto sm:rounded-lg">
                                                <ReactTable columns={columns} data={state.data.onboarding} />
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

            <RequestDetails
                uuid={state.uuid}
                show={state.show.requestPanel}
                showOrHide={showOrHideRequestDetailsPanel}
            />
        </React.Fragment>
    )
}