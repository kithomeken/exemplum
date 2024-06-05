import React, { FC } from "react"

import emptyBox from "../../assets/images/parachute.png"
import { Generic_Error_Interface } from "../../lib/modules/Interfaces"
import { APPLICATION } from "../../global/ConstantsRegistry"

export const GenericError: FC<Generic_Error_Interface> = ({ description, title = "Oops! Something went wrong" }) => {
    return (
        <React.Fragment>
            <div className="w-full h-screen flex flex-col justify-center align-middle items-center">
                <div className="mx-auto my-3 px-4 flex- flex-col w-full">
                    <img src={emptyBox} alt="broken_robot" width="auto" className="block text-center m-auto w-52" />

                    <div className="mt-3 text-center m-auto text-slate-600 py-4 md:w-1/3">
                        <span className="text-orange-600 my-4 block text-xl">
                            {title}
                        </span>

                        <div className="text-sm mb-2">
                            {description}
                        </div>

                        <span className="text-sm text-stone-500 block py-3">
                            In case of any issue, reach out to our support team at <span className="text-orange-600">support@email.com</span>
                        </span>

                        <div className="mx-auto md:py-4 py-6 text-center block w-full border-t mt-3">
                            <p className="text-sm text-stone-500 pb-4">
                                <span className="text-orange-600">{APPLICATION.NAME}</span> © {new Date().getFullYear()}. 
                                Elevated Acts of Appreciation, <span className="text-orange-600 block">Tip by Tip.</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}