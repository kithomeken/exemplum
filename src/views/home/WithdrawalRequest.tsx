import React, { useState } from "react"
import { Helmet } from "react-helmet"

import { ERR_404 } from "../errors/ERR_404"
import { Loading } from "../../components/modules/Loading"
import { CONFIG_MAX_WIDTH } from "../../global/ConstantsRegistry"

export const WithdrawalRequest = () => {
    const pageTitle = 'Withdrawal Request'
    const [state, setstate] = useState({
        status: 'pending',
        posting: false,
        data: {

        }
    })

    return (
        <React.Fragment>
            <Helmet>
                <title>{pageTitle}</title>
            </Helmet>

            <div className="mb-4 px-6 w-full pt-4">
                <div className={`w-full mb-3`}>
                    <div className="kiOAkj" style={CONFIG_MAX_WIDTH}>
                        {
                            state.status === 'rejected' ? (
                                <div className="w-full form-group px-12 mb-14">
                                    <div className="w-full">
                                        <div className="pt-10">
                                            <ERR_404
                                                compact={true}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : state.status === 'fulfilled' ? (
                                <div className="w-full text-sm">
                                    <div className="flex flex-col md:flex-row md:items-center">
                                        <div className="flex-grow">
                                            <p className="text-2xl leading-7 mb-4 flex-auto text-amber-600">
                                                
                                            </p>
                                        </div>

                                    </div>
                                </div>
                            ) : (
                                <div className="w-full form-group px-12 mb-14">
                                    <div className="w-full">
                                        <div className="pt-10">
                                            <Loading />
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </React.Fragment >
    )
}