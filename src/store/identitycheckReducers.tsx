import { IDENTITY_, STORAGE_KEYS } from "../global/ConstantsRegistry";
import StorageServices from "../services/StorageServices";

const identityState = {
    processing: false,
    error: null,
    PRc0: 'META_00',
}

export const identityCheckReducer = (state = identityState, action: any) => {
    const metaPRc0State = StorageServices.getLocalStorage(STORAGE_KEYS.PRc0_STATE)

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
            const currPRc0State = StorageServices.getLocalStorage(STORAGE_KEYS.PRc0_STATE)
            const PRc0Code = currPRc0State.charAt(currPRc0State.length - 1);
            const nextPRc0 = 'META_0' + (parseInt(PRc0Code) + 1)
            StorageServices.setLocalStorage(STORAGE_KEYS.PRc0_STATE, nextPRc0)

            return {
                ...state,
                processing: false,
                PRc0: nextPRc0,
                error: null,
            }

        case IDENTITY_.PRc0_EXCEPTION:
            let metaErrMsg = action.response
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

        default:
            return state;
    }
}