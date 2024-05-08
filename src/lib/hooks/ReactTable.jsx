import React, { } from 'react'
import { useTable, usePagination } from 'react-table'

export default function ReactTable({ columns, data, hidePagination = false, showPageSize = false }) {
    // Use the state and functions returned from useTable to build your UI
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize },
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0 },
        },
        usePagination
    )

    let pageCountArray = []
    let dataLength = data.length
    let firstItemOnPageFromData = (pageSize * pageIndex) + 1
    let lastItemOnPageFromData = (pageCount !== (pageIndex + 1)) ? ((pageSize * pageIndex) + pageSize) : (dataLength)

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }

    function mapPageCountToArray() {
        var i = 0
        while (++i <= pageCount) pageCountArray.push(i);
    }

    mapPageCountToArray()

    return (
        <>
            {
                showPageSize ? (
                    <div className="w-12/12 mb-3 flex items-center align-middle">
                        <div className="">
                            <select
                                className="relative bg-white border-0 border-gray-300 rounded-md shadow-none pl-3 pr-3 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                                value={pageSize}
                                onChange={e => {
                                    setPageSize(Number(e.target.value))
                                }}
                            >
                                {[10, 20, 30, 40, 50].map(pageSize => (
                                    <option key={`PG-${pageSize}`} value={pageSize} className="absolute z-10 mr-2 rounded-sm mt-1 w-full bg-white shadow-lg max-h-56 hover:bg-orange-400 py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                                        Show {pageSize}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                ) : null
            }

            <table {...getTableProps()} className="w-full divide-y divide-gray-200">
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr className="bg-gray-50 dark:bg-gray-700" {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column, index) => (
                                <th
                                    // {...column.getHeaderProps()}
                                    key={column.render("id")}
                                    className={`p-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-white`}>
                                    {column.render("Header")}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>

                <tbody {...getTableBodyProps()}>
                    {page.map((row, index) => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()} key={`TR-${index}`} className="border-b text-gray-600 hover:bg-gray-100">
                                {row.cells.map((cell, indice) => {
                                    return (
                                        <td {...cell.getCellProps()} key={`TD-${index}-${indice}`} className="px-3 py-2 whitespace-nowrap">
                                            {cell.render("Cell")}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <div className="pagination md:mt-6" hidden={hidePagination}>
                <div className="bg-gray-50 px-4 py-3 flex items-center justify-between sm:px-6">
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-500">
                                {firstItemOnPageFromData} - {lastItemOnPageFromData} of {dataLength} results
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md text-orange-600 text-sm" aria-label="Pagination">
                                <button
                                    onClick={() => previousPage()}
                                    disabled={!canPreviousPage}
                                    className="relative inline-flex items-center px-2 py-1.5 shadow-sm rounded mr-2 text-gray-500 border border-gray-300 bg-white text-xs hover:bg-gray-100">
                                    <span className="">Previous</span>
                                </button>

                                {
                                    pageCount <= 10 ? (
                                        <>
                                            {
                                                pageCountArray.map((pageNumber, index) => {
                                                    return (
                                                        <>
                                                            <button
                                                                type="button"
                                                                key={`XDS-${index}`}
                                                                onClick={() => {
                                                                    gotoPage(pageNumber - 1)
                                                                }}
                                                                className={
                                                                    classNames(
                                                                        (pageNumber - 1) === pageIndex ? 'bg-orange-50 border-orange-500 text-orange-600' : 'bg-white border-gray-300  hover:bg-gray-100',
                                                                        'z-10 relative px-3 py-1.5 border text-xs rounded mr-2'
                                                                    )
                                                                }>
                                                                {pageNumber}
                                                            </button>
                                                        </>
                                                    )
                                                })
                                            }
                                        </>
                                    ) : (
                                        <>
                                            {
                                                pageCountArray.map((pageNumber, index) => {
                                                    return (
                                                        <>
                                                            {
                                                                pageNumber < 6 ? (
                                                                    <button
                                                                        type="button"
                                                                        key={`BX-${index}`}
                                                                        onClick={e => {
                                                                            gotoPage(pageNumber - 1)
                                                                        }}
                                                                        className={
                                                                            classNames(
                                                                                (pageNumber - 1) === pageIndex ? 'bg-orange-50 border-orange-500 text-orange-600' : 'bg-white border-gray-300  hover:bg-gray-100',
                                                                                'z-10 relative px-3 py-1.5 border text-xs rounded mr-2'
                                                                            )
                                                                        }>
                                                                        {pageNumber}
                                                                    </button>
                                                                ) : null
                                                            }
                                                        </>
                                                    )
                                                })
                                            }

                                            <span className="z-10 relative px-3 py-1.5 border text-xs bg-white border-gray-300  hover:bg-gray-100">
                                                ...
                                            </span>

                                            {
                                                pageCountArray.map((pageNumber, index) => {
                                                    return (
                                                        <>
                                                            {
                                                                pageNumber === pageCount ? (
                                                                    <button
                                                                        type="button"
                                                                        key={`XR-${index}`}
                                                                        onClick={e => {
                                                                            gotoPage(pageNumber - 1)
                                                                        }}
                                                                        className={
                                                                            classNames(
                                                                                (pageNumber - 1) === pageIndex ? 'bg-orange-50 border-orange-500 text-orange-600' : 'bg-white border-gray-300  hover:bg-gray-100',
                                                                                'z-10 relative px-3 py-1 border text-xs rounded mr-2'
                                                                            )
                                                                        }>
                                                                        {pageNumber}
                                                                    </button>
                                                                ) : null
                                                            }
                                                        </>
                                                    )
                                                })
                                            }
                                        </>
                                    )
                                }

                                <button
                                    onClick={() => nextPage()}
                                    disabled={!canNextPage}
                                    className="relative inline-flex items-center px-2 py-1 rounded text-gray-500 border border-gray-300 bg-white text-xs hover:bg-gray-100">
                                    <span className="">Next</span>
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
