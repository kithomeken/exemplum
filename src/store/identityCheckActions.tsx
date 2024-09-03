import { AUTH, PREFLIGHT } from "../api/API_Registry";
import { AUTH_, IDENTITY_, PREFLIGHT_, STORAGE_KEYS } from "../global/ConstantsRegistry";
import HttpServices from "../services/HttpServices";
import StorageServices from "../services/StorageServices";

interface IdentityProps {
    dataDump: any,
}

export function setPRc0MetaStage(propsIn: IdentityProps) {
    return (dispatch: (arg0: { type: string; response: any }) => void) => {
        const IdentityProps = { ...propsIn }

        dispatch({
            type: IDENTITY_.PRc0,
            response: IdentityProps,
        });
    }
}

export function setPFg0MetaStage(propsIn: IdentityProps) {
    return (dispatch: (arg0: { type: string; response: any }) => void) => {
        const metaProps = { ...propsIn }

        dispatch({
            type: PREFLIGHT_.PFg0,
            response: metaProps,
        });
    }
}

export function overridePFg0MetaStage(propsIn: IdentityProps) {
    return (dispatch: (arg0: { type: string; response: any }) => void) => {
        const ovrProps = { ...propsIn }

        dispatch({
            type: PREFLIGHT_.PFg0_OVRD,
            response: ovrProps,
        });
    }
}

export function overridePRc0MetaStage(propsIn: IdentityProps) {
    return (dispatch: (arg0: { type: string; response: any }) => void) => {
        const override = { ...propsIn }

        dispatch({
            type: IDENTITY_.PRc0_OVRD,
            response: override,
        });
    }
}

export function addIdentityToProfile(propsIn: IdentityProps) {
    return async (dispatch: (arg0: { type: string; response: any }) => void) => {
        const IdentityProps = { ...propsIn }

        dispatch({
            type: IDENTITY_.PROCESSING,
            response: 'PRc0',
        });

        try {
            let formData = new FormData()
            const dataDump = IdentityProps.dataDump

            if (dataDump.keepName) {
                formData.append('display_name', dataDump.display_name)
            } else {
                formData.append('last_name', dataDump.last_name)
                formData.append('first_name', dataDump.first_name)
            }

            const identityResponse: any = await HttpServices.httpMultipartForm(AUTH.ID_META_01, formData)

            if (identityResponse.data.success) {
                dispatch({
                    type: AUTH_.ID_META_01,
                    response: {
                        keepName: dataDump.keepName,
                        last_name: dataDump.last_name,
                        first_name: dataDump.first_name,
                        display_name: dataDump.display_name,
                    },
                });

                identityDocUpload(propsIn)

                dispatch({
                    type: IDENTITY_.PRc0_UPDATE,
                    response: 'PRc0',
                });
            } else {
                dispatch({
                    type: IDENTITY_.PRc0_EXCEPTION,
                    response: '',
                });
            }
        } catch (error) {
            dispatch({
                type: IDENTITY_.PRc0_EXCEPTION,
                response: error,
            });
        }
    }
}

async function identityDocUpload(propsIn: IdentityProps) {
    const IdentityProps = { ...propsIn }

    try {
        let formData = new FormData()
        const dataDump = IdentityProps.dataDump

        formData.append('id_type', dataDump.id_type)
        formData.append('docPhoto', dataDump.docPhoto)
        formData.append('identifier', dataDump.identifier)

        const identityResponse: any = await HttpServices.httpMultipartForm(AUTH.ID_META_UPLOAD, formData)

        console.log('Identity Doc Upload', identityResponse);
    } catch (error) {
        console.log('Identity Doc Upload', error);
    }
}

export function captainIdentityLog(propsIn: IdentityProps) {
    return async (dispatch: (arg0: { type: string; response: any }) => void) => {
        const IdentityProps = { ...propsIn }

        dispatch({
            type: PREFLIGHT_.PROCESSING,
            response: 'PFg0',
        });

        try {
            let formData = new FormData()
            const dataDump = IdentityProps.dataDump

            let identity: any = {
                display_name: dataDump.display_name,
                first_name: dataDump.first_name,
                last_name: dataDump.last_name
            }

            if (dataDump.keepName) {
                formData.append('display_name', dataDump.display_name)
                const nameParts = dataDump.display_name.split(' ');

                identity.first_name = nameParts[0];
                identity.last_name = nameParts[nameParts.length - 1]
            } else {
                formData.append('last_name', dataDump.last_name)
                formData.append('first_name', dataDump.first_name)
            }

            const identityResponse: any = await HttpServices.httpPost(PREFLIGHT.CAPTAIN_IDENTITY, formData)

            if (identityResponse.data.success) {
                dispatch({
                    type: AUTH_.ID_META_01,
                    response: {
                        keepName: dataDump.keepName,
                        last_name: identity.last_name,
                        first_name: identity.first_name,
                        display_name: identity.display_name,
                    },
                });

                dispatch({
                    type: PREFLIGHT_.PFg0_UPDATE,
                    response: 'PFg0',
                });
            } else {
                dispatch({
                    type: PREFLIGHT_.PFg0_EXCEPTION,
                    response: '',
                });
            }
        } catch (error) {
            dispatch({
                type: PREFLIGHT_.PFg0_EXCEPTION,
                response: error,
            });
        }
    }
}

