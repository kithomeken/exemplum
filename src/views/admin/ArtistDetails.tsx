import { toast } from "react-toastify"
import PhoneInput from 'react-phone-number-input'
import { Fragment, FC, useEffect, useState } from "react"

import { ERR_404 } from "../errors/ERR_404"
import { ERR_500 } from "../errors/ERR_500"
import { DocumentDetails } from './DocumentDetails'
import HttpServices from "../../services/HttpServices"
import { ADMINISTRATION } from "../../api/API_Registry"
import { Loading } from "../../components/modules/Loading"
import { BespokePanel } from "../../lib/hooks/BespokePanel"
import { APPLICATION } from "../../global/ConstantsRegistry"
import { Basic_Modal_Props } from "../../lib/modules/Interfaces"
import { API_RouteReplace, getColorForLetter } from "../../lib/modules/HelperFunctions"

export const ArtistDetails: FC<Basic_Modal_Props> = ({ uuid, show, showOrHide }) => {
    const [state, setstate] = useState({
        posting: false,
        httpStatus: 200,
        status: 'pending',
        data: null,
    })

    useEffect(() => {
        if (show) {
            fetchArtistDetails()
        }
    }, [show])

    const emptyOnChangeHandler = () => { }

    const fetchArtistDetails = async () => {
        setstate({
            ...state, status: 'pending'
        })

        let { data } = state
        let { status } = state
        let { posting } = state
        let { httpStatus } = state

        try {
            let detailsRoute = null
            let accountResponse: any = null

            detailsRoute = API_RouteReplace(ADMINISTRATION.USER_DETAILS, ':uuid', uuid)
            accountResponse = await HttpServices.httpGet(detailsRoute)
            httpStatus = accountResponse.status

            if (accountResponse.data.success) {
                data = accountResponse.data.payload

                posting = false
                status = 'fulfilled'
            } else {
                posting = false
                status = 'rejected'
            }
        } catch (error) {
            status = 'rejected'
            httpStatus = 500
            posting = false
        }

        setstate({
            ...state, status, data, httpStatus, posting
        })
    }

    const suspendOrReinstateUserAccount = (action: string) => {
        let { posting } = state

        if (!posting) {
            setstate({
                ...state, posting: true
            })

            action === 'R' ?
                reinstateUserAccount() :
                suspendUserAccount()
        }
    }

    const suspendUserAccount = async () => {
        let { posting } = state

        try {
            let disablingRoute = null
            let statusResponse: any = null

            disablingRoute = API_RouteReplace(ADMINISTRATION.SUSPEND_USER, ':uuid', uuid)
            statusResponse = await HttpServices.httpPost(disablingRoute, null)

            if (statusResponse.data.success) {
                toast.success('Account has been suspendd', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

                fetchArtistDetails()
            } else {
                toast.error(APPLICATION.ERR_MSG, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }

            posting = false
        } catch (error) {
            posting = false

            toast.error(APPLICATION.ERR_MSG, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }

        setstate({
            ...state, posting
        })
    }

    const reinstateUserAccount = async () => {
        let { posting } = state

        try {
            let reinstatingRoute = null
            let statusResponse: any = null

            reinstatingRoute = API_RouteReplace(ADMINISTRATION.REINSTATE_USER, ':uuid', uuid)
            statusResponse = await HttpServices.httpPost(reinstatingRoute, null)

            if (statusResponse.data.success) {
                toast.success('Account has been reinstated', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

                fetchArtistDetails()
            } else {
                toast.error(APPLICATION.ERR_MSG, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }

            posting = false
        } catch (error) {
            posting = false

            toast.error(APPLICATION.ERR_MSG, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }

        setstate({
            ...state, posting
        })
    }

    return (
        <Fragment>
            <BespokePanel
                show={show}
                title={"User Details"}
                showOrHidePanel={showOrHide}
                components={
                    <>
                        {
                            state.status === 'rejected' ? (
                                <div className="w-full flex-grow">
                                    <div className={`w-full pb-3 mx-auto bg-white border rounded h-full`}>
                                        <div className="py-3 px-4 w-full">
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
                                        </div>
                                    </div>
                                </div>
                            ) : state.status === 'fulfilled' ? (
                                <div className="w-full text-sm flex flex-col pb-3 px-2">
                                    <div className="flex flex-row items-center w-auto mx-6 gap-x-4 rounded py-1 text-sm text-slate-500">
                                        {
                                            state.data.aC0.photo_url === null ? (
                                                <>
                                                    {
                                                        state.data.aC0.display_name && (
                                                            <div className={`w-16 h-16 flex items-center justify-center rounded-full ${getColorForLetter(state.data.aC0.display_name.charAt(0))}`}>
                                                                <span className="text-white text-2xl font-bold">
                                                                    {state.data.aC0.display_name.charAt(0)}
                                                                </span>
                                                            </div>
                                                        )
                                                    }
                                                </>
                                            ) : (
                                                <img className="rounded-full h-16 w-16" src={state.data.aC0.photo_url} alt={state.data.aC0.photo_url} />
                                            )
                                        }

                                        <div className="flex-grow pl-2">
                                            <span className="text-lg mr-4 block">{state.data.aC0.display_name}</span>
                                            <span className="text-sm mr-4 block">{state.data.aC0.email}</span>
                                        </div>
                                    </div>

                                    <div className="pt-4 flex-grow px-6 overflow-y-auto">
                                        <div className="flex-none flex gap-x-3 md:flex-row pt-2 pb-4 items-center text-slate-600">
                                            {
                                                state.data.aC0.status === 'Y' ? (
                                                    <span className="bg-green-200 text-slate-700 text-xs py-1 px-1.5 rounded">
                                                        <span className="hidden md:inline-block">Active Account</span>
                                                        <span className="md:hidden">Active</span>
                                                    </span>
                                                ) : (
                                                    <span className="bg-red-500 text-white text-xs py-1 px-1.5 rounded">
                                                        <span className="hidden md:inline-block">Disabled Account</span>
                                                        <span className="md:hidden">Disabled</span>
                                                    </span>
                                                )
                                            }

                                            <div className="flex-grow flex flex-row-reverse align-middle items-center gap-x-3">
                                                {
                                                    state.data.aC0.status === 'Y' ? (
                                                        state.posting ? (
                                                            <>
                                                                <span className="text-sm flex-none shadow-none py-1.5 bg-inherit text-red-500 sm:w-auto sm:text-sm">Suspending user access...
                                                                </span>
                                                                <span className="fa-duotone text-red-500 fa-spinner-third fa-xl block fa-spin"></span>
                                                            </>
                                                        ) : (
                                                            <span onClick={() => suspendOrReinstateUserAccount('D')} className="text-sm flex-none shadow-none py-1 bg-inherit text-red-600 hover:underline hover:cursor-pointer sm:w-auto sm:text-sm">
                                                                Suspend Account
                                                            </span>
                                                        )
                                                    ) : (
                                                        state.posting ? (
                                                            <>
                                                                <span className="text-sm flex-none shadow-none px-3 py-1.5 bg-inherit text-stone-500 sm:w-auto sm:text-sm">Reinstating user access...
                                                                </span>
                                                                <span className="fa-duotone text-stone-500 fa-spinner-third fa-xl block fa-spin"></span>
                                                            </>
                                                        ) : (
                                                            <span onClick={() => suspendOrReinstateUserAccount('R')} className="text-sm flex-none py-1 bg-inherit text-emerald-600 hover:underline hover:cursor-pointer sm:w-auto sm:text-sm">
                                                                Reinstate Account
                                                            </span>
                                                        )
                                                    )
                                                }
                                            </div>
                                        </div>

                                        <div className="w-full">
                                            <div className="flex flex-row w-full lg:w-12/12 mb-3">
                                                <div className="basis-2/5 text-stone-500">
                                                    <span className="py-1 block">
                                                        <span className="hidden md:inline-block">Phone Number:</span>
                                                        <span className="md:hidden">Phone:</span>
                                                    </span>
                                                </div>

                                                <div className="basis-3/5 text-stone-700">
                                                    <span className="block lowercase">
                                                        <PhoneInput
                                                            international
                                                            readOnly={true}
                                                            disabled={true}
                                                            defaultCountry="KE"
                                                            onChange={emptyOnChangeHandler}
                                                            value={state.data.aC0.msisdn}
                                                        />
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex flex-row w-full lg:w-12/12 mb-1">
                                                <div className="basis-2/5 text-stone-500">
                                                    <span className="py-1 block">
                                                        <span className="hidden md:inline-block">Account Type:</span>
                                                        <span className="md:hidden">Account Type:</span>
                                                    </span>
                                                </div>

                                                <div className="basis-3/5 text-stone-700">
                                                    <span className="py-1 mb-2 capitalize flex flex-row align-middle items-center gap-x-4">
                                                        {
                                                            state.data.aC0.provider === 'google.com' ? (
                                                                <>
                                                                    <span className="fa-brands fa-google text-stone-500 fa-lg"></span>
                                                                    <span>Google Account</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <span className="fa-light fa-key text-stone-500 fa-lg"></span>
                                                                    <span>Email & Password</span>
                                                                </>
                                                            )
                                                        }
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex flex-row w-full lg:w-12/12">
                                                <div className="basis-2/5 text-stone-500">
                                                    <span className="py-1 block">
                                                        <span className="hidden md:inline-block">Verification:</span>
                                                        <span className="md:hidden">Verification:</span>
                                                    </span>
                                                </div>

                                                <div className="basis-3/5 text-stone-700">
                                                    <span className="py-1 mb-2 capitalize flex flex-row align-middle items-center gap-x-4">
                                                        {
                                                            state.data.aC0.email_verified_at === null ? (
                                                                <>
                                                                    <span className="fa-duotone fa-badge-check text-green-600 fa-xl"></span>
                                                                    <span className="text-green-600">Verified</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <span className="fa-light fa-key text-stone-500 fa-lg"></span>
                                                                    <span>Email & Password</span>
                                                                </>
                                                            )
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 flex-grow px-6 overflow-y-auto">
                                        <p className="text-sm  text-amber-600 border-t pt-3">
                                            Artist Details
                                        </p>

                                        <div className="w-full">
                                            <div className="flex flex-row w-full lg:w-12/12 mb-2">
                                                <div className="basis-2/5 text-stone-500">
                                                    <span className="py-1 block">
                                                        <span className="hidden md:inline-block">Artist Name:</span>
                                                        <span className="md:hidden">Artist:</span>
                                                    </span>
                                                </div>

                                                <div className="basis-3/5 text-stone-700">
                                                    <span className="text-sm py-1 block capitalize">
                                                        {state.data.art.name}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="w-full">
                                            <div className="flex flex-row w-full lg:w-12/12 mb-2">
                                                <div className="basis-2/5 text-stone-500">
                                                    <span className="py-1 block">
                                                        <span className="hidden md:inline-block">Account:</span>
                                                        <span className="md:hidden">Account:</span>
                                                    </span>
                                                </div>

                                                <div className="basis-3/5 text-stone-700">
                                                    <span className="text-sm py-1 block capitalize">
                                                        {state.data.art.account}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="w-full">
                                            <div className="flex flex-row w-full lg:w-12/12 mb-2">
                                                <div className="basis-2/5 text-stone-500">
                                                    <span className="py-1 block">
                                                        <span className="hidden md:inline-block">Artist Type:</span>
                                                        <span className="md:hidden">Type:</span>
                                                    </span>
                                                </div>

                                                <div className="basis-3/5 text-stone-700">
                                                    <span className="text-sm py-1 block capitalize">
                                                        {state.data.enTT.type}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="w-full">
                                            <div className="flex flex-row w-full lg:w-12/12 mb-2">
                                                <div className="basis-2/5 text-stone-500">
                                                    <span className="py-1 block">
                                                        <span className="hidden md:inline-block">Entity:</span>
                                                        <span className="md:hidden">Entity:</span>
                                                    </span>
                                                </div>

                                                <div className="basis-3/5 text-stone-700">
                                                    <span className="text-sm py-1 block capitalize">
                                                        {state.data.enTT.name}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="py-4 flex-grow px-6 overflow-y-auto">
                                        <div className="text-sm mb-3 text-amber-600 border-t pt-3">
                                            <DocumentDetails
                                                docs={state.data.docs}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full h-full flex flex-col justify-center">
                                    <div className="flex-grow">
                                        <Loading />
                                    </div>
                                </div>
                            )
                        }
                    </>
                }
            />
        </Fragment>
    )
}