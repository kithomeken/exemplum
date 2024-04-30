import { toast } from "react-toastify";
import React, { useState } from "react";
import { Link } from "react-router-dom";

import { AUTH } from "../../api/API_Registry";
import { commonRoutes } from "../../routes/routes";
import HttpServices from "../../services/HttpServices";
import StorageServices from "../../services/StorageServices";
import { classNames } from "../../lib/modules/HelperFunctions";
import { G_onInputBlurHandler } from "../../components/lib/InputHandlers";
import completed from "../../assets/images/fd0b0ed18a34962f80d77c6e6ff42e7b.svg"
import invitation from "../../assets/images/1bb38b1912d0c7dbfb5b02cb3d30e0ad.svg"
import { APPLICATION, CONFIG_MAX_WIDTH, STORAGE_KEYS } from "../../global/ConstantsRegistry";

export const Identity_00 = () => {
    const [state, setstate] = useState({
        data: null,
        show: false,
        posting: false,
        httpStatus: 200,
        status: 'pending',
        entity: [{
            email: '',
        }],
        entityErrors: [{
            email: '',
        }]
    })

    let specificObject: any = StorageServices.getLocalStorage(STORAGE_KEYS.ENTITY_TYPE)
    let entityHash: any = StorageServices.getLocalStorage(STORAGE_KEYS.ENTITY_HASH)
    specificObject = JSON.parse(specificObject)

    const homeRoute: any = (
        commonRoutes.find(
            (routeName) => routeName.name === 'HOME_')
    )?.path

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
        let { entity } = state
        let { entityErrors } = state
        const { posting } = state

        if (!posting) {
            if (entity.length < specificObject.max) {
                entity = state.entity.concat([{
                    email: '',
                }])

                entityErrors = state.entityErrors.concat([{
                    email: '',
                }])

                setstate({
                    ...state, entity, entityErrors
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

    const onFormSubmitHandler = (e: any) => {
        e.preventDefault()
        let { posting } = state

        if (!posting) {
            setstate({
                ...state, posting: true
            })
            addMemeberToEntity()
        }
    }

    const addMemeberToEntity = async () => {
        let { entity } = state
        let { posting } = state
        let { httpStatus } = state
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
                let toastText = 'Invites sent out'

                toast.success(toastText, {
                    position: "top-right",
                    autoClose: 7000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } else {
                posting = false
                httpStatus = 500
            }
        } catch (error) {
            posting = false
            httpStatus = 500
        }

        setstate({
            ...state, posting, httpStatus
        })
    }

    return (
        <React.Fragment>
            <div className="wrapper w-full overflow-auto h-screen">
                <section className="gx-container h-screen rounded-md w-full flex items-center justify-center" style={CONFIG_MAX_WIDTH}>
                    <div className="flex md:flex-row flex-col align-middle items-center w-full md:pb-0 pb-10">
                        <div className="md:basis-3/5 md:px-6 px-8 w-full h-screen py-8">
                            <span className="text-2xl self-start text-amber-500 tracking-wider leading-7 block mb-2 md:pt-0 pt-4">{APPLICATION.NAME}</span>

                            <div className="flex flex-row w-full align-middle justitfy-between items-center md:hidden">
                                <div className="w-48 pt-4 mx-auto pb-3">
                                    <img src={completed} alt={"completed"} width="auto" className="block text-center m-auto" />
                                </div>
                            </div>

                            <div className="flex flex-row align-middle items-center gap-x-3 pt-2">
                                <span className="fa-duotone text-amber-600 fa-badge-check fa-lg"></span>

                                <span className="text-sm text-stone-500 md:text-start text-right block">
                                    Profile completed
                                </span>
                            </div>

                            <div className="w-full text-sm text-stone-600 float-right">
                                <span className="block py-4 text-xl md:text-2xl">
                                    Your request has been received!

                                    <span className="text-lg pt-4 text-stone-500 block">
                                        <span className="block pt-2">
                                            We'll review your request and approve your account within 3 business days.

                                            <span className="text-sm block pt-3 mt-3">
                                                In case of any issue, reach out to our admin at <span className="text-amber-600">admin@email.com</span>
                                            </span>
                                        </span>
                                    </span>
                                </span>
                            </div>

                            {
                                !entityHash && (
                                    specificObject && (
                                        specificObject.max > 1 ? (
                                            <div className="w-full pb-3 flex flex-col">
                                                {
                                                    state.show ? (
                                                        <>
                                                            {
                                                                state.httpStatus !== 200 ? (
                                                                    <>
                                                                        <div className="mb-2 bg-sky-00 py-1 md:px-4 border-2 border-red-300 border-dashed rounded-md">
                                                                            <div className="flex md:flex-row flex-col align-middle items-center text-red-700 px-2">
                                                                                <i className="fa-duotone fa-octagon-exclamation fa-2x mt-1 text-red-700 flex-none"></i>

                                                                                <div className="flex-auto ml-1 mt-1">
                                                                                    <span className="text-sm pl-3 block text-left py-2 text-red-700">
                                                                                        Error occurred when sending out invities to your members.

                                                                                        <span className="block">
                                                                                            Try again later
                                                                                        </span>
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </>
                                                                ) : null
                                                            }

                                                            <div className="w-full pb-6 border-y-2 border-dashed">
                                                                <span className="text-sm block text-stone-600 pt-4 pb-2">
                                                                    Extend personalized invitations via email to your members to join our community.
                                                                </span>

                                                                <form className="w-full md:w-2/3 block" onSubmit={onFormSubmitHandler}>
                                                                    {
                                                                        state.entity.map((contact: any, index: any) => {
                                                                            return (
                                                                                <div key={`KDE_${index}`} className="w-full py-3 flex flex-row align-middle items-center gap-x-3">
                                                                                    <div className="flex-grow">
                                                                                        <input type="text" name="email" id="entity-1-email" autoComplete="off" onChange={(e) => onChangeHandler(e, index)} className="focus:ring-1 w-full py-1.5 px-2.5 lowercase flex-1 block text-sm rounded-md sm:text-sm border border-gray-300 disabled:opacity-50 focus:ring-amber-600 focus:outline-amber-500" onBlur={(e) => onInputBlur(e, index)} placeholder={`member${index + 1}@email.com`} value={contact.email} />

                                                                                        {
                                                                                            state.entityErrors[index].email.length > 0 &&
                                                                                            <span className='invalid-feedback text-xs text-red-600 pl-0'>
                                                                                                {state.entityErrors[index].email}
                                                                                            </span>
                                                                                        }
                                                                                    </div>

                                                                                    {
                                                                                        index !== 0 ? (
                                                                                            <p className="text-red-500 flex-none text-sm cursor-pointer" onClick={() => removePointOfContactHandler(index)}>
                                                                                                Remove
                                                                                            </p>
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
                                                                            state.entity.length < (specificObject.max - 1) ? (
                                                                                <span className="text-blue-500 text-sm cursor-pointer" onClick={addPointOfContactHandler}>
                                                                                    Invite another member
                                                                                </span>
                                                                            ) : (
                                                                                null
                                                                            )
                                                                        }
                                                                    </div>

                                                                    <div className="mb-3 pt-3 px-0">
                                                                        <button className="bg-amber-600 float-right min-w-28 relative py-1.5 px-4 border border-transparent text-sm font-medium rounded-md text-white hover:bg-amber-700 focus:outline-none focus:ring-0 focus:ring-offset-2 focus:bg-amber-700" type="submit">
                                                                            {
                                                                                state.posting ? (
                                                                                    <i className="fad fa-spinner-third fa-xl fa-spin py-2.5"></i>
                                                                                ) : (
                                                                                    <div className="flex justify-center align-middle items-center gap-x-3">
                                                                                        <i className="fa-duotone fa-paper-plane fa-lg"></i>
                                                                                        Send Invite{state.entity.length > 1 ? 's' : null}
                                                                                    </div>
                                                                                )
                                                                            }
                                                                        </button>
                                                                    </div>
                                                                </form>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div className="flex flex-col md:flex-row align-middle items-center md:gap-x-3 border-b-2 border-dashed">
                                                            <div className="md:w-1/2 w-full">
                                                                <img src={invitation} alt={"invitation"} width="auto" className="block text-center m-auto" />
                                                            </div>

                                                            <div className="md:w-1/2">
                                                                <span className="text-sm block text-stone-600 my-4 pb-2">
                                                                    Extend personalized invitations via email to your members to join our community.
                                                                </span>

                                                                <span className="text-amber-600 text-sm block cursor-pointer py-1.5 text-end hover:text-amber-700 hover:underline" onClick={showOrHideEntityInv}>
                                                                    Invite to your members
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        ) : null
                                    )
                                )
                            }

                            <div className="mb-4 w-full flex flex-row-reverse py-4 px-3 md:px-0">
                                {
                                    state.posting ? (
                                        <button disabled={true} className="bg-amber-600 float-right min-w-28 relative py-1.5 px-4 border border-transparent text-sm font-medium rounded-md text-white hover:bg-amber-700 focus:outline-none focus:ring-0 focus:ring-offset-2 focus:bg-amber-700" type="submit">
                                            <div className="flex justify-center align-middle items-center gap-x-3">
                                                Take Me Home
                                            </div>
                                        </button>
                                    ) : (
                                        <Link to={homeRoute} className={classNames(
                                            "bg-amber-600 float-right min-w-28 relative py-1.5 px-4 border border-transparent text-sm font-medium rounded-md text-white hover:bg-amber-700 focus:outline-none focus:ring-0 focus:ring-offset-2 focus:bg-amber-700"
                                        )} tabIndex={1}>
                                            Take Me Home
                                        </Link>
                                    )
                                }
                            </div>

                            <div className="mx-auto py-3 text-center">
                                <p className="text-sm text-stone-500">
                                    © {new Date().getFullYear()}. Elevated Acts of Appreciation, <span className="text-amber-600 block">Tip by Tip.</span>
                                </p>
                            </div>
                        </div>

                        <div className="md:basis-2/5 hidden md:block h-screen px-4 py-8">
                            <img className="h-full bg-amber-100 rounded-2xl" src={completed} alt={"completed"} loading="lazy" />
                        </div>
                    </div>
                </section>
            </div>
        </React.Fragment>
    )
}