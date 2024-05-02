import React, { FC } from "react"

import emptyBox from "../../assets/images/parachute.png"
import { Generic_Error_Interface } from "../../lib/modules/Interfaces"

export const GenericError: FC<Generic_Error_Interface> = ({ description, title = "Oops! Something went wrong" }) => {
    return (
        <React.Fragment>
            <div className="w-full h-screen flex flex-col justify-center align-middle items-center">
                <div className="mx-auto my-3 px-4">
                    <img src={emptyBox} alt="broken_robot" width="auto" className="block text-center m-auto w-52" />

                    <div className="mt-3 text-center m-auto text-slate-600 py-4 md:w-96">
                        <span className="text-amber-600 my-4 block">
                            {title}
                        </span>

                        <div className="text-sm">
                            {description}
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}