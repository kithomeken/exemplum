import React, { FC } from "react"
import { useDispatch } from "react-redux";
import { TECollapse } from "tw-elements-react"

import { overridePRc0MetaStage } from "../../store/identityCheckActions";

interface props {
    types: any,
    entity: any,
    activeElement: any,
}

export const AccordionEntity: FC<props> = ({ activeElement, entity, types }) => {
    const [state, setstate] = React.useState({
        modify: false,
        input: {
            bio: '',
            entity: '',
            artist_name: '',
            artist_type: entity.type,
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

    const dispatch: any = useDispatch();

    const modifyEntityDetails = () => {
        const props = {
            dataDump: {
                stage: 'META_03',
                data: {
                    bio: entity.bio,
                    max: entity.max,
                    type: entity.type,
                    artist: entity.artist,
                    entity: entity.entity,
                    description: entity.description,
                },
            },
        }

        dispatch(overridePRc0MetaStage(props))
    }

    return (
        <React.Fragment>
            <TECollapse show={activeElement === "entity"} className="!mt-0 !rounded-b-none !shadow-none">
                <div className="pb-4">
                    <div className="flex flex-col">
                        <div className="px-4 sm:px-0">
                            <p className="mt-1 max-w-2xl text-sm leading-6 text-stone-500">
                                Review the details below to ensure all information is accurate:
                            </p>
                        </div>

                        <div className="mt-3 border-t-0 border-stone-100">
                            <dl className="divide-y divide-stone-100">
                                <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                    <dt className="text-sm font-medium leading-6 text-stone-900">Entity Type:</dt>

                                    {
                                        state.modify ? (
                                            <>
                                            </>
                                        ) : (
                                            <dd className="mt-1 text-sm leading-6 text-stone-700 sm:col-span-2 sm:mt-0">{entity.description}</dd>
                                        )
                                    }
                                </div>

                                {
                                    entity.max > 1 ? (
                                        <>
                                            <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                                <dt className="text-sm font-medium leading-6 text-stone-900">Entity Name:</dt>

                                                {
                                                    state.modify ? (
                                                        <>
                                                        </>
                                                    ) : (
                                                        <dd className="mt-1 text-sm leading-6 text-stone-700 sm:col-span-2 sm:mt-0">{entity.entity}</dd>
                                                    )
                                                }
                                            </div>
                                        </>
                                    ) : null
                                }

                                <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                    <dt className="text-sm font-medium leading-6 text-stone-900">Artist Name:</dt>

                                    {
                                        state.modify ? (
                                            <>
                                            </>
                                        ) : (
                                            <dd className="mt-1 text-sm leading-6 text-stone-700 sm:col-span-2 sm:mt-0">{entity.artist}</dd>
                                        )
                                    }
                                </div>

                                <div className="px-4 py-3 sm:gap-4 sm:px-0">
                                    <dt className="text-sm font-medium leading-6 text-stone-900 pb-2 block">
                                        Bio:
                                    </dt>

                                    {
                                        state.modify ? (
                                            <>
                                            </>
                                        ) : (
                                            <dd className="mt-2 text-sm text-stone-900 sm:col-span-2 sm:mt-0">
                                                <p className="mt-2 pb-2 text-gray-700" style={{ whiteSpace: 'pre-wrap' }}>
                                                    {entity.bio}
                                                </p>
                                            </dd>
                                        )
                                    }

                                </div>
                            </dl>
                        </div>

                        <div className="px-4 sm:gap-4 sm:px-0">
                            <button onClick={() => modifyEntityDetails()} className="text-orange-600 float-right relative min-w-28 text-sm hover:text-orange-700 focus:outline-none focus:ring-0 focus:ring-offset-2 focus:text-orange-700 disabled:cursor-not-allowed disabled:bg-orange-400" type="button">
                                Modify Entity Details
                            </button>
                        </div>
                    </div>
                </div>
            </TECollapse>
        </React.Fragment>
    )
}