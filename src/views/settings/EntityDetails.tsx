import React, { useState } from "react"

import { ERR_404 } from "../errors/ERR_404"
import { ERR_500 } from "../errors/ERR_500"
import { EntityMembers } from "./EntityMembers"
import { ACCOUNT } from "../../api/API_Registry"
import HttpServices from "../../services/HttpServices"
import { Loading } from "../../components/modules/Loading"

export const EntityDetails = () => {
    const [state, setstate] = useState({
        posting: false,
        httpStatus: 200,
        status: 'pending',
        data: null,
    })

    React.useEffect(() => {
        fetchEntityDetails()
    }, [])

    const fetchEntityDetails = async () => {
        let { httpStatus } = state
        let { posting } = state
        let { status } = state
        let { data } = state

        try {
            const response: any = await HttpServices.httpGet(ACCOUNT.GET_NOMINATED)
            httpStatus = response.status

            if (response.data.success) {
                status = 'fulfilled'
                data = response.data.payload
            } else {
                status = 'rejected'
            }
        } catch (error) {
            httpStatus = 500
            status = 'rejected'
        }

        posting = false

        setstate({
            ...state, status, data, posting, httpStatus
        })
    }

    return (
        <React.Fragment>
            {
                state.status === 'rejected' ? (
                    state.httpStatus === 404 ? (
                        <ERR_404
                            compact={true}
                        />
                    ) : (
                        <ERR_500 />
                    )
                ) : state.status === 'fulfilled' ? (
                    <>
                        {
                            state.data.enTT.max === 1 ? (
                                <>
                                    <div className="w-full md:gap-x-4 gap-y-4 grid md:grid-cols-3 pt-4 pb-6 md:px-4">
                                        <div className="col-span-1">
                                            <span className="text-lg text-stone-600 md:text-base">
                                                Artist Details:
                                            </span>
                                        </div>

                                        <div className="col-span-2 flex md:flex-row md:gap-x-2 gap-y-3 md:align-middle md:items-center md:py-0">
                                            <div className="flex-none flex flex-col gap-y-4 pb-3">
                                                <p className="text-xl leading-7 text-stone-500 py-1">
                                                    {state.data.enTT.name}
                                                </p>

                                                <div className="text-teal-700 text-xs">
                                                    <span className="bg-teal-200  py-1 px-1.5 rounded">
                                                        <span className="hidden md:inline-block">{state.data.enTT.description}</span>
                                                        <span className="md:hidden">{state.data.enTT.description}</span>
                                                    </span>
                                                </div>

                                                <span className="block text-sm text-stone-600">
                                                    Account: <span className="text-orange-600">{state.data.enTT.account}</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="w-full md:gap-x-4 gap-y-4 grid md:grid-cols-3 pt-4 border-b md:px-4">
                                        <div className="col-span-1">
                                            <span className="text-lg text-stone-600 md:text-base">
                                                Entity Details:
                                            </span>
                                        </div>

                                        <div className="col-span-2 flex md:flex-row md:gap-x-2 gap-y-3 md:align-middle md:items-center md:py-0">
                                            <div className="flex-none flex flex-col gap-y-4 pb-3 w-full">
                                                <p className="text-xl leading-7 text-stone-700 py-1">
                                                    {state.data.enTT.name}
                                                </p>

                                                <div className="text-teal-700 text-xs">
                                                    <span className="bg-teal-200  py-1 px-1.5 rounded">
                                                        <span className="hidden md:inline-block">{state.data.enTT.description}</span>
                                                        <span className="md:hidden">{state.data.enTT.description}</span>
                                                    </span>
                                                </div>

                                                <span className="block text-sm text-stone-600">
                                                    Account: <span className="text-orange-600">{state.data.enTT.account}</span>
                                                </span>

                                                <div className="w-full mt-2 border-t-2 border-dashed pt-4">
                                                    <p className="text-base leading-7 text-stone-500">
                                                        Onboarded Members
                                                    </p>

                                                    <EntityMembers />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )
                        }
                    </>
                ) : (
                    <div className="w-full md:gap-x-4 gap-y-4 grid md:grid-cols-3 pt-4 pb-6 md:px-4">
                        <div className="col-span-3">
                            <Loading />
                        </div>
                    </div>
                )
            }
        </React.Fragment>
    )
}