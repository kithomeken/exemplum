import { Helmet } from "react-helmet"
import React, { useState } from "react"

import { ChangeEmail } from "./ChangeEmail"
import { EntityProfile } from "./EntityProfile"
import { useAppSelector } from "../../store/hooks"
import { classNames } from "../../lib/modules/HelperFunctions"
import { CONFIG_MAX_WIDTH } from "../../global/ConstantsRegistry"

export const AccountManagement = () => {
    const [state, setstate] = useState({
        status: 'pending',
        activeTab: 'profile',
        data: {
            email: null,
        },
    })

    const auth0: any = useAppSelector(state => state.auth0)

    const setActivateTab = (tabName: any) => {
        setstate({
            ...state,
            activeTab: tabName
        })
    }

    const loadRespectiveTab = (tabName = 'poc') => {
        switch (tabName) {
            case 'profile':
                return <EntityProfile />

            case 'email':
                return <ChangeEmail />

            default:
                return null
        }
    }

    return (
        <React.Fragment>
            <Helmet>
                <title>Account Management</title>
            </Helmet>

            <div className="flex flex-col w-full md:flex-row overflow-hidden">
                <div className="flex-shrink-0 w-full md:w-56">
                    <div className="p-4">
                        <h1 className="text-xl text-stone-600 font-medium tracking-wider">Settings</h1>
                    </div>
                    
                    <nav className="flex flex-col px-3">
                        <button type="button" onClick={() => setActivateTab('profile')} className={classNames(
                            state.activeTab === 'profile' ? 'text-amber-700 bg-amber-100' : 'text-slate-700 hover:bg-slate-100',
                            "text-sm items-center w-full text-left py-2 px-6 rounded-md my-1"
                        )}>
                            <span className="flex flex-row align-middle items-center">
                                <span className="flex-auto">
                                    Account Profile
                                </span>
                            </span>
                        </button>

                        {
                            auth0.identity.provider === 'password' ? (
                                <button type="button" onClick={() => setActivateTab('email')} className={classNames(
                                    state.activeTab === 'email' ? 'text-amber-700 bg-amber-100' : 'text-slate-700 hover:bg-slate-100',
                                    "text-sm items-center w-full text-left py-2 px-6 rounded-md my-1"
                                )}>
                                    <span className="flex flex-row align-middle items-center">
                                        <span className="flex-auto">
                                            Change Email
                                        </span>
                                    </span>
                                </button>
                            ) : null
                        }
                    </nav>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden py-3">
                    <main className="flex-1 p-4 overflow-y-auto border-gray-200 md:border-l">
                        <div className="container mx-auto px-2 md:px-4 py-4 border-t md:border-t-0">
                            {loadRespectiveTab(state.activeTab)}
                        </div>
                    </main>
                </div>
            </div>
        </React.Fragment>
    )
}