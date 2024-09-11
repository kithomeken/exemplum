import { toast } from "react-toastify"
import React, { FC, Fragment } from "react"
import { Transition, Dialog } from "@headlessui/react"

import { Loading } from "../../components/modules/Loading"
import { CommsBreakdown } from "../../views/errors/CommsBreakdown"

interface Props {
    size: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl',
    title: any,
    status: any,
    show: boolean,
    posting: boolean,
    noAction?: boolean,
    formComponents: any,
    showOrHideModal: any,
    actionButton: string,
    onFormSubmitHandler: any,
    error?: {
        title: string,
        message: any,
    },
}

export const DynamicModal: FC<Props> = ({ show, size, showOrHideModal, title, onFormSubmitHandler, posting, formComponents, actionButton, status, error, noAction = false }) => {    
    const checkIfFormIsPostingData = () => {
        if (!posting) {
            showOrHideModal()
            return
        }

        // Prevent dismissing if the form is positing data
        let toastText = 'Cannot dismiss. Current operation is still in progress'

        toast.warning(toastText, {
            position: "top-right",
            autoClose: 7000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }

    return (
        <Transition.Root show={show} as={Fragment}>
            <Dialog as="div" className="fixed z-30 inset-0 overflow-y-auto" onClose={checkIfFormIsPostingData}>
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
                            {
                                // For items that pre load data
                                status === 'rejected' ? (
                                    <div className="">
                                        {
                                            error !== undefined ? (
                                                <>
                                                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                                        <div className="sm:flex sm:items-start">
                                                            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                                                <span className="fal fa-exclamation-circle fa-2x text-red-600"></span>
                                                            </div>
                                                            <div className="mt-3 text-center text-slate-600 sm:mt-0 sm:ml-4 sm:text-left">
                                                                <span className="text-red-500 pb-4 pt-2 block">
                                                                    {error.title}
                                                                </span>

                                                                <div className="text-sm leading-7 mb-4">
                                                                    {error.message}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="bg-slate-100 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                                        <button
                                                            type="button"
                                                            onClick={checkIfFormIsPostingData}
                                                            className="w-full inline-flex justify-center text-sm rounded-md border border-transparent shadow-sm px-3 py-1 bg-red-600 text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm">
                                                            Close
                                                        </button>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <CommsBreakdown />

                                                    <div className="bg-slate-100 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                                        <div className="w-12/12 space-y-px">
                                                            <div className="flex flex-row-reverse items-center align-middle">
                                                                <button type="button" className="w-full inline-flex justify-center text-sm rounded-md border-0 border-transparent shadow-none px-3 py-1 bg-inherit text-slate-600 hover:bg-slate-200 sm:ml-3 sm:w-auto sm:text-sm" onClick={checkIfFormIsPostingData}>
                                                                    Cancel
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            )
                                        }

                                    </div>
                                ) : status === 'fulfilled' ? (
                                    <form className="rounded-md shadow-none space-y-px" onSubmit={onFormSubmitHandler}>
                                        <div className="bg-white pt-5 pb-4 sm:py-6 sm:pb-4">
                                            <div className="w-full">
                                                <div className="sm:col-span-8 lg:col-span-7 mb-3 px-4 sm:px-6">
                                                    <h2 className="text-xl text-orange-600">
                                                        {title}
                                                    </h2>
                                                </div>

                                                <div className="w-full max-h-96 overflow-y-auto px-4 sm:px-6">
                                                    {
                                                        formComponents
                                                    }
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-slate-100 px-4 py-4 sm:px-6 sm:flex sm:flex-row-reverse">
                                            <div className="w-full space-y-px">
                                                <div className="flex flex-row-reverse items-center align-middle">
                                                    {
                                                        noAction ? (
                                                            <button type="button" className="w-24 justify-center disabled:cursor-not-allowed text-sm rounded-md border border-transparent shadow-sm px-3 py-1-5 bg-orange-600 text-white disabled:bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-0 focus:ring-offset-2 focus:ring-orange-500" onClick={showOrHideModal}>
                                                                Done
                                                            </button>
                                                        ) : (
                                                            <>
                                                                <button type="submit" className="w-auto min-w-24 justify-center disabled:cursor-not-allowed text-sm rounded-md border border-transparent shadow-sm px-3 py-1-5 bg-orange-600 text-white disabled:bg-orange-600 hover:bg-orange-700 focus:outline-none" disabled={posting}>
                                                                    {
                                                                        posting ? (
                                                                            <span className="flex flex-row items-center h-5 justify-center">
                                                                                <i className="fad fa-spinner-third fa-xl fa-spin"></i>
                                                                            </span>
                                                                        ) : (
                                                                            actionButton
                                                                        )
                                                                    }
                                                                </button>

                                                                <span className="text-sm flex-none shadow-none px-3 py-1 bg-inherit text-slate-600 hover:underline hover:cursor-pointer mr-2 sm:w-auto sm:text-sm" onClick={checkIfFormIsPostingData}>
                                                                    Cancel
                                                                </span>
                                                            </>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="py-2 px-6">
                                        <Loading />
                                    </div>
                                )
                            }
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    )
}