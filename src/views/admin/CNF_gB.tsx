import React from "react"

import mainAsset from "../../assets/images/illustration_8351740.svg"
import { CONFIG_MAX_WIDTH } from "../../global/ConstantsRegistry"

export const CNF_gB = () => {
    const [state, setstate] = React.useState({
        status: 'pending',
    })

    return (
        <React.Fragment>
            <div className="wrapper md:align-middle align-baseline w-full overflow-auto md:h-screen h-auto">
                <section className="gx-container md:h-screen rounded-md w-full flex md:items-center justify-center" style={CONFIG_MAX_WIDTH}>
                    <div className="flex md:flex-row flex-col align-middle md:items-center w-full md:pb-0 pb-10">
                        <div className="md:basis-3/5 md:px-6 px-8 w-full py-6 overflow-auto">




                        </div>

                        <div className="md:basis-2/5 hidden md:block h-screen px-4 py-6">
                            <img className="h-full rounded-2xl" src={mainAsset} alt={"data_points"} loading="lazy" />
                        </div>
                    </div>
                </section>
            </div >
        </React.Fragment >
    )
}