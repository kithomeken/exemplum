import React, { FC } from "react"
import { BreadCrumbs } from "../../lib/hooks/BreadCrumbs"
import { DropDown } from "../lib/DropDown"

interface settingsProps {
    width?: any,
    menuItems?: any,
    breadCrumbs?: any,
    pageTitle: any,
    actionName: string,
    onClickAction: any,
}

export const SettingsHeader: FC<settingsProps> = ({ pageTitle, actionName, onClickAction, breadCrumbs, menuItems, width }) => {

    return (
        <React.Fragment>
            <div className="w-full">
                <BreadCrumbs breadCrumbDetails={breadCrumbs} />

                <div className="flex flex-row align-middle mb-3 items-center">
                    <p className="text-xl lttr-spc flex-auto text-green-500">
                        {pageTitle}
                    </p>

                    {
                        actionName && (
                            <button type="button" onClick={onClickAction} className={`flex-none items-center px-4 py-1-5 border border-green-500 bg-green-500 rounded shadow-none text-sm text-white hover:text-white hover:border hover:border-green-600 hover:bg-green-600 focus:outline-none focus:ring-0`}>
                                <span className="text-sm">
                                    {actionName}
                                </span>
                            </button>
                        )
                    }

                    {
                        menuItems && (
                            <DropDown
                                menuItems={menuItems}
                                width={width} />
                        )
                    }
                </div>
            </div>
        </React.Fragment>
    )
}