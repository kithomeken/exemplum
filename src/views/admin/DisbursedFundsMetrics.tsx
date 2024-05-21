import React, { useState } from "react"

import { ERR_404 } from "../errors/ERR_404"
import { ERR_500 } from "../errors/ERR_500"
import { LineChart } from "../charts/LineChart"
import HttpServices from "../../services/HttpServices"
import { ADMINISTRATION } from "../../api/API_Registry"
import { Loading } from "../../components/modules/Loading"
import { formatAmount } from "../../lib/modules/HelperFunctions"

export const DisbursedFundsMetrics = () => {
    const [state, setstate] = useState({
        uuid: null,
        httpStatus: 200,
        status: 'pending',
        total: {
            wk6Tot: '0',
            mn6Tot: '0',
        },
        data: {
            rev6Wk: null,
            rev6Mn: null,
            dsBF: null,
        },
    })

    React.useEffect(() => {
        fetchDashboardMetrics()
    }, [])

    const fetchDashboardMetrics = async () => {
        let { data } = state
        let { total } = state
        let { status } = state
        let { httpStatus } = state

        try {
            const metricsResp: any = await HttpServices.httpGet(ADMINISTRATION.DASH_METRICS)
            httpStatus = metricsResp.status

            if (metricsResp.data.success) {
                let wk6Obj = metricsResp.data.payload.rev6Wk
                let mn6Obj = metricsResp.data.payload.rev6Mn

                let wk6Tot = 0
                let wk6Data = Object.values(wk6Obj)
                let wk6Labels = Object.keys(wk6Obj)

                let mn6Tot = 0
                let mn6Data = Object.values(mn6Obj)
                let mn6Labels = Object.keys(mn6Obj)

                Object.keys(wk6Data).forEach(function (key) {
                    wk6Data[key] = parseFloat(wk6Data[key])
                    wk6Tot = wk6Data[key] + wk6Tot
                })

                Object.keys(mn6Data).forEach(function (key) {
                    mn6Data[key] = parseFloat(mn6Data[key])
                    mn6Tot = mn6Data[key] + mn6Tot
                })

                total.mn6Tot = formatAmount(parseFloat(mn6Tot.toString()))
                total.wk6Tot = formatAmount(parseFloat(wk6Tot.toString()))

                data.rev6Mn = {
                    data: mn6Data,
                    labels: mn6Labels,
                }

                data.rev6Wk = {
                    data: wk6Data,
                    labels: wk6Labels,
                }

                status = 'fulfilled'
            } else {
                status = 'rejected'
            }
        } catch (error) {
            console.log(error);

            httpStatus = 500
            status = 'rejected'
        }

        setstate({
            ...state, status, data, httpStatus, total
        })
    }

    return (
        <React.Fragment>
            {
                state.status === 'rejected' ? (
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
                ) : state.status === 'fulfilled' ? (
                    <div className="py-2 px-2 w-full">
                        <span className="flex flex-row align-middle items-center text-xl sm:text-2xl dark:text-white">
                            <span className="pr-2 text-sm">KES</span>
                            <span className="text-amber-700">{state.total.wk6Tot.split('.')[0]}</span>
                            <span className="text-amber-500">.{state.total.wk6Tot.split('.')[1]}</span>
                        </span>

                        <h3 className="text-sm font-light text-gray-500 dark:text-gray-400">Commissioned earned the last 6 weeks</h3>

                        <LineChart
                            dataset={
                                [
                                    {
                                        label: 'Revenue Last 6 Weeks              ',
                                        data: state.data.rev6Wk.data,
                                        borderColor: '#0369a1',
                                        borderWidth: 6,
                                        tension: 0.4,
                                        pointBackgroundColor: '#0c4a6e',
                                        pointBorderColor: '#FFF',
                                        pointBorderWidth: 3,
                                    },
                                    {
                                        label: 'Money Out Last 6 Weeks',
                                        data: state.data.rev6Mn.data,
                                        borderColor: '#65a30d',
                                        borderWidth: 6,
                                        tension: 0.4,
                                        pointBackgroundColor: '#15803d',
                                        pointBorderColor: '#FFF',
                                        pointBorderWidth: 3,
                                    },
                                ]
                            }
                            labels={state.data.rev6Wk.labels}
                            title={"Revenue Last 6 Weeks"}
                        />
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