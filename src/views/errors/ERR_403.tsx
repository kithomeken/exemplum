import React, { FC } from "react"
import { Helmet } from "react-helmet"

import imageAsset from '../../assets/images/Hidden-rafiki.svg'
import { HTTP_Error_Interface } from "../../lib/modules/Interfaces"
import { getRandomObjectFromArray } from "../../lib/modules/HelperFunctions"

export const ERR_403: FC<HTTP_Error_Interface> = ({ compact = false }) => {
    const errorMessages = [
        "You've reached the digital equivalent of a VIP area, but without the golden ticket. No worries, we're working on expanding your access pass.",
        "Uh-oh! It seems you've stumbled into a restricted zone. Our bouncers are serious about this, but we're working on giving you an all-access pass. Stay tuned!",
        "This area is like a members-only club, and you're not on the list. Keep exploring the public areas while we sort out your VIP invitation.",
    ]

    return (
        <React.Fragment>
            {
                compact ? (
                    <>
                        <div className="bg-white px-4 pt-6 pb-4">
                            <div className="flex flex-col pt-4 items-center">
                                <div className="mx-auto flex-shrink-0 flex items-center justify-center mb-3 sm:mx-0 w-48">
                                    <img src={imageAsset} alt="403_access_denied" width="auto" className="block text-center m-auto" />
                                </div>

                                <div className="mt-3 text-center m-auto text-slate-600">
                                    <span className="text-red-600 mb-2 block">
                                        ERR_403: Access Denied
                                    </span>

                                    <div className="text-sm">
                                        {getRandomObjectFromArray(errorMessages)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <Helmet>
                            <title>Access Denied</title>
                        </Helmet>

                        <div className="items-center flex flex-col justify-content-center p-6">
                            <section className="page_403 m-auto">
                                <div className="container">
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <img className="m-auto px-4 pt-6 block text-center mb-5 max-w-sm" src={imageAsset} alt="403_access_denied" />
                                        </div>

                                        <div className="col-sm-12 sm:max-w-sm md:max-w-md lg:max-w-lg text-center">
                                            <div className="col-sm-10 col-sm-offset-1 text-center">
                                                <p className="text-red-500 text-2xl mb-3">ERR_403: Access Denied</p>
                                                <p className="text-slate-600 py-5 text-sm">
                                                    {getRandomObjectFromArray(errorMessages)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </>
                )
            }
        </React.Fragment>
    )
}