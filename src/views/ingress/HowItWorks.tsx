import React from "react"

import scanQR from "../../assets/images/B5NqjNJMbOBL08O1A.svg"
import amount from "../../assets/images/CjvPVsM4P9gl66J9A.svg"
import sendMessage from "../../assets/images/5X2sN118N4oSRytxF.svg"
import paymentMethod from "../../assets/images/9KVyGIRJtaUcEo5jw.svg"

export const HowItWorks = () => {

    return (
        <React.Fragment>
            <div className="w-full px-3 text-gray-600">
                <div className="mx-auto py-3 container md:text-xl text-base md:max-w-4xl lg:max-w-4xl xl:max-w-5xl">
                    <h1 className="mt-2 text-2xl font-bold tracking-tight text-orange-600 sm:text-3xl">
                        How it Works
                    </h1>

                    <p className="mt-6 mb-6 md:mb-0 leading-8 text-gray-700">
                        Show your appreciation in just 4 simple steps.
                    </p>

                    <div className="flex flex-col md:flex-row items-center align-middle">
                        <div className="md:basis-2/3">
                            <h1 className="mt-2 text-lg font-medium tracking-tight sm:text-2xl">
                                1. Scan QR Code or Search Creator by Name

                                <div className="w-48 pt-4 mx-auto pb-3 md:hidden">
                                    <img src={scanQR} alt={"scan_qr_code"} width="auto" className="block text-center m-auto" />
                                </div>
                            </h1>

                            <p className="mt-6 md:text-lg text-base leading-8 text-gray-700 pb-3 md:py-0">
                                Quickly find the creator you're supporting by either scanning their personalized QR code or searching by their name.
                            </p>
                        </div>

                        <div className="md:basis-1/3 md:block h-full px-4">
                            <img className="h-full rounded-2xl" src={scanQR} alt={"scan_qr_code"} loading="lazy" />
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center align-middle">
                        <div className="md:basis-1/3 md:block h-full px-4">
                            <img className="h-full rounded-2xl" src={amount} alt={"scan_qr_code"} loading="lazy" />
                        </div>

                        <div className="md:basis-2/3">
                            <h1 className="mt-2 text-lg font-medium tracking-tight sm:text-2xl">
                                2. Set Amount

                                <div className="w-48 pt-4 mx-auto pb-3 md:hidden">
                                    <img src={amount} alt={"set_amount"} width="auto" className="block text-center m-auto" />
                                </div>
                            </h1>

                            <p className="mt-6 md:text-lg text-base leading-8 text-gray-700 pb-3 md:py-0">
                                Choose how much you'd like to give—whether it's a small token or a big gesture, it all makes a difference.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center align-middle">
                        <div className="md:basis-2/3">
                            <h1 className="mt-2 text-lg font-medium tracking-tight sm:text-2xl">
                                3. Select Payment Method

                                <div className="w-48 pt-4 mx-auto pb-3 md:hidden">
                                    <img src={paymentMethod} alt={"payment_method"} width="auto" className="block text-center m-auto" />
                                </div>
                            </h1>

                            <p className="mt-6 md:text-lg text-base leading-8 text-gray-700 pb-3 md:py-0">
                                Pick the payment option that suits you best for a smooth transaction.
                            </p>
                        </div>

                        <div className="md:basis-1/3 md:block h-full px-4">
                            <img className="h-full rounded-2xl" src={paymentMethod} alt={"payment_method"} loading="lazy" />
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center align-middle">
                        <div className="md:basis-1/3 md:block h-full px-4">
                            <img className="h-full rounded-2xl" src={sendMessage} alt={"send_message"} loading="lazy" />
                        </div>

                        <div className="md:basis-2/3">
                            <h1 className="mt-2 text-lg font-medium tracking-tight sm:text-2xl">
                                4. Send a Personalized Message for the Creator

                                <div className="w-48 pt-4 mx-auto pb-3 md:hidden">
                                    <img src={sendMessage} alt={"send_message"} width="auto" className="block text-center m-auto" />
                                </div>
                            </h1>

                            <p className="mt-6 md:text-lg text-base leading-8 text-gray-700 pb-3 md:py-0">
                                Add a personal touch by writing a message of support or encouragement to let the creator know how much you appreciate their work.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}