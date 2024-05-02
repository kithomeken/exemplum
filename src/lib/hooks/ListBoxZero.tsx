import { FC, Fragment, useEffect, useRef } from 'react';
import { Listbox, Transition } from '@headlessui/react';

interface Props {
    label?: any;
    state: any;
    width?: any;
    listButton: any;
    listOptions: any;
    onChangeListBoxHandler: any;
}

export const ListBoxZero: FC<Props> = ({
    label,
    listButton,
    listOptions,
    state,
    onChangeListBoxHandler,
    width = 'w-full',
}) => {
    function classNames(...classes) {
        return classes.filter(Boolean).join(' ');
    }

    const randomId = generateString(7);
    const listboxRef = useRef(null);

    useEffect(() => {
        width = listboxRef.current?.offsetWidth || width;
    }, [width]);



    return (
        <Listbox value={state} onChange={(event) => onChangeListBoxHandler(event)}>
            {({ open }) => (
                <>
                    <Listbox.Label className="block w-full text-sm text-gray-500 mb-2">{label}</Listbox.Label>

                    <div className="mt-1 relative" ref={listboxRef}>
                        <Listbox.Button
                            id={randomId}
                            className="relative w-full _lsBnQY bg-white border border-gray-300 rounded-md shadow-sm p-1-5 pl-3 pr-8 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                        >
                            {listButton}
                        </Listbox.Button>

                        {open && (
                            <div
                                className={classNames(
                                    'absolute left-0 mt-2 bg-white z-20 shadow-lg max-h-36 w-full rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm',
                                    width
                                )}
                            >
                                <Listbox.Options style={{ width: '100%' }}>
                                    {listOptions}
                                </Listbox.Options>
                            </div>
                        )}
                    </div>
                </>
            )}
        </Listbox>
    );
};

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function generateString(length: number) {
    let result = ' ';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}
