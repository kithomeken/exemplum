import React from "react"
import { useDispatch } from "react-redux"

import { ERR_404 } from "../errors/ERR_404"
import { ERR_500 } from "../errors/ERR_500"
import { useAppSelector } from "../../store/hooks"
import { Loading } from "../../components/modules/Loading"
import mainAsset from "../../assets/images/illutsration_726837462.svg"
import { G_onInputBlurHandler } from "../../components/lib/InputHandlers"
import { APPLICATION, CONFIG_MAX_WIDTH, PREFLIGHT_ } from "../../global/ConstantsRegistry"

export const CNF_gD = () => {
    const [state, setstate] = React.useState({
        toastERR: '',
        posting: false,
        httpStatus: 200,
        status: 'fulfilled',
        data: {

        },
        team: [{
            email: '',
        }],
        teamErrors: [{
            email: '',
        }]
    })

    const dispatch: any = useDispatch();
    const auth0: any = useAppSelector(state => state.auth0)
    const idC_State: any = useAppSelector(state => state.idC)

    React.useEffect(() => {

    }, [])

    const onChangeHandler = (e: any, index: any) => {
        const { posting } = state

        if (!posting) {
            let { teamErrors } = state
            let { team }: any = state

            const artistDetailsCollection = state.team.map((artist, mapIndex) => {
                if (index !== mapIndex) return artist

                teamErrors[index][e.target.name] = ''
                return { ...artist, [e.target.name]: e.target.value }
            })

            team = artistDetailsCollection

            setstate({
                ...state, team, teamErrors
            })
        }
    }

    const onInputBlur = (e: any, index: any) => {
        let { posting } = state

        if (!posting) {
            let output: any = G_onInputBlurHandler(e, posting, '', 3)
            let { team } = state
            let { teamErrors } = state

            team[index][e.target.name] = output.value
            teamErrors[index][e.target.name] = output.error.replace('_', ' ')

            setstate({
                ...state, team, teamErrors
            })
        }
    }

    const addTeamMateHandler = () => {
        let { data } = state
        let { team } = state
        let { teamErrors } = state
        const { posting } = state

        if (!posting) {
            team = state.team.concat([{
                email: '',
            }])

            teamErrors = state.teamErrors.concat([{
                email: '',
            }])

            setstate({
                ...state, team, teamErrors, toastERR: ''
            })
        }
    }

    const removeTeamMateHandler = (index: any) => {
        setstate({
            ...state,
            team: state.team.filter((s, varIdx) => index !== varIdx),
            teamErrors: state.teamErrors.filter((s, varIdx) => index !== varIdx),
        })
    }

    const goToCoreHome = () => {
        dispatch({
            type: PREFLIGHT_.PROCESSING,
            response: 'PFg0',
        });

        dispatch({
            type: PREFLIGHT_.PFg0_FIN,
            response: 'PFg0',
        });
    }

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
                                                                Pre-flight Check #5:
                                                            </span>

                                                            The final step, invite your team to join you as administrators
                                                        </span>
                                                    </span>
                                                </div>

                                                <div className="mb-3 pt-3 md:px-3 px-0 block w-full">
                                                    <button type="button" onClick={goToCoreHome} className="bg-orange-600 float-right relative w-28 py-1.5 px-4 border border-transparent text-sm rounded-md text-white hover:bg-orange-700 focus:outline-none focus:ring-0 focus:ring-offset-2 focus:bg-orange-700">
                                                        {
                                                            idC_State.processing ? (
                                                                <i className="fad fa-spinner-third fa-xl fa-spin py-2.5"></i>
                                                            ) : (
                                                                <div className="flex justify-center align-middle items-center gap-x-3">
                                                                    Finish
                                                                </div>
                                                            )
                                                        }
                                                    </button>
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