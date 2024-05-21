import { Helmet } from "react-helmet"
import React, { useState } from "react"

import { ERR_404 } from "../errors/ERR_404"
import { ERR_500 } from "../errors/ERR_500"
import HttpServices from "../../services/HttpServices"
import { ADMINISTRATION } from "../../api/API_Registry"
import { TopActiveAccounts } from "./TopActiveAccounts";
import { Loading } from "../../components/modules/Loading"
import { DisbursedFundsMetrics } from "./DisbursedFundsMetrics";

export const AdminstrativeHome = () => {
    const [state, setstate] = useState({
        uuid: null,
        httpStatus: 200,
        status: 'pending',
        data: {
            pyC: null,
            OnBc: null,
        },
    })

    React.useEffect(() => {
        fetchDashboardMetrics()
    }, [])

    const fetchDashboardMetrics = async () => {
        let { data } = state
        let { status } = state
        let { httpStatus } = state

        try {
            const metricsResp: any = await HttpServices.httpGet(ADMINISTRATION.OTHER_STATISCAL)
            httpStatus = metricsResp.status

            if (metricsResp.data.success) {
                data = metricsResp.data.payload
                status = 'fulfilled'
            } else {
                status = 'rejected'
            }

            console.log('INipNp3dn', data);

        } catch (error) {
            console.log(error);

            httpStatus = 500
            status = 'rejected'
        }

        setstate({
            ...state, status, data, httpStatus
        })
    }

    return (
        <React.Fragment>
            <Helmet>
                <title>Home</title>
            </Helmet>

            <div className="w-full">
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
                        <div className="w-full flex-grow pb-4 mb-4">
                            <div className="grid w-full grid-cols-1 gap-y-4 xl:gap-x-4 xl:grid-cols-3 2xl:grid-cols-3 px-2">
                                <div className="items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:flex dark:border-gray-700 sm:p-6 dark:bg-gray-800">
                                    <div className="w-full flex flex-col md:flex-row align-middle items-center gap-y-3 md:gap-x-3">
                                        <i className="fa-duotone fa-user-tie-hair fa-2x md:w-10 text-purple-600"></i>

                                        <div className="flex-grow">
                                            {
                                                state.data.OnBc.P === 0 ? (
                                                    <>
                                                        <h3 className="text-base font-normal text-gray-500 dark:text-gray-400">Recently onboarded users</h3>
                                                        <span className="text-2xl font-bold leading-none text-gray-900 sm:text-3xl dark:text-white">
                                                            {state.data.OnBc.R}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <h3 className="text-base font-normal text-gray-500 dark:text-gray-400">Pending Onboarding Requests</h3>
                                                        <span className="text-2xl font-bold leading-none text-gray-900 sm:text-3xl dark:text-white">
                                                            {state.data.OnBc.P}
                                                        </span>
                                                    </>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>

                                <div className="items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:flex dark:border-gray-700 sm:p-6 dark:bg-gray-800">
                                    <div className="w-full flex flex-col md:flex-row align-middle items-center gap-y-3 md:gap-x-3">
                                        <i className="fa-duotone fa-hourglass-half fa-2x md:w-10 text-blue-600"></i>

                                        <div className="flex-grow">
                                            {
                                                state.data.pyC.P === 0 ? (
                                                    <>
                                                        <h3 className="text-base font-normal text-gray-500 dark:text-gray-400">Recent payment requests</h3>
                                                        <span className="text-2xl font-bold leading-none text-gray-900 sm:text-3xl dark:text-white">
                                                            {state.data.pyC.R}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <h3 className="text-base font-normal text-gray-500 dark:text-gray-400">Pending User Requests</h3>
                                                        <span className="text-2xl font-bold leading-none text-gray-900 sm:text-3xl dark:text-white">
                                                            {state.data.pyC.P}
                                                        </span>
                                                    </>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>

                                <div className="items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:flex dark:border-gray-700 sm:p-6 dark:bg-gray-800">
                                    <div className="w-full">
                                        <h3 className="text-base font-normal text-gray-500 dark:text-gray-400">Total Money Out</h3>
                                        <span className="text-2xl font-bold leading-none text-gray-900 sm:text-3xl dark:text-white">2,340</span>
                                        <p className="flex items-center text-base font-normal text-gray-500 dark:text-gray-400">
                                            <span className="flex items-center mr-1.5 text-sm text-green-500 dark:text-green-400">

                                                12.5%
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid-cols-1 grid mt-4 gap-y-4 xl:gap-x-4 xl:grid-cols-3 2xl:grid-cols-3 w-full md:flex-row px-2 pb-2">
                                <div className="col-span-2 p-3 bg-white border rounded-md">
                                    <DisbursedFundsMetrics />
                                </div>

                                <div className="col-span-1 p-3 bg-white border rounded-md">
                                    <TopActiveAccounts />
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
            </div>
        </React.Fragment>
    )
}