import React, { FC, useState } from "react"
import PhoneInput from 'react-phone-number-input'

import { ACCOUNT } from "../../api/API_Registry"
import HttpServices from "../../services/HttpServices"
import { DynamicModal } from "../../lib/hooks/DynamicModal"
import { classNames } from "../../lib/modules/HelperFunctions"
import { G_onInputChangeHandler } from "../../components/lib/InputHandlers"

interface props {
    reload: any,
    show: boolean,
    showOrHide: any,
}

export const MemberNominations: FC<props> = ({ reload, show, showOrHide }) => {
    const [state, setstate] = useState({
        show: false,
        posting: false,
        status: 'pending',
        data: {
            members: null
        },
        input: {
            member: '',
        },
        errors: {
            member: '',
        },
        modal: {
            errorTitle: '',
            errorMessage: '',
        },
    })

    React.useEffect(() => {
        if (show) {
            potentialMembersNomination()
        }
    }, [show])

    const emptyOnChangeHandler = () => { }

    const potentialMembersNomination = async () => {
        setstate({
            ...state, status: 'pending'
        })

        let { data } = state
        let { modal } = state
        let { status } = state

        try {
            const response: any = await HttpServices.httpGet(ACCOUNT.MEMBER_NOMINTATION)

            if (response.data.success) {
                status = 'fulfilled'
                data.members = response.data.payload.members
            } else {
                status = 'rejected'
                modal.errorTitle = 'Could not process request'
                modal.errorMessage = response.data.error.message
            }
        } catch (error) {
            status = 'rejected'
            modal.errorTitle = "Oops! Something Went Wrong"
            modal.errorMessage = "We're sorry, but we're experiencing some technical difficulties. Please try again later..."
        }

        setstate({
            ...state, status, data, posting: false, modal,
            input: { member: '' },
            errors: { member: '' },
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

    const formValidation = () => {
        let valid = true
        let { input } = state
        let { errors } = state

        if (input.member.length < 1) {
            errors.member = 'Kindly select a member to nominated'
            valid = false
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
            const valid = formValidation()

            if (valid) {
                posting = true

                setstate({
                    ...state, posting
                })

                nominatePotentialMember()
            }
        }
    }

    const nominatePotentialMember = async () => {
        let { modal } = state
        let { input } = state
        let { posting } = state

        try {
            let formData = new FormData()
            formData.append('member', input.member)

            const nominationResponse: any = await HttpServices.httpPost(ACCOUNT.MEMBER_NOMINTATION, formData)

            if (nominationResponse.data.success) {
                showOrHide()
                reload()
            } else {
                modal.errorTitle = 'Could not process request'
                modal.errorMessage = nominationResponse.data.error.message
            }
        } catch (error) {
            modal.errorTitle = "Oops! Something Went Wrong"
            modal.errorMessage = "We're sorry, but we're experiencing some technical difficulties. Please try again later..."
        }

        posting = false

        setstate({
            ...state, posting, modal
        })
    }

    return (
        <React.Fragment>
            <DynamicModal
                show={show}
                size={"md"}
                status={state.status}
                posting={state.posting}
                title={'Nominate Member'}
                showOrHideModal={showOrHide}
                actionButton={"Nominate Member"}
                error={{
                    title: state.modal.errorTitle,
                    message: state.modal.errorMessage
                }}
                onFormSubmitHandler={onFormSubmitHandler}
                formComponents={
                    <>
                        {
                            state.status === 'fulfilled' ? (
                                <>
                                    <span className="text-sm pb-4 block text-stone-600">
                                        Select a member to nominate:
                                    </span>

                                    <div className="w-full pb-3">
                                        {
                                            state.data.members.map((member: any) => {
                                                return (
                                                    <div className="w-full" key={member.uuid}>
                                                        <label htmlFor={`member-${member.uuid}`} className="text-gray-600 bg-inherit cursor-pointer hover:bg-gray-100 hover:text-gray-800 flex w-full rounded-md">
                                                            <div className={classNames(
                                                                state.input.member === member.uuid ?
                                                                    'bg-inherit text-green-600 border-green-600 peer-checked:bg-inherit' :
                                                                    'text-gray-600 bg-inherit cursor-pointer hover:bg-gray-200 hover:text-gray-800',
                                                                'flex md:flex-row rounded-md text-sm flex-col gap-y-1 py-1 md:py-2 w-full md:gap-x-3 align-middle md:items-center px-4 border'
                                                            )}>
                                                                <div className="basis-2/3">
                                                                    <span className="md:py-2 block text-stone-700 whitespace-nowrap">
                                                                        {member.display_name}
                                                                    </span>
                                                                </div>

                                                                <div className="basis-1/3 text-stone-500 whitespace-nowrap">
                                                                    <PhoneInput
                                                                        international
                                                                        readOnly={true}
                                                                        disabled={true}
                                                                        defaultCountry="KE"
                                                                        onChange={emptyOnChangeHandler}
                                                                        value={member.msisdn}
                                                                    />
                                                                </div>

                                                                <input type="radio" onChange={onChangeHandler} id={`member-${member.uuid}`} name="member" checked={state.input.member === member.uuid ? true : false} value={member.uuid} className="checked:bg-orange-500  peer" />
                                                            </div>
                                                        </label>
                                                    </div>
                                                )
                                            })
                                        }

                                        {
                                            state.errors.member.length > 0 ? (
                                                <span className='invalid-feedback text-xs text-red-600 py-1 block'>
                                                    {state.errors.member}
                                                </span>
                                            ) : null
                                        }
                                    </div>
                                </>
                            ) : null
                        }
                    </>
                }
            />
        </React.Fragment>
    )
}