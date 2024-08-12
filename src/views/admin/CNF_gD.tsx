import React from "react"
import { useDispatch } from "react-redux"

import { ERR_404 } from "../errors/ERR_404"
import { ERR_500 } from "../errors/ERR_500"
import { useAppSelector } from "../../store/hooks"
import { Loading } from "../../components/modules/Loading"
import mainAsset from "../../assets/images/illutsration_5712674.svg"
import { G_onInputBlurHandler } from "../../components/lib/InputHandlers"
import { APPLICATION, CONFIG_MAX_WIDTH, PREFLIGHT_ } from "../../global/ConstantsRegistry"

export const CNF_gD = () => {
    const [state, setstate] = React.useState({
        toastERR: '',
        posting: false,
        httpStatus: 200,
        status: 'fulfilled',
        show: {
            expansion: false
        },
        data: {
            identity: {
                pax: 4
            }
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

    const teamExpansion = () => {
        if (!idC_State.processing) {
            let { show } = state
            show.expansion = !state.show.expansion

            setstate({
                ...state, show
            })
        }
    }

    const onFormSubmitHandler = (e: any) => {
        e.preventDefault()

        if (!idC_State.processing) {

        }
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
                                            <div className="flex flex-col gap-y-1-5 w-full">
                                                <span className="text-2xl self-start text-orange-500 tracking-wider leading-7 block mb-3 md:pt-0 pt-4">{APPLICATION.NAME}</span>

                                                <div className="flex flex-row w-full align-middle justitfy-between items-center md:hidden">
                                                    <div className="w-48 pt-4 mx-auto pb-3">
                                                        <img src={mainAsset} alt={"hello_i'm_carol"} width="auto" className="block text-center m-auto" />
                                                    </div>
                                                </div>

                                                <div className="w-full text-sm text-stone-600 float-right mb-4">
                                                    <span className="text-base md:text-lg pt-4 text-stone-600 block mb-2">
                                                        <span className="w-full text-start text-sm  md:gap-x-2 gap-y-1 align-middle">
                                                            <span className="text-orange-600 text-sm block">
                                                                Pre-flight Checks Complete.
                                                            </span>

                                                            All systems are green! We're ready for takeoff.
                                                        </span>
                                                    </span>

                                                    <p className="text-base md:text-lg py-4 text-stone-800 block">
                                                        Expand the team, by inviting your colleagues to join as admins.
                                                    </p>
                                                </div>

                                                {
                                                    state.show.expansion ? (
                                                        <>
                                                            {
                                                                state.team.length < (state.data.identity.pax) ? (
                                                                    <form className="w-full md:w-2/3 mx-0 block mb-3" onSubmit={onFormSubmitHandler}>
                                                                        {
                                                                            state.team.map((contact: any, index: any) => {
                                                                                return (
                                                                                    <div key={`KDE_${index}`} className="w-full py-3 flex flex-row align-middle items-center gap-x-3">
                                                                                        <div className="flex-grow">
                                                                                            <input type="email" name="email" id={`team-${index}-email`} autoComplete="off" onChange={(e) => onChangeHandler(e, index)} className="focus:ring-1 w-full py-1.5 px-2.5 lowercase flex-1 block text-sm rounded-md sm:text-sm border border-gray-300 disabled:opacity-50 focus:ring-orange-600 focus:outline-orange-500" onBlur={(e) => onInputBlur(e, index)} placeholder={`member${index + 1}@email.com`} value={contact.email} />

                                                                                            {
                                                                                                state.teamErrors[index].email.length > 0 &&
                                                                                                <span className='invalid-feedback text-sm text-red-600 pl-1 block pt-1'>
                                                                                                    {state.teamErrors[index].email}
                                                                                                </span>
                                                                                            }
                                                                                        </div>

                                                                                        {
                                                                                            index !== 0 ? (
                                                                                                <button type="button" className="text-red-500 hover:text-red-600 flex-none text-sm cursor-pointer" onClick={() => removeTeamMateHandler(index)}>
                                                                                                    <span className="hidden md:inline-block">Remove</span>
                                                                                                    <span className="md:hidden">
                                                                                                        <span className="fa-duotone sm:block hidden fa-trash-can fa-lg pr-2"></span>
                                                                                                    </span>
                                                                                                </button>
                                                                                            ) : (
                                                                                                null
                                                                                            )
                                                                                        }

                                                                                    </div>
                                                                                )
                                                                            })
                                                                        }

                                                                        <div className="w-6/12">
                                                                            <div className="mb-3" id="poc_extra"></div>

                                                                            {
                                                                                state.team.length < (state.data.identity.pax - 1) ? (
                                                                                    <button type="button" className="text-blue-500 text-sm cursor-pointer" onClick={addTeamMateHandler}>
                                                                                        Invite another member
                                                                                    </button>
                                                                                ) : (
                                                                                    null
                                                                                )
                                                                            }
                                                                        </div>

                                                                        {
                                                                            state.toastERR && (
                                                                                <div className="mt-4 bg-orange-00 px-2 md:py-2 border-l-2 bg-orange-50 border-orange-300 border-dashed rounded-sm mb-3">
                                                                                    <div className="flex flex-row align-middle items-center text-orange-700 px-2">
                                                                                        <i className="fa-duotone fa-hexagon-exclamation fa-xl mt-1 text-orange-700 flex-none"></i>

                                                                                        <div className="flex-auto ml-1 mt-1">
                                                                                            <span className="text-sm pl-3 block py-2 text-orange-700">
                                                                                                {state.toastERR}
                                                                                            </span>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            )
                                                                        }

                                                                        <div className="pb-3 px-0 w-full flex flex-row-reverse align-middle items-middle">
                                                                            <button className="bg-orange-600  min-w-28 py-1.5 px-4 border border-transparent text-sm rounded-md text-white hover:bg-orange-700 focus:outline-none focus:ring-0 focus:ring-offset-2 focus:bg-orange-700" type="submit">
                                                                                {
                                                                                    state.posting ? (
                                                                                        <i className="fad fa-spinner-third fa-xl fa-spin py-2.5"></i>
                                                                                    ) : (
                                                                                        <div className="flex justify-center align-middle items-center gap-x-3">
                                                                                            <i className="fa-solid fa-paper-plane fa-lg"></i>
                                                                                            Send Invite{state.team.length > 1 ? 's' : null}
                                                                                        </div>
                                                                                    )
                                                                                }
                                                                            </button>
                                                                        </div>
                                                                    </form>
                                                                ) : null
                                                            }
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="mb-3 px-0 w-full md:w-3/5 mx-auto flex md:flex-row flex-col align-middle items-center gap-y-3 md:gap-x-3">
                                                                <div className="flex-1 md:w-1/2">
                                                                    <button onClick={goToCoreHome} className="bg-orange-600 relative min-w-28 py-1.5 px-4 border border-transparent text-sm rounded-md text-white hover:bg-orange-700 focus:outline-none focus:ring-0 focus:ring-offset-2 focus:bg-orange-700" type="button">
                                                                        <div className="flex justify-center align-middle items-center gap-x-3">
                                                                            Invite Now
                                                                        </div>
                                                                    </button>
                                                                </div>

                                                                <div className="flex-1 md:w-1/2 md:mt-0 mt-3">
                                                                    <button onClick={goToCoreHome} className="bg-stone-200 relative min-w-28 py-1.5 px-4 border border-transparent text-sm rounded-md text-stone-700 hover:bg-stone-300 focus:outline-none hover:text-stone-800 focus:ring-0 focus:ring-offset-2 focus:bg-orange-700" type="submit" disabled={idC_State.processing ? true : false}>
                                                                        <div className="flex justify-center align-middle items-center gap-x-3">
                                                                            Maybe Later
                                                                        </div>
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            <p className="text-sm text-stone-500 md:mt-8 mt-4 text-center mb-3 pb-4">
                                                                You can always invite your colleagues later from the dashboard.
                                                            </p>
                                                        </>
                                                    )
                                                }

                                                <div className="mx-auto py-5 text-center block w-full border-t-2 border-gray-400 border-dashed">
                                                    <p className="text-sm text-stone-500">
                                                        © {new Date().getFullYear()}. Elevated Acts of Appreciation, <span className="text-orange-600 block">Tip by Tip.</span>
                                                    </p>
                                                </div>
                                            </div>
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