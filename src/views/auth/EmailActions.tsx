import React, { useState } from "react"
import { useLocation } from "react-router-dom"
import { applyActionCode } from "firebase/auth"

import { ERR_500 } from "../errors/ERR_500"
import { GenericError } from "../errors/GenericError"
import { Loading } from "../../components/modules/Loading"
import { firebaseAuth } from "../../firebase/firebaseConfigs"
import emptyBox from "../../assets/images/12704364_5041143.svg"

export const EmailActions = () => {
    const [state, setstate] = useState({
        httpStatus: 200,
        status: 'pending',
        data: null
    })

    React.useEffect(() => {
        parseQueryString()
    }, [])

    const location = useLocation()

    function parseQueryString() {
        const params = {};
        let { data } = state
        let search = location.search

        if (search) {
            search
                .slice(1) // Remove the leading '?'
                .split('&') // Split by '&' to get individual key-value pairs
                .forEach(pair => {
                    const [key, value] = pair.split('='); // Split each pair by '=' to get key and value
                    params[key] = decodeURIComponent(value || ''); // Decode URI component and assign to params
                });
        }

        data = params;

        switch (data.mode) {
            case 'recoverEmail':
                // handleRecoverEmail(auth, actionCode, lang);
                break;

            case 'verifyEmail':
                handleVerifyEmail(data.oobCode, data.lang);
                break;

            default:
            // Error: invalid mode.
        }

        return params;
    }

    function handleVerifyEmail(actionCode: any, lang: any) {
        let { status } = state
        let { httpStatus } = state
        firebaseAuth.languageCode = lang

        applyActionCode(firebaseAuth, actionCode).then((resp) => {
            console.log('DNEOS20-32', resp);
            status = 'fulfilled'

            setstate({
                ...state, status, httpStatus
            })

            // TODO: Display a confirmation message to the user.
            // You could also provide the user with a link back to the app.

            // TODO: If a continue URL is available, display a button which on
            // click redirects the user back to the app via continueUrl with
            // additional state determined from that URL's parameters.
        }).catch((error) => {
            status = 'rejected'
            const errorCode = error.code;
            let errorMessage = error.message;

            let popUpErrors = [
                'auth/user-disabled',
                'auth/expired-action-code',
                'auth/invalid-action-code',
            ]

            if (popUpErrors.includes(errorCode)) {
                httpStatus = 403
            } else {
                httpStatus = 500
                errorMessage = null
            }

            setstate({
                ...state, status, httpStatus
            })
        });
    }

    return (
        <React.Fragment>
            {
                state.status === 'rejected' ? (
                    state.httpStatus === 403 ? (
                        <GenericError
                            description={"The verification link you followed is probably broken or the lifespan has expired. Kindly request for a new invitation link"}
                        />
                    ) : (
                        <ERR_500 />
                    )
                ) : state.status === 'fulfilled' ? (
                    <div className="w-full h-screen flex flex-col justify-center align-middle items-center">
                        <div className="mx-auto my-2 px-4">
                            <img src={emptyBox} alt="broken_robot" width="auto" className="block text-center m-auto w-68" />

                            <div className="text-center m-auto text-slate-600 py-2 md:w-96">
                                <span className="text-orange-600 mb-2 block">
                                    Verification Successful
                                </span>

                                <div className="text-sm">
                                    Your email has been successfully verified. You can now enjoy full access to our services
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="w-full h-screen flex flex-col justify-center align-middle items-center">
                        <Loading />
                    </div>
                )
            }
        </React.Fragment>
    )
}