import React, { FC, useState } from "react";

import { FQDN } from "../../api/API_Controller";
import { Loading } from "../../components/modules/Loading";
import { DynamicModal } from "../../lib/hooks/DynamicModal";
import { Basic_Modal_Props } from "../../lib/modules/Interfaces";

export const DocumentView: FC<Basic_Modal_Props> = ({ show, showOrHide, uuid }) => {
    const [isLoading, setIsLoading] = useState(true);

    const handleImageLoaded = () => {
        setIsLoading(false);
    };

    return (
        <React.Fragment>
            <DynamicModal
                size={"md"}
                title={'Document View'}
                status={'fulfilled'}
                show={show}
                posting={false}
                showOrHideModal={showOrHide}
                actionButton={"Close"}
                onFormSubmitHandler={undefined}
                formComponents={
                    <>
                        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                            {
                                isLoading && (
                                    <div className="w-full h-full flex flex-col justify-center">
                                        <div className="flex-grow">
                                            <Loading />
                                        </div>
                                    </div>
                                )
                            }
                            <img className="rounded-md max-w-full h-56" src={`${FQDN}/files/documents/${uuid}`} alt={uuid}
                                onLoad={handleImageLoaded}
                                style={{ display: isLoading ? 'none' : 'block', width: '100%', height: 'auto' }}
                            />
                        </div>
                    </>
                }
            />
        </React.Fragment>
    )
}