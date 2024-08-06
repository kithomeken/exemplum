import React, { useState } from "react"
import { toast } from "react-toastify"

import { ERR_404 } from "../errors/ERR_404"
import { ERR_500 } from "../errors/ERR_500"
import { useAppSelector } from "../../store/hooks"
import { ACCOUNT, AUTH } from "../../api/API_Registry"
import HttpServices from "../../services/HttpServices"
import { Loading } from "../../components/modules/Loading"
import { APPLICATION } from "../../global/ConstantsRegistry"
import { getColorForLetter, classNames } from "../../lib/modules/HelperFunctions"

export const EntityMembers = () => {
    const [state, setstate] = useState({
        data: null,
        posting: false,
        httpStatus: 200,
        status: 'pending',
        invitation: {
            email: ''
        },
    })

    React.useEffect(() => {
        fetchEntityMembers()
    }, [])

    const auth0: any = useAppSelector(state => state.auth0)

    const fetchEntityMembers = async () => {
        let { httpStatus } = state
        let { status } = state
        let { data } = state

        try {
            const response: any = await HttpServices.httpGet(ACCOUNT.ENTITY_DETAILS)
            httpStatus = response.status

            if (response.data.success) {
                status = 'fulfilled'
                data = response.data.payload

                const sortedUsers = response.data.payload.onB1.sort((a: any, b: any) => {
                    if (a.uid === auth0.identity.uid) return -1;
                    if (b.uid === auth0.identity.uid) return 1;
                    return 0;
                });

                data.onB1 = sortedUsers
            } else {
                status = 'rejected'
            }
        } catch (error) {
            status = 'rejected'
            httpStatus = 500
        }

        setstate({
            ...state, status, data, httpStatus
        })
    }

    const invitationHandler = (email: string) => {
        let { posting } = state
        let { invitation } = state

        if (!posting) {
            posting = true
            invitation.email = email

            setstate({
                ...state, posting, invitation
            })

            resendEmailInvitation()
        }
    }

    const resendEmailInvitation = async () => {
        let { posting } = state
        let { invitation } = state

        try {
            let formData = new FormData()
            formData.append("email", invitation.email)

            const invitationResponse: any = await HttpServices.httpPost(AUTH.ENT_RE_EXPANSION, formData)

            if (invitationResponse.data.success) {
                posting = false
                let toastText = "Your invite have been dispatched"

                toast.success(toastText, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } else {
                posting = false
                const errorMsg = invitationResponse.data.error.message

                toast.warning(errorMsg, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
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
        <React.Fragment>
            {
                state.status === 'rejected' ? (
                    state.httpStatus === 404 ? (
                        <ERR_404
                            compact={true}
                        />
                    ) : (
                        <ERR_500 />
                    )
                ) : state.status === 'fulfilled' ? (
                    <>
                        <div className="flex-none w-full py-4">
                            <ul role="list" className="divide-y divide-stone-100">
                                {
                                    state.data.onB1.map((person: any) => (
                                        <>
                                            <li key={person.acid} className="flex justify-between gap-x-6 py-2">
                                                <div className="flex min-w-0 gap-x-4 items-center align-middle">
                                                    {
                                                        person.photo_url ? (
                                                            <>
                                                                <img className="h-10 w-10 flex-none rounded-full bg-stone-50" src={person.photo_url} alt="" />
                                                            </>
                                                        ) : (
                                                            <>
                                                                {
                                                                    person.display_name.length > 1 ? (
                                                                        <div className={`w-10 h-10 flex items-center justify-center rounded-full ${getColorForLetter(person.display_name.charAt(0))}`}>
                                                                            <span className="text-white text-lg">
                                                                                {person.display_name.charAt(0)}
                                                                            </span>
                                                                        </div>
                                                                    ) : (
                                                                        <div className={`w-10 h-10 flex items-center justify-center rounded-full ${getColorForLetter('X')}`}>
                                                                            <span className="text-white text-lg">
                                                                                X
                                                                            </span>
                                                                        </div>
                                                                    )
                                                                }
                                                            </>
                                                        )
                                                    }

                                                    <div className="min-w-0 flex-auto">
                                                        <p className="leading-6 text-stone-900">{person.display_name}</p>
                                                        <p className="mt-1 truncate text-xs leading-5 text-stone-500">{person.email}</p>
                                                    </div>
                                                </div>

                                                <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                                                    {
                                                        person.status !== 'Y' ? (
                                                            <div className="mt-1 flex items-center gap-x-1.5">
                                                                <div className="flex-none rounded-full bg-red-500/20 p-1">
                                                                    <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                                                                </div>
                                                                <p className="text-xs leading-5 text-red-500">Disabled</p>
                                                            </div>
                                                        ) : null
                                                    }
                                                </div>
                                            </li>
                                        </>
                                    ))
                                }
                            </ul>
                        </div>

                        {
                            state.data.inV0.length > 0 ? (
                                <div className="flex-none w-full pt-4">
                                    <p className="text-lg leading-7 text-stone-500 py-1">
                                        Invited Members

                                        <span className="block text-sm text-stone-500 py-2">
                                            Invited members that have not yet onboarded.
                                        </span>
                                    </p>

                                    <ul role="list" className="divide-y divide-stone-100">
                                        {
                                            state.data.inV0.map((person: any) => (
                                                <li key={person.email} className="flex justify-between gap-x-6 py-5 items-center">
                                                    <div className="flex min-w-0 gap-x-4 align-middle items-center">
                                                        <div className={`w-10 h-10 flex items-center justify-center rounded-full ${getColorForLetter(person.email.charAt(0))}`}>
                                                            <span className="text-white text-lg">
                                                                {person.email.toUpperCase().charAt(0)}
                                                            </span>
                                                        </div>

                                                        <div className="min-w-0 flex-auto">
                                                            <p className="leading-6 text-stone-700 truncate text-sm">{person.email}</p>

                                                            <p className="mt-1 md:mt-0 truncate shrink-0 text-xs leading-5 flex items-center gap-x-1.5 text-blue-600 md:hidden">
                                                                <i className="fa-duotone fa-paper-plane"></i>
                                                                <p className="text-xs leading-5">Resend invitation</p>
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                                                        <button type="button" onClick={() => invitationHandler(person.email)} disabled={state.posting}
                                                            className={
                                                                classNames(
                                                                    state.posting && state.invitation[0].email === person.email ? "animate-pulse" : null,
                                                                    "mt-1 flex items-center gap-x-1.5 text-blue-600 cursor-pointer disabled:cursor-not-allowed"
                                                                )
                                                            }>
                                                            <i className="fa-duotone fa-paper-plane"></i>
                                                            <p className="text-xs leading-5">
                                                                {state.posting && state.invitation[0].email === person.email ? 'Sending invitation' : 'Resend invitation'}
                                                            </p>
                                                        </button>
                                                    </div>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </div>
                            ) : null
                        }
                    </>
                ) : (
                    <div className="w-full md:gap-x-4 gap-y-4 grid md:grid-cols-3 pt-4 pb-6 md:px-4">
                        <div className="col-span-3">
                            <Loading />
                        </div>
                    </div>
                )
            }
        </React.Fragment >
    )
}