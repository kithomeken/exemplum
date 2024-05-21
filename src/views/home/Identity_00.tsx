import { toast } from "react-toastify";
import React, { useState } from "react";

import { ERR_404 } from "../errors/ERR_404";
import { ERR_500 } from "../errors/ERR_500";
import { AUTH } from "../../api/API_Registry";
import { useAppSelector } from "../../store/hooks";
import HttpServices from "../../services/HttpServices";
import { Loading } from "../../components/modules/Loading";
import { G_onInputBlurHandler } from "../../components/lib/InputHandlers";
import completed from "../../assets/images/fd0b0ed18a34962f80d77c6e6ff42e7b.svg"
import invitation from "../../assets/images/1bb38b1912d0c7dbfb5b02cb3d30e0ad.svg"
import { APPLICATION, CONFIG_MAX_WIDTH, STORAGE_KEYS } from "../../global/ConstantsRegistry";
import { classNames, emailValidator, encryptAndStoreLS, getColorForLetter } from "../../lib/modules/HelperFunctions";
import StorageServices from "../../services/StorageServices";

export const Identity_00 = () => {
    const [state, setstate] = useState({
        show: false,
        toastERR: '',
        posting: false,
        emailInvite: '',
        httpStatus: 200,
        status: 'pending',
        data: {
            identity: null,
            beneficiaries: null,
        },
        entity: [{
            email: '',
        }],
        entityErrors: [{
            email: '',
        }]
    })

    const auth0: any = useAppSelector(state => state.auth0)

    React.useEffect(() => {
        metaIdentityConfirmation()
    }, [])

    const metaIdentityConfirmation = async () => {
        let { show } = state
        let { data } = state
        let { status } = state
        let { httpStatus } = state

        try {
            const response: any = await HttpServices.httpGet(AUTH.ENTITY_CONFIRMATION)
            const payload = response.data.payload
            httpStatus = response.status

            if (response.data.success) {
                status = 'fulfilled'

                data.beneficiaries = payload.beneficiaries
                data.identity = payload.identity

                StorageServices.setLocalStorage(STORAGE_KEYS.ONBOARDING_STATUS, payload.identity.quo)
                show = data.beneficiaries.length > 0 ? true : false
            } else {
                status = 'rejected'
            }
        } catch (error) {
            status = 'rejected'
            httpStatus = 500
        }

        setstate({
            ...state, status, data, show, httpStatus
        })
    }

    const onChangeHandler = (e: any, index: any) => {
        const { posting } = state

        if (!posting) {
            let { entityErrors } = state
            let { entity }: any = state

            const artistDetailsCollection = state.entity.map((artist, mapIndex) => {
                if (index !== mapIndex) return artist

                entityErrors[index][e.target.name] = ''
                return { ...artist, [e.target.name]: e.target.value }
            })

            entity = artistDetailsCollection

            setstate({
                ...state, entity, entityErrors
            })
        }
    }

    const onInputBlur = (e: any, index: any) => {
        let { posting } = state

        if (!posting) {
            let output: any = G_onInputBlurHandler(e, posting, '', 3)
            let { entity } = state
            let { entityErrors } = state

            entity[index][e.target.name] = output.value
            entityErrors[index][e.target.name] = output.error.replace('_', ' ')

            setstate({
                ...state, entity, entityErrors
            })
        }
    }

    const addPointOfContactHandler = () => {
        let { data } = state
        let { entity } = state
        let { entityErrors } = state
        const { posting } = state

        if (!posting) {
            if (entity.length < data.identity.pax) {
                entity = state.entity.concat([{
                    email: '',
                }])

                entityErrors = state.entityErrors.concat([{
                    email: '',
                }])

                setstate({
                    ...state, entity, entityErrors, toastERR: ''
                })
            }
        }
    }

    const removePointOfContactHandler = (index: any) => {
        setstate({
            ...state,
            entity: state.entity.filter((s, varIdx) => index !== varIdx),
            entityErrors: state.entityErrors.filter((s, varIdx) => index !== varIdx),
        })
    }

    const showOrHideEntityInv = () => {
        setstate({
            ...state, show: !state.show
        })
    }

    const entitasConfirmatio = () => {
        let { entity } = state
        let { toastERR } = state
        let { entityErrors } = state
        let { identity } = state.data

        toastERR = ''
        let confimatio = true
        let emailArray: any = []

        if (state.data.identity.pax === 5 && state.entity.length < 4) {
            toastERR = `To form a ${identity.description}, 4 or 5 members are required. Please adjust the number of invitees accordingly.`
        } else if (state.entity.length < (identity.pax - 1)) {
            toastERR = `To form a ${identity.description}, ${identity.pax} members are required. Please adjust the number of invitees accordingly.`
        }

        if (toastERR) {
            setstate({
                ...state, toastERR
            })

            return false
        }

        Object.keys(entity).forEach(function (key) {
            if (!entity[key].email) {
                entityErrors[key].email = 'Please provide a email address'
                confimatio = false
            } else if (!emailValidator(entity[key].email)) {
                entityErrors[key].email = 'Please provide a valid email address'
                confimatio = false
            } else {
                if (!emailArray.includes(entity[key].email)) {
                    emailArray.push(entity[key].email);
                } else {
                    confimatio = false
                    toastERR = "Duplicate email(s) found. Please correct."
                }
            }

            if (entity[key].email === auth0.identity.email) {
                confimatio = false
                entityErrors[key].email = "You can't invite yourself as a member"
            }
        })

        setstate({
            ...state, entity, entityErrors, toastERR
        })

        return confimatio
    }

    const onFormSubmitHandler = (e: any) => {
        e.preventDefault()
        let { posting } = state

        if (!posting) {
            setstate({
                ...state, toastERR: ''
            })

            let confimatio = entitasConfirmatio()

            if (confimatio) {
                setstate({
                    ...state, posting: true
                })

                addMemeberToEntity()
            }
        }
    }

    const addMemeberToEntity = async () => {
        let { entity } = state
        let { posting } = state
        let { httpStatus } = state
        let { entityErrors } = state
        let formData = new FormData()

        try {
            Object.keys(entity).forEach(function (key) {
                formData.append("email[]", entity[key].email)
            })

            const entityResponse: any = await HttpServices.httpPost(AUTH.ENTITY_EXPANSION, formData)
            httpStatus = entityResponse.status

            if (entityResponse.data.success) {
                showOrHideEntityInv()
                posting = false
                let toastText = "Your invites have been dispatched"

                toast.success(toastText, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

                window.location.reload();
            } else {
                posting = false
                httpStatus = 500
                const payload = entityResponse.data

                Object.keys(payload).forEach(function (key) {
                    let entityIndex = key.split('.')[1]
                    let errorMsg = payload[key][0]
                    entityErrors[entityIndex].email = errorMsg.replace('.' + entityIndex, '')
                })
            }
        } catch (error) {
            posting = false
            httpStatus = 500
        }

        setstate({
            ...state, posting, httpStatus, entityErrors
        })
    }

    const resendEntityInviationAction = (email: string) => {
        let { posting } = state

        if (!posting) {
            setstate({
                ...state, posting: true, emailInvite: email
            })

            resendEntityInviation(email)
        }
    }

    const resendEntityInviation = async (email: string) => {
        let { posting } = state

        try {
            let formData = new FormData()
            formData.append("email", email)
            const invitationResponse: any = await HttpServices.httpPost(AUTH.ENT_RE_EXPANSION, formData)

            if (invitationResponse.data.success) {
                posting = false
                let toastText = "Your invites have been dispatched"

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
            console.log(error);

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
            <div className="wrapper w-full overflow-auto md:h-screen h-auto">
                <section className="gx-container md:h-screen h-auto rounded-md w-full flex items-center justify-center" style={CONFIG_MAX_WIDTH}>
                    <div className="flex md:flex-row flex-col align-middle items-center w-full md:pb-0 pb-10">
                        {
                            state.status === 'rejected' ? (
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
                            ) : state.status === 'fulfilled' ? (
                                <>
                                    <div className="md:basis-3/5 md:px-6 px-8 w-full py-6 overflow-auto">
                                        <span className="text-2xl self-start text-orange-500 tracking-wider leading-7 block mb-2 md:pt-0 pt-4">{APPLICATION.NAME}</span>

                                        <div className="flex flex-row align-middle items-center gap-x-3 pt-2 md:pb-3">
                                            <span className="fa-duotone text-orange-600 fa-badge-check fa-lg"></span>

                                            <span className="text-sm text-stone-500 md:text-start text-right block">
                                                Profile completed
                                            </span>
                                        </div>

                                        {
                                            state.data.identity.pax > 1 ? (
                                                <>
                                                    <div className="flex flex-col md:flex-col align-middle items-center md:gap-x-3">
                                                        <div className="md:w-1/1 md:w-60 w-72">
                                                            {
                                                                state.data.beneficiaries.length === (state.data.identity.pax - 1) ? (
                                                                    <img src={completed} alt={"completed"} width="auto" className="block text-center m-auto md:hidden" />
                                                                ) : (
                                                                    <img src={invitation} alt={"invitation"} width="auto" className={
                                                                        classNames(
                                                                            state.show === true && state.data.identity.pax > 2 ? "md:hidden" : null,
                                                                            "block text-center m-auto"
                                                                        )
                                                                    } hidden={state.show === true && state.data.identity.pax} />
                                                                )
                                                            }
                                                        </div>

                                                        {
                                                            state.data.beneficiaries.length === (state.data.identity.pax - 1) ? (
                                                                <div className="w-full text-sm text-stone-600 float-right">
                                                                    <span className="block py-4 text-lg md:text-xl">
                                                                        Your request has been received!

                                                                        <span className="text-base md:text-sm pt-4 text-stone-500 block">
                                                                            <span className="block pt-2">
                                                                                We'll review your request and approve your account within 3 business days.
                                                                            </span>
                                                                        </span>
                                                                    </span>
                                                                </div>
                                                            ) : (
                                                                <div className="w-full text-sm text-stone-600 float-right">
                                                                    <span className="block pb-3 text-lg md:text-xl">
                                                                        Your profile is complete.

                                                                        <span className="text-base md:text-sm text-stone-500 block">
                                                                            <span className="block md:pt-2 md:py-0 py-3">
                                                                                Extend personalized invitations via email to your member(s) to join our community.
                                                                            </span>
                                                                        </span>
                                                                    </span>
                                                                </div>
                                                            )
                                                        }

                                                        {
                                                            state.show ? (
                                                                <>
                                                                    {
                                                                        state.httpStatus !== 200 ? (
                                                                            <>
                                                                                <div className="mb-2 bg-orange-00 py-1 md:px-4 border-2 border-red-300 border-dashed rounded-md">
                                                                                    <div className="flex md:flex-row flex-row align-middle items-center text-red-700 md:px-2 px-4">
                                                                                        <i className="fa-duotone fa-octagon-exclamation fa-2x mt-1 text-red-700 flex-none"></i>

                                                                                        <div className="flex-auto ml-1 mt-1">
                                                                                            <span className="text-sm pl-3 block text-left py-2 text-red-700">
                                                                                                Error occurred when sending out invities to your members.
                                                                                            </span>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </>
                                                                        ) : null
                                                                    }

                                                                    <div className="w-full block mb-3 pb-4 border-b-2 border-dashed">
                                                                        {
                                                                            state.data.beneficiaries.length < (state.data.identity.pax - 1) ? (
                                                                                <form className="w-full md:w-2/3 mx-0 block" onSubmit={onFormSubmitHandler}>
                                                                                    {
                                                                                        state.entity.map((contact: any, index: any) => {
                                                                                            return (
                                                                                                <div key={`KDE_${index}`} className="w-full py-3 flex flex-row align-middle items-center gap-x-3">
                                                                                                    <div className="flex-grow">
                                                                                                        <input type="email" name="email" id={`entity-${index}-email`} autoComplete="off" onChange={(e) => onChangeHandler(e, index)} className="focus:ring-1 w-full py-1.5 px-2.5 lowercase flex-1 block text-sm rounded-md sm:text-sm border border-gray-300 disabled:opacity-50 focus:ring-orange-600 focus:outline-orange-500" onBlur={(e) => onInputBlur(e, index)} placeholder={`member${index + 1}@email.com`} value={contact.email} />

                                                                                                        {
                                                                                                            state.entityErrors[index].email.length > 0 &&
                                                                                                            <span className='invalid-feedback text-xs text-red-600 pl-1 block pt-1'>
                                                                                                                {state.entityErrors[index].email}
                                                                                                            </span>
                                                                                                        }
                                                                                                    </div>

                                                                                                    {
                                                                                                        index !== 0 ? (
                                                                                                            <button type="button" className="text-red-500 hover:text-red-600 flex-none text-sm cursor-pointer" onClick={() => removePointOfContactHandler(index)}>
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
                                                                                            state.entity.length < (state.data.identity.pax - 1) ? (
                                                                                                <button type="button" className="text-blue-500 text-sm cursor-pointer" onClick={addPointOfContactHandler}>
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
                                                                                        <button className="bg-orange-600  min-w-28 py-1.5 px-4 border border-transparent text-sm font-medium rounded-md text-white hover:bg-orange-700 focus:outline-none focus:ring-0 focus:ring-offset-2 focus:bg-orange-700" type="submit">
                                                                                            {
                                                                                                state.posting ? (
                                                                                                    <i className="fad fa-spinner-third fa-xl fa-spin py-2.5"></i>
                                                                                                ) : (
                                                                                                    <div className="flex justify-center align-middle items-center gap-x-3">
                                                                                                        <i className="fa-solid fa-paper-plane fa-lg"></i>
                                                                                                        Send Invite{state.entity.length > 1 ? 's' : null}
                                                                                                    </div>
                                                                                                )
                                                                                            }
                                                                                        </button>
                                                                                    </div>
                                                                                </form>
                                                                            ) : null
                                                                        }

                                                                        {
                                                                            state.data.beneficiaries.length > 0 ? (
                                                                                <div className="py-3 w-full">
                                                                                    <span className="block text-base d:text-stone-600 pb-1 text-orange-500">
                                                                                        Invited Members
                                                                                    </span>

                                                                                    {
                                                                                        state.data.beneficiaries.map((member: any, index: any) => {
                                                                                            return (
                                                                                                <li key={`MMDR-${member.email}`} className={`w-full flex md:flex-row flex-col align-middle items-center justify-between gap-x-6 py-3 md:py-2 md:px-3 md:hover:bg-stone-100 ${index === 0 ? 'border-t-0' : 'border-t'}`}>
                                                                                                    <div className="flex w-full md:w-auto min-w-0 gap-x-4 md:gap-x-4 align-middle items-center">
                                                                                                        <div className={`md:h-8 md:w-8 w-10 h-10 flex items-center justify-center uppercase text-white rounded-full ${getColorForLetter(member.email.charAt(0))}`}>
                                                                                                            {member.email.charAt(0)}
                                                                                                        </div>

                                                                                                        <div className="min-w-0 flex-auto">
                                                                                                            {
                                                                                                                member.display_name === null || member.display_name === undefined ? (
                                                                                                                    <p className="truncate text-sm leading-5 text-gray-500" onClick={() => resendEntityInviationAction(member.email)}>
                                                                                                                        {member.email}

                                                                                                                        {
                                                                                                                            state.posting && state.emailInvite === member.email ? (
                                                                                                                                <span className="flex md:hidden gap-x-2 align-middle items-center text-blue-500 hover:text-blue-600">
                                                                                                                                    <span className="inline-block py-0.5">Resending</span>
                                                                                                                                </span>
                                                                                                                            ) : (
                                                                                                                                <span className="flex md:hidden gap-x-2 align-middle items-center text-blue-500 hover:text-blue-600">
                                                                                                                                    <span className="inline-block py-0.5">Resend Invitation</span>
                                                                                                                                </span>
                                                                                                                            )
                                                                                                                        }
                                                                                                                    </p>
                                                                                                                ) : (
                                                                                                                    <p className="truncate text-sm leading-5 text-gray-500">
                                                                                                                        {member.display_name}

                                                                                                                        <span className="flex md:hidden gap-x-2 align-middle items-center text-emerald-500">
                                                                                                                            <span className="fa-duotone sm:block hidden fa-badge-check fa-lg"></span>
                                                                                                                            <span className="inline-block py-0.5">Onboarded</span>
                                                                                                                        </span>
                                                                                                                    </p>
                                                                                                                )
                                                                                                            }
                                                                                                        </div>
                                                                                                    </div>

                                                                                                    <div className="shrink-0 md:w-auto sm:flex sm:flex-col sm:items-end w-full">
                                                                                                        {
                                                                                                            member.display_name === null || member.display_name === undefined ? (
                                                                                                                <p className="text-blue-600 hover:text-blue-700 w-full gap-x-2 text-sm cursor-pointer hidden md:flex" onClick={() => resendEntityInviationAction(member.email)}>
                                                                                                                    {
                                                                                                                        state.posting && state.emailInvite === member.email ? (
                                                                                                                            <>
                                                                                                                                <span className="md:hidden">
                                                                                                                                    <span className="fa-duotone sm:block hidden fa-spinner fa-spin fa-lg"></span>
                                                                                                                                </span>

                                                                                                                                <span className="hidden md:inline-block">Resending</span>
                                                                                                                            </>
                                                                                                                        ) : (
                                                                                                                            <>
                                                                                                                                <span className="md:hidden">
                                                                                                                                    <span className="fa-duotone sm:block hidden fa-paper-plane fa-lg"></span>
                                                                                                                                </span>

                                                                                                                                <span className="hidden md:inline-block">Resend Email</span>
                                                                                                                            </>
                                                                                                                        )
                                                                                                                    }
                                                                                                                </p>
                                                                                                            ) : (
                                                                                                                <p className="text-emerald-600 w-full gap-x-2 text-sm cursor-pointer hidden md:flex align-middle items-center">
                                                                                                                    <span className="fa-duotone sm:block hidden fa-badge-check fa-lg"></span>

                                                                                                                    <span className="hidden md:inline-block">Onboarded</span>
                                                                                                                </p>

                                                                                                            )
                                                                                                        }
                                                                                                    </div>
                                                                                                </li>
                                                                                            )
                                                                                        })
                                                                                    }


                                                                                    <div className="mt-4 bg-orange-00 px-2 md:py-2 border-l-2 bg-orange-50 border-orange-300 border-dashed rounded-sm mb-3">
                                                                                        <div className="flex flex-row align-middle items-center text-orange-700 px-2">
                                                                                            <i className="fa-duotone fa-info-circle fa-xl mt-1 text-orange-700 flex-none"></i>

                                                                                            <div className="flex-auto ml-1 mt-1">
                                                                                                <span className="text-sm pl-3 block py-2 text-orange-700">
                                                                                                    All invited member(s) need to onboard for your request to be approved.
                                                                                                </span>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            ) : null
                                                                        }

                                                                        <span className="text-sm pt-3 text-stone-500 block">
                                                                            In case of any issue, reach out to our admin at <span className="text-orange-600">admin@email.com</span>
                                                                        </span>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <div className="w-full mb-3 pb-4 border-b-2 border-dashed">
                                                                    <button type="button" className="text-orange-600 text-sm block cursor-pointer py-1.5 float-end hover:text-orange-700 hover:underline" onClick={showOrHideEntityInv}>
                                                                        Invite to your members
                                                                    </button>
                                                                </div>
                                                            )
                                                        }

                                                        <div className="mx-auto py-3 text-center">
                                                            <p className="text-sm text-stone-500 md:pb-0">
                                                                © {new Date().getFullYear()}. Elevated Acts of Appreciation, <span className="text-orange-600 block">Tip by Tip.</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="flex flex-col md:flex-col align-middle items-center md:gap-x-3">
                                                        <div className="md:w-1/1 md:w-60 w-72">
                                                            <img src={completed} alt={"completed"} width="auto" className="block text-center m-auto md:hidden" />
                                                        </div>

                                                        <div className="w-full text-sm text-stone-600 float-right">
                                                            <span className="block py-4 text-lg md:text-2xl">
                                                                Your request has been received!

                                                                <span className="md:text-lg text-base pt-4 text-stone-500 block">
                                                                    <span className="block pt-2">
                                                                        We'll review your request and approve your account within 3 business days.
                                                                    </span>
                                                                </span>
                                                            </span>
                                                        </div>

                                                        <div className="w-full block mb-3 pb-4 border-b-2 border-dashed">
                                                            <span className="text-sm pt-3 mt-3 text-stone-500 block">
                                                                In case of any issue, reach out to our admin at <span className="text-orange-600">admin@email.com</span>
                                                            </span>
                                                        </div>

                                                        <div className="mx-auto py-3 text-center">
                                                            <p className="text-sm text-stone-500 md:pb-0">
                                                                © {new Date().getFullYear()}. Elevated Acts of Appreciation, <span className="text-orange-600 block">Tip by Tip.</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </>
                                            )
                                        }
                                    </div>

                                    <div className="md:basis-2/5 hidden md:block h-screen px-4 py-8">
                                        <img className="h-full bg-orange-100 rounded-2xl" src={completed} alt={"completed"} loading="lazy" />
                                    </div>
                                </>
                            ) : (
                                <div className="w-full h-1/2 flex flex-col justify-center">
                                    <div className="flex-grow pt-8">
                                        <Loading />
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </section>
            </div>
        </React.Fragment>
    )
}