import { Helmet } from "react-helmet"
import { Menu } from "@headlessui/react"
import React, { useState } from "react"
import PhoneInput from 'react-phone-number-input'

import { useAppSelector } from "../../store/hooks"
import { classNames, getColorForLetter, readDecryptAndParseLS } from "../../lib/modules/HelperFunctions"
import { STORAGE_KEYS } from "../../global/ConstantsRegistry"
import { DropDown } from "../../components/lib/DropDown"
import { NomintatedMember } from "./NominatedMember"
import { EntityDetails } from "./EntityDetails"

export const AccountManagement = () => {
    const [state, setstate] = useState({
        status: 'pending',
        httpStatus: 200,
        data: null,
    })

    const emptyOnChangeHandler = () => { }
    const auth0: any = useAppSelector(state => state.auth0)
    const identityData = readDecryptAndParseLS(STORAGE_KEYS.ACCOUNT_DATA)


    return (
        <React.Fragment>
            <Helmet>
                <title>My Account</title>
            </Helmet>

            <div className="w-full mb-4 md:gap-x-4 gap-x-4 flex align-middle items-center flex-row md:pb-8 pb-2 md:border-b-0">
                <div className="w-20 h-20 flex flex-col justify-center align-middle items-center mx-auto">
                    {
                        identityData.photo_url ? (
                            <img className="rounded-full h-20 w-20" src={identityData.photo_url} alt={'photo_url'} />
                        ) : (
                            <div className={`w-16 h-16 flex items-center justify-center rounded-full ${getColorForLetter(auth0.identity.display_name.charAt(0))}`}>
                                <span className="text-white text-4xl font-medium">
                                    {auth0.identity.display_name.charAt(0)}
                                </span>
                            </div>
                        )
                    }
                </div>

                {
                    identityData.provider_id === 'password' ? (
                        <div className="flex-1">
                            <span className="md:text-3xl text-2xl text-stone-700 leading-7 tracking-wide font- block md:text-start">
                                {auth0.identity.display_name}
                            </span>
                        </div>
                    ) : (
                        <div className="flex-1">
                            <span className="md:text-3xl text-2xl text-stone-700 leading-7 tracking-wide font- block md:text-start">
                                {auth0.identity.display_name}
                            </span>
                        </div>
                    )
                }
            </div>

            <div className="w-full md:gap-x-4 gap-y-4 grid md:grid-cols-3 pt-4 pb-6 border-b md:px-4">
                <div className="col-span-1">
                    <span className="text-lg text-stone-600 font-medium md:text-base">
                        Name:
                    </span>
                </div>

                <div className="col-span-2 flex md:flex-row md:gap-x-2 gap-y-3 md:align-middle md:items-center py-2 md:py-0">
                    <span className="text-base text-stone-700 block md:text-start md:basis-1/2 w-full">
                        {auth0.identity.display_name}
                    </span>

                    <div className="md:basis-1/2 text-base md:float-right">
                        <button type="button" className="text-base text-orange-600 md:float-end float-left disabled:cursor-not-allowed disabled:text-orange-400" disabled={identityData.provider_id === 'password' ? false : true}>
                            Change
                        </button>
                    </div>
                </div>
            </div>

            <div className="w-full md:gap-x-4 gap-y-4 grid md:grid-cols-3 pt-4 pb-6 border-b md:px-4">
                <div className="col-span-1">
                    <span className="text-lg text-stone-600 font-medium md:text-base">
                        Phone Number:
                    </span>
                </div>

                <div className="col-span-2 flex md:flex-row md:gap-x-2 gap-y-3 md:align-middle md:items-center py-2 md:py-0">
                    <span className="text-base text-stone-700 block md:text-start md:basis-1/2 w-full">
                        <PhoneInput
                            international
                            readOnly={true}
                            disabled={true}
                            defaultCountry="KE"
                            onChange={emptyOnChangeHandler}
                            value={auth0.identity.msisdn}
                        />
                    </span>

                    <div className="md:basis-1/2 text-base md:float-right">
                        <button type="button" className="text-base text-orange-600 md:float-end float-left disabled:cursor-not-allowed disabled:text-orange-400">
                            Change
                        </button>
                    </div>
                </div>
            </div>

            <div className="w-full md:gap-x-4 gap-y-4 md:grid md:grid-cols-3 py-4 border-b md:px-4">
                <div className="col-span-1 flex flex-row align-middle items-center gap-x-3 w-full mb-5">
                    <span className="text-lg text-stone-600 font-medium md:text-base">
                        Sign-in-method:
                    </span>

                    <div className="md:hidden basis-1/2">
                        <SignInMethod_DropDown
                            identity={identityData}
                        />
                    </div>
                </div>

                <div className="col-span-2 flex md:flex-row md:gap-x-2 gap-y-3 md:align-middle md:items-center items-baseline align-baseline w-full py-2 md:py-0">
                    <div className="block md:basis-1/2 w-full">
                        {
                            identityData.provider_id === 'password' ? (
                                <span className="flex w-full flex-row items-center text-sm gap-x-3 align-middle text-stone-500">
                                    <span className="fa-light fa-key fa-lg block"></span>
                                    Email/Password
                                </span>
                            ) : (
                                <span className="flex w-full flex-row items-center text-sm gap-x-3 align-middle text-stone-500">
                                    <span className="fa-brands fa-google fa-xl block"></span>
                                    Google Account
                                </span>
                            )
                        }

                        <span className="text-sm py-2 text-orange-600 block md:text-start">
                            {auth0.identity.email}
                        </span>
                    </div>

                    <div className="md:basis-1/2 text-base md:float-right hidden md:block">
                        <SignInMethod_DropDown
                            identity={identityData}
                        />
                    </div>
                </div>
            </div>

            <EntityDetails />

            <NomintatedMember />



        </React.Fragment>
    )
}

const SignInMethod_DropDown = (identity: any) => {
    const identityData = identity.identity

    return (
        <React.Fragment>
            <DropDown
                width={'w-52'}
                title={
                    <>
                        <button type="button" disabled={identityData.provider_id === 'password' ? false : true} className="text-sm bg-white text-orange-600 py-1.5 border border-orange-400 rounded-md px-3 flex flex-row align-middle items-center gap-x-2 disabled:text-orange-400 disabled:cursor-not-allowed">
                            Change

                            <span className="fa-light fa-chevron-down fa-lg"></span>
                        </button>
                    </>
                }
                menuItems={
                    <>
                        <Menu.Item>
                            {({ active }) => (
                                <button
                                    className={classNames(
                                        active ? 'bg-stone-100 text-stone-800' : 'text-stone-700',
                                        'px-2 py-2.5 text-sm text-left w-full block'
                                    )}
                                >
                                    <span className="flex flex-row align-middle items-center pl-1">
                                        <span className="ml-2 flex-auto">
                                            Change Password
                                        </span>
                                    </span>
                                </button>
                            )}
                        </Menu.Item>

                        <Menu.Item>
                            {({ active }) => (
                                <button
                                    className={classNames(
                                        active ? 'bg-stone-100 text-stone-800' : 'text-stone-700',
                                        'px-2 py-2.5 text-sm text-left w-full block'
                                    )}
                                >
                                    <span className="flex flex-row align-middle items-center pl-1">
                                        <span className="ml-2 flex-auto">
                                            Change Email Address
                                        </span>
                                    </span>
                                </button>
                            )}
                        </Menu.Item>
                    </>
                }
            />
        </React.Fragment>
    )
}