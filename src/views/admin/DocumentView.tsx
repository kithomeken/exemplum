import React, { FC, Fragment, useState } from "react"
import { Transition, Dialog } from "@headlessui/react"

import { FQDN } from "../../api/API_Controller"
import { Loading } from "../../components/modules/Loading"
import { Basic_Modal_Props } from "../../lib/modules/Interfaces"

export const DocumentView: FC<Basic_Modal_Props> = ({ show, showOrHide, uuid }) => {
    const [isLoading, setIsLoading] = useState(true);
    const size = 'lg'

    const handleImageLoaded = () => {
        setIsLoading(false);
    };

    return (
        <React.Fragment>
            <Transition.Root show={show} as={Fragment}>
                <Dialog as="div" className="fixed z-30 inset-0 overflow-y-auto" onClose={showOrHide}>
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0 bg-slate-500 bg-opacity-75 transition-opacity" />
                        </Transition.Child>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                            &#8203;
                        </span>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <div className={`inline-block align-bottom bg-white sm:max-w-${size} rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:w-full`}>
                                <div className="bg-white pt-5 pb-4 sm:py-6 sm:pb-4">
                                    <div className="w-full">
                                        <div className="sm:col-span-8 lg:col-span-7 mb-3 px-4 sm:px-6">
                                            <h2 className="text-xl text-orange-600">
                                                Document View
                                            </h2>
                                        </div>

                                        <div className="w-full max-h-96 overflow-y-auto px-0 sm:px-0">
                                            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                                {
                                                    isLoading && (
                                                        <div className="w-full h-full flex flex-col justify-center">
                                                            <div className="flex-grow">
                                                                <Loading />
                                                            </div>
                                                        </div>
                                                    )
                                                }

                                                <img className="rounded-md max-w-full h-56" src={`${FQDN}/files/documents/${uuid}`} alt={uuid}
                                                    onLoad={handleImageLoaded}
                                                    style={{ display: isLoading ? 'none' : 'block', width: '100%', height: 'auto' }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-100 px-4 py-4 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <div className="w-full space-y-px">
                                        <div className="flex flex-row-reverse items-center align-middle">
                                            <button type="button" className="w-24 justify-center disabled:cursor-not-allowed text-sm rounded-md border border-transparent shadow-sm px-3 py-1-5 bg-orange-600 text-white disabled:bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-0 focus:ring-offset-2 focus:ring-orange-500" onClick={showOrHide}>
                                                Close
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>
        </React.Fragment>
    )
}