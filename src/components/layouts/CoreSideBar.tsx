import React, { FC } from "react" 
import { Link } from "react-router-dom"

import { administrativeRoutes } from "../../routes/routes"
import { classNames } from "../../lib/modules/HelperFunctions"
import { Core_Side_B_Props } from "../../lib/modules/Interfaces"

export const CoreSideBar: FC<Core_Side_B_Props> = ({ location }) => {
    const coreSettingsRoutes = (coreRouteName: any) => {
        const coreRoute: any = (
            administrativeRoutes.find(
                (routeName) => routeName.name === coreRouteName)
        )?.path

        return coreRoute
    }

    const coreRoutePsot = (targetRoute: any) => {
        for (const item of administrativeRoutes) {
            // Check if the current item's route starts with the targetRoute
            if (item.path && targetRoute.startsWith(item.path)) {
                return item.name
            }
        }

        return null;
    };

    const PsotMenuLink = (icon: string, menu: string, coreName: string) => {
        const Psot = coreRoutePsot(location.pathname)

        return (
            <Link to={coreSettingsRoutes(coreName)} className={classNames(
                Psot === coreName ? 'text-amber-700 bg-amber-100 hover:bg-amber-100' : 'text-stone-600 hover:bg-gray-200',
                "group px-3 py-2 flex flex-col gap-2 rounded-lg "
            )} tabIndex={1}>
                <div className="flex cursor-pointer items-center align-middle gap-x-4">
                    <i className={`fa-duotone ${icon} fa-xl`}></i>

                    <span>
                        {menu}
                    </span>
                </div>
            </Link>
        )
    }

    return (
        <React.Fragment>
            <div className="md:w-64 md:block hidden bg-white text-sm h-full fixed left-0 top-0 overflow-y-auto scroll-smooth scrollbar-thin mt-16 mb-16 border-r border-gray-300">
                <div className="py-4 px-2">
                    <ul className="w-full">
                        <li className="text-stone-600 m-2 space-y-2 ">
                            {
                                PsotMenuLink('fa-chart-pie', 'Dashboard', 'CORE_HOME_')
                            }
                        </li>
                    </ul>

                    <p className="text-sm pl-2 text-stone-500 my-4">
                        Onboarding
                    </p>

                    <ul className="w-full">
                        <li className="text-stone-600 m-2 space-y-2 ">
                            {
                                PsotMenuLink('fa-box-archive', 'All Requests', 'CORE_ONBOARDING_')
                            }
                        </li>

                        <li className="text-stone-600 m-2 space-y-2 ">
                            {
                                PsotMenuLink('fa-address-book', 'Entities', 'CORE_ENTITIES_')
                            }
                        </li>

                        <li className="text-stone-600 m-2 space-y-2 ">
                            {
                                PsotMenuLink('fa-user-tie-hair', 'User Management', 'CORE_USERS_')
                            }
                        </li>
                    </ul>

                    <p className="text-sm pl-2 text-stone-500 my-4">
                        Payments
                    </p>

                    <ul className="w-full">
                        <li className="text-stone-600 m-2 space-y-2 ">
                            {
                                PsotMenuLink('fa-money-bill-transfer', 'Withdrawal Requests', 'CORE_PAYMENTS_')
                            }
                        </li>

                        <li className="text-stone-600 m-2 space-y-2 ">
                            {
                                PsotMenuLink('fa-money-check', 'Transaction Payouts', 'CORE_TXN_PAYOUTS_')
                            }
                        </li>

                        <li className="text-stone-600 m-2 space-y-2 ">
                            {
                                PsotMenuLink('fa-message-dollar', 'Fan Contributions', 'CORE_TXN_PAYIN_')
                            }
                        </li>

                        <li className="text-stone-600 m-2 space-y-2 ">
                            {
                                PsotMenuLink('fa-octagon-exclamation', 'Mpesa Exceptions', 'CORE_MPESA_EXCS_')
                            }
                        </li>
                    </ul>

                    <p className="text-sm pl-2 text-stone-500 my-4">
                        Revenue
                    </p>

                    <ul className="w-full">
                        <li className="text-stone-600 m-2 space-y-2 py-2 hover:bg-gray-200 px-3 rounded">
                            <div className="group flex flex-col gap-2 rounded-lg" tabIndex={1}>
                                <div className="flex cursor-pointer items-center align-middle gap-x-4">
                                    <i className="fa-duotone fa-money-check-alt fa-xl"></i>

                                    <span>
                                        Earned Commissions
                                    </span>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </React.Fragment>
    )
}