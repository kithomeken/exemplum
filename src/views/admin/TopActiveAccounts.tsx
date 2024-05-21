import React, { useState } from "react"

import { ERR_404 } from "../errors/ERR_404"
import { ERR_500 } from "../errors/ERR_500"
import HttpServices from "../../services/HttpServices"
import { ADMINISTRATION } from "../../api/API_Registry"
import { Loading } from "../../components/modules/Loading"
import { formatAmount } from "../../lib/modules/HelperFunctions"

export const TopActiveAccounts = () => {
    const [state, setstate] = useState({
        uuid: null,
        httpStatus: 200,
        status: 'pending',
        data: {
            accounts: null,
        },
        show: {
            payoutPanel: false,
        },
    })

    React.useEffect(() => {
        fetchTopActiveAccounts()
    }, [])

    const fetchTopActiveAccounts = async () => {
        let { data } = state
        let { status } = state
        let { httpStatus } = state

        try {
            const response: any = await HttpServices.httpGet(ADMINISTRATION.TOP_ACTIVE_ENT)
            httpStatus = response.status

            if (response.data.success) {
                data.accounts = response.data.payload.aCtv

                Object.keys(data.accounts).forEach(function (key) {
                    data.accounts[key].total_amount = formatAmount(parseFloat(data.accounts[key].total_amount))
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

    return (
        <React.Fragment>
            {
                state.status === 'rejected' ? (
                    <div className="w-full flex-grow">
                        <div className={`w-full pb-3 mx-auto bg-white rounded h-full`}>
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
                    <div className="py-2 px-2 w-full">
                        <h3 className="flex items-center tracking-wide mb-2 text-lg text-amber-600 dark:text-white">
                            Top active accounts last 30 days
                        </h3>

                        <div className="px-3" id="about" role="tabpanel" aria-labelledby="about-tab">
                            <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
                                {
                                    state.data.accounts.map((account: any) => {
                                        return (
                                            <li className="py-3 sm:py-4">
                                                <div className="flex items-center space-x-4">
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-gray-900 truncate dark:text-white">
                                                            {account.name}
                                                        </p>
                                                        <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                                            {account.account}
                                                        </p>
                                                    </div>
                                                    <div className="inline-flex items-center text-base font-semibold tracking-wider text-gray-900 dark:text-white">
                                                        <span className="flex flex-row align-middle items-center text-sm dark:text-white">
                                                            <span className="pr-2 text-sm">KES</span>
                                                            <span className="text-stone-900">{account.total_amount.split('.')[0]}</span>
                                                            <span className="text-stone-400">.{account.total_amount.split('.')[1]}</span>
                                                        </span>
                                                    </div>
                                                </div>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
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