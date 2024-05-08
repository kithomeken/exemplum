import React from "react"

export const Loading = () => {

    return(
        <React.Fragment>
            <div className="flex flex-col align-middle h-16">
                <span className="fa-duotone text-orange-500 fa-spinner fa-2x m-auto block fa-spin"></span>
            </div>
        </React.Fragment>
    )
}