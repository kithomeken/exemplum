import Compressor from 'compressorjs';
import React, { useState } from "react"
import { useDispatch } from "react-redux"
import { Listbox } from "@headlessui/react"

import { AUTH } from "../../api/API_Registry"
import { useAppSelector } from "../../store/hooks"
import HttpServices from "../../services/HttpServices"
import { ListBoxZero } from "../../lib/hooks/ListBoxZero"
import { classNames } from "../../lib/modules/HelperFunctions"
import smallAsset from "../../assets/images/0e4537779b99b50a40a4c70b5acdf857.svg"
import { InputWithLoadingIcon } from "../../components/lib/InputWithLoadingIcon"
import { addIdentityToProfile, resetIdentity } from "../../store/identityCheckActions"
import { G_onInputBlurHandler, G_onInputChangeHandler } from "../../components/lib/InputHandlers"
import { CONFIG_MAX_WIDTH, APPLICATION } from '../../global/ConstantsRegistry';

export const Identity_01 = () => {
    const [state, setstate] = useState({
        keepName: true,
        input: {
            first_name: '',
            last_name: '',
            identifier: '',
            id_type: 'ID',
            docPhoto: null,
            docFile: null,
        },
        errors: {
            first_name: '',
            last_name: '',
            identifier: '',
            id_type: '',
            docPhoto: '',
            docFile: '',
        },
        identifier: {
            checking: false,
            exists: false
        }
    })

    React.useEffect(() => {
        preLoadCheck()
    }, [])

    const dispatch: any = useDispatch();
    const auth0: any = useAppSelector(state => state.auth0)
    const idC_State: any = useAppSelector(state => state.idC)

    const documentTypes = [
        { value: 'ID', name: "National ID" },
        { value: 'PP', name: "Passport Number" },
    ]

    const preLoadCheck = () => {
        let { keepName } = state
        keepName = auth0.provider === 'password' ? false : true

        dispatch(resetIdentity())

        setstate({
            ...state, keepName
        })
    }

    const keepOrChangeDisplayName = () => {
        if (!idC_State.processing) {
            setstate({
                ...state, keepName: !state.keepName
            })
        }
    }

    const onChangeHandler = (e: any) => {
        if (!idC_State.processing) {
            let output: any = G_onInputChangeHandler(e, idC_State.processing)
            let { input } = state
            let { errors }: any = state

            switch (e.target.name) {
                case 'identifier':
                    output.value = output.value.toUpperCase()
                    break;

                default:
                    break;
            }

            input[e.target.name] = output.value
            errors[e.target.name] = output.error

            setstate({
                ...state, input, errors
            })
        }
    }

    const onInputBlur = (e: any) => {
        if (!idC_State.processing) {
            let output: any = G_onInputBlurHandler(e, idC_State.processing, '')
            let { input } = state
            let { errors }: any = state

            switch (e.target.name) {
                case 'identifier':
                    let { identifier } = state
                    output.value = output.value.toUpperCase()

                    if (output.error.length > 1) {
                        identifier.checking = false
                        output.error = input.id_type === 'ID' ? 'National ID number cannot be empty' : 'Passport number cannot be empty';
                    } else {
                        if (state.input.id_type === 'ID') {
                            if (isNaN(output.value)) {
                                output.error = 'Kindly add a valid National ID number'
                            }
                        }

                        if (output.error.length < 1) {
                            identifier.checking = true
                            checkIdentifierAvailability()
                        }
                    }
                    break;

                default:
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
        let { input } = state
        let { errors } = state

        if (!idC_State.processing) {
            input.id_type = e
            input.identifier = ''
            errors.identifier = ''

            setstate({
                ...state, input, errors
            })
        }
    }

    const onFileChangeHandler = (e: any) => {
        if (!idC_State.processing) {
            let { input } = state
            let { errors } = state

            let fileSize = (e.target.files[0].size / 1024) / 1024
            let fileType = e.target.files[0].type
            errors[e.target.name] = ''

            if (fileType !== 'image/png' && fileType !== 'image/jpg' && fileType !== 'image/jpeg') {
                errors[e.target.name] = 'Allowed file types are png, jpg and jpeg files'
                input.docPhoto = null
                input.docFile = null

                setstate({
                    ...state, input, errors
                })

                return
            } else if (fileSize > 1) {
                errors[e.target.name] = 'Maximum file upload size is 1 MB'
                input.docPhoto = null
                input.docFile = null

                setstate({
                    ...state, input, errors
                })

                return
            }

            const uncompressedImage = e.target.files[0];
            new Compressor(uncompressedImage, {
                quality: 0.8, // 0.6 can also be used, but its not recommended to go below.
                success: (compressedResult) => {
                    // compressedResult has the compressed file.
                    // Use the compressed file to upload the images to your server.        
                    // setCompressedFile(res)
                    // console.log('COM34-31x', compressedResult);
                    input.docPhoto = compressedResult
                },
            });

            input.docFile = e.target.files[0].name
            errors[e.target.name] = ''

            setstate({
                ...state, input, errors
            })
        }
    }

    const checkIdentifierAvailability = async () => {
        let { identifier } = state
        let { errors } = state
        let { input } = state

        try {
            let formData = new FormData()
            formData.append('identifier', input.identifier)

            const identifierCheckResp: any = await HttpServices.httpPost(AUTH.PRE_META_01, formData)

            if (identifierCheckResp.data.available) {
                errors.identifier = ''
                identifier.exists = false
            } else {
                errors.identifier = input.id_type === 'ID' ? 'ID number already exists' : 'Passport number already exists';
                identifier.exists = true
            }
        } catch (error) {
            errors.identifier = input.id_type === 'ID' ? 'ID number already exists' : 'Passport number already exists';
            identifier.exists = true
        }

        identifier.checking = false

        setstate({
            ...state, identifier, errors
        })
    }

    function formValidation() {
        let valid = true;

        let { input } = state
        let { errors } = state
        let { keepName } = state
        let { identifier } = state

        if (!keepName) {
            if (!input.first_name.trim()) {
                errors.first_name = 'First name cannot be empty';
                valid = false
            }

            if (!input.last_name.trim()) {
                errors.last_name = 'Last name cannot be empty';
                valid = false
            }
        }

        if (!input.identifier.trim()) {
            errors.identifier = input.id_type === 'ID' ? 'ID number cannot be empty' : 'Passport number cannot be empty';
            valid = false
        }

        if (!input.docPhoto === null) {
            errors.docFile = 'Kindly upload ID/Passport photo'
            valid = false
        }

        if (identifier.exists) {
            errors.identifier = input.id_type === 'ID' ? 'ID number already exists' : 'Passport number already exists';
            valid = false
        }

        return valid
    }

    const onFormSubmitHandler = (e: any) => {
        e.preventDefault()

        if (!idC_State.processing) {
            let { identifier } = state

            if (!identifier.checking) {
                let validity = formValidation()

                if (validity) {
                    let identProps = null

                    if (state.keepName) {
                        identProps = {
                            dataDump: {
                                keepName: state.keepName,
                                id_type: state.input.id_type,
                                docPhoto: state.input.docPhoto,
                                identifier: state.input.identifier,
                                display_name: auth0.identity.display_name,
                            }
                        }
                    } else {
                        identProps = {
                            dataDump: {
                                keepName: state.keepName,
                                id_type: state.input.id_type,
                                docPhoto: state.input.docPhoto,
                                last_name: state.input.last_name,
                                first_name: state.input.first_name,
                                identifier: state.input.identifier,
                            }
                        }
                    }

                    dispatch(addIdentityToProfile(identProps))
                }
            }
        }
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
                                    <img src={smallAsset} alt={"hello_i'm_carol"} width="auto" className="block text-center m-auto" />
                                </div>
                            </div>

                            <div className="w-32 md:float-start float-right">
                                <div className="w-full py-4 grid grid-cols-3 gap-x-2">
                                    <div className="rounded-md h-2 shadow-lg bg-amber-600"></div>
                                    <div className="rounded-md h-2 shadow-lg bg-amber-400"></div>
                                    <div className="rounded-md h-2 shadow-lg bg-gray-300"></div>
                                </div>

                                <span className="text-sm text-stone-500 md:text-start text-right block">
                                    1 of 3
                                </span>
                            </div>

                            <div className={
                                classNames(
                                    "w-full text-sm text-stone-600 float-right mb-4",
                                    auth0.provider === 'google' && state.keepName ? "border-b-0" : "border-b-2 border-dashed"
                                )
                            }>
                                <span className="block py-4 text-xl md:text-2xl">
                                    Welcome aboard! We're excited to have you!

                                    <span className="text-sm pt-4 pb-2 text-stone-500 block">
                                        First things first, share some details about yourself...
                                    </span>
                                </span>
                            </div>

                            <div className="flex flex-col mb-3 w-full">
                                <form className="md:spac shadow-none mb-3" onSubmit={onFormSubmitHandler}>
                                    {
                                        auth0.provider === 'password' ? (
                                            <IdentityDisplayName
                                                state={state}
                                                onInputBlur={onInputBlur}
                                                onChangeHandler={onChangeHandler}
                                            />
                                        ) : (
                                            state.keepName ? (
                                                <div className="py-2 px-3 border-2 border-amber-300 border-dashed rounded-md mb-4">
                                                    <div className="flex flex-row align-middle justify-center items-center text-amber-700 px-2 gap-x-3 mt-2">
                                                        <img className="w-8 h-8" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo" />

                                                        <div className="flex-auto">
                                                            <span className="text-sm block text-gray-600">
                                                                We'll set your name to <span className="text-amber-600">{auth0.identity.display_name}</span> as provided by your Google sign-in.
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-row-reverse align-middle items-center text-amber-600 px-2">
                                                        <span onClick={keepOrChangeDisplayName} className="text-sm flex-none shadow-none py-2 md:py-1 bg-inherit hover:underline hover:cursor-pointer sm:w-auto sm:text-sm">
                                                            Change name
                                                        </span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="flex flex-row-reverse align-middle items-center text-amber-600 px-2">
                                                        <span onClick={keepOrChangeDisplayName} className="text-sm flex-none shadow-none py-1 mb-2 bg-inherit hover:underline hover:cursor-pointer sm:w-auto sm:text-sm">
                                                            Retain your name from Google sign-in
                                                        </span>
                                                    </div>

                                                    <IdentityDisplayName
                                                        state={state}
                                                        onInputBlur={onInputBlur}
                                                        onChangeHandler={onChangeHandler}
                                                    />
                                                </>
                                            )
                                        )
                                    }

                                    <div className="flex flex-col md:flex-row md:space-x-4 md:pt-1">
                                        <div className="w-full md:w-1/2 mb-3">
                                            <ListBoxZero
                                                onChangeListBoxHandler={(e: any) => onChangeListBoxHandler(e)}
                                                state={state}
                                                label="Document Type:"
                                                listButton={
                                                    <>
                                                        {documentTypes.map((document, key) => (
                                                            <span key={key}>
                                                                {
                                                                    state.input.id_type === document.value ? (
                                                                        <span className="flex items-center">
                                                                            <span className="ml-2 text-sm text-gray-700 truncate">{document.name}</span>
                                                                        </span>
                                                                    ) : null
                                                                }
                                                            </span>
                                                        ))}

                                                        <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                                            <i className="far fa-chevron-down text-emerald-500"></i>
                                                        </span>
                                                    </>
                                                }
                                                listOptions={
                                                    <>
                                                        {documentTypes.map((document, key) => (
                                                            <Listbox.Option
                                                                key={`DES-${key}`}
                                                                className={({ active }) =>
                                                                    classNames(
                                                                        active ? 'text-white bg-gray-100' : 'text-gray-900',
                                                                        'cursor-default select-none relative py-2 pl-3 pr-9'
                                                                    )
                                                                }
                                                                value={document.value}
                                                            >
                                                                {({ selected }) => (
                                                                    <>
                                                                        <span className="flex items-center">
                                                                            <span className="ml-2 text-sm text-gray-700 truncate">{document.name}</span>
                                                                        </span>

                                                                        {selected ? (
                                                                            <span className="text-purple-600 absolute inset-y-0 right-0 flex items-center pr-4">
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

                                        <div className="w-full md:w-1/2">
                                            <InputWithLoadingIcon
                                                name={'identifier'}
                                                label={state.input.id_type === 'ID' ? 'ID Number' : 'Passport Number'}
                                                placeHolder={state.input.id_type === 'ID' ? 'ID Number' : 'Passport Number'}
                                                onInputBlurHandler={onInputBlur}
                                                onChangeHandler={onChangeHandler}
                                                inputValue={state.input.identifier}
                                                errorsName={state.errors.identifier}
                                                checkForStatus={state.identifier.checking}
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-3 flex flex-col md:flex-row md:space-x-4 justify-center px-6 pt-4 pb-4 mb-3 border-2 border-stone-300 border-dashed rounded-md">
                                        <div className="text-center flex align-middle items-center">
                                            <svg
                                                className="mx-auto h-16 w-16 text-stone-400"
                                                stroke="currentColor"
                                                fill="none"
                                                viewBox="0 0 48 48"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                    strokeWidth={2}
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                            <div className="text-sm w-full ml-3 text-stone-600">
                                                <label
                                                    htmlFor="file-upload"
                                                    className="relative cursor-pointer rounded bg-white text-amber-600 hover:text-amber-700 focus:outline-none focus-within:outline-none "
                                                >
                                                    <span>
                                                        {
                                                            state.input.id_type === 'ID' ? 'Upload National ID Photo' : 'Upload Passport Photo'
                                                        }
                                                    </span>
                                                    <input id="file-upload" name="docPhoto" required type="file" onChange={(e) => onFileChangeHandler(e)} className="sr-only" />
                                                </label>
                                                <p className="pl-1"></p>
                                                <p className="text-xs text-stone-500">png, jpg, jpeg up to 1MB</p>
                                            </div>
                                        </div>
                                    </div>

                                    {
                                        state.input.docFile && (
                                            <div className="w-full">
                                                <span className="text-gray-500 block mb-1 text-xs w-full">
                                                    File Name:
                                                </span>

                                                <span className="text-slate-600 block text-xs w-full">
                                                    <span className="fad fa-file mr-2"></span>
                                                    {state.input.docFile}
                                                </span>
                                            </div>
                                        )
                                    }

                                    {
                                        state.errors.docPhoto.length > 0 ? (
                                            <span className='invalid-feedback text-xs text-red-600 pl-0'>
                                                {state.errors.docPhoto}
                                            </span>
                                        ) : null
                                    }

                                    <div className="mb-3 pt-3 px-3 md:px-0">
                                        <button className="bg-amber-600 float-right relative w-28 py-1.5 px-4 border border-transparent text-sm font-medium rounded-md text-white hover:bg-amber-700 focus:outline-none focus:ring-0 focus:ring-offset-2 focus:bg-amber-700" type="submit">
                                            {
                                                idC_State.processing ? (
                                                    <i className="fad fa-spinner-third fa-xl fa-spin py-2.5"></i>
                                                ) : (
                                                    <div className="flex justify-center align-middle items-center gap-x-3">
                                                        Next
                                                        <i className="fa-duotone fa-arrow-right fa-lg"></i>
                                                    </div>
                                                )
                                            }
                                        </button>
                                    </div>
                                </form>
                            </div>

                            <div className="mx-auto py-3 text-center">
                                <p className="text-sm text-stone-500">
                                    © {new Date().getFullYear()}. Elevated Acts of Appreciation, <span className="text-amber-600 block">Tip by Tip.</span>
                                </p>
                            </div>
                        </div>

                        <div className="md:basis-2/5 hidden md:block h-screen px-4 py-8">
                            <img className="h-full bg-amber-100 rounded-2xl" src={smallAsset} alt={"hello_i'm_carol"} loading="lazy" />
                        </div>
                    </div>
                </section>
            </div>
        </React.Fragment>
    )
}

const IdentityDisplayName = ({
    state, onChangeHandler, onInputBlur
}) => {

    return (
        <React.Fragment>
            <div className="md:mb-2 flex flex-col md:flex-row md:space-x-4 pt-1">
                <div className="w-full md:w-1/2 mb-3">
                    <label htmlFor="first_name" className="block text-sm leading-6 text-stone-600 mb-1">First Name:</label>

                    <div className="relative mt-2 rounded shadow-sm">
                        <input type="text" name="first_name" id="first_name" placeholder="First Name" autoComplete="off"
                            className={classNames(
                                state.errors.first_name.length > 0 ?
                                    'text-red-900 ring-slate-300 placeholder:text-red-400 focus:ring-red-600 border border-red-600 focus:outline-red-500' :
                                    'text-stone-900 ring-slate-300 placeholder:text-stone-400 focus:border-0 focus:outline-none focus:ring-amber-600 focus:outline-amber-500 hover:border-stone-400 border border-stone-300',
                                'block w-full rounded-md py-2 pl-3 pr-8  text-sm'
                            )} onChange={onChangeHandler} value={state.input.first_name} onBlur={onInputBlur} required />
                        <div className="absolute inset-y-0 right-0 flex items-center w-8">
                            {
                                state.errors.first_name.length > 0 ? (
                                    <span className="fa-duotone text-red-500 fa-circle-exclamation fa-lg"></span>
                                ) : null
                            }
                        </div>
                    </div>

                    {
                        state.errors.first_name.length > 0 ? (
                            <span className='invalid-feedback text-xs text-red-600 pl-0'>
                                {state.errors.first_name}
                            </span>
                        ) : null
                    }
                </div>

                <div className="w-full md:w-1/2 mb-3">
                    <label htmlFor="last_name" className="block text-sm leading-6 text-stone-700 mb-1">Last Name:</label>

                    <div className="relative mt-2 rounded shadow-sm">
                        <input type="text" name="last_name" id="last_name" placeholder="Last Name" autoComplete="off"
                            className={classNames(
                                state.errors.last_name.length > 0 ?
                                    'text-red-900 ring-slate-300 placeholder:text-red-400 focus:ring-red-600 border border-red-600 focus:outline-red-500' :
                                    'text-stone-900 ring-slate-300 placeholder:text-stone-400 focus:border-0 focus:outline-none focus:ring-amber-600 focus:outline-amber-500 hover:border-stone-400 border border-stone-300',
                                'block w-full rounded-md py-2 pl-3 pr-8  text-sm'
                            )} onChange={onChangeHandler} value={state.input.last_name} onBlur={onInputBlur} required />
                        <div className="absolute inset-y-0 right-0 flex items-center w-8">
                            {
                                state.errors.last_name.length > 0 ? (
                                    <span className="fa-duotone text-red-500 fa-circle-exclamation fa-lg"></span>
                                ) : null
                            }
                        </div>
                    </div>

                    {
                        state.errors.last_name.length > 0 ? (
                            <span className='invalid-feedback text-xs text-red-600 pl-0'>
                                {state.errors.last_name}
                            </span>
                        ) : null
                    }
                </div>
            </div>
        </React.Fragment>
    )
}