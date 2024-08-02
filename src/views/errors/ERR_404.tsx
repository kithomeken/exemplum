import React, { FC } from "react"
import { Helmet } from "react-helmet"
import { Link } from "react-router-dom"

import imageAsset from '../../assets/images/illustration_4326530.svg'
import smallAsset from '../../assets/images/7117865_3371469.svg'
import { HTTP_Error_Interface } from "../../lib/modules/Interfaces"
import { STYLE } from "../../global/ConstantsRegistry"

export const ERR_404: FC<HTTP_Error_Interface> = ({ compact = false }) => {

    return (
        <React.Fragment>
            {
                compact ? (
                    <div className="bg-white px-4 pt-6 pb-4">
                        <div className="flex flex-col pt-4 items-center">
                            <div className="mx-auto flex-shrink-0 flex items-center justify-center mb-3 sm:mx-0 w-48">
                                <img src={smallAsset} alt="broken_robot" width="auto" className="block text-center m-auto" />
                            </div>

                            <div className="mt-3 text-center m-auto text-stone-600">
                                <span className="text-red-600 mb-2 block">
                                    ERR_404: Resource Not Found
                                </span>

                                <div className="text-sm">
                                    The resource either does not exists or it was moved to a new location
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <Helmet>
                            <title>Page Not Found</title>
                        </Helmet >

                        <div className="flex flex-col items-center justify-center min-h-screen md:p-6">
                            <div className="max-w-md w-full text-start p-6 bg-inherit">
                                <img src={imageAsset} alt="error_500" className="mx-auto mb-6 w-full h-auto max-w-xs" />

                                <h1 className="text-sm sm:text-lg font-medium text-red-600 mb-2">
                                    ERR_404: <br />Page Not Found
                                </h1>
                                <h2 className="text-base sm:text-2xl font-medium mb-2">Whoopsy Daisy!</h2>
                                <p className="text-gray-600 mb-6">
                                    Look's like you're lost in the digital wilderness. Let us guide you back to someplace more familiar
                                </p>

                                <div className="flex text-sm flex-row-reverse items-center justify-between">
                                    <Link to="/home" className="text- text-orange-600 hover:text-orange-700">
                                        <span className="flex items-center justify-between">
                                            <span>
                                                Back to safety
                                            </span>
                                        </span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </>
                )
            }
        </React.Fragment >
    )
}