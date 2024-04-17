/* This example requires Tailwind CSS v2.0+ */
import { FC, Fragment, useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'

import { classNames } from '../modules/HelperFunctions'

interface Props {
    show: any,
    title: any,
    details: any,
    showOrHide: any,
    size: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl',
}

export const InformationalModal: FC<Props> = ({ title, details, show, showOrHide, size }) => {
    return (
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
                        <div
                            className={
                                classNames(
                                    size === 'sm' ? 'sm:max-w-sm' : null,
                                    size === 'md' ? 'sm:max-w-md' : null,
                                    size === 'lg' ? 'sm:max-w-lg' : null,
                                    size === 'xl' ? 'sm:max-w-xl' : null,
                                    size === '2xl' ? 'sm:max-w-2xl' : null,
                                    size === '3xl' ? 'sm:max-w-3xl' : null,
                                    size === '4xl' ? 'sm:max-w-4xl' : null,
                                    size === '5xl' ? 'sm:max-w-5xl' : null,
                                    size === '6xl' ? 'sm:max-w-6xl' : null,
                                    'inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:w-full'
                                )
                            }>
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="flex flex-row items-center align-middle pb-3 w-full gap-x-4">
                                    <div className="flex-none flex items-center justify-center h-12 w-12 rounded-full bg-amber-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <span className="fal fa-info-circle fa-2x text-amber-600"></span>
                                    </div>

                                    <div className="text-center sm:mt-0 sm:text-left">
                                        {
                                            title.length > 1 ? (
                                                <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                                                    {title}
                                                </Dialog.Title>
                                            ) : null
                                        }
                                    </div>
                                </div>

                                <div className="w-full max-h-96 overflow-y-auto px-4 sm:px-6">
                                    {details}
                                </div>
                            </div>
                            <div className="bg-gray-100 px-4 py-3 sm:px-6 flex flex-row-reverse">
                                <button type="button" className="w-1/2 inline-flex justify-center text-sm rounded-md border border-transparent shadow-sm px-3 py-1 bg-amber-600 font-medium text-white hover:bg-amber-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm" onClick={showOrHide}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    )
}
