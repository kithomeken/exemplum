import { Link } from "react-router-dom"
import React, { FC, useState } from "react"

import { FQDN } from "../../api/API_Controller"
import { Doc_Details_Props } from "../../lib/modules/Interfaces"

export const DocumentDetails: FC<Doc_Details_Props> = ({ docs }) => {
    const [state, setstate] = useState({
        status: 'pending',
        show: false
    })

    return (
        <React.Fragment>
            <p className="text-sm mb-3 text-amber-600">
                Documents Details
            </p>

            <div className="w-full">
                <div className="flex flex-row w-full lg:w-12/12 mb-2">
                    <div className="basis-2/5 text-stone-500">
                        <span className="py-1 block">
                            <span className="hidden md:inline-block">Document Type:</span>
                            <span className="md:hidden">Doc Type:</span>
                        </span>
                    </div>

                    <div className="basis-3/5 text-stone-700">
                        <span className="text-sm py-1 block capitalize">
                            {
                                docs.type === 'ID' ? (
                                    <span>National Identification</span>
                                ) : (
                                    <span>Passport Document</span>
                                )
                            }
                        </span>
                    </div>
                </div>

                <div className="flex flex-row w-full lg:w-12/12 mb-2">
                    <div className="basis-2/5 text-stone-500">
                        <span className="py-1 block">
                            <span className="hidden md:inline-block">{docs.type === 'ID' ? 'ID Number' : 'Passport Number'}:</span>
                            <span className="md:hidden">{docs.type === 'ID' ? 'ID Number' : 'Passport Number'}:</span>
                        </span>
                    </div>

                    <div className="basis-3/5 text-stone-700">
                        <span className="text-sm py-1 block capitalize">
                            {docs.identifier}
                        </span>
                    </div>
                </div>

                <div className="mb-2 bg-amber-00 py-2 px-4 border-2 border-stone-300 border-dashed rounded-md">
                    <div className="flex flex-row align-middle items-center text-amber-700 px-2">
                        <i className="fa-duotone fa-image fa-2x mt-1 text-amber-900 flex-none"></i>

                        <div className="flex-auto ml-1 mt-1">
                            <span className="text-sm pl-3 block text-amber-900">
                                {docs.path}
                            </span>

                            <span className="text-sm pl-3 block text-stone-500">
                                {
                                    docs.type === 'ID' ? (
                                        <span>National ID</span>
                                    ) : (
                                        <span>Passport</span>
                                    )
                                }
                                <Link to={`${FQDN}/files/documents/${docs.path}`} target="_blank" className="text-right hover:cursor-pointer hover:underline float-right text-amber-600">View</Link>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}