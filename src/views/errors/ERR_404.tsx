import React, { FC } from "react"
import { Helmet } from "react-helmet"
import { Link } from "react-router-dom"

import imageAsset from '../../assets/images/7070464_3275437.svg'
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

                        <div className="wrapper md:align-middle align-baseline w-full overflow-auto md:h-screen h-auto">
                            <section className="gx-container md:h-screen h-auto rounded-md w-full flex items-center justify-center" style={STYLE.MAX_WIDTH}>
                                <div className="flex flex-col align-middle items-center w-full md:pb-0 pb-10">
                                    <div className="md:w-3/5">
                                        <img className="m-auto px-4 pt-6 block text-center mb-5 w-full" src={imageAsset} alt="404_page_not_found" />
                                    </div>

                                    <div className="max-w-sm md:max-w-md lg:max-w-lg text-center px-4">
                                            <p className="text-red-500 md:text-2xl mb-3 text-lg">ERR_404: Page Not Found</p>
                                            <p className="text-stone-600 mb-5 text-sm">
                                                Look's like you're lost in the digital wilderness. Let us Guide you back
                                            </p>

                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <div className="text-sm m-auto ">
                                                        <Link to="/home" className="font-medium text-center text-orange-600 hover:text-orange-700">
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
                            </section>
                        </div>
                    </>
                )
            }
        </React.Fragment >
    )
}