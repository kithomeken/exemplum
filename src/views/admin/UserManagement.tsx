import React, { useState } from "react"

import { Empty } from "../errors/Empty"
import { SearchBar } from "./SearchBar"
import { ERR_404 } from "../errors/ERR_404"
import { ERR_500 } from "../errors/ERR_500"
import { ArtistDetails } from "./ArtistDetails"
import ReactTable from "../../lib/hooks/ReactTable"
import HttpServices from "../../services/HttpServices"
import { ADMINISTRATION } from "../../api/API_Registry"
import { Loading } from "../../components/modules/Loading"
import { getColorForLetter } from "../../lib/modules/HelperFunctions"
import { G_onInputBlurHandler, G_onInputChangeHandler } from "../../components/lib/InputHandlers"

export const UserManagement = () => {
    const [state, setstate] = useState({
        uuid: null,
        httpStatus: 200,
        search: {
            posting: false,
            gotResults: 'search/no-operation',
        },
        status: 'pending',
        data: {
            onbU: [],
        },
        input: {
            search: ''
        },
        errors: {
            search: ''
        },
        show: {
            detailsPanel: false,
        },
    })

    React.useEffect(() => {
        fetchOnboardedUsers()
    }, [])

    const fetchOnboardedUsers = async () => {
        let { data } = state
        let { status } = state
        let { search } = state
        let { httpStatus } = state

        try {
            const response: any = await HttpServices.httpGet(ADMINISTRATION.ALL_USERS)
            httpStatus = response.status

            if (response.data.success) {
                data.onbU = response.data.payload.onbU
                search.posting = false
                status = 'fulfilled'
            } else {
                search.posting = false
                status = 'rejected'
            }
        } catch (error) {
            search.posting = false
            status = 'rejected'
        }

        setstate({
            ...state, status, data, httpStatus, search
        })
    }

    const onChangeHandler = (e: any) => {
        let { search } = state

        if (!search.posting) {
            let output: any = G_onInputChangeHandler(e, search.posting)
            let { input } = state
            let { errors }: any = state

            input[e.target.name] = output.value
            errors[e.target.name] = output.error

            setstate({
                ...state, input, errors
            })
        }
    }

    const onInputBlur = (e: any) => {
        let { search } = state

        if (!search.posting) {
            let output: any = G_onInputBlurHandler(e, search.posting, '')
            let { input } = state
            let { errors }: any = state

            input[e.target.name] = output.value
            errors[e.target.name] = output.error

            setstate({
                ...state, input, errors
            })
        }
    }

    const columns = React.useMemo(
        () => [
            {
                Header: 'Name',
                id: 'cl74wb4y7',
                accessor: (data: { display_name: any, email: any, photo_url: any }) => (
                    <span className="flex flex-row align-middle items-center space-x-4">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 flex flex-col justify-center align-middle items-center mx-auto">
                                {
                                    data.photo_url ? (
                                        <>
                                            <img className="rounded-full h-8 w-8" src={data.photo_url} alt={null} />
                                        </>
                                    ) : (
                                        <>
                                            <div className={`w-8 h-8 flex items-center justify-center rounded-full ${getColorForLetter(data.display_name.charAt(0))}`}>
                                                <span className="text-white text-lg">
                                                    {data.display_name.charAt(0)}
                                                </span>
                                            </div>
                                        </>
                                    )
                                }
                            </div>
                        </div>

                        <div className="flex-1 min-w-0">
                            <p className="text-gray-900 truncate">
                                {data.display_name}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                                {data.email}
                            </p>
                        </div>
                    </span>
                ),
            },
            {
                Header: 'Type',
                id: 'iub7Y3jndi3',
                accessor: (data: { type: any }) => (
                    <span>
                        {
                            data.type === null ? (
                                <span className="bg-orange-100 text-orange-800 text-xs mr-2 px-2.5 py-0.5 rounded-md border border-orange-100 ">
                                    <span className="hidden md:inline-block">Onboaring Pending</span>
                                    <span className="md:hidden">Pending</span>
                                </span>
                            ) : (
                                <span className="text-sm font-normal text-gray-500 whitespace-nowrap">
                                    {data.type}
                                </span>
                            )
                        }
                    </span>
                ),
            },
            {
                Header: 'Artist Name',
                id: 'cle22tk3i',
                accessor: (data: { artist: any }) => (
                    <span>
                        {
                            data.artist === null ? (
                                <>-</>
                            ) : (
                                <span className="text-sm font-normal text-gray-900 whitespace-nowrap">
                                    {data.artist}
                                </span>
                            )
                        }
                    </span>
                ),
            },

            {
                Header: 'Entity',
                id: 'jhfbcinsakdnwq',
                accessor: (data: { name: any, type: any, cpt: any }) => (
                    <span>
                        {
                            data.cpt === null ? (
                                <>-</>
                            ) : (
                                <span>
                                    <span className="text-sm font-normal text-gray-900 whitespace-nowrap">
                                        {data.name}
                                    </span>
                                </span>
                            )
                        }
                    </span>
                )
            },
            {
                Header: 'Status',
                id: 'n9YpE3zK0q',
                accessor: (data: { active: any }) => (
                    <span>
                        {
                            data.active === 'Y' ? (
                                <span className="bg-green-100 text-green-800 text-xs mr-2 px-2.5 py-0.5 rounded-md border border-green-100">
                                    <span className="hidden md:inline-block">Active</span>
                                    <span className="md:hidden">Active</span>
                                </span>
                            ) : (
                                <span className="bg-red-100 text-red-800 text-xs mr-2 px-2.5 py-0.5 rounded-md border border-red-100">
                                    <span className="hidden md:inline-block">Disabled</span>
                                    <span className="md:hidden">Disabled</span>
                                </span>
                            )
                        }
                    </span>
                ),
            },
            {
                Header: '-',
                id: 'ihbs87rvhb3298',
                accessor: (data: { uuid: any }) => (
                    <span onClick={() => showOrHideAccountDetailsPanel(data.uuid)}className="text-amber-600 m-auto hover:underline text-right block float-right cursor-pointer hover:text-amber-900 text-xs">
                        View
                    </span>
                )
            },
        ],
        []
    )

    const onSearchableTermHandler = (e: any) => {
        e.preventDefault()
        let { search } = state
        let { input } = state

        if (!search.posting) {
            search.posting = true
            search.gotResults = 'search/no-operation'

            setstate({
                ...state, search
            })

            if (!input.search.trim()) {
                fetchOnboardedUsers()
                return
            }

            if (input.search.length >= 3) {
                retrieveSearchResults()
                return
            }
        }
    }

    const retrieveSearchResults = async () => {
        let { data } = state
        let { input } = state
        let { search } = state
        let { httpStatus } = state

        try {
            const searchTerm = `?search=${encodeURIComponent(input.search)}`
            const searchResp: any = await HttpServices.httpGet(ADMINISTRATION.SRCH_USERS + searchTerm)
            httpStatus = searchResp.status

            if (searchResp.data.success) {
                data.onbU = searchResp.data.payload.onbU

                search.posting = false
                search.gotResults = data.onbU.length < 1 ? 'search/no-results' : 'search/list-results'
            } else {
                search.posting = false
            }
        } catch (error) {
            httpStatus = 500
            search.posting = false
        }

        setstate({
            ...state, search, data, httpStatus
        })
    }

    const showOrHideAccountDetailsPanel = (uuidX: string) => {
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
                            <div className="py-4 px-6">
                                <div className="flex items-center">
                                    <p className="text-2xl flex-auto text-amber-600 mb-2">
                                        User Management

                                        <span className="py-4 block text-sm font-normal text-gray-500">
                                            Essential tools to efficiently oversee user accounts. From account verification to engagement monitoring, our dashboard simplifies user management tasks, ensuring a smooth and secure user experience
                                        </span>
                                    </p>
                                </div>

                                <div className="flex mb-4 w-full">
                                    {
                                        state.data.onbU.length < 1 ? (
                                            <div className="w-full overflow-x-auto sm:rounded-lg">
                                                {
                                                    state.search.gotResults === 'search/no-operation' ? (
                                                        <Empty description={"You haven't onboarded any users at the moment"} />
                                                    ) : (
                                                        <div className="w-full overflow-x-auto sm:rounded-lg">
                                                            <SearchBar
                                                                state={state}
                                                                onInputBlur={onInputBlur}
                                                                onChangeHandler={onChangeHandler}
                                                                formHandler={onSearchableTermHandler}
                                                            />

                                                            <Empty description={`We've searched far and wide, but we've not found any match...`} />
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        ) : (
                                            <div className="w-full overflow-x-auto sm:rounded-lg">
                                                <SearchBar
                                                    state={state}
                                                    onInputBlur={onInputBlur}
                                                    onChangeHandler={onChangeHandler}
                                                    formHandler={onSearchableTermHandler}
                                                />

                                                <div className="pb-3">
                                                    {
                                                        state.search.posting ? (
                                                            <div className="w-full h-full flex flex-col py-3 justify-center">
                                                                <div className="flex-grow">
                                                                    <Loading />
                                                                </div>

                                                                <span className="text-amber-600 text-center">Searching</span>
                                                            </div>
                                                        ) : (
                                                            <ReactTable columns={columns} data={state.data.onbU} />
                                                        )
                                                    }
                                                </div>
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

            <ArtistDetails
                uuid={state.uuid}
                show={state.show.detailsPanel}
                showOrHide={showOrHideAccountDetailsPanel}
            />
        </React.Fragment>
    )
}