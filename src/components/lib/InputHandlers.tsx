import { isValidPhoneNumber } from "react-phone-number-input";
import { emailValidator, nameValidator, passwordValidator } from "../../lib/modules/HelperFunctions";

export function G_onInputChangeHandler(event: any, posting: boolean) {
    let input: any = {
        error: '',
        name: event.target.name,
        value: event.target.value
    }

    if (!posting) {
        let ifCheckbox: any = (event.target.type === 'checkbox') ? true : false;

        if (ifCheckbox) {
            let checked = event.target.checked;
            let toggleStatus = checked ? 'Y' : 'N'

            input.value = toggleStatus
        } else {
            input.value = event.target.value
        }
    }

    return input
}

export function G_onInputBlurHandler(event: any, posting: boolean, title: any, minChar = 5, maxChar = 30) {
    let input: any = {
        error: '',
        name: event.target.name,
        value: event.target.value.trim()
    }

    if (!posting) {
        let tValue = event.target.value.trim()
        let tName = event.target.name

        let targetTitle = tName.charAt(0).toUpperCase() + tName.slice(1)
        targetTitle = targetTitle.replace('_', ' ')

        let head = title === '' ? targetTitle : title + ' ' + tName.replace('_', ' ')

        if (tValue.length < 1 && event.target.required) {
            /* 
             * Mandatory inputs should not be empty
            */
            switch (tName) {
                case 'amount':
                    input.error = 'Kindly add an amount'
                    break;

                case 'identifier':
                    head = title === 'ID' ? 'National ID' : 'Passport number'
                    input.error = head + ' cannot be empty'
                    break

                default:
                    input.error = head + ' cannot be empty'
                    break
            }

            return input
        }

        switch (tName) {
            case 'name':
                if (tValue.length < minChar) {
                    input.error = head + ' cannot be less than ' + minChar + ' characters'
                    return input
                } else if (tValue.length > maxChar) {
                    input.error = head + ' cannot be more than ' + maxChar + ' characters'
                    return input
                }
                break

            case 'comment':
            case 'description':
                if (tValue.length < 5) {
                    input.error = head + ' cannot be less than 5 characters'
                    return input
                } else if (tValue.length > 200) {
                    input.error = head + ' cannot be more than 200 characters'
                    return input
                }
                break

            case 'amount':
                tValue = tValue.replace(',', '')
                const isValidAmount = /^\d+(\.\d{1,2})?$/.test(tValue);

                if (!isValidAmount) {
                    input.error = isValidAmount ? '' : 'Invalid amount format';
                }
                break

            case 'artist_name':
            case 'first_name':
            case 'last_name':
                if (tValue.length < 3) {
                    input.error = head + ' cannot be less than 3 characters'
                    return input
                } else if (tValue.length > 30) {
                    input.error = head + ' cannot be more than 30 characters'
                    return input
                } else {
                    /* 
                     * Validate name details
                     * Set first character to upper case
                    */
                    tValue = tValue.charAt(0).toUpperCase() + tValue.slice(1)
                    input.value = tValue

                    let isValidName = nameValidator(tValue)

                    if (!isValidName) {
                        input.error = 'Please provide a valid ' + targetTitle.toLowerCase()
                    }
                }
                break

            case 'email':
                let isValidEmail = emailValidator(tValue)

                if (!isValidEmail) {
                    input.error = 'Please provide a valid email address'
                }
                break

            case 'password':
            case 'confirm':
                const pwdMinLength = 8
                const pwdMaxLength = 30

                if (tValue.length < pwdMinLength) {
                    input.error = tName + ' cannot be less than ' + minChar + ' characters'
                    return input
                } else if (tValue.length > pwdMaxLength) {
                    input.error = tName + ' cannot be more than ' + maxChar + ' characters'
                    return input
                } else {
                    let isValidPwd = passwordValidator(tValue)

                    if (!isValidPwd) {
                        input.error = 'Kindly set a strong password '
                        return input
                    }
                }
                break

            case 'msisdn':
                const validPhone = isValidPhoneNumber(tValue)

                if (validPhone) {
                    input.error = 'Kindly add a valid phone number '
                    return input
                }
                break

            case 'identifier':
                tValue = tValue.toUpperCase()

                if (title === 'ID') {
                    const idRegex = /^\d{7,8}$/;

                    if (!idRegex.test(tValue)) {
                        input.error = 'Please provide a valid ' + head
                    }
                } else {
                    const passportRegex = /^[A-Z0-9]{6,9}$/;

                    if (!passportRegex.test(tValue)) {
                        input.error = 'Please provide a valid ' + head
                    }
                }
                break

            default:
                const firstCase = tName
                if (tValue.length < minChar) {
                    input.error = head + ' cannot be less than ' + minChar + ' characters'
                    return input
                } else if (tValue.length > maxChar) {
                    input.error = head + ' cannot be more than ' + maxChar + ' characters'
                    return input
                }
                break
        }
    }

    return input
}