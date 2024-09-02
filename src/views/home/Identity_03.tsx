import React, { useState } from "react"
import { useDispatch } from "react-redux"
import { Listbox } from "@headlessui/react"

import { AUTH } from "../../api/API_Registry"
import { useAppSelector } from "../../store/hooks"
import HttpServices from "../../services/HttpServices"
import { ListBoxZero } from "../../lib/hooks/ListBoxZero"
import { Loading } from "../../components/modules/Loading"
import { classNames } from "../../lib/modules/HelperFunctions"
import { CONFIG_MAX_WIDTH, APPLICATION } from "../../global/ConstantsRegistry"
import { InputWithLoadingIcon } from "../../components/lib/InputWithLoadingIcon"
import artisticForm from "../../assets/images/7e33b86cfb1293b8c7a101e9b1011e5d.svg"
import { artistEntityCreation, resetIdentity } from "../../store/identityCheckActions"
import { G_onInputBlurHandler, G_onInputChangeHandler } from "../../components/lib/InputHandlers"

export const Identity_03 = () => {
    const [state, setstate] = useState({
        status: 'pending',
        selectedType: null,
        data: {
            artistTypes: null,
            entity: null,
        },
        input: {
            bio: '',
            entity: '',
            artist_name: '',
            artist_type: 'SOLO',
        },
        errors: {
            bio: '',
            entity: '',
            artist_name: '',
            artist_type: '',
        },
        artist_name: {
            checking: false,
            exists: false
        },
        entity: {
            checking: false,
            exists: false
        }
    })

    React.useEffect(() => {
        dispatch(resetIdentity())
        fetchArtistTypeData()
    }, [])

    const dispatch: any = useDispatch();
    const auth0: any = useAppSelector(state => state.auth0)
    const idC_State: any = useAppSelector(state => state.idC)

    const fetchArtistTypeData = async () => {
        let { selectedType } = state
        let { status } = state
        let { input } = state
        let { data } = state

        try {
            const typesResponse: any = await HttpServices.httpGet(AUTH.ARTIST_TYPES)

            if (typesResponse.data.success) {
                status = 'fulfilled'
                data.artistTypes = typesResponse.data.payload.types
                data.entity = typesResponse.data.payload.entity

                if (data.entity !== null) {
                    input.artist_type = data.entity.type
                    input.entity = data.entity.name
                }

                selectedType = data.artistTypes.find(
                    (type: { key: string }) => type.key === "SOLO"
                )
            } else {
                status = 'rejected'
            }
        } catch (error) {
            console.log(error);

            status = 'rejected'
        }

        setstate({
            ...state, status, data, input, selectedType
        })
    }

    const targetLength = (name: string) => {
        switch (name) {
            case 'entity':
            case 'artist_name':
                return {
                    min: 2,
                    max: 20
                };

            case 'bio':
                return {
                    min: 150,
                    max: 500
                };

            default:
                return {
                    min: 5,
                    max: 30
                };
        }
    }

    const onChangeHandler = (e: any) => {
        if (!idC_State.processing) {
            let output: any = G_onInputChangeHandler(e, idC_State.processing)
            let { input } = state
            let { errors }: any = state

            input[e.target.name] = output.value
            errors[e.target.name] = output.error

            setstate({
                ...state, input, errors
            })
        }
    }

    const onInputBlur = (e: any) => {
        if (!idC_State.processing) {
            const target0 = targetLength(e.target.name)
            let output: any = G_onInputBlurHandler(e, idC_State.processing, '', target0.min, target0.max)

            let { input } = state
            let { errors }: any = state

            switch (e.target.name) {
                case 'artist_name':
                    if (output.error === '') {
                        let { artist_name } = state
                        artist_name.checking = true

                        checkArtistAvailability()
                    } else {
                        let { artist_name } = state
                        artist_name.checking = false
                    }
                    break;

                case 'entity':
                    if (output.error === '') {
                        let { entity } = state
                        entity.checking = true

                        checkEntityAvailability()
                    } else {
                        let { entity } = state
                        entity.checking = false
                    }
                    break;

                default:
                    output.error = output.error.replace('Bio', 'Your bio')
                    break;
            }

            input[e.target.name] = output.value
            errors[e.target.name] = output.error

            setstate({
                ...state, input, errors
            })
        }
    }

    const onChangeListBoxHandler = (e: any) => {
        let { data } = state
        let { input } = state
        let { selectedType } = state

        input.artist_type = e

        selectedType = data.artistTypes.find(
            (type: { key: string }) => type.key === e
        )

        setstate({
            ...state, input, selectedType
        })
    }

    const checkArtistAvailability = async () => {
        let { artist_name } = state
        let { errors } = state

        try {
            let { input } = state

            let formData = new FormData()
            formData.append('artist_name', input.artist_name)

            const responsecheck: any = await HttpServices.httpPost(AUTH.PRE_META_03, formData)

            if (responsecheck.data.available) {
                errors.artist_name = ''
                artist_name.exists = false
            } else {
                errors.artist_name = 'Artist name already exists'
                artist_name.exists = true
            }
        } catch (error) {
            errors.artist_name = 'Artist name already exists'
            artist_name.exists = true
        }

        artist_name.checking = false

        setstate({
            ...state, artist_name, errors
        })
    }

    const checkEntityAvailability = async () => {
        let { entity } = state
        let { errors } = state

        try {
            let { input } = state

            let formData = new FormData()
            formData.append('entity', input.entity)

            const responseCheck: any = await HttpServices.httpPost(AUTH.PRE_META_E, formData)

            if (responseCheck.data.available) {
                errors.entity = ''
                entity.exists = false
            } else {
                errors.entity = 'Band/Group name already exists'
                entity.exists = true
            }
        } catch (error) {
            errors.entity = 'Band/Group name already exists'
            entity.exists = true
        }

        entity.checking = false

        setstate({
            ...state, entity, errors
        })
    }

    const artistEntityFormHandler = (e: any) => {
        e.preventDefault()
        let { input } = state

        if (!idC_State.processing) {
            const specificObject = state.data.artistTypes.find(
                (item: { key: string }) => item.key === state.input.artist_type
            );

            let entity = parseInt(specificObject.max) > 1 ? state.input.entity : state.input.artist_name

            const identProps = {
                dataDump: {
                    artist: input.artist_name,
                    type: input.artist_type,
                    bio: input.bio,
                    entity: entity,
                    specificObject: JSON.stringify(specificObject),
                }
            }

            dispatch(artistEntityCreation(identProps))
        }
    }

    const getMaxMembersForEntity = () => {
        let { data } = state
        let { input } = state

        const categoryType = data.artistTypes.find((category: any) => category.key === input.artist_type)
        return categoryType ? categoryType.max : 0
    }

    return (
        <React.Fragment>
            <div className="wrapper md:align-middle align-baseline w-full overflow-auto md:h-screen h-auto">
                <section className="gx-container md:h-screen rounded-md w-full flex items-center justify-center" style={CONFIG_MAX_WIDTH}>
                    <div className="flex md:flex-row flex-col align-middle items-center w-full md:pb-0 pb-10">
                        <div className="md:basis-3/5 md:px-6 px-8 w-full py-6 overflow-auto">
                            <span className="text-2xl self-start text-orange-500 tracking-wider leading-7 block mb-2 md:pt-0 pt-4">{APPLICATION.NAME}</span>

                            <div className="flex flex-row w-full align-middle justitfy-between items-center md:hidden">
                                <div className="w-48 pt-4 mx-auto pb-3">
                                    <img src={artisticForm} alt={"i_am_an_artist"} width="auto" className="block text-center m-auto" />
                                </div>
                            </div>

                            <div className="w-32 md:float-start float-right">
                                <div className="w-full py-4 grid grid-cols-3 gap-x-2">
                                    <div className="rounded-md h-2 shadow-lg bg-orange-600"></div>
                                    <div className="rounded-md h-2 shadow-lg bg-orange-600"></div>
                                    <div className="rounded-md h-2 shadow-lg bg-orange-600"></div>
                                </div>

                                <span className="text-sm text-stone-500 md:text-start text-right block">
                                    3 of 3
                                </span>
                            </div>

                            <div className="w-full text-sm text-stone-600 float-right">
                                <span className="block py-4 text-xl md:text-2xl">
                                    Who is <span className="text-orange-600">{auth0.identity.display_name.split(' ')[1]}</span> as an artist?

                                    <span className="text-sm pt-4 pb-2 text-stone-500 block">
                                        Wrap up your artist profile and step into a world of possibilities
                                    </span>
                                </span>
                            </div>

                            {
                                state.status === 'rejected' ? (
                                    <></>
                                ) : state.status === 'fulfilled' ? (
                                    <div className="flex flex-col w-full mb-4">
                                        {
                                            state.data.entity && (
                                                <>
                                                    <div className="w-full mb-4">
                                                        <span className="block text-stone-700 pb-3">
                                                            You've already been included as a member on:
                                                        </span>

                                                        <div className="w-full grid grid-cols-3 gap-x-3 pb-2">
                                                            <div className="col-span-1">
                                                                <span className="block text-sm text-stone-600">
                                                                    Artist Type:
                                                                </span>
                                                            </div>

                                                            <div className="col-span-2">
                                                                <span className="block text-sm text-orange-600">
                                                                    {state.data.entity.description}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="w-full grid grid-cols-3 gap-x-3 pb-2">
                                                            <div className="col-span-1">
                                                                <span className="block text-sm text-stone-600">
                                                                    Group Name:
                                                                </span>
                                                            </div>

                                                            <div className="col-span-2">
                                                                <span className="block text-sm text-orange-600">
                                                                    {state.data.entity.name}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="py-2 px-3 border-2 border-orange-300 border-dashed rounded-md mb-4 w-full">
                                                        <div className="flex flex-row align-middle justify-center items-center text-orange-700 px-2 gap-x-3">
                                                            <span className="fa-duotone fa-info-circle fa-2x"></span>

                                                            <div className="flex-auto">
                                                                <span className="text-sm block text-gray-600">

                                                                    <span className="block py-2">
                                                                        Please note that the above aspects of your artist profile data are fixed and cannot be changed.
                                                                    </span>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            )
                                        }

                                        <form className="space-y-4 mb-3 w-full text-sm" onSubmit={artistEntityFormHandler}>
                                            {
                                                !state.data.entity && (
                                                    <>
                                                        <div className="w-full pb-2 md:px-0">
                                                            <ListBoxZero
                                                                onChangeListBoxHandler={(e: any) => onChangeListBoxHandler(e)}
                                                                state={state}
                                                                label="Artist Type:"
                                                                listButton={
                                                                    <>
                                                                        {state.data.artistTypes.map((artistType: any, index: any) => (
                                                                            <span key={`kP${artistType.key}YxL7Zu`}>
                                                                                {
                                                                                    state.input.artist_type === artistType.key ? (
                                                                                        <span className="flex items-center py-0.5">
                                                                                            <span className="ml-2 text-sm text-gray-700 truncate">{artistType.value}</span>
                                                                                        </span>
                                                                                    ) : null
                                                                                }
                                                                            </span>
                                                                        ))}

                                                                        <span className="ml-3 w-6 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                                                            <i className="far fa-chevron-down text-emerald-500"></i>
                                                                        </span>
                                                                    </>
                                                                }
                                                                listOptions={
                                                                    <>
                                                                        {state.data.artistTypes.map((artistType: any, index: any) => (
                                                                            <Listbox.Option
                                                                                key={`28LbWz${index}XqFp`}
                                                                                className={({ active }) =>
                                                                                    classNames(
                                                                                        active ? 'text-white bg-gray-100' : 'text-gray-900',
                                                                                        'cursor-default select-none relative py-2 pl-3 pr-9'
                                                                                    )
                                                                                }
                                                                                value={artistType.key}
                                                                            >
                                                                                {({ selected }) => (
                                                                                    <>
                                                                                        <span className="flex items-center">
                                                                                            <span className="ml-2 text-sm text-gray-700 truncate">{artistType.value}</span>
                                                                                        </span>

                                                                                        {selected ? (
                                                                                            <span className="text-orange-600 absolute inset-y-0 right-0 flex items-center pr-4">
                                                                                                <i className="fad fa-check h-5 w-5"></i>
                                                                                            </span>
                                                                                        ) : null}
                                                                                    </>
                                                                                )}
                                                                            </Listbox.Option>
                                                                        ))}
                                                                    </>
                                                                }
                                                            />
                                                        </div>

                                                        {
                                                            getMaxMembersForEntity() > 1 ? (
                                                                <div className="shadow-none space-y-px mb-4 ">
                                                                    <label htmlFor="entity" className="block text-sm leading-6 text-stone-600 mb-1">
                                                                        {
                                                                            (state.data.artistTypes.find(
                                                                                (typeValue: any) => typeValue.key === state.input.artist_type)
                                                                            )?.value
                                                                        } Name:
                                                                    </label>

                                                                    <div className="relative mt-2 rounded shadow-sm">
                                                                        <input type="text" name="entity" id="entity" placeholder="Name" autoComplete="off"
                                                                            className={classNames(
                                                                                state.errors.entity.length > 0 ?
                                                                                    'text-red-900 ring-slate-300 placeholder:text-red-400 focus:ring-red-600 border border-red-600 focus:outline-red-500' :
                                                                                    'text-stone-900 ring-slate-300 placeholder:text-stone-400 focus:border-0 focus:outline-none focus:ring-orange-600 focus:outline-orange-500 hover:border-stone-400 border border-stone-300',
                                                                                'block w-full rounded-md py-2 pl-3 pr-8  text-sm'
                                                                            )} onChange={onChangeHandler} value={state.input.entity} onBlur={onInputBlur} required />
                                                                        <div className="absolute inset-y-0 right-0 flex items-center w-8">
                                                                            {
                                                                                state.entity.checking ? (
                                                                                    <span className="fa-duotone text-orange-500 fa-spinner-third fa-lg fa-spin"></span>
                                                                                ) : state.errors.entity.length > 0 ? (
                                                                                    <span className="fa-duotone text-red-500 fa-circle-exclamation fa-lg"></span>
                                                                                ) : null
                                                                            }
                                                                        </div>
                                                                    </div>

                                                                    {
                                                                        state.errors.entity.length > 0 ? (
                                                                            <span className='invalid-feedback text-xs text-red-600 pl-0'>
                                                                                {state.errors.entity}
                                                                            </span>
                                                                        ) : null
                                                                    }
                                                                </div>
                                                            ) : null
                                                        }
                                                    </>
                                                )
                                            }

                                            <div className="shadow-none space-y-px mb-4 ">
                                                <InputWithLoadingIcon
                                                    name={'artist_name'}
                                                    label={`${getMaxMembersForEntity() > 1 ? 'My ' : ''} Artist Name`}
                                                    placeHolder={'Artist name'}
                                                    onInputBlurHandler={onInputBlur}
                                                    onChangeHandler={onChangeHandler}
                                                    inputValue={state.input.artist_name}
                                                    errorsName={state.errors.artist_name}
                                                    checkForStatus={state.artist_name.checking}
                                                />
                                            </div>

                                            {
                                                !state.data.entity && (
                                                    <div className="w-full ">
                                                        <div className="relative rounded">
                                                            <label htmlFor="description" className="block text-sm leading-6 text-stone-600 mb-1">
                                                                {
                                                                    state.selectedType.max === 1 ? (
                                                                        'Share a bit about yourself and your journey:'
                                                                    ) : (
                                                                        'Share a bit about your ' + state.selectedType.value + ':'
                                                                    )
                                                                }
                                                            </label>

                                                            <textarea name="bio" id="bio" placeholder="Let your fans know who you are" autoComplete="off" rows={4} cols={1}
                                                                className={classNames(
                                                                    state.errors.bio.length > 0 ?
                                                                        'text-red-900 ring-slate-300 placeholder:text-red-400 focus:ring-red-600 focus:outline-red-500 hover:border-red-400 border border-red-300' :
                                                                        'text-gray-900 ring-slate-300 placeholder:text-gray-400 focus:ring-orange-600 focus:outline-orange-500 hover:border-stone-400 border border-stone-300',
                                                                    'block w-full rounded-md py-2 pl-3 pr-8 border border-gray-300 resize-none text-sm focus:outline-none disabled:cursor-not-allowed focus:border-0'
                                                                )} onChange={onChangeHandler} disabled={idC_State.processing} value={state.input.bio} onBlur={onInputBlur} required />
                                                            <div className="absolute inset-y-0 right-0 flex items-center w-8">
                                                                {
                                                                    state.errors.bio.length > 0 ? (
                                                                        <span className="fa-duotone text-red-500 fa-circle-exclamation fa-lg"></span>
                                                                    ) : null
                                                                }
                                                            </div>
                                                        </div>

                                                        <div className="w-full">
                                                            <div className="w-full flex flex-col-reverse md:flex-row-reverse py-1">
                                                                <div className="flex-1">
                                                                    {
                                                                        state.errors.bio.length > 0 ? (
                                                                            <span className='invalid-feedback text-xs text-red-600 pl-0 float-start'>
                                                                                {state.errors.bio}
                                                                            </span>
                                                                        ) : null
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            }

                                            <div className="mb-3 pt-3 px-0">
                                                <button className="bg-orange-600 float-right relative w-28 py-1.5 px-4 border border-transparent text-sm rounded-md text-white hover:bg-orange-700 focus:outline-none focus:ring-0 focus:ring-offset-2 focus:bg-orange-700" type="submit">
                                                    {
                                                        idC_State.processing ? (
                                                            <i className="fad fa-spinner-third fa-xl fa-spin py-2.5"></i>
                                                        ) : (
                                                            <div className="flex justify-center align-middle items-center gap-x-3">
                                                                Complete
                                                                <i className="fa-duotone fa-circle-check fa-lg"></i>
                                                            </div>
                                                        )
                                                    }
                                                </button>
                                            </div>
                                        </form>

                                        <div className="mx-auto py-3 text-center">
                                            <p className="text-sm text-stone-500">
                                                © {new Date().getFullYear()}. Elevated Acts of Appreciation, <span className="text-orange-600 block">Tip by Tip.</span>
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full h-1/2 flex flex-col justify-center">
                                        <div className="flex-grow pt-8">
                                            <Loading />
                                        </div>
                                    </div>
                                )
                            }
                        </div>

                        <div className="md:basis-2/5 hidden md:block h-screen px-4 py-6">
                            <img className="h-full bg-orange-100 rounded-2xl" src={artisticForm} alt={"i_am_an_artist"} loading="lazy" />
                        </div>
                    </div>
                </section>
            </div>
        </React.Fragment>
    )
}