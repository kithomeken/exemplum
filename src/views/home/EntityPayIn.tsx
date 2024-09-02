import { Helmet } from "react-helmet"
import { toast } from "react-toastify"
import React, { useState } from "react"
import { useParams } from "react-router"

import { ERR_404 } from "../errors/ERR_404"
import { ERR_500 } from "../errors/ERR_500"
import { GUEST } from "../../api/API_Registry"
import HttpServices from "../../services/HttpServices"
import { Loading } from "../../components/modules/Loading"
import CookieServices from "../../services/CookieServices"
import confetti from "../../assets/images/confetti_green.png"
import { APPLICATION, COOKIE_KEYS, STYLE } from "../../global/ConstantsRegistry"
import { API_RouteReplace, classNames, formatAmount } from "../../lib/modules/HelperFunctions"
import { G_onInputChangeHandler, G_onInputBlurHandler } from "../../components/lib/InputHandlers"

export const EntityPayIn = () => {
    const [state, setstate] = useState({
        httpStatus: 200,
        status: 'pending',
        stkResponse: null,
        posting: false,
        data: {
            entity: null,
            limits: null,
        },
        input: {
            amount: '',
            msisdn: '',
            gratitude: '',
        },
        errors: {
            msisdn: '',
            amount: '',
            stkError: '',
            gratitude: '',
        },
        gratitude: {
            show: false,
            posting: false,
            highlight: false,
        },
        donation: {
            completed: false,
            entity: '',
            amount: '',
            donation: '',
        }
    })

    const params = useParams();
    const [isFocused, setIsFocused] = useState(false);
    const [isPolling, setIsPolling] = useState(false);
    let donationDetail: any = CookieServices.get(COOKIE_KEYS.DONATION)

    let pollingInterval: NodeJS.Timeout;
    let stopPollingTimeout: NodeJS.Timeout;

    interface Artist {
        name: string;
        bio: string;
        profileImage: string;
        backgroundImage: string;
    }

    const artist: Artist = {
        name: "Jane Doe",
        bio: "Jane Doe is a renowned artist known for her vibrant paintings and inspiring music. Support her journey and become part of her creative world!",
        profileImage: "https://via.placeholder.com/150",
        backgroundImage: "https://img.freepik.com/free-photo/musician-playing-electric-guitar_23-2151414318.jpg?t=st=1724833878~exp=1724837478~hmac=72e8083519fc3f438679fe3abafeb8595781629d458f1d2cbb2728a55e31560a&w=996",
    };

    React.useEffect(() => {
        fetchEntityDetails()
    }, [])

    React.useEffect(() => {
        if (isPolling) {
            pollingInterval = setInterval(async () => {
                try {
                    console.log('\d', donationDetail);
                    let { donation } = state

                    if (donationDetail.entity === params.uuid) {
                        let transactionRoute = null
                        transactionRoute = API_RouteReplace(GUEST.DONATION_GRATITUDE, ':uuid', donationDetail.entity)
                        transactionRoute = API_RouteReplace(transactionRoute, ':donation', donationDetail.donation)

                        const transactionCheck: any = await HttpServices.httpGet(transactionRoute)

                        if (transactionCheck.data.success) {
                            /* 
                             * Donation has been recieved. Update cookie 
                             * and stop the polling
                            */
                            donationDetail = {
                                'completed': true,
                                'entity': donationDetail.entity,
                                'amount': donationDetail.amount,
                                'donation': donationDetail.donation,
                            }

                            setIsPolling(false)
                            donation = donationDetail
                            CookieServices.setTimed(COOKIE_KEYS.DONATION, donationDetail, 20, COOKIE_KEYS.OPTIONS)

                            setstate({
                                ...state, donation, stkResponse: null
                            })
                        } else {

                        }
                    } else {
                        setIsPolling(false)
                    }
                } catch (error) {
                    console.log(error);
                    setIsPolling(false)
                }
            }, 5000);

            stopPollingTimeout = setTimeout(() => {
                setIsPolling(false);
            }, 60000);
        }

        return () => {
            clearInterval(pollingInterval);
            clearTimeout(stopPollingTimeout);
        };
    }, [isPolling]);

    React.useEffect(() => {
        if (!isPolling) {
            clearInterval(pollingInterval);
        }
    }, [isPolling]);

    const fetchEntityDetails = async () => {
        let { data } = state
        let { status } = state
        let { donation } = state

        try {
            const entityRoute = API_RouteReplace(GUEST.ENTITY_DATA, ':uuid', params.uuid)
            const entityResponse: any = await HttpServices.httpGet(entityRoute)

            if (entityResponse.data.success) {
                status = 'fulfilled'
                data.entity = entityResponse.data.payload.entity
                data.limits = entityResponse.data.payload.limits

                donation = donationDetail
            } else {
                status = 'rejected'
            }
        } catch (error) {
            status = 'rejected'
        }

        setstate({
            ...state, status, data, donation
        })
    }

    const onChangeHandler = (e: any) => {
        let { posting } = state

        if (!posting) {
            let output: any = G_onInputChangeHandler(e, state.posting)
            let { input } = state
            let { errors }: any = state

            input[e.target.name] = output.value
            errors[e.target.name] = output.error.replace('Msisdn', 'Phone number')

            setstate({
                ...state, input, errors
            })
        }
    }

    const onInputBlur = (e: any) => {
        let { input } = state
        let { posting } = state
        let { errors } = state

        if (!posting) {
            setIsFocused(false)
            let output: any = G_onInputBlurHandler(e, state.posting, '')

            switch (e.target.name) {
                case 'amount':
                    const transactionMinAmount = state.data.limits.min
                    const transactionMaxAmount = state.data.limits.max

                    let theAmount = output.value.replace(',', '')
                    theAmount = theAmount.length < 1 ? '0' : theAmount

                    if (output.error.length < 1) {
                        if (parseFloat(theAmount) > parseFloat(transactionMaxAmount)) {
                            // Maximum withdrawable amount per transaction
                            output.value = transactionMaxAmount
                            output.error = 'Maximum donation is KES. ' + formatAmount(parseFloat(transactionMaxAmount))
                        } else if (parseFloat(theAmount) < parseFloat(transactionMinAmount)) {
                            // Maximum withdrawable amount as per wallet
                            output.value = transactionMinAmount
                            output.error = 'Minimum donation is KES. ' + formatAmount(parseFloat(transactionMinAmount))
                        }
                    }

                    input[e.target.name] = formatAmount(parseFloat(theAmount))
                    errors[e.target.name] = output.error
                    break;

                default:
                    input[e.target.name] = output.value
                    errors[e.target.name] = output.error.replace('Msisdn', 'Phone number')
                    errors[e.target.name] = output.error.replace('Gratitude', 'Your message')
                    break;
            }

            setstate({
                ...state, input, errors
            })
        }
    }

    function formValidation() {
        let valid = true
        let { data } = state
        let { input } = state
        let { errors } = state

        if (input.amount.length < 1) {
            errors.amount = "Kindly add the amount you'd wish to contribute"
            valid = false
        } else {
            const transactionMinAmount = data.limits.min
            const transactionMaxAmount = data.limits.max

            let theAmount = input.amount.replace(',', '')
            const isValidAmount = /^\d+(\.\d{1,2})?$/.test(theAmount);

            if (!isValidAmount) {
                errors.amount = "Invalid amount format"
                valid = false
            } else {
                if (parseFloat(theAmount) > parseFloat(transactionMaxAmount)) {
                    // Maximum contributable amount per transaction
                    errors.amount = 'Maximum donation is KES. ' + formatAmount(parseFloat(transactionMaxAmount))
                    valid = false
                } else if (parseFloat(theAmount) < parseFloat(transactionMinAmount)) {
                    // Maximum contributable amount as per transaction
                    errors.amount = 'Minimum donation is KES. ' + formatAmount(parseFloat(transactionMinAmount))
                    valid = false
                }
            }
        }

        if (input.msisdn.length > 1) {
            if (input.msisdn.length < 12) {
                errors.msisdn = 'Enter valid phone number'
                valid = false
            } else if (input.msisdn.length > 12) {
                errors.msisdn = 'Enter valid phone number'
                valid = false
            }
        }

        return valid
    }

    const onFormSubmitHandler = (e: any) => {
        e.preventDefault()
        let { posting } = state

        if (!posting) {
            const valid = formValidation()

            if (valid) {
                setstate({
                    ...state, posting: true, stkResponse: null
                })

                stkPushNotification()
            }
        }
    }

    const stkPushNotification = async () => {
        let { data } = state
        let { input } = state
        let { errors } = state
        let { posting } = state
        let { donation } = state
        let { stkResponse } = state

        try {
            let formData = new FormData()

            formData.append("amount", input.amount.replace(',', ''))
            formData.append("msisdn", input.msisdn)
            formData.append("account", data.entity.account)

            const apiResponse: any = await HttpServices.httpPost(GUEST.ENTITY_DONATION, formData)

            if (apiResponse.data.success) {
                const payload = apiResponse.data.payload
                const donationId = payload.donation

                donationDetail = {
                    'completed': false,
                    'entity': params.uuid,
                    'donation': donationId,
                    'amount': input.amount.replace(',', ''),
                }

                CookieServices.setTimed(COOKIE_KEYS.DONATION, donationDetail, 20, COOKIE_KEYS.OPTIONS)
                donation = donationDetail

                input.amount = ''
                input.msisdn = ''
                posting = false

                stkResponse = payload.status
                errors.stkError = payload.status === 200 ? '' : payload.message

                setstate({
                    ...state, posting, stkResponse, input, errors, donation
                })

                setIsPolling(true);
                console.log('\e', apiResponse);
            } else {
                posting = false
                stkResponse = apiResponse.data.payload.status
                errors.stkError = apiResponse.data.payload.message
            }
        } catch (error) {
            console.log(error);

            posting = false
            stkResponse = 500
            errors.stkError = "Something went wrong, try again later"
        }

        setstate({
            ...state, posting, stkResponse, input, errors
        })
    }

    const showGratitudeForm = () => {
        let { gratitude } = state

        if (!gratitude.posting) {
            gratitude.show = true

            setstate({
                ...state, gratitude
            })
        }
    }

    const onGratitudeSubmit = (e: any) => {
        e.preventDefault()
        let { gratitude } = state

        if (!gratitude.posting) {
            let valid = true
            let { input } = state
            let { errors } = state

            if (input.gratitude.length < 1) {
                errors.gratitude = "Kindly add your message"
                valid = false
            } else if (input.gratitude.length < 5) {
                errors.gratitude = "Your message cannot be less than 5 characters"
                valid = false
            } else if (input.gratitude.length > 200) {
                errors.gratitude = "Your message cannot be more than 200 characters"
                valid = false
            }

            if (valid) {
                gratitude.posting = true

                setstate({
                    ...state, gratitude
                })

                addGratitudeNoteToDonation()
            }
        }
    }

    const addGratitudeNoteToDonation = async () => {
        let { input } = state
        let { errors } = state
        let { donation } = state
        let { gratitude } = state

        try {
            let gratitudeRoute = null
            let formData = new FormData()
            formData.append("note", input.gratitude)

            gratitudeRoute = API_RouteReplace(GUEST.DONATION_GRATITUDE, ':uuid', donationDetail.entity)
            gratitudeRoute = API_RouteReplace(gratitudeRoute, ':donation', donationDetail.donation)

            const gratResponse: any = await HttpServices.httpPost(gratitudeRoute, formData)

            if (gratResponse.data.success) {
                CookieServices.setTimed(COOKIE_KEYS.DONATION, donationDetail, -20, COOKIE_KEYS.OPTIONS)

                donation = null
                gratitude.posting = false

                toast.success('Your message has been sent', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } else {
                donation = null
                gratitude.posting = false
            }
        } catch (error) {
            donation = null
            gratitude.posting = false
        }

        setstate({
            ...state, donation, gratitude
        })
    }

    return (
        <React.Fragment>
            <Helmet>
                <title>{APPLICATION.NAME}</title>
            </Helmet>

            {
                state.status === 'rejected' ? (
                    <div className="flex items-center justify-center">
                        {
                            state.httpStatus === 404 ? (
                                <ERR_404
                                    compact={true}
                                />
                            ) : (
                                <ERR_500 />
                            )
                        }
                    </div>
                ) : state.status === 'fulfilled' ? (
                    <div className="relative overflow-hidden">
                        <div className="w-full md:h-[40vh] h-[27vh] bg-cover bg-center" style={{ backgroundImage: `url(${artist.backgroundImage})` }}>
                            <div className="w-full h-full bg-black bg-opacity-50 flex justify-center">
                                <section className="gx-container h-full w-full flex items-end justif-center" style={STYLE.W850}>
                                    <h1 className="text-orange-300 text-4xl font-medium p-4 mb-4 px-4">{state.data.entity.name}</h1>
                                </section>
                            </div>
                        </div>

                        <div className="w-full bg-orange-100 bg-opacity-70">
                            <section className="px-6 py-6 gx-container w-full flex flex-col gap-y-4" style={STYLE.W850}>
                                <h2 className="text-xl text-orange-600">
                                    {
                                        state.data.entity.max === 1 ? (
                                            'Who am I?'
                                        ) : (
                                            'Who we are?'
                                        )
                                    }

                                </h2>

                                {
                                    state.data.entity.bio.length > 1 ? (
                                        <>
                                            <p className="mt-2 pb-2 text-gray-700">
                                                {state.data.entity.bio}
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <p className="mt-2 pb-2 text-gray-700">
                                                <strong>{state.data.entity.name}</strong> creates dynamic and passionate music, known for their unique blend of sounds and heartfelt lyrics. With a deep love for storytelling through music, they has captivated audiences with their soulful voice and captivating performances.
                                            </p>

                                            <p className="pb-2 text-gray-700">
                                                Drawing inspiration from personal experiences and a wide range of musical influences, {state.data.entity.name} has created a distinct sound that resonates with listeners worldwide.
                                            </p>
                                        </>
                                    )
                                }


                            </section>
                        </div>

                        <div className="w-full bg-white">
                            <section className="px-6 py-6 gx-container w-full flex flex-col gap-y-4" style={STYLE.W850}>
                                <h2 className="text-xl text-orange-600">
                                    Donate
                                </h2>

                                <p className="mt-2 pb-2 text-gray-700">
                                    Make a direct contribution to support our work.
                                </p>

                                {
                                    state.stkResponse && (
                                        state.stkResponse === 200 ? (
                                            <div className="w-12/12">
                                                <div className="rounded-md mb-2 border-0 border-green-400 bg-green-100 py-4 px-4">
                                                    <div className="flex flex-row align-middle items-center text-green-700">
                                                        <i className="fa-duotone fa-badge-check fa-2x mt-1 text-green-700 flex-none"></i>

                                                        <div className="flex-auto ml-1 mt-1">
                                                            <span className="text-sm pl-3 block text-emerald-900 mb-1">
                                                                Request Processed
                                                            </span>

                                                            <span className="text-sm pl-3 block text-emerald-700">
                                                                Check your phone for the Mpesa prompt
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="w-12/12">
                                                <div className="rounded-md mb-2 border-0 border-red-400 bg-red-100 py-4 px-4">
                                                    <div className="flex flex-row align-middle items-center text-red-700">
                                                        <i className="fa-duotone fa-info-circle fa-2x mt-1 text-red-700 flex-none"></i>

                                                        <div className="flex-auto ml-1 mt-1">
                                                            <span className="text-sm pl-3 block text-red-900 mb-1">
                                                                Could not process your request
                                                            </span>

                                                            <span className="text-sm pl-3 block text-red-700">
                                                                {state.errors.stkError}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    )
                                }

                                {
                                    state.donation && (
                                        state.donation.entity === params.uuid ? (
                                            <>
                                                {
                                                    state.donation.completed ? (
                                                        <>
                                                            {
                                                                state.gratitude.show ? (
                                                                    <div className="w-full border-t-2 border-dashed py-3">
                                                                        <span className="block font-medium text-orange-500 py-2 mb-3">
                                                                            Send a message to the {state.data.entity.max > 1 ? 'artists' : 'artist'}
                                                                        </span>

                                                                        <form className={classNames(
                                                                            isFocused ? 'border-orange-500' : '',
                                                                            state.errors.gratitude.length > 0 ? 'border-red-500' : '',
                                                                            "flex w-full flex-col border rounded-md items-end align-middle px-2 pt-2"
                                                                        )} onSubmit={onGratitudeSubmit}>
                                                                            <div className="w-full">
                                                                                <div className="relative rounded">
                                                                                    <textarea name="gratitude" id="gratitude" placeholder="Enter a message" autoComplete="off" rows={4} cols={1}
                                                                                        className={classNames(
                                                                                            state.errors.gratitude.length > 0 ?
                                                                                                'text-red-900 ring-slate-300 placeholder:text-red-400' :
                                                                                                'text-gray-900 ring-slate-300 placeholder:text-gray-400 focus:border-0 focus:outline-none',
                                                                                            'block w-full rounded-md py-2 pl-3 pr-8 border-0 resize-none text-sm focus:outline-none disabled:cursor-not-allowed'
                                                                                        )} onChange={onChangeHandler} disabled={state.gratitude.posting} value={state.input.gratitude} onBlur={onInputBlur} required onFocus={() => setIsFocused(true)} />
                                                                                    <div className="absolute inset-y-0 right-0 flex items-center w-8">
                                                                                        {
                                                                                            state.errors.gratitude.length > 0 ? (
                                                                                                <span className="fa-duotone text-red-500 fa-circle-exclamation fa-lg"></span>
                                                                                            ) : null
                                                                                        }
                                                                                    </div>
                                                                                </div>

                                                                                <div className="w-full px-4">
                                                                                    <div className="w-full py-4 flex flex-col-reverse md:flex-row-reverse border-t">
                                                                                        <button type="submit" className="w-auto min-w-24 justify-center disabled:cursor-not-allowed text-sm rounded-md border border-transparent shadow-sm px-4 py-1-5 bg-orange-600 text-white disabled:bg-orange-600 hover:bg-orange-700 focus:outline-none" disabled={state.gratitude.posting}>
                                                                                            {
                                                                                                state.gratitude.posting ? (
                                                                                                    <span className="flex flex-row items-center h-5 justify-center">
                                                                                                        <i className="fad fa-spinner-third fa-xl fa-spin"></i>
                                                                                                    </span>
                                                                                                ) : (
                                                                                                    <span>Send Message</span>
                                                                                                )
                                                                                            }
                                                                                        </button>

                                                                                        <div className="flex-1">
                                                                                            {
                                                                                                state.errors.gratitude.length > 0 ? (
                                                                                                    <span className='invalid-feedback text-xs text-red-600 pl-0 float-start md:pb-0 pb-4'>
                                                                                                        {state.errors.gratitude}
                                                                                                    </span>
                                                                                                ) : null
                                                                                            }
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </form>
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex flex-col md:flex-row items-center align-middle px-4 py-4 my-4 md:gap-x-3 gap-y-3 bg-green-10 rounded-md border-2 border-dashed border-green-500">
                                                                        <div className="md:w-32 w-full flex justify-center">
                                                                            <img className="w-12 h-12 md:my-0 mt-2" src={confetti} loading="lazy" alt="google logo" />
                                                                        </div>

                                                                        <div className="md:flex-1 w-full">
                                                                            <span className="block font-medium text-stone-700 py-2 text-center md:text-start">
                                                                                <span className="hidden md:inline-block">Your payment of <span className="font-medium">KES {formatAmount(parseFloat(donationDetail.amount))}</span> was received.</span>
                                                                                <span className="md:hidden">Payment of <span className="font-medium">KES {formatAmount(parseFloat(donationDetail.amount))}</span> received.</span>
                                                                            </span>

                                                                            <span className="text-sm text-stone-500 block text-center md:text-start">
                                                                                Would you like to send a message to the {state.data.entity.max > 1 ? 'artists' : 'artist'}?
                                                                            </span>
                                                                        </div>

                                                                        <button onClick={showGratitudeForm} className="md:ml-4 my-2 md:my-0 px-3 text-sm py-2 text-white bg-green-500 rounded hover:bg-green-600">
                                                                            Send Message
                                                                        </button>
                                                                    </div>
                                                                )
                                                            }
                                                        </>
                                                    ) : null
                                                }
                                            </>
                                        ) : null
                                    )
                                }

                                <form className="flex md:flex-row w-full flex-col gap-x-3 gap-y-2 mb-3 items-end align-middle" onSubmit={onFormSubmitHandler}>
                                    <div className="md:flex-1 w-full">
                                        <label htmlFor="msisdn" className="block text-xs leading-6 py-1 text-stone-500 mb-2">Phone Number:</label>

                                        <div className="relative mt-2 rounded shadow-sm">
                                            <input type="text" name="msisdn" id="msisdn" placeholder="2547XXXXXXXX" autoComplete="off"
                                                className={classNames(
                                                    state.errors.msisdn.length > 0 ?
                                                        'text-red-900 ring-slate-300 placeholder:text-red-400 focus:ring-red-600 border border-red-600 focus:outline-red-500' :
                                                        'text-gray-900 ring-slate-300 placeholder:text-gray-400 focus:border-0 focus:outline-none focus:ring-orange-600 focus:outline-orange-500 hover:border-gray-400',
                                                    'block w-full rounded-md py-2 pl-3 pr-8 border border-gray-300 disabled:cursor-not-allowed disabled:hover:border-gray-300'
                                                )} onChange={onChangeHandler} value={state.input.msisdn} onBlur={onInputBlur} disabled={state.posting} required />
                                            <div className="absolute inset-y-0 right-0 flex items-center w-8">
                                                {
                                                    state.errors.msisdn.length > 0 ? (
                                                        <span className="fa-duotone text-red-500 fa-circle-exclamation fa-lg"></span>
                                                    ) : null
                                                }
                                            </div>
                                        </div>

                                        {
                                            state.errors.msisdn.length > 0 ? (
                                                <span className='invalid-feedback text-xs text-red-600 pl-0 md:hidden'>
                                                    {state.errors.msisdn}
                                                </span>
                                            ) : null
                                        }
                                    </div>

                                    <div className="md:flex-1 w-full">
                                        <label htmlFor="amount" className="block text-xs leading-6 py-1 text-stone-500 mb-2">Amount To Donate:</label>

                                        <div className="relative mt-2 rounded shadow-sm">
                                            <input type="text" name="amount" id="amount" placeholder="0.00" autoComplete="off"
                                                className={classNames(
                                                    state.errors.amount.length > 0 ?
                                                        'text-red-900 ring-slate-300 placeholder:text-red-400 focus:ring-red-600 border border-red-600 focus:outline-red-500' :
                                                        'text-gray-900 ring-slate-300 placeholder:text-gray-400 focus:border-0 focus:outline-none focus:ring-orange-600 focus:outline-orange-500 hover:border-gray-400',
                                                    'block w-full rounded-md py-2 pl-3 pr-8 border border-gray-300 disabled:cursor-not-allowed disabled:hover:border-gray-300'
                                                )} onChange={onChangeHandler} value={state.input.amount} onBlur={onInputBlur} disabled={state.posting} required />
                                            <div className="absolute inset-y-0 right-0 flex items-center w-8">
                                                {
                                                    state.errors.amount.length > 0 ? (
                                                        <span className="fa-duotone text-red-500 fa-circle-exclamation fa-lg"></span>
                                                    ) : null
                                                }
                                            </div>
                                        </div>

                                        {
                                            state.errors.amount.length > 0 ? (
                                                <span className='invalid-feedback text-xs text-red-600 pl-0 md:hidden'>
                                                    {state.errors.amount}
                                                </span>
                                            ) : null
                                        }
                                    </div>

                                    <div className="md:flex-1 w-full md:py-0 py-4">
                                        <button type="submit" className="w-auto min-w-24 justify-center disabled:cursor-not-allowed text-sm rounded-md border border-transparent shadow-sm px-4 py-1-5 bg-orange-600 text-white disabled:bg-orange-600 hover:bg-orange-700 focus:outline-none" disabled={state.posting}>
                                            {
                                                state.posting ? (
                                                    <span className="flex flex-row items-center h-5 justify-center">
                                                        <i className="fad fa-spinner-third fa-xl fa-spin"></i>
                                                    </span>
                                                ) : (
                                                    <span>Donate</span>
                                                )
                                            }
                                        </button>
                                    </div>
                                </form>

                                {
                                    state.errors.msisdn.length > 0 ? (
                                        <span className='invalid-feedback text-xs text-red-600 pl-0 hidden md:block'>
                                            {state.errors.msisdn}
                                        </span>
                                    ) : null
                                }

                                {
                                    state.errors.amount.length > 0 ? (
                                        <span className='invalid-feedback text-xs text-red-600 pl-0 hidden md:block'>
                                            {state.errors.amount}
                                        </span>
                                    ) : null
                                }

                                <div className="mx-auto md:py-3 py-6 text-center">
                                    <p className="text-sm text-stone-500 pb-4">
                                        © {new Date().getFullYear()}. Elevated Acts of Appreciation, <span className="text-orange-600 block">Tip by Tip.</span>
                                    </p>
                                </div>
                            </section>
                        </div>

                        <div className={`w-full flex-none bg-gradient-to-r from-orange-100 to-orange-300 h-30`}>
                            <div className="kiOAkj sttng_strp h-12 px-12"></div>
                        </div>
                    </div>
                ) : (
                    <div className="wrapper md:align-middle align-baseline w-full overflow-auto md:h-screen h-auto">
                        <section className="gx-container md:h-screen h-auto rounded-md w-full flex items-center justify-center">
                            <div className="flex md:flex-row flex-col align-middle items-center w-full md:pb-0 pb-10">
                                <div className="w-full h-1/2 flex flex-col justify-center">
                                    <div className="flex-grow pt-8">
                                        <Loading />
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                )
            }
        </React.Fragment>
    )
}