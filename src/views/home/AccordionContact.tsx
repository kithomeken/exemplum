import React, { FC } from "react"
import { useDispatch } from "react-redux";
import { TECollapse } from "tw-elements-react"
import PhoneInput from 'react-phone-number-input'

import { overridePRc0MetaStage } from "../../store/identityCheckActions";

interface props {
    persona: any,
    activeElement: any,
}

export const AccordionContact: FC<props> = ({ activeElement, persona }) => {
    const dispatch: any = useDispatch();
    const emptyOnChangeHandler = () => { }

    const modifyContactDetails = () => {
        const props = {
            dataDump: {
                stage: 'META_02',
            },
        }

        dispatch(overridePRc0MetaStage(props))
    }

    return (
        <React.Fragment>
            <TECollapse show={activeElement === "contact"} className="!mt-0 !rounded-b-none !shadow-none">
                <div className="pb-4">
                    <div className="flex flex-col">
                        <div className="px-4 sm:px-0">
                            <p className="mt-1 max-w-2xl text-sm leading-6 text-stone-500">
                                Review the details below to ensure all information is accurate:
                            </p>
                        </div>

                        <div className="mt-6 border-t border-stone-100">
                            <dl className="divide-y divide-stone-100">
                                <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                    <dt className="text-sm font-medium leading-6 text-stone-900">Phone Number:</dt>
                                    <dd className="mt-1 text-sm leading-6 text-stone-700 sm:col-span-2 sm:mt-0">
                                        <PhoneInput
                                            international
                                            readOnly={true}
                                            disabled={true}
                                            defaultCountry="KE"
                                            onChange={emptyOnChangeHandler}
                                            value={persona.msisdn}
                                        />
                                    </dd>
                                </div>
                            </dl>
                        </div>

                        <div className="px-4 sm:gap-4 sm:px-0">
                            <button onClick={() => modifyContactDetails()} className="text-orange-600 float-right relative min-w-28 text-sm rounded-md bg-white hover:text-orange-700 focus:outline-none focus:ring-0 focus:ring-offset-2 focus:text-orange-700 disabled:cursor-not-allowed disabled:bg-orange-400" type="button">
                                Modify Contact Detail
                            </button>
                        </div>
                    </div>
                </div>
            </TECollapse>
        </React.Fragment>
    )
}