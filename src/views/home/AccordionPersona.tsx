import React, { FC } from "react"
import { useDispatch } from "react-redux"
import { TECollapse } from "tw-elements-react"

import { DocumentView } from "../admin/DocumentView"
import { overridePRc0MetaStage } from "../../store/identityCheckActions"

interface props {
    persona: any,
    attachment: any,
    activeElement: any,
}

export const AccordionPersona: FC<props> = ({ activeElement, persona, attachment }) => {
    const [state, setstate] = React.useState({
        show: false
    })

    const dispatch: any = useDispatch();

    const showOrHideUploadedDocument = () => {
        let { show } = state
        show = !state.show

        setstate({
            ...state, show
        })
    }

    const modifyPersonaDetails = () => {
        const props = {
            dataDump: {
                stage: 'META_01',
                data: {
                    type: attachment.type,
                    path: attachment.path,
                    file_name: attachment.file_name,
                    provider_id: persona.provider_id,
                    identifier: attachment.identifier,
                    display_name: persona.display_name,
                    preferred_name: persona.preferred_name,
                },
            },
        }

        dispatch(overridePRc0MetaStage(props))
    }

    return (
        <React.Fragment>
            <TECollapse show={activeElement === "persona"} className="!mt-0 !rounded-b-none !shadow-none">
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
                                    <dt className="text-sm font-medium leading-6 text-stone-900">Full names:</dt>
                                    <dd className="mt-1 text-sm leading-6 text-stone-700 sm:col-span-2 sm:mt-0">{persona.display_name}</dd>
                                </div>

                                <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                    <dt className="text-sm font-medium leading-6 text-stone-900">
                                        {attachment.type === 'ID' ? 'National ID' : 'Passport Number'}:
                                    </dt>

                                    <dd className="mt-1 text-sm leading-6 text-stone-700 sm:col-span-2 sm:mt-0">
                                        {attachment.identifier}
                                    </dd>
                                </div>

                                <div className="px-4 py-3 sm:gap-4 sm:px-0">
                                    <dt className="text-sm font-medium leading-6 text-stone-900 pb-3.5 block">
                                        Uploaded {attachment.type === 'ID' ? 'National ID' : 'Passport'}:
                                    </dt>

                                    <dd className="mt-2 text-sm text-stone-900 sm:col-span-2 sm:mt-0">
                                        <ul role="list" className="divide-y divide-stone-100 rounded-md border border-stone-200">
                                            <li className="flex md:flex-row flex-col items-center md:justify-between py-4 pl-4 pr-5 text-sm leading-6">
                                                <div className="flex md:w-0 w-full flex-1 md:items-center">
                                                    <svg className="h-5 w-5 flex-shrink-0 text-stone-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                        <path fillRule="evenodd" d="M15.621 4.379a3 3 0 00-4.242 0l-7 7a3 3 0 004.241 4.243h.001l.497-.5a.75.75 0 011.064 1.057l-.498.501-.002.002a4.5 4.5 0 01-6.364-6.364l7-7a4.5 4.5 0 016.368 6.36l-3.455 3.553A2.625 2.625 0 119.52 9.52l3.45-3.451a.75.75 0 111.061 1.06l-3.45 3.451a1.125 1.125 0 001.587 1.595l3.454-3.553a3 3 0 000-4.242z" clipRule="evenodd" />
                                                    </svg>

                                                    <div className="ml-4 flex min-w-0 flex-1 gap-2">
                                                        <span className="truncate text-stone-600 font-medim">{attachment.file_name}</span>
                                                    </div>
                                                </div>

                                                <div className="ml-4 flex-shrink-0">
                                                    <button onClick={showOrHideUploadedDocument} type="button" className="font-medium text-orange-600 hover:text-orange-500">
                                                        View
                                                    </button>
                                                </div>
                                            </li>
                                        </ul>
                                    </dd>
                                </div>
                            </dl>
                        </div>

                        <div className="px-4 sm:gap-4 sm:px-0">
                            <button onClick={() => modifyPersonaDetails()} className="text-orange-600 float-right relative min-w-28 text-sm rounded-md bg-white hover:text-orange-700 focus:outline-none focus:ring-0 focus:ring-offset-2 focus:text-orange-700 disabled:cursor-not-allowed disabled:bg-orange-400" type="button">
                                Modify Personal Details
                            </button>
                        </div>
                    </div>
                </div>
            </TECollapse>

            <DocumentView
                show={state.show}
                uuid={attachment.path}
                showOrHide={showOrHideUploadedDocument}
            />
        </React.Fragment>
    )
}