import { toast } from "react-toastify"
import { FC, Fragment, useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'

interface Props {
    show: any,
    title: any,
    details: any,
    iconClass: any,
    showOrHide: any,
    actionEvent: any,
    isPostingForm: any,
    actionButton: string,
}

export const ActionModal: FC<Props> = ({ show, title, details, showOrHide, isPostingForm, actionButton, actionEvent, iconClass}) => {
    const checkIfFormIsPostingData = () => {
        if (!isPostingForm) {
            showOrHide()
            return
        }

        // Prevent dismissing if the form is positing data
        let toastText = 'Cannot dismiss as the current operation is still in progress'

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
            <Dialog as="div" className="fixed z-50 inset-0 overflow-y-auto" onClose={checkIfFormIsPostingData}>
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
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
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <span className={`${iconClass} text-red-600`}></span>
                                    </div>

                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        {
                                            title.length > 1 ? (
                                                <Dialog.Title as="h3" className="text-lg leading-6 mb-2 text-red-600">
                                                    {title}
                                                </Dialog.Title>
                                            ) : null
                                        }

                                        <div className="text-sm text-slate-700 pb-3">
                                            {details}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-100 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <div className="w-12/12 space-y-px">
                                    <div className="flex flex-row-reverse items-center align-middle">
                                        <button type="button" className="w-full inline-flex justify-center text-sm rounded-md border-0 border-transparent shadow-none px-3 py-1 bg-inherit text-red-600 hover:text-red-800 sm:ml-3 sm:w-auto sm:text-sm" onClick={checkIfFormIsPostingData}>
                                            Cancel
                                        </button>

                                        {
                                            isPostingForm ? (
                                                <button type="button" className="w-full inline-flex cursor-not-allowed justify-center text-sm rounded-md border border-transparent shadow-sm px-3 py-1 bg-red-600 text-white sm:ml-3 sm:w-auto sm:text-sm disabled:bg-red-600" disabled={true}>
                                                    <span>
                                                        <span className="left-0 inset-y-0 flex items-center">
                                                            <span className="w-5 h-5">
                                                                <i className="fad fa-spinner-third fa-lg fa-spin"></i>
                                                            </span>
                                                        </span>
                                                    </span>
                                                </button>
                                            ) : (
                                                <button type="button" onClick={actionEvent} className="w-full inline-flex justify-center text-sm rounded-md border border-transparent shadow-sm px-3 py-1 bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-0 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
                                                    {actionButton}
                                                </button>
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    )
}