import React, { FC } from "react"
import { Helmet } from "react-helmet"
import { Link } from "react-router-dom"

import imageAsset from '../../assets/images/7070464_3275437.svg'
import smallAsset from '../../assets/images/7117865_3371469.svg'
import { HTTP_Error_Interface } from "../../lib/modules/Interfaces"

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

                        <div className="bg-white items-center flex flex-col justify-content-center p-6">
                            <section className="page_404 m-auto">
                                <div className="container">
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <img className="m-auto px-4 pt-6 block text-center mb-5 max-w-sm" src={imageAsset} alt="404_page_not_found" />
                                        </div>

                                        <div className="col-sm-12 sm:max-w-sm md:max-w-md lg:max-w-lg text-center">
                                            <div className="col-sm-10 col-sm-offset-1 text-center">
                                                <p className="text-red-500 text-2xl mb-3">ERR_404: Page Not Found</p>
                                                <p className="text-stone-600 mb-5 text-sm">
                                                    Look's like you're lost in the digital wilderness. Let us Guide you back
                                                </p>

                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <div className="text-sm m-auto ">
                                                            <Link to="/home" className="font-medium text-center text-amber-600 hover:text-amber-700">
                                                                <span className="flex items-center justify-between">
                                                                    <span>
                                                                        Back to safety
                                                                    </span>
                                                                </span>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </>
                )
            }
        </React.Fragment >
    )
}