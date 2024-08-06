import React, { useState } from "react"

import { Empty } from "../errors/Empty"
import { ERR_404 } from "../errors/ERR_404"
import { ERR_500 } from "../errors/ERR_500"
import ReactTable from "../../lib/hooks/ReactTable"
import HttpServices from "../../services/HttpServices"
import { ADMINISTRATION } from "../../api/API_Registry"
import { Loading } from "../../components/modules/Loading"
import { humanReadableDate } from "../../lib/modules/HelperFunctions"
import { RequestDetails } from "./RequestDetails"

export const AllEntities = () => {
    const [state, setstate] = useState({
        uuid: null,
        httpStatus: 200,
        status: 'pending',
        data: {
            enTT: null,
        },
        show: {
            detailsPanel: false,
        },
    })

    React.useEffect(() => {
        fetchOnboardedEntities()
    }, [])

    const fetchOnboardedEntities = async () => {
        let { data } = state
        let { status } = state
        let { httpStatus } = state

        try {
            const response: any = await HttpServices.httpGet(ADMINISTRATION.ALL_ENTITIES)
            httpStatus = response.status

            if (response.data.success) {
                data.enTT = response.data.payload.enTT
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

        show.detailsPanel = !state.show.detailsPanel
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
                Header: 'Type',
                id: 'cle22tk3i',
                accessor: (data: { type: any }) => (
                    <span>
                        <span className="text-sm font-normal text-stone-500 whitespace-nowrap">
                            {data.type}
                        </span>
                    </span>
                ),
            },
            {
                Header: 'Account',
                id: 'iub7Y3jndi3',
                accessor: (data: { account: any }) => (
                    <span>
                        <span className="text-sm font-normal text-stone-500 whitespace-nowrap">
                            {data.account}
                        </span>
                    </span>
                ),
            },
            {
                Header: 'Joined Date',
                id: 'jhfbcinsakdnwq',
                accessor: (data: { created_at: any }) => (
                    <span className="text-sm font-normal text-stone-500 whitespace-nowrap">
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
                            <div className="py-3 px-4">
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
                                    <p className="text-xl flex-auto text-amber-600 mb-2">
                                        Entities

                                        <span className="py-2 block text-sm font-normal text-stone-500">
                                            List of onboarded artists and their members
                                        </span>
                                    </p>
                                </div>

                                <div className="flex mb-4 w-full">
                                    {
                                        state.data.enTT.length < 1 ? (
                                            <div className="w-full overflow-x-auto sm:rounded-lg">
                                                <Empty description={"You haven't onboarded any entities at the moment"} />
                                            </div>
                                        ) : (
                                            <div className="w-full overflow-x-auto sm:rounded-lg">
                                                <ReactTable columns={columns} data={state.data.enTT} />
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
                show={state.show.detailsPanel}
                showOrHide={showOrHideRequestDetailsPanel}
            />
        </React.Fragment>
    )
}