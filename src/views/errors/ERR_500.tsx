import React from "react"
import smallAsset from '../../assets/images/ay32873n0f9204n79-3982.png'

export const ERR_500 = () => {
    return (
        <React.Fragment>
            <div className="px-4 pt-6 pb-4 w-full">
                <div className="flex flex-col pt-4 items-center align-middle justify-center">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center mb-3 m-auto sm:mx-0">
                        <img src={smallAsset} alt="broken_robot" width="auto" className="block text-center m-auto w-64" />
                    </div>

                    <div className="mt-3 text-center m-auto text-slate-600">
                        <span className="text-red-600 mb-2 block">
                            ERR_500: Internal Server Error
                        </span>

                        <div className="text-sm">
                            Oops! Something went wrong, please try again later.
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}