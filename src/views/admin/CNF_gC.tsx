import React from "react"

import { ERR_404 } from "../errors/ERR_404"
import { ERR_500 } from "../errors/ERR_500"
import { Loading } from "../../components/modules/Loading"
import mainAsset from "../../assets/images/illutsration_726837462.svg"
import { APPLICATION, CONFIG_MAX_WIDTH } from "../../global/ConstantsRegistry"

export const CNF_gC = () => {
    const [state, setstate] = React.useState({
        httpStatus: 200,
        status: 'pending'
    })

    return (
        <React.Fragment>
            {
                state.status === 'rejected' ? (
                    <div className="flex items-center justify-center">
                        {
                            state.httpStatus === 404 ? (
                                <ERR_404
                                    compact={true}
                                />
                            ) : (
                                <ERR_500 />
                            )
                        }
                    </div>
                ) : (
                    <div className="wrapper md:align-middle align-baseline w-full overflow-auto md:h-screen h-auto">
                        <section className={`gx-container md:h-screen rounded-md w-full flex ${state.status === 'pending' ? 'md:items-center' : null} justify-center`} style={CONFIG_MAX_WIDTH}>
                            <div className="flex md:flex-row flex-col align-middle md:items-center w-full md:pb-0 pb-10">
                                <div className="md:basis-3/5 md:px-6 px-6 w-full py-6 overflow-auto">
                                    {
                                        state.status === 'fulfilled' ? (
                                            <>
                                                <span className="text-2xl self-start text-orange-500 tracking-wider leading-7 block mb-3 md:pt-0 pt-4">{APPLICATION.NAME}</span>

                                                <div className="flex flex-row w-full align-middle justitfy-between items-center md:hidden">
                                                    <div className="w-48 pt-4 mx-auto pb-3">
                                                        <img src={mainAsset} alt={"hello_i'm_carol"} width="auto" className="block text-center m-auto" />
                                                    </div>
                                                </div>

                                                <div className="w-full text-sm text-stone-600 float-right mb-4">
                                                    <span className="text-base md:text-lg pt-4 text-stone-800 block">
                                                        <span className="w-full text-start text-base  md:gap-x-2 gap-y-1 align-middle">
                                                            <span className="text-orange-600 text-sm block">
                                                                Pre-flight Check #4:
                                                            </span>

                                                            The final step, invite your team to join you as administrators
                                                        </span>
                                                    </span>
                                                </div>
                                            </>
                                        ) : (
                                            <Loading />
                                        )
                                    }
                                </div>

                                <div className="md:basis-2/5 hidden md:block h-screen px-4 py-6">
                                    <img className="h-full rounded-2xl" src={mainAsset} alt={"data_points"} loading="lazy" />
                                </div>
                            </div>
                        </section>
                    </div >
                )
            }
        </React.Fragment>
    )
}