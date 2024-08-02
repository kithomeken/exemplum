import React from "react"
import smallAsset from '../../assets/images/ay32873n0f9204n79-3982.png'
import errorAsset from '../../assets/images/illustration_7962160.svg'

export const ERR_500 = () => {
    return (
        <React.Fragment>
            <div className="flex flex-col items-center justify-center min-h-screen md:p-6">
                <div className="max-w-md w-full text-start p-6 bg-inherit">
                    <img src={errorAsset} alt="error_500" className="mx-auto mb-6 w-full h-auto max-w-xs" />

                    <h1 className="text-sm sm:text-lg font-medium text-red-600 mb-2">
                        ERR_500: <br />Internal Server Error
                    </h1>
                    <h2 className="text-base sm:text-2xl font-medium mb-2">Oops, that's our bad.</h2>
                    <p className="text-gray-600 mb-6">
                        We're not exactly sure what happened, but our servers say something is wrong. Worry not though, we're looking into it.
                    </p>
                </div>
            </div>
        </React.Fragment>
    )
}