export function addMSISDN_ToProfile(propsIn: IdentityProps) {
    return async (dispatch: (arg0: { type: string; response: any }) => void) => {
        const IdentityProps = { ...propsIn }

        dispatch({
            type: IDENTITY_.PROCESSING,
            response: {
                redirect: false,
            },
        });

        try {
            let formData = new FormData()
            const dataDump = IdentityProps.dataDump

            formData.append('msisdn', dataDump.msisdn)

            const identityResponse: any = await HttpServices.httpPut(AUTH.ID_META_02, formData)

            if (identityResponse.data.success) {
                dispatch({
                    type: AUTH_.ID_META_02,
                    response: dataDump,
                });

                dispatch({
                    type: IDENTITY_.PRc0_UPDATE,
                    response: 'PRc0',
                });
            } else {
                let errorMsg = identityResponse.data.msisdn[0]
                errorMsg = errorMsg.replace('msisdn', 'phone number')

                dispatch({
                    type: IDENTITY_.PRc0_EXCEPTION,
                    response: errorMsg,
                });
            }
        } catch (error) {
            dispatch({
                type: IDENTITY_.PRc0_EXCEPTION,
                response: error,
            });
        }
    }
}

export function capitanSecuris(propsIn: IdentityProps) {
    return async (dispatch: (arg0: { type: string; response: any }) => void) => {
        const IdentityProps = { ...propsIn }

        dispatch({
            type: PREFLIGHT_.PROCESSING,
            response: 'PFg0',
        });

        try {
            let formData = new FormData()
            const dataDump = IdentityProps.dataDump
            formData.append('msisdn', dataDump.msisdn)

            const securisResponse: any = await HttpServices.httpPut(PREFLIGHT.CAPTAIN_SECURIS, formData)

            if (securisResponse.data.success) {
                dispatch({
                    type: AUTH_.ID_META_02,
                    response: dataDump,
                });

                dispatch({
                    type: PREFLIGHT_.PFg0_UPDATE,
                    response: 'PFg0',
                });
            } else {
                let errorMsg = securisResponse.data.msisdn[0]
                errorMsg = errorMsg.replace('msisdn', 'phone number')

                dispatch({
                    type: PREFLIGHT_.PFg0_EXCEPTION,
                    response: errorMsg,
                });
            }
        } catch (error) {
            dispatch({
                type: PREFLIGHT_.PFg0_EXCEPTION,
                response: error,
            });
        }
    }
}

export function artistEntityCreation(propsIn: IdentityProps) {
    return async (dispatch: (arg0: { type: string; response: any }) => void) => {
        const IdentityProps = { ...propsIn }

        dispatch({
            type: IDENTITY_.PROCESSING,
            response: {
                redirect: false,
            },
        });

        try {
            let formData = new FormData()
            const dataDump = IdentityProps.dataDump
            const entityHash = StorageServices.getLocalStorage(STORAGE_KEYS.ENTITY_HASH)

            formData.append('bio', dataDump.bio)
            formData.append('type', dataDump.type)
            formData.append('entity', dataDump.entity)
            formData.append('artist', dataDump.artist)

            if (entityHash !== null && entityHash !== undefined) {
                formData.append('hash', entityHash);
            }

            const identityResponse: any = await HttpServices.httpPost(AUTH.ID_META_03, formData)

            if (identityResponse.data.success) {
                // Save the entity type to local storage
                StorageServices.setLocalStorage(STORAGE_KEYS.ENTITY_TYPE, dataDump.specificObject)

                dispatch({
                    type: AUTH_.ID_META_03,
                    response: identityResponse.data.payload,
                });

                dispatch({
                    type: IDENTITY_.PRc0_COMPLETED,
                    response: identityResponse.data.payload,
                });
            } else {
                dispatch({
                    type: IDENTITY_.PRc0_EXCEPTION,
                    response: identityResponse.data,
                });
            }
        } catch (error) {
            dispatch({
                type: IDENTITY_.PRc0_EXCEPTION,
                response: error,
            });
        }
    }
}

export function resetIdentity() {
    return (dispatch: (arg0: { type: string; response: any }) => void) => {
        dispatch({
            type: IDENTITY_.RESET_,
            response: {
                redirect: false,
            },
        });
    }
}

export function resetCNF_g() {
    return (dispatch: (arg0: { type: string; response: any }) => void) => {
        dispatch({
            type: PREFLIGHT_.RESET_,
            response: {
                redirect: false,
            },
        });
    }
}

export function setMpesaCredentials(propsIn: IdentityProps) {
    return async (dispatch: (arg0: { type: string; response: any }) => void) => {
        const IdentityProps = { ...propsIn }

        dispatch({
            type: PREFLIGHT_.PROCESSING,
            response: 'PFg0',
        });

        try {
            let formData = new FormData()
            const dataDump = IdentityProps.dataDump

            formData.append('trans_min', dataDump.trans_min)
            formData.append('trans_max', dataDump.trans_max)
            formData.append('pass_key', dataDump.pass_key)
            formData.append('init_name', dataDump.init_name)
            formData.append('short_code', dataDump.short_code)
            formData.append('init_passwd', dataDump.init_passwd)
            formData.append('customer_key', dataDump.customer_key)
            formData.append('customer_secret', dataDump.customer_secret)

            const credentialsResp: any = await HttpServices.httpPost(PREFLIGHT.MPESA_CREDENTIALS, formData)

            if (credentialsResp.data.success) {
                dispatch({
                    type: PREFLIGHT_.PFg0_UPDATE,
                    response: 'PFg0',
                });
            } else {
                dispatch({
                    type: PREFLIGHT_.PFg0_EXCEPTION,
                    response: 'Something went wrong. Could not complete action',
                });
            }
        } catch (error) {
            dispatch({
                type: PREFLIGHT_.PFg0_EXCEPTION,
                response: error,
            });
        }
    }
}