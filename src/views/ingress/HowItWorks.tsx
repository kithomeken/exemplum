import React from "react"

import scanQR from "../../assets/images/B5NqjNJMbOBL08O1A.svg"
import amount from "../../assets/images/CjvPVsM4P9gl66J9A.svg"
import sendMessage from "../../assets/images/5X2sN118N4oSRytxF.svg"
import paymentMethod from "../../assets/images/9KVyGIRJtaUcEo5jw.svg"

export const HowItWorks = () => {

    return (
        <React.Fragment>
            <div className="w-full px-3 pb-4 text-gray-600">
                <div className="mx-auto py-3 container md:text-xl text-base md:max-w-4xl lg:max-w-4xl xl:max-w-5xl flex flex-col">
                    <h2 className="font-heading mb-3 lg:text-3xl mt-2 text-2xl font-bold tracking-tight text-orange-600 sm:text-3xl">
                        How it Works
                    </h2>

                    <p className="mb-6 leading-8 text-gray-700">
                        Show your appreciation in just 3 simple steps.
                    </p>

                    <div className="mx-auto">
                        <div className="flex">
                            <div className="mr-4 flex flex-col items-center">
                                <div>
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-orange-700"><svg
                                        xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                        className="h-6 w-6 text-orange-700">
                                        <path d="M12 5l0 14"></path>
                                        <path d="M18 13l-6 6"></path>
                                        <path d="M6 13l6 6"></path>
                                    </svg></div>
                                </div>
                                <div className="h-full w-px bg-gray-300"></div>
                            </div>
                            <div className="pt-1 pb-8">
                                <p className="mb-2 text-xl font-bold text-gray-900">
                                    Step 1
                                </p>

                                <p className="text-gray-600">
                                    Scan QR code or search creator by name
                                </p>
                            </div>
                        </div>

                        <div className="flex">
                            <div className="mr-4 flex flex-col items-center">
                                <div>
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-orange-700"><svg
                                        xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                        className="h-6 w-6 text-orange-700">
                                        <path d="M12 5l0 14"></path>
                                        <path d="M18 13l-6 6"></path>
                                        <path d="M6 13l6 6"></path>
                                    </svg></div>
                                </div>
                                <div className="h-full w-px bg-gray-300"></div>
                            </div>
                            <div className="pt-1 pb-8">
                                <p className="mb-2 text-xl font-bold text-gray-900">
                                    Step 2
                                </p>

                                <p className="text-gray-600">
                                    Set how much you'd like to give then send
                                </p>
                            </div>
                        </div>

                        <div className="flex">
                            <div className="mr-4 flex flex-col items-center">
                                <div>
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-orange-700"><svg
                                        xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                        className="h-6 w-6 text-orange-700">
                                        <path d="M12 5l0 14"></path>
                                        <path d="M18 13l-6 6"></path>
                                        <path d="M6 13l6 6"></path>
                                    </svg></div>
                                </div>
                                <div className="h-full w-px bg-gray-300"></div>
                            </div>
                            <div className="pt-1 pb-8">
                                <p className="mb-2 text-xl font-bold text-gray-900">
                                    Step 3
                                </p>
                                <p className="text-gray-600">
                                    Leave a personalized message of support or encouragement.
                                </p>
                            </div>
                        </div>

                        <div className="flex">
                            <div className="mr-4 flex flex-col items-center">
                                <div>
                                    <div
                                        className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-orange-700 bg-orange-700">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                            className="h-6 w-6 text-white">
                                            <path d="M5 12l5 5l10 -10"></path>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-1 ">
                                <p className="mb-2 text-xl font-bold text-gray-900">
                                    And Done!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}