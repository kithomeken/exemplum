import { toast } from "react-toastify"
import React, { useState } from "react"
import PhoneInput from 'react-phone-number-input'

import { ERR_404 } from "../errors/ERR_404"
import { ERR_500 } from "../errors/ERR_500"
import { ACCOUNT } from "../../api/API_Registry"
import { useAppSelector } from "../../store/hooks"
import HttpServices from "../../services/HttpServices"
import { Loading } from "../../components/modules/Loading"
import { STORAGE_KEYS } from "../../global/ConstantsRegistry"
import { readDecryptAndParseLS, classNames } from "../../lib/modules/HelperFunctions"

export const NomintatedMember = () => {
    const [state, setstate] = useState({
        posting: false,
        httpStatus: 200,
        status: 'pending',
        data: null,
        input: {
            email: ''
        },
        errors: {
            email: ''
        },
        process: {
            type: '',
            state: false,
        },
        show: {
            msisdnChange: false,
            nominations: false,
            displayName: false,
        }
    })

    const emptyOnChangeHandler = () => { }
    let idenityData = readDecryptAndParseLS(STORAGE_KEYS.ACCOUNT_DATA)

    React.useEffect(() => {
        fetchDesignatory()
    }, [])

    const fetchDesignatory = async () => {
        let { httpStatus } = state
        let { posting } = state
        let { status } = state
        let { data } = state

        try {
            const response: any = await HttpServices.httpGet(ACCOUNT.GET_NOMINATED)
            httpStatus = response.status

            if (response.data.success) {
                status = 'fulfilled'
                data = response.data.payload
            } else {
                status = 'rejected'
            }
        } catch (error) {
            httpStatus = 500
            status = 'rejected'
        }

        posting = false

        setstate({
            ...state, status, data, posting, httpStatus
        })
    }

    const setOwnMsisdnAsDesignated = async () => {
        let { posting } = state

        if (!posting) {
            posting = true

            try {
                const response: any = await HttpServices.httpPost(ACCOUNT.SET_NOMINATED, null)

                if (response.data.success) {
                    fetchDesignatory()
                } else {

                }
            } catch (error) {
                console.log(error);
            }

            posting = false

            setstate({
                ...state, posting
            })
        }
    }

    const nominatedMemberAction = (action: string) => {
        let { posting } = state

        if (!posting) {
            posting = true

            setstate({
                ...state, posting
            })

            if (action === 'A') {
                approveNominatedMember()
            } else {
                rejectNominatedMember()
            }
        }
    }

    const approveNominatedMember = async () => {
        let { posting } = state

        try {
            const response: any = await HttpServices.httpPost(ACCOUNT.NMNTD_MMBR_ACTION, null)

            if (response.data.success) {
                fetchDesignatory()
            } else {
                toast.error("Something went wrong, could not process your request", {
                    position: "top-right",
                    autoClose: 7000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong, could not process your request", {
                position: "top-right",
                autoClose: 7000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    }

    const rejectNominatedMember = async () => {
        let { posting } = state

        try {
            const response: any = await HttpServices.httpDelete(ACCOUNT.NMNTD_MMBR_ACTION, null)

            if (response.data.success) {
                fetchDesignatory()
            } else {
                toast.error("Something went wrong, could not process your request", {
                    position: "top-right",
                    autoClose: 7000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong, could not process your request", {
                position: "top-right",
                autoClose: 7000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    }

    const showOrHideNominationModal = () => {
        let { data } = state

        if (data.Nm0T === 'N' && data.enTT.max > 1 && data.Fb0C === 'Y') {
            let { show } = state
            show.nominations = !state.show.nominations

            setstate({
                ...state, show
            })
        }
    }

    const showOrHideMsisdnChangeModal = () => {
        let { show } = state
        show.msisdnChange = !state.show.msisdnChange

        setstate({
            ...state, show
        })
    }

    const showOrHideDisplayNameModal = () => {
        if (idenityData.provider_id === 'password') {
            let { show } = state
            show.displayName = !state.show.displayName

            setstate({
                ...state, show
            })
        }
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
                        <div className="w-full md:gap-x-4 gap-y-4 grid md:grid-cols-3 pt-4 pb-6 border-b md:px-4">
                            <div className="col-span-1">
                                <span className="text-lg text-stone-600 md:text-base">
                                    Nominated Member:
                                </span>
                            </div>

                            <div className="col-span-2 flex flex-col md:gap-x-2 gap-y-3 md:align-middle md:items-center py-2 md:py-0">
                                <p className="text-sm text-stone-600">
                                    A member's phone number nominated to receive funds, withdrawal notifications and confirmation of transactions.
                                </p>

                                <div className="md w-full py-3">
                                    {
                                        state.data.Nm0T === 'Y' ? (
                                            <div className="mb-2 rounded">
                                                <div className="flex md:flex-row flex-col gap-y-1 w-full md:gap-x-3 align-middle md:items-center border-b pb-4">
                                                    <span className="py-2 block basis-1/2 text-stone-700 whitespace-nowrap">
                                                        {state.data.meta.dsGA.display_name}
                                                    </span>

                                                    <div className="basis-1/2 text-stone-700 whitespace-nowrap">
                                                        <PhoneInput
                                                            international
                                                            readOnly={true}
                                                            disabled={true}
                                                            defaultCountry="KE"
                                                            onChange={emptyOnChangeHandler}
                                                            value={state.data.meta.dsGA.msisdn}
                                                        />
                                                    </div>
                                                </div>

                                                {
                                                    state.data.meta.dsG0 === undefined || state.data.meta.dsG0 === null ? (
                                                        // User does not have an approval
                                                        <>
                                                            {
                                                                state.data.meta.dsGR === undefined || state.data.meta.dsGR === null ? (
                                                                    // Already approved
                                                                    state.data.Fb0C === 'Y' ? (
                                                                        <div className="flex flex-row-reverse align-middle items-center py-1">
                                                                            <span className="text-sm flex-none shadow-none px-3 py-1 bg-inherit text-orange-600 hover:underline hover:cursor-pointer mr-2 sm:w-auto sm:text-sm">
                                                                                Change Nominated Member
                                                                            </span>
                                                                        </div>
                                                                    ) : null
                                                                ) : (
                                                                    // Not fully approved by members
                                                                    <span className={
                                                                        classNames(
                                                                            state.data.meta.dsGR[0] > state.data.meta.dsGR[1] ? 'text-orange-500' : 'text-emerald-500',
                                                                            'text-sm px-3 py-2 block text-right'
                                                                        )
                                                                    }>
                                                                        {
                                                                            state.data.meta.dsGR[0] > state.data.meta.dsGR[1] ? (
                                                                                <span>Pending approval of {state.data.meta.dsGR[0]} member(s)</span>
                                                                            ) : (
                                                                                <span>Approved by all members</span>
                                                                            )
                                                                        }
                                                                    </span>
                                                                )
                                                            }
                                                        </>
                                                    ) : (
                                                        // User has an approval
                                                        state.posting ? (
                                                            <div className="flex flex-row-reverse items-center py-1-5 px-3">
                                                                <span className="text-sm flex-none shadow-none px-3 py-1 bg-inherit text-orange-500 sm:w-auto sm:text-sm">Recording your action...
                                                                </span>
                                                                <span className="fad text-orange-500 fa-spinner-third fa-xl block fa-spin"></span>
                                                            </div>
                                                        ) : (
                                                            <div className="flex flex-row-reverse align-middle items-center py-1">
                                                                <span onClick={() => nominatedMemberAction('R')} className="text-sm flex-none shadow-none px-3 py-1 bg-inherit text-red-600 hover:underline hover:cursor-pointer mr-2 sm:w-auto sm:text-sm">
                                                                    <span className="hidden md:inline-block">Reject Nomination</span>
                                                                    <span className="md:hidden">Reject</span>
                                                                </span>

                                                                <span onClick={() => nominatedMemberAction('A')} className="text-sm flex-none shadow-none px-3 py-1 bg-inherit text-emerald-600 hover:underline hover:cursor-pointer mr-2 sm:w-auto sm:text-sm">
                                                                    <span className="hidden md:inline-block">Approve Nomination</span>
                                                                    <span className="md:hidden">Approve</span>
                                                                </span>
                                                            </div>
                                                        )

                                                    )
                                                }
                                            </div>
                                        ) : (
                                            // No nominated member found
                                            state.data.Fb0C === 'N' ? (
                                                <div className="mb-2 bg-sky-00 py-2 px-2 border-2 border-sky-300 border-dashed rounded-md">
                                                    <div className="flex flex-row align-middle items-center text-sky-700 px-2 gap-x-2">
                                                        <div className="flex-none hidden md:block">
                                                            <i className="fa-duotone fa-info-circle fa-2x text-blue-700"></i>
                                                        </div>

                                                        <div className="flex-auto text-sm pl-2 py-2">
                                                            <span className="text-blue-800 pb-2 flex flex-row align-middle items-center gap-x-3 md:py-0">
                                                                <div className="md:hidden block">
                                                                    <i className="fa-duotone fa-info-circle fa-2x text-blue-700"></i>
                                                                </div>

                                                                No nominated member set.
                                                            </span>

                                                            <span className="text-sm block text-blue-600">
                                                                Please wait for your inviter to set a nominated member. <span className="block md:inline-block py-1 md:py-0">Once they do, you'll approve to make the nominated member's phone operational.</span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="mb-2 bg-sky-00 py-2 px-2 border-2 border-sky-300 border-dashed rounded-md">
                                                    <div className="flex flex-row align-middle items-center text-sky-700 px-2 gap-x-2">
                                                        <div className="flex-none hidden md:block">
                                                            <i className="fa-duotone fa-info-circle fa-2x text-blue-700"></i>
                                                        </div>

                                                        <div className="flex-auto text-sm pl-2 py-2">
                                                            <span className="text-blue-800 pb-2 flex flex-row align-middle items-center gap-x-3 md:py-0">
                                                                <div className="md:hidden block">
                                                                    <i className="fa-duotone fa-info-circle fa-2x text-blue-700"></i>
                                                                </div>

                                                                No nominated member set.
                                                            </span>

                                                            <span className="text-sm block text-blue-600">
                                                                Upon selecting a nominated member, you will require approval from other members before it can be opertional.
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-row-reverse align-middle items-center pt-3">
                                                        <button type="button" onClick={showOrHideNominationModal} className="text-sm flex-none shadow-none px-3 py-1 bg-inherit text-stone-600 hover:underline hover:cursor-pointer mr-2 sm:w-auto sm:text-sm">
                                                            Nominate another
                                                        </button>

                                                        <button type="button" onClick={setOwnMsisdnAsDesignated} className="text-sm flex-none shadow-none px-3 py-1 bg-inherit text-stone-600 hover:underline hover:cursor-pointer mr-2 sm:w-auto sm:text-sm">
                                                            Nominate yourself
                                                        </button>
                                                    </div>
                                                </div>
                                            )
                                        )
                                    }
                                </div>


                            </div>
                        </div>
                    </>
                ) : (
                    <div className="w-full md:gap-x-4 gap-y-4 grid md:grid-cols-3 pt-4 pb-6 md:px-4">
                        <div className="col-span-3">
                            <Loading />
                        </div>
                    </div>
                )
            }
        </React.Fragment>
    )
}