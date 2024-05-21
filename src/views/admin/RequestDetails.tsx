import React, { FC, useState } from "react"
import PhoneInput from 'react-phone-number-input'

import { ERR_404 } from "../errors/ERR_404"
import HttpServices from "../../services/HttpServices"
import { ADMINISTRATION } from "../../api/API_Registry"
import { Loading } from "../../components/modules/Loading"
import { BespokePanel } from "../../lib/hooks/BespokePanel"
import { Basic_Modal_Props } from "../../lib/modules/Interfaces"
import { G_onInputChangeHandler, G_onInputBlurHandler } from "../../components/lib/InputHandlers"
import { API_RouteReplace, classNames, humanReadableDate } from "../../lib/modules/HelperFunctions"

export const RequestDetails: FC<Basic_Modal_Props> = ({ uuid, show, showOrHide }) => {
    const [state, setstate] = useState({
        posting: false,
        status: 'pending',
        show: {
            rejection: false
        },
        data: {
            entity: null,
            artists: null,
            request: null,
            documents: null,
        },
        input: {
            comment: ''
        },
        errors: {
            comment: ''
        }
    })

    React.useEffect(() => {
        if (show) {
            fetchRequestDetails()
        }
    }, [show])

    const emptyOnChangeHandler = () => { }

    const fetchRequestDetails = async () => {
        setstate({
            ...state, status: 'pending'
        })

        let { data } = state
        let { status } = state
        let { posting } = state

        try {
            let requestDetailsRoute = null
            let requestResponse: any = null

            requestDetailsRoute = API_RouteReplace(ADMINISTRATION.REQUETS_DETAILS, ':uuid', uuid)
            requestResponse = await HttpServices.httpGet(requestDetailsRoute)

            if (requestResponse.data.success) {
                data.artists = requestResponse.data.payload.nodes
                data.request = requestResponse.data.payload.request
                data.entity = requestResponse.data.payload.entity
                data.documents = requestResponse.data.payload.docs

                status = 'fulfilled'
            } else {
                status = 'rejected'
            }

            posting = false
        } catch (error) {
            status = 'rejected'
            posting = false
        }

        setstate({
            ...state, status, data, posting
        })
    }

    const onboardingRequestAction = (action: any) => {
        let { posting } = state
        let { show } = state

        if (!posting) {
            if (action === 'R') {
                let isValid = true
                let { input } = state
                let { errors } = state

                if (input.comment.length < 1) {
                    errors.comment = 'Kindly add a comment'
                    isValid = false
                } else if (input.comment.length < 5) {
                    errors.comment = 'Comment cannot be less than 5 characters'
                    isValid = false
                } else if (input.comment.length > 200) {
                    errors.comment = 'Comment cannot be more than 30 characters'
                    isValid = false
                } else {
                    errors.comment = ''
                }

                if (!isValid) {
                    setstate({
                        ...state, errors
                    })

                    return
                }
            }

            posting = true
            show.rejection = false

            setstate({
                ...state, posting, show
            })

            approveOrDeclineOnboardingRequest(action)
        }
    }

    const approveOrDeclineOnboardingRequest = async (action: string) => {
        let { posting } = state

        try {
            let formData = new FormData()
            let requestActionRoute = null
            let actionResponse: any = null

            console.log('IU3BF2', state.input.comment);


            formData.append('comment', state.input.comment)
            requestActionRoute = API_RouteReplace(ADMINISTRATION.ACTION_REQUETS, ':uuid', uuid)

            actionResponse = action === 'A' ?
                actionResponse = await HttpServices.httpPost(requestActionRoute, null) :
                actionResponse = await HttpServices.httpPut(requestActionRoute, formData)

            fetchRequestDetails()
        } catch (error) {
            posting = false

            setstate({
                ...state, posting
            })
        }
    }

    const showOrHideRejectionInput = () => {
        let { show } = state
        show.rejection = !state.show.rejection

        setstate({
            ...state, show
        })
    }

    const onChangeHandler = (e: any) => {
        let output: any = G_onInputChangeHandler(e, state.posting)
        let { input } = state
        let { errors }: any = state

        input[e.target.name] = output.value
        errors[e.target.name] = output.error

        setstate({
            ...state, input, errors
        })
    }

    const onInputBlur = (e: any) => {
        let output: any = G_onInputBlurHandler(e, state.posting, '')
        let { input } = state
        let { errors }: any = state

        input[e.target.name] = output.value
        errors[e.target.name] = output.error

        setstate({
            ...state, input, errors
        })
    }

    return (
        <React.Fragment>
            <BespokePanel
                show={show}
                title={"Request Details"}
                showOrHidePanel={showOrHide}
                components={
                    <>
                        {
                            state.status === 'rejected' ? (
                                <div className="w-full form-group px-12 mb-14">
                                    <div className="w-full">
                                        <div className="pt-5">
                                            <ERR_404
                                                compact={true}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : state.status === 'fulfilled' ? (
                                <div className="w-full text-sm flex flex-col py-3">
                                    <div className="flex-none px-6">
                                        <p className="text-2xl leading-7 text-gray-500 py-1">
                                            {state.data.entity.name}
                                        </p>

                                        <span className="block text-sm text-stone-600 py-2">
                                            Account: <span className="text-amber-600">{state.data.entity.account}</span>
                                        </span>
                                    </div>

                                    <div className="flex-none px-6 flex gap-3 md:flex-row pt-2 pb-2 items-center text-slate-600">
                                        {
                                            state.data.request.status === 'A' ? (
                                                <span className="bg-green-200 text-slate-700 text-xs py-1 px-1.5 rounded">
                                                    <span className="hidden md:inline-block">Request Approved</span>
                                                    <span className="md:hidden">Approved</span>
                                                </span>
                                            ) : state.data.request.status === 'P' ? (
                                                <span className="bg-sky-200 text-sky-700 text-xs py-1 px-1.5 rounded">
                                                    <span className="hidden md:inline-block">New Request</span>
                                                    <span className="md:hidden">New</span>
                                                </span>
                                            ) : (
                                                <span className="bg-red-500 text-white text-xs py-1 px-1.5 rounded">
                                                    <span className="hidden md:inline-block">Request Rejected</span>
                                                    <span className="md:hidden">Rejected</span>
                                                </span>
                                            )
                                        }

                                        <span className="bg-amber-200 text-amber-700 text-xs py-1 px-1.5 rounded">
                                            <span className="hidden md:inline-block">{state.data.entity.type}</span>
                                            <span className="md:hidden">{state.data.entity.type}</span>
                                        </span>

                                        <span className="flex-grow block text-sm text-right">
                                            {humanReadableDate(state.data.request.created_at)}
                                        </span>
                                    </div>

                                    {
                                        state.data.request.comments ? (
                                            <div className={`w-full py-2 px-6 bg-red-50 mb-3 mt-3 transition-transform ease-in-out duration-500`}>
                                                <span className="text-sm mb-1 pt-2 block text-red-600">
                                                    Rejection reason:
                                                </span>

                                                <span className="text-sm mb-2 block text-stone-600 py-2">
                                                    {state.data.request.comments}
                                                </span>
                                            </div>
                                        ) : null
                                    }

                                    {
                                        state.posting ? (
                                            <div className="flex-none flex flex-row-reverse align-middle items-center py-2 mx-6 mb-3 border-b-2 border-dashed">
                                                <span className="text-sm flex-none shadow-none px-3 py-1.5 bg-inherit text-stone-500 sm:w-auto sm:text-sm">Recording your action...
                                                </span>
                                                <span className="fa-duotone text-stone-500 fa-spinner-third fa-xl block fa-spin"></span>
                                            </div>
                                        ) : (
                                            !state.show.rejection ? (
                                                state.data.request.status === 'P' ? (
                                                    <div className="flex-none flex flex-row-reverse align-middle items-center py-2 mx-6 gap-x-3 mb-3 border-b-2 border-dashed">
                                                        <span onClick={showOrHideRejectionInput} className="text-sm flex-none shadow-none py-1 bg-inherit text-red-600 hover:underline hover:cursor-pointer sm:w-auto sm:text-sm">
                                                            Reject Request
                                                        </span>

                                                        <span onClick={() => onboardingRequestAction('A')} className="text-sm flex-none shadow-none py-1 bg-inherit text-green-600 hover:underline hover:cursor-pointer sm:w-auto sm:text-sm">
                                                            Approve Request
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div className="flex-none flex flex-row-reverse align-middle items-center py-2 mx-6 gap-x-3 mb-3 border-b-2 border-dashed">
                                                    </div>
                                                )
                                            ) : (
                                                <div className="flex-none flex flex-row-reverse align-middle items-center py-2 mx-6 gap-x-3">
                                                </div>
                                            )
                                        )
                                    }

                                    {
                                        state.show.rejection ? (
                                            <div className={`w-full py-2 px-6 bg-amber-50 mb-3 transition-transform ease-in-out duration-500 transform ${state.show.rejection ? 'translate-x-0' : 'translate-x-full'}`}>
                                                <span className="text-sm mb-2 block text-stone-600">
                                                    Kindly add reason for rejecting request:
                                                </span>

                                                <div className="mb-2 flex flex-col md:w-12/12 md:space-x-4">
                                                    <div className="space-y-px">
                                                        <div className=" mt-2 rounded shadow-sm">
                                                            <textarea name="comment" id="comment" placeholder="Add Comment" autoComplete="off" rows={3}
                                                                className={classNames(
                                                                    state.errors.comment.length > 0 ?
                                                                        'text-red-900 ring-slate-300 placeholder:text-red-400 focus:ring-red-600 border border-red-600 focus:outline-red-500' :
                                                                        'text-gray-900 ring-slate-300 placeholder:text-gray-400 focus:outline-none focus:border-0 focus:ring-amber-600 focus:outline-amber-500 hover:border-gray-400',
                                                                    'block w-full rounded py-2 resize-none pl-3 pr-8 border border-gray-300 text-sm'
                                                                )} onChange={onChangeHandler} onBlur={onInputBlur} required={true} value={state.input.comment}></textarea>
                                                            <div className="absolute inset-y-0 right-0 top-0 pt-4 flex items-enter w-8">
                                                                {
                                                                    state.errors.comment.length > 0 ? (
                                                                        <span className="fa-duotone text-red-500 fa-circle-exclamation fa-lg"></span>
                                                                    ) : null
                                                                }
                                                            </div>
                                                        </div>

                                                        {
                                                            state.errors.comment.length > 0 ? (
                                                                <span className='invalid-feedback text-xs text-red-600 pl-0'>
                                                                    {state.errors.comment}
                                                                </span>
                                                            ) : null
                                                        }
                                                    </div>
                                                </div>

                                                <div className="mb-2 flex flex-row md:w-12/12 align-middle items-center justify-center">
                                                    <span onClick={showOrHideRejectionInput} className="text-sm flex-1 py-1 bg-inherit text-stone-500 hover:underline hover:cursor-pointer sm:w-auto sm:text-sm">
                                                        Cancel
                                                    </span>

                                                    <span onClick={() => onboardingRequestAction('R')} className="text-sm flex-1 text-right py-1 bg-inherit text-red-600 hover:underline hover:cursor-pointer sm:w-auto sm:text-sm">
                                                        Reject Request
                                                    </span>
                                                </div>
                                            </div>
                                        ) : null
                                    }

                                    <div className="pb-4 flex-grow px-6 overflow-y-auto">
                                        <h2 className="text-lg leading-7 text-amber-500 sm:text-lg sm: mb-2">
                                            Artist Details
                                        </h2>

                                        <div className="w-12/12">
                                            <p className="text-sm form-group text-gray-500">
                                                Entity's member and their identity documents
                                            </p>
                                        </div>

                                        {
                                            state.data.artists.map((artist: any, key: any) => {
                                                return (
                                                    <div className="border-b mb-4" key={artist.uid}>
                                                        <div className="flex flex-row w-full lg:w-12/12">
                                                            <div className="basis-2/5 text-stone-500">
                                                                <span className=" py-1 block mb-2">
                                                                    <span className="hidden md:inline-block">Full Names:</span>
                                                                    <span className="md:hidden">Full Names:</span>
                                                                </span>

                                                                <span className=" py-1 block mb-2">
                                                                    <span className="hidden md:inline-block">Artist Names:</span>
                                                                    <span className="md:hidden">Artist Names:</span>
                                                                </span>

                                                                <span className=" py-1 block mb-2">
                                                                    <span className="hidden md:inline-block">E-mail Address:</span>
                                                                    <span className="md:hidden">E-mail:</span>
                                                                </span>

                                                                <span className=" py-1 block mb-2">
                                                                    <span className="hidden md:inline-block">Phone Number:</span>
                                                                    <span className="md:hidden">Phone:</span>
                                                                </span>

                                                                <span className=" py-1 block mb-2">
                                                                    <span className="hidden md:inline-block">Account Type:</span>
                                                                    <span className="md:hidden">Account Type:</span>
                                                                </span>
                                                            </div>

                                                            <div className="basis-3/5 text-stone-700">
                                                                <span className=" py-1 block mb-2 capitalize">
                                                                    {artist.display_name}
                                                                </span>

                                                                <span className=" py-1 block mb-2 text-amber-500">
                                                                    {artist.name}
                                                                </span>

                                                                <span className=" py-1 block mb-2 lowercase">
                                                                    {artist.email}
                                                                </span>

                                                                <span className=" py-1 block lowercase">
                                                                    <PhoneInput
                                                                        international
                                                                        readOnly={true}
                                                                        disabled={true}
                                                                        defaultCountry="KE"
                                                                        onChange={emptyOnChangeHandler}
                                                                        value={artist.msisdn}
                                                                    />
                                                                </span>

                                                                <span className=" py-1 block mb-2 capitalize">
                                                                    {
                                                                        artist.provider === 'google.com' ? (
                                                                            <span>Google Account</span>
                                                                        ) : (
                                                                            <span>Email & Password</span>
                                                                        )
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {
                                                            state.data.documents.map((document: any) => {
                                                                return (
                                                                    document.users_uuid === artist.acid ? (
                                                                        <div className="w-full" key={document.identifier}>
                                                                            <div className="flex flex-row w-full lg:w-12/12">
                                                                                <div className="basis-2/5 text-stone-500">
                                                                                    <span className=" py-1 block mb-2">
                                                                                        <span className="hidden md:inline-block">{document.type === 'ID' ? 'ID Number' : 'Passport Number'}:</span>
                                                                                        <span className="md:hidden">{document.type === 'ID' ? 'ID Number' : 'Passport Number'}:</span>
                                                                                    </span>
                                                                                </div>

                                                                                <div className="basis-3/5 text-stone-700">
                                                                                    <span className=" py-1 block mb-2 capitalize">
                                                                                        {document.identifier}
                                                                                    </span>
                                                                                </div>
                                                                            </div>

                                                                            <div className="mb-2 bg-amber-00 py-2 px-4 border-2 border-stone-300 border-dashed rounded-md">
                                                                                <div className="flex flex-row align-middle items-center text-amber-700 px-2">
                                                                                    <i className="fa-duotone fa-file fa-2x mt-1 text-amber-900 flex-none"></i>

                                                                                    <div className="flex-auto ml-1 mt-1">
                                                                                        <span className="text-sm pl-3 block text-amber-900">
                                                                                            {document.path}
                                                                                        </span>

                                                                                        <span className="text-sm pl-3 block text-stone-500">
                                                                                            {
                                                                                                document.type === 'ID' ? (
                                                                                                    <span>National ID</span>
                                                                                                ) : (
                                                                                                    <span>Passport</span>
                                                                                                )
                                                                                            }

                                                                                            <span className="text-right float-right text-amber-600">View</span>
                                                                                        </span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ) : null
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full form-group px-12 mb-14">
                                    <div className="w-full">
                                        <div className="pt-10">
                                            <Loading />
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    </>
                }
            />
        </React.Fragment>
    )
}
