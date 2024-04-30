import { toast } from "react-toastify"
import { useDispatch } from "react-redux"
import React, { FC, useState } from "react"
import { updateProfile } from "@firebase/auth"

import { ACCOUNT } from "../../api/API_Registry"
import HttpServices from "../../services/HttpServices"
import { DynamicModal } from "../../lib/hooks/DynamicModal"
import { AUTH_, STORAGE_KEYS } from "../../global/ConstantsRegistry"
import { firebaseAuth } from "../../firebase/firebaseConfigs"
import { Basic_Modal_Props } from "../../lib/modules/Interfaces"
import { G_onInputChangeHandler, G_onInputBlurHandler } from "../../components/lib/InputHandlers"
import { classNames, encryptAndStoreLS, nameValidator, readDecryptAndParseLS } from "../../lib/modules/HelperFunctions"

export const UpdateDisplayName: FC<Basic_Modal_Props> = ({ reload, show, showOrHide }) => {
    const [state, setstate] = useState({
        data: null,
        posting: false,
        status: 'fulfilled',
        input: {
            first_name: '',
            last_name: '',
        },
        errors: {
            first_name: '',
            last_name: '',
        },
        modal: {
            errorTitle: '',
            errorMessage: '',
        },
    })

    const dispatch: any = useDispatch();

    React.useEffect(() => {
        if (show) {
            setDisplayNameFromStorage()
        }
    }, [show])

    const setDisplayNameFromStorage = () => {
        let idenityData = readDecryptAndParseLS(STORAGE_KEYS.ACCOUNT_DATA)
        let displayArray = idenityData.display_name.split(" ")

        let { input } = state
        input.first_name = displayArray.slice(0, -1);
        input.last_name = displayArray[displayArray.length - 1]

        setstate({
            ...state, input,  status: 'fulfilled',
            modal: {
                errorTitle: '',
                errorMessage: '',
            }
        })
    }

    const onChangeHandler = (e: any) => {
        if (!state.posting) {
            let output: any = G_onInputChangeHandler(e, state.posting)
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
        if (!state.posting) {
            let output: any = G_onInputBlurHandler(e, state.posting, '')
            let { input } = state
            let { errors }: any = state

            input[e.target.name] = output.value
            errors[e.target.name] = output.error

            setstate({
                ...state, input, errors
            })
        }
    }

    function formValidation() {
        let valid = true;
        let { input } = state
        let { errors } = state

        if (!input.first_name.trim()) {
            errors.first_name = 'First name cannot be empty';
            valid = false
        }

        if (!input.last_name.trim()) {
            errors.last_name = 'Last name cannot be empty';
            valid = false
        }

        if (input.first_name.length < 3) {
            errors.first_name = 'First name cannot be less than 3 characters'
            valid = false
        } else if (input.first_name.length > 30) {
            errors.first_name = 'First name cannot be more than 30 characters'
            valid = false
        } else {
            /* 
             * Validate name details
             * Set first character to upper case
            */
            input.first_name = input.first_name.charAt(0).toUpperCase() + input.first_name.slice(1)

            let isValidName = nameValidator(input.first_name)

            if (!isValidName) {
                errors.first_name = 'Please provide a valid first name'
                valid = false
            }
        }

        if (input.last_name.length < 3) {
            errors.last_name = 'Last name cannot be less than 3 characters'
            valid = false
        } else if (input.last_name.length > 30) {
            errors.last_name = 'Last name cannot be more than 30 characters'
            valid = false
        } else {
            /* 
             * Validate name details
             * Set first character to upper case
            */
            input.last_name = input.last_name.charAt(0).toUpperCase() + input.last_name.slice(1)

            let isValidName = nameValidator(input.last_name)

            if (!isValidName) {
                errors.last_name = 'Please provide a valid last name'
                valid = false
            }
        }

        setstate({
            ...state, errors
        })

        return valid
    }

    const onFormSubmitHandler = (e: any) => {
        e.preventDefault()
        let { posting } = state

        if (!posting) {
            let passedValidation = formValidation()

            if (passedValidation) {
                setstate({
                    ...state, posting: true
                })

                updateFirebaseDisplayName()
            }
        }
    }

    const updateFirebaseDisplayName = () => {
        let { input } = state
        let { modal } = state
        let { status } = state
        let display_name = input.first_name + ' ' + input.last_name

        updateProfile(firebaseAuth.currentUser, {
            displayName: display_name
        }).then(async () => {
            let formData = new FormData()
            const firebaseUser: any = firebaseAuth.currentUser
            formData.append('accessToken', firebaseUser.accessToken)

            try {
                const response: any = await HttpServices.httpPost(ACCOUNT.DSPLY_NAME_CHANGE, formData)

                if (response.data.success) {
                    // Update Redux State
                    dispatch({
                        type: AUTH_.ID_META_01,
                        response: {
                            first_name: input.first_name,
                            last_name: input.last_name
                        },
                    });

                    toast.success("Profile name has been updated", {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });

                    // Update Storage data dump
                    let idenityData = readDecryptAndParseLS(STORAGE_KEYS.ACCOUNT_DATA)
                    idenityData.display_name = display_name
                    encryptAndStoreLS(STORAGE_KEYS.ACCOUNT_DATA, idenityData)

                    showOrHide()
                } else {
                    status = 'rejected'
                    modal.errorTitle = "Oops! Something Went Wrong"
                    modal.errorMessage = "We're experiencing some technical difficulties. Please try again later..."
                }
            } catch (error) {
                status = 'rejected'
                modal.errorTitle = "Oops! Something Went Wrong"
                modal.errorMessage = "We're experiencing some technical difficulties. Please try again later..."
            }

            setstate({
                ...state, modal, status, posting: false
            })
        }).catch((error) => {
            status = 'rejected'
            modal.errorTitle = "Oops! Something Went Wrong"
            modal.errorMessage = "We're experiencing some technical difficulties. Please try again later..."

            setstate({
                ...state, modal, status, posting: false
            })
        });
    }

    return (
        <React.Fragment>
            <DynamicModal
                show={show}
                size={"sm"}
                status={state.status}
                posting={state.posting}
                title={'Update Profile Name'}
                showOrHideModal={showOrHide}
                actionButton={"Update"}
                error={{
                    title: state.modal.errorTitle,
                    message: state.modal.errorMessage
                }}
                onFormSubmitHandler={onFormSubmitHandler}
                formComponents={
                    <>
                        <span className="text-sm pb-4 block text-stone-600">
                            Please enter your new name below to update your profile.
                        </span>

                        <div className="md:mb-2 flex flex-col md:flex-col md:space-y-2 pt-1">
                            <div className="w-full mb-3">
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

                            <div className="w-full mb-3">
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
                    </>
                }
            />
        </React.Fragment>
    )
}