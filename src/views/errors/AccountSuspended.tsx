import { Helmet } from "react-helmet"
import { useDispatch } from "react-redux"
import { Navigate } from "react-router-dom"
import React, { useEffect, useState } from "react"

import { ERR_404 } from "./ERR_404"
import { ERR_500 } from "./ERR_500"
import { ACCOUNT } from "../../api/API_Registry"
import { commonRoutes } from "../../routes/routes"
import { AUTH_ } from "../../global/ConstantsRegistry"
import HttpServices from "../../services/HttpServices"
import { Loading } from "../../components/modules/Loading"
import imageAsset from '../../assets/images/Hidden-rafiki.svg'

export const AccountSuspended = () => {
    const [state, setstate] = useState({
        data: {
            identity: null
        },
        httpStatus: 200,
        status: 'pending',
    })

    const dispatch: any = useDispatch()
    const homeRoute: any = (
        commonRoutes.find(
            (routeName) => routeName.name === 'HOME_')
    )?.path

    useEffect(() => {
        getCurrentAccountStatus()
    }, [])

    const getCurrentAccountStatus = async () => {
        let { data } = state
        let { status } = state
        let { httpStatus } = state

        try {
            try {
                const statusResponse: any = await HttpServices.httpGet(ACCOUNT.PROFILE)
                httpStatus = statusResponse.status

                if (statusResponse.data.success) {
                    data.identity = statusResponse.data.payload.identity
                    status = 'fulfilled'

                    dispatch({
                        type: AUTH_.SANCTUM_TOKEN,
                        response: statusResponse.data,
                    });
                } else {
                    status = 'rejected'
                }
            } catch (error) {
                console.error(error);

                status = 'rejected'
                httpStatus = 500
            }
        } catch (error) {
            status = 'rejected'
            httpStatus = 500
        }

        setstate({
            ...state, status, httpStatus
        })
    }

    return (
        <React.Fragment>
            <Helmet>
                <title>Account Suspended</title>
            </Helmet>

            {
                state.status === 'rejected' ? (
                    <div className="w-full flex-grow">
                        <div className={`w-full pb-3 mx-auto h-full`}>
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
                    <>
                        {
                            state.data.identity.active === 'Y' ? (
                                /* 
                                 * Account has been reinstated,
                                 * Redirect to home page
                                */
                                <Navigate to={homeRoute} replace />
                            ) : (
                                <div className="items-center flex flex-col justify-content-center p-6 w-full">
                                    <section className="page_403 m-auto">
                                        <div className="container">
                                            <div className="row">
                                                <div className="col-sm-12">
                                                    <img className="m-auto px-4 pt-6 block text-center mb-5 max-w-sm" src={imageAsset} alt="403_access_denied" />
                                                </div>

                                                <div className="col-sm-12 sm:max-w-sm md:max-w-md lg:max-w-lg text-center">
                                                    <div className="col-sm-10 col-sm-offset-1 text-center">
                                                        <p className="text-slate-600 py-5 text-sm">
                                                            Your account has been Suspended. Reach out to your admin for assistance.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            )
                        }
                    </>
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