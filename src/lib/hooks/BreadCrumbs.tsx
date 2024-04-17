import React, { FC } from "react";
import { Link } from "react-router-dom";

interface Props {
    breadCrumbDetails: (
        {
            linkItem: boolean,
            title: string,
            url?: any
        }
    )[]
}

export const BreadCrumbs: FC<Props> = ({breadCrumbDetails}) => {

    return (
        <React.Fragment>
            <ul className="w-full flex flex-row items-center mb-3 text-sm text-slate-500">
                <li>
                    <span className="w-5 h-5">
                        <span className="fa-regular fa-cog"></span>
                    </span>
                </li>

                {breadCrumbDetails.map(
                    (crumb, index) => (
                        <li className="ml-3 breadcrumb-item" key={index}>
                            {
                                crumb.linkItem ? (
                                    <Link to={crumb.url} key={index}>
                                        <span className="lttr-spc">
                                            {crumb.title}
                                        </span>
                                    </Link>
                                ) : (
                                    <span className="lttr-spc text-slate-700">
                                        {crumb.title}
                                    </span>
                                )
                            }
                        </li>
                    )
                )}
            </ul>
        </React.Fragment>
    )
}