import QRCode from 'qrcode'
import { Helmet } from "react-helmet"
import React, { useState } from "react"

import { MoneyIn } from './MoneyIn';
import { MoneyOut } from './MoneyOut';
import { ERR_404 } from '../errors/ERR_404';
import { ERR_500 } from '../errors/ERR_500';
import { FanMessages } from './FanMessages';
import { WithdrawModal } from './WithdrawModal';
import { ACCOUNT } from '../../api/API_Registry';
import { genericRoutes } from '../../routes/routes';
import HttpServices from '../../services/HttpServices';
import { Loading } from "../../components/modules/Loading"
import { APPLICATION, CONFIG_MAX_WIDTH } from "../../global/ConstantsRegistry"
import { API_RouteReplace, classNames, formatAmount } from '../../lib/modules/HelperFunctions';

export const ArtistHome = () => {
    const [state, setstate] = useState({
        show: false,
        blurred: true,
        activeTab: 'in',
        httpStatus: 200,
        pageTitle: 'Home',
        status: 'pending',
        data: {
            craft: null,
            entity: null,
            money_in: null,
            qrCodeImageName: null,
        },
    })

    const [qrLink, setQRLink] = useState(null)
    const [copied, setCopied] = useState(false);

    const [qrCode, setQRCode] = useState({
        lowQuality: '',
        highQuality: ''
    });

    React.useEffect(() => {
        artistDetailsApiCall()
    }, [])

    const artistDetailsApiCall = async () => {
        let { httpStatus } = state
        let { status } = state
        let { data } = state

        try {
            const response: any = await HttpServices.httpGet(ACCOUNT.ARTIST_DETAILS)
            httpStatus = response.status

            if (response.data.success) {
                status = 'fulfilled'
                data.craft = response.data.payload.craft
                data.entity = response.data.payload.entity

                let entity0Route: any = (
                    genericRoutes.find(
                        (routeName) => routeName.name === 'ENTITY_0_'
                    )
                )?.path

                entity0Route = API_RouteReplace(entity0Route, ':uuid', data.entity.uuid)
                const qrCodeText = APPLICATION.URL + entity0Route

                setQRLink(qrCodeText)
                GenerateQRCode(qrCodeText)

                data.entity.bal = formatAmount(parseFloat(data.entity.bal))
                data.qrCodeImageName = 'qrcode_' + data.entity.uuid + '.png'
            } else {
                status = 'rejected'
            }
        } catch (error) {
            console.log(error);
            status = 'rejected'
        }

        setstate({
            ...state, status, data, httpStatus
        })
    }

    function GenerateQRCode(qrCodeText: string) {
        let { lowQuality } = qrCode
        let { highQuality } = qrCode

        // Low Quality QR Code
        QRCode.toDataURL(
            qrCodeText,
            {
                width: 200,
                margin: 2,
            },
            (err: any, dataImage: any) => {
                if (err) return console.log(err);
                lowQuality = dataImage
            }
        )

        // High Quality QR Code
        QRCode.toDataURL(
            qrCodeText,
            {
                width: 800,
                margin: 2,
            },
            (err: any, dataImage: any) => {
                if (err) return console.log(err);
                highQuality = dataImage
            }
        )

        setQRCode({
            ...qrCode, lowQuality, highQuality
        })
    }

    const activateTab = (tabName: any) => {
        setstate({
            ...state,
            activeTab: tabName
        })
    }

    const showOrHideWithdrawModal = () => {
        let { data } = state

        if (data.entity.nominated === 'Y') {
            let { show } = state
            show = !state.show

            setstate({
                ...state, show
            })
        }
    }

    const loadRespectiveTab = (tab: string = 'in') => {
        switch (tab) {
            case "in":
                return <MoneyIn />

            case "out":
                return <MoneyOut />

            case "fan":
                return <FanMessages />

            default:
                return null
        }
    }

    const toggleAmountBlur = () => {
        setstate({
            ...state, blurred: !state.blurred
        })
    }

    const copyTextToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    return (
        <React.Fragment>
            <Helmet>
                <title>{state.pageTitle}</title>
            </Helmet>

            <div className="w-full px-4 py-4">
                {
                    state.status === 'rejected' ? (
                        <div className="py-3 px-4 w-full">
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
                        </div>
                    ) : state.status === 'fulfilled' ? (
                        <div className="w-full relative">

                            <div className={`fixed inset-x-0 bottom-0 pb-2 sm:pb-5 z-50 transform transition-transform duration-500 ease-out ${copied ? 'translate-x-0' : '-translate-x-full'}`}>
                                <div className="mx-auto max-w-7xl md:w-96 px-2 sm:px-6 lg:px-8">
                                    <div className="rounded-lg bg-orange-600 p-2 shadow-lg sm:p-3 text-base">
                                        <div className="flex flex-wrap items-center justify-between">
                                            <div className="flex w-0 flex-1 items-center">
                                                <span className="flex rounded-lg bg-orange-800 p-2">
                                                    <div className="h-6 w-6">
                                                        <span className="fa-duotone fa-badge-check fa-xl h-6 w-6 m-auto text-white"></span>
                                                    </div>
                                                </span>

                                                <p className="ml-3 truncate font-normal text-white">
                                                    <span className="">Copied to clipboard</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={`w-full mb-3`}>
                                <div className="kiOAkj" style={CONFIG_MAX_WIDTH}>
                                    <div className="w-full flex flex-col-reverse md:space-x-4 md:flex-row pb-6">
                                        <div className="flex-none flex flex-col gap-y-3 justify-center border-t md:border-t-0 md:pt-0 pt-3">
                                            <img src={qrCode.lowQuality} alt="qr_code" className="block text-center m-auto" />

                                            <div className="flex items-center w-44 justify-center mx-auto text-gray-800 border border-gray-800 bg-white font-mono md:hidden text-sm py-2 px-4 rounded-md">
                                                <div className="flex-grow gap-1">
                                                    <span>Copy Link</span>
                                                </div>

                                                <button onClick={() => copyTextToClipboard(qrLink)} className="flex text-gray-800 cursor-pointer w-5 h-5 hover:text-gray-400 duration-200 align-middle items-center">
                                                    <span className="fa-light fa-copy fa-lg"></span>
                                                </button>
                                            </div>

                                            <a className="text-orange-600 w-44 py-2 m-auto px-4 flex flex-row items-center justify-center border border-orange-600 md:hidden text-sm text-center rounded-md bg-white hover:bg-orange-700 focus:outline-none" href={qrCode.highQuality} download={state.data.qrCodeImageName}>
                                                <i className="fa-duotone fa-download mr-2 fa-lg"></i>
                                                Download QR
                                            </a>
                                        </div>

                                        <div className="flex-grow border-0 md:border-l md:ml-3 md:px-4 pb-4 md:py-0">
                                            <div className="w-full">
                                                <div className="w-full flex flex-row items-center -middle">
                                                    <span className="py-1 flex-grow px-1.5 block text-2xl text-orange-600 mb-2 capitalize">
                                                        {state.data.entity.name}
                                                    </span>

                                                    {
                                                        state.data.entity.nominated === 'Y' ? (
                                                            <button type="button" onClick={showOrHideWithdrawModal} className="bg-orange-600 flex-none w-40 py-2 px-4 float-right hidden text-sm md:flex flex-row items-center justify-center text-center rounded-md text-white hover:bg-orange-700 focus:outline-none">
                                                                <i className="fa-light fa-money-bill-wave mr-2 fa-lg"></i>
                                                                Withdraw
                                                            </button>
                                                        ) : null
                                                    }
                                                </div>

                                                <span className="px-1.5 block text-sm text-stone-500 mb-2 capitalize">
                                                    {state.data.entity.account}
                                                </span>

                                                <span className=" py-1 px-1.5 block text-sm text-slate-700">
                                                    <i className="fa-light fa-wallet text-slate-500 fa-lg mr-2"></i>
                                                    Wallet
                                                </span>

                                                <div className="w-full flex flex-row align-middle items-center py-1 gap-x-4">
                                                    <div className={
                                                        classNames(
                                                            state.blurred ? 'blurred' : null,
                                                            "flex-none flex flex-row align-middle items-center py-1 gap-x-2"
                                                        )
                                                    }>
                                                        <span className="text-slate-500 text-xs">
                                                            KES.
                                                        </span>

                                                        <span className="text-3xl">
                                                            <span className="text-slate-700">{state.data.entity.bal.split('.')[0]}</span>
                                                            <span className="text-slate-400 text-xl">.{state.data.entity.bal.split('.')[1]}</span>
                                                        </span>
                                                    </div>

                                                    <div className="flex-none">
                                                        {
                                                            state.blurred ? (
                                                                <span className="fa-duotone fa-eye text-orange-600 fa-lg cursor-pointer" onClick={toggleAmountBlur}></span>
                                                            ) : (
                                                                <span className="fa-duotone fa-eye-slash text-orange-600 fa-lg cursor-pointer" onClick={toggleAmountBlur}></span>
                                                            )
                                                        }
                                                    </div>
                                                </div>

                                                {
                                                    state.data.entity.nominated === 'Y' ? (
                                                        <div className="flex flex-col justify-center py-2">
                                                            <button type="button" onClick={showOrHideWithdrawModal} className="text-orange-600 py-2 px-4 sm:hidden text-sm flex flex-row border border-orange-600 items-center justify-center text-center rounded-md bg-white hover:bg-orange-700 focus:outline-none">
                                                                <i className="fa-light fa-money-bill-wave mr-2 fa-lg"></i>
                                                                Withdraw
                                                            </button>
                                                        </div>
                                                    ) : null
                                                }

                                                <div className="flex flex-col justify-center md:py-2 gap-y-3">
                                                    <div className="md:flex w-40 items-center justify-between text-gray-800 border border-gray-800 bg-white max-w-sm font-mono hidden text-sm py-2 px-4 rounded-md">
                                                        <div className="flex gap-1">
                                                            <span>Copy Link</span>
                                                        </div>

                                                        <button onClick={() => copyTextToClipboard(qrLink)} className="flex text-gray-800 cursor-pointer w-5 h-5 hover:text-gray-400 duration-200 align-middle items-center">
                                                            <span className="fa-light fa-copy fa-lg"></span>
                                                        </button>
                                                    </div>

                                                    <a className="bg-orange-600 w-40 py-2 px-4 hidden text-sm md:flex flex-row items-center justify-center text-center rounded-md text-white hover:bg-orange-700 focus:outline-none" href={qrCode.highQuality} download={state.data.qrCodeImageName}>
                                                        <i className="fa-duotone fa-download mr-2 fa-lg"></i>
                                                        Download QR
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-full mb-3 md:px-3">
                                        <div className="w-full flex flex-row">
                                            <div className="md:flex-none cursor-pointer basis-1/2 border-b" onClick={() => activateTab('in')}>
                                                <button className={classNames(
                                                    state.activeTab === 'in' ? 'text-orange-700 bg-orange-200 border-orange-400' : 'hover:text-gray-700 text-gray-500 hover:bg-gray-100 ',
                                                    "text-sm items-center block p-2 px-6 rounded-t rounded-b-none text-center w-full md:w-auto"
                                                )}>
                                                    <span className="lolrtn robot">
                                                        Money In
                                                    </span>
                                                </button>
                                            </div>

                                            <div className="md:flex-none cursor-pointer basis-1/2 border-b" onClick={() => activateTab('out')}>
                                                <button className={classNames(
                                                    state.activeTab === 'out' ? 'text-orange-700 bg-orange-200 border-orange-400' : 'hover:text-gray-700 text-gray-500 hover:bg-gray-100 ',
                                                    "text-sm items-center block p-2 px-6 rounded-t rounded-b-none text-center w-full md:w-auto"
                                                )}>
                                                    <span className="lolrtn robot">Money Out</span>
                                                </button>
                                            </div>

                                            <div className="md:flex-none cursor-pointer basis-1/2 border-b" onClick={() => activateTab('fan')}>
                                                <button className={classNames(
                                                    state.activeTab === 'fan' ? 'text-orange-700 bg-orange-200 border-orange-400' : 'hover:text-gray-700 text-gray-500 hover:bg-gray-100 ',
                                                    "text-sm items-center block p-2 px-6 rounded-t rounded-b-none text-center w-full md:w-auto"
                                                )}>
                                                    <span className="lolrtn robot">Fan Messages</span>
                                                </button>
                                            </div>

                                            <div className="flex-grow border-b md:block hidden">

                                            </div>
                                        </div>

                                        <div className="w-full md:px-3 px-1.5">
                                            {loadRespectiveTab(state.activeTab)}
                                        </div>
                                    </div>

                                    <div className="flex mb-4 items-center">
                                        <p className="text-2xl flex-auto text-orange-600">

                                        </p>


                                    </div>

                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full h-screen -mt-20 flex flex-col justify-center align-middle items-center">
                            <Loading />
                        </div>
                    )
                }
            </div>

            {
                state.status === 'fulfilled' ? (
                    <WithdrawModal
                        show={state.show}
                        entity={state.data.entity}
                        account={'wdiuhwoid'}
                        showOrHide={showOrHideWithdrawModal}
                    />
                ) : null
            }
        </React.Fragment >
    )
}