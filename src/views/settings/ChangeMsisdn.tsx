import { toast } from "react-toastify"
import { useDispatch } from "react-redux"
import React, { FC, useState } from "react"
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input'

import { ACCOUNT } from "../../api/API_Registry"
import { useAppSelector } from "../../store/hooks"
import HttpServices from "../../services/HttpServices"
import { DynamicModal } from "../../lib/hooks/DynamicModal"
import { Basic_Modal_Props } from "../../lib/modules/Interfaces"
import { AUTH_, STORAGE_KEYS } from "../../global/ConstantsRegistry"
import { readDecryptAndParseLS, encryptAndStoreLS } from "../../lib/modules/HelperFunctions"

export const ChangeMsisdn: FC<Basic_Modal_Props> = ({ reload, show, showOrHide }) => {
    const [state, setstate] = useState({
        data: null,
        posting: false,
        status: 'fulfilled',
        input: {
            msisdn: '',
        },
        errors: {
            msisdn: '',
        },
        modal: {
            errorTitle: '',
            errorMessage: '',
        },
    })

    const dispatch: any = useDispatch();
    const auth0: any = useAppSelector(state => state.auth0)

    const onPhoneInputChange = (e: any) => {
        let { posting } = state

        if (!posting) {
            let { input } = state
            input.msisdn = e

            setstate({
                ...state, input
            })
        }
    }

    const onPhoneInputBlur = (e: any) => {
        let { posting } = state

        if (!posting) {
            let { errors } = state
            const validPhone = isValidPhoneNumber(e.target.value)

            if (!validPhone) {
                errors.msisdn = 'Kindly add a valid phone number'
            } else {
                errors.msisdn = ''
            }

            setstate({
                ...state, errors
            })
        }
    }

    const onFormSubmitHandler = (e: any) => {
        e.preventDefault()
        let { input } = state
        let { errors } = state
        let { posting } = state

        if (!posting) {
            let validPhone = isValidPhoneNumber(input.msisdn)

            if (validPhone) {
                if (auth0.identity.msisdn === input.msisdn) {
                    errors.msisdn = "Please enter a different phone number than the one currently in use."

                    setstate({
                        ...state, errors
                    })

                    return
                }

                errors.msisdn = ''
                posting = true

                setstate({
                    ...state, posting
                })

                updateEntityMsisdn()
            }
        }
    }

    const updateEntityMsisdn = async () => {
        let { modal } = state
        let { input } = state
        let { status } = state
        let { errors } = state

        try {
            let formData = new FormData()
            formData.append('msisdn', input.msisdn)

            const response: any = await HttpServices.httpPost(ACCOUNT.MSISDN_CHANGE, formData)

            if (response.data.success) {
                // Update Redux State
                dispatch({
                    type: AUTH_.ID_META_02,
                    response: {
                        msisdn: input.msisdn
                    },
                });

                // Update Storage data dump
                let idenityData = readDecryptAndParseLS(STORAGE_KEYS.ACCOUNT_DATA)
                idenityData.msisdn = input.msisdn

                toast.success("Your appointed number has been updated", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

                setstate({
                    ...state, input: {
                        msisdn: ''
                    }
                })

                encryptAndStoreLS(STORAGE_KEYS.ACCOUNT_DATA, idenityData)
                showOrHide()
                reload()
            } else {
                const errorsMsg = response.data.msisdn[0]
                errors.msisdn = errorsMsg.replace('msisdn', 'phone number')
            }
        } catch (error) {
            status = 'rejected'
            modal.errorTitle = "Oops! Something Went Wrong"
            modal.errorMessage = "We're experiencing some technical difficulties. Please try again later..."
        }

        setstate({
            ...state, posting: false, modal
        })
    }

    return (
        <React.Fragment>
            <DynamicModal
                show={show}
                size={"sm"}
                status={state.status}
                posting={state.posting}
                title={'Change Phone Number'}
                showOrHideModal={showOrHide}
                actionButton={"Change"}
                error={{
                    title: state.modal.errorTitle,
                    message: state.modal.errorMessage
                }}
                onFormSubmitHandler={onFormSubmitHandler}
                formComponents={
                    <>
                        <span className="text-sm pb-4 block text-stone-600">
                            Please enter your new phone number below to update your contact information.
                        </span>

                        <div className="w-full mb-4">
                            <label htmlFor="msisdn" className="block text-sm leading-6 text-gray-500 mb-2">Phone Number:</label>

                            <div className="flex flex-row align-middle items-center gap-x-4">
                                <div className="flex-grow">
                                    <PhoneInput
                                        international
                                        defaultCountry='KE'
                                        className="border border-gray-300 px-3 py-1 rounded"
                                        placeholder="Enter phone number"
                                        value={state.input.msisdn}
                                        onChange={onPhoneInputChange}
                                        onBlur={onPhoneInputBlur}
                                        error={state.input.msisdn ? (isValidPhoneNumber(state.input.msisdn) ? undefined : 'Invalid phone number') : 'Phone number required'}
                                    />
                                </div>
                            </div>

                            {
                                state.errors.msisdn.length > 0 &&
                                <span className='invalid-feedback text-xs text-red-600 pl-0'>
                                    {state.errors.msisdn}
                                </span>
                            }
                        </div>
                    </>
                }
            />
        </React.Fragment>
    )
}