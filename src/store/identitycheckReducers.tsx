import { IDENTITY_, PREFLIGHT_, STORAGE_KEYS } from "../global/ConstantsRegistry";
import StorageServices from "../services/StorageServices";

const identityState = {
    error: null,
    PFg0: 'CNF_gA',
    PRc0: 'META_00',
    processing: false,
}

export const identityCheckReducer = (state = identityState, action: any) => {
    const metaPRc0State = StorageServices.getLocalStorage(STORAGE_KEYS.PRc0_STATE)
    const metaPFg0State = StorageServices.getLocalStorage(STORAGE_KEYS.PFg0_STATE)
    let metaErrMsg = null

    switch (action.type) {
        case IDENTITY_.PRc0:
            const metaPRc0 = action.response.dataDump.PRc0
            StorageServices.setLocalStorage(STORAGE_KEYS.PRc0_STATE, metaPRc0)

            return {
                ...state,
                PRc0: metaPRc0
            }

        case IDENTITY_.RESET_:
            return {
                ...state,
                error: null,
                processing: false,
                PRc0: metaPRc0State,
            }

        case IDENTITY_.PROCESSING:
            return {
                ...state,
                error: null,
                processing: true,
                PRc0: metaPRc0State,
            }

        case IDENTITY_.PRc0_UPDATE:
            const PRc0Code = metaPRc0State.charAt(metaPRc0State.length - 1);
            const nextPRc0 = 'META_0' + (parseInt(PRc0Code) + 1)
            StorageServices.setLocalStorage(STORAGE_KEYS.PRc0_STATE, nextPRc0)

            return {
                ...state,
                processing: false,
                PRc0: nextPRc0,
                error: null,
            }

        case IDENTITY_.PRc0_EXCEPTION:
            metaErrMsg = action.response
            console.log('PRc0_EXCEPTION: ', metaPRc0State);

            return {
                ...state,
                processing: false,
                error: metaErrMsg,
                PRc0: metaPRc0State,
            }

        case IDENTITY_.PRc0_COMPLETED:
            const metaPRc0_Complete = action.response.PRc0
            console.log('COMP', metaPRc0_Complete);

            StorageServices.setLocalStorage(STORAGE_KEYS.PRc0_STATE, metaPRc0_Complete)

            return {
                ...state,
                processing: false,
                PRc0: metaPRc0_Complete,
                error: null,
            }

        case PREFLIGHT_.PFg0:
            const metaPFg0 = action.response.dataDump.PFg0
            StorageServices.setLocalStorage(STORAGE_KEYS.PFg0_STATE, metaPFg0)

            return {
                ...state,
                PFg0: metaPFg0
            }

        case PREFLIGHT_.RESET_:
            return {
                ...state,
                error: null,
                processing: false,
                PFg0: metaPFg0State,
            }

        case PREFLIGHT_.PROCESSING:
            return {
                ...state,
                error: null,
                processing: true,
                PFg0: metaPFg0State,
            }

        case PREFLIGHT_.PFg0_UPDATE:
            const PFg0Code = metaPFg0State.charAt(metaPFg0State.length - 1);
            const nextChar = String.fromCharCode(PFg0Code.charCodeAt(0) + 1);
            
            const nextPFg0 = 'CNF_g' + nextChar
            StorageServices.setLocalStorage(STORAGE_KEYS.PFg0_STATE, nextPFg0)

            return {
                ...state,
                error: null,
                PFg0: nextPFg0,
                processing: false,
            }

        case PREFLIGHT_.PFg0_EXCEPTION:
            metaErrMsg = action.response
            console.log('PFg0_EXCEPTION: ', metaPFg0State);

            return {
                ...state,
                processing: false,
                error: metaErrMsg,
                PFg0: metaPFg0State,
            }

        default:
            return state;
    }
}