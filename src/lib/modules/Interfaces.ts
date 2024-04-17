/*
* Generic Interface Listing
*
* */

export interface HTTP_Error_Interface {
    compact?: boolean,
}

export interface Generic_Error_Interface {
	title?: string,
	description: any
}

export interface Basic_Modal_Props {
    uuid?: any,
    reload?: any,
    show: boolean,
    showOrHide: any,
}

export interface Line_Chart_Props {
    labels: any,
    dataset: any,
    title: string,
}

export interface Core_Side_B_Props {
    location: any,
}

export interface Search_Box_Props {
    state: any,
    formHandler: any,
    onInputBlur: any,
    onChangeHandler: any,
}

export interface Doc_Details_Props {
    docs: any,
}
