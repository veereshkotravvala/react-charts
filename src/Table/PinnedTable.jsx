import React from 'react'
import ReactDOM from 'react-dom/client'

import './PinnedTable.css'

import {
  ColumnDef,
  ColumnOrderState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { maskData } from './makeData'

const defaultColumns = [
  {
    header: 'Name',
    footer: props => props.column.id,
    columns: [
      {
        accessorKey: 'firstName',
        cell: info => info.getValue(),
        footer: props => props.column.id,
      },
      {
        accessorFn: row => row.lastName,
        id: 'lastName',
        cell: info => info.getValue(),
        header: () => <span>Last Name</span>,
        footer: props => props.column.id,
      },
    ],
  },
  {
    header: 'Info',
    footer: props => props.column.id,
    columns: [
      {
        accessorKey: 'age',
        header: () => 'Age',
        footer: props => props.column.id,
      },
      {
        header: 'More Info',
        columns: [
          {
            accessorKey: 'visits',
            header: () => <span>Visits</span>,
            footer: props => props.column.id,
          },
          {
            accessorKey: 'status',
            header: 'Status',
            footer: props => props.column.id,
          },
          {
            accessorKey: 'progress',
            header: 'Profile Progress',
            footer: props => props.column.id,
          },
        ],
      },
    ],
  },
]

function PinnedTable() {
  const [data, setData] = React.useState(maskData)
  const [columns] = React.useState(() => [...defaultColumns])

  const [columnVisibility, setColumnVisibility] =
    React.useState({})
  const [columnOrder, setColumnOrder] = React.useState([])
  const [columnPinning, setColumnPinning] = React.useState({})

  const [isSplit, setIsSplit] = React.useState(false)
  const rerender = () => setData(() => maskData)

  const table = useReactTable({
    data,
    columns,
    state: {
      columnVisibility,
      columnOrder,
      columnPinning,
    },
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    onColumnPinningChange: setColumnPinning,
    getCoreRowModel: getCoreRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
  })

  const randomizeColumns = () => {
    // table.setColumnOrder(
    //   faker.helpers.shuffle(table.getAllLeafColumns().map(d => d.id))
    // )
  }

  return (
    <div className="p-2">
      <div className="flex border border-black shadow rounded" style={{margin: "10px"}}>
        <div className="px-1 border-b border-black">
          <label>
            <input
              {...{
                type: 'checkbox',
                checked: table.getIsAllColumnsVisible(),
                onChange: table.getToggleAllColumnsVisibilityHandler(),
              }}
            />{' '}
            Toggle All
          </label>
        </div>
        {table.getAllLeafColumns().map(column => {
          return (
            <div key={column.id} className="px-1">
              <label>
                <input
                  {...{
                    type: 'checkbox',
                    checked: column.getIsVisible(),
                    onChange: column.getToggleVisibilityHandler(),
                  }}
                />{' '}
                {column.id}
              </label>
            </div>
          )
        })}
      </div>
      <div className="h-4" />
      <div className="flex flex-wrap gap-2">
        <button onClick={() => rerender()} className="border p-1">
          Regenerate
        </button>
        <button onClick={() => randomizeColumns()} className="border p-1">
          Shuffle Columns
        </button>
      </div>
      <div className="h-4" />
      <div>
        <label>
          <input
            type="checkbox"
            checked={isSplit}
            onChange={e => setIsSplit(e.target.checked)}
          />{' '}
          Split Mode
        </label>
      </div>
      <div className={`flex ${isSplit ? 'gap-4' : ''}`}>
        {isSplit ? (
          <table className="border-2 border-black">
            <thead>
              {table.getLeftHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} colSpan={header.colSpan}>
                      <div className="whitespace-nowrap">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </div>
                      {!header.isPlaceholder && header.column.getCanPin() && (
                        <div className="flex gap-1 justify-center">
                          {header.column.getIsPinned() !== 'left' ? (
                            <button
                              className="border rounded px-2"
                              onClick={() => {
                                header.column.pin('left')
                              }}
                            >
                              {'<='}
                            </button>
                          ) : null}
                          {header.column.getIsPinned() ? (
                            <button
                              className="border rounded px-2"
                              onClick={() => {
                                header.column.pin(false)
                              }}
                            >
                              X
                            </button>
                          ) : null}
                          {header.column.getIsPinned() !== 'right' ? (
                            <button
                              className="border rounded px-2"
                              onClick={() => {
                                header.column.pin('right')
                              }}
                            >
                              {'=>'}
                            </button>
                          ) : null}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table
                .getRowModel()
                .rows.slice(0, 20)
                .map(row => {
                  return (
                    <tr key={row.id}>
                      {row.getLeftVisibleCells().map(cell => {
                        return (
                          <td key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
            </tbody>
          </table>
        ) : null}
        <table className="border-2 border-black">
          <thead>
            {(isSplit
              ? table.getCenterHeaderGroups()
              : table.getHeaderGroups()
            ).map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} colSpan={header.colSpan}>
                    <div className="whitespace-nowrap">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </div>
                    {!header.isPlaceholder && header.column.getCanPin() && (
                      <div className="flex gap-1 justify-center">
                        {header.column.getIsPinned() !== 'left' ? (
                          <button
                            className="border rounded px-2"
                            onClick={() => {
                              header.column.pin('left')
                            }}
                          >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                            <path d="M12 4l-8 8h5v4h6v-4h5l-8-8z"/>
                        </svg>
                          </button>
                        ) : null}
                        {header.column.getIsPinned() ? (
                          <button
                            className="border rounded px-2"
                            onClick={() => {
                              header.column.pin(false)
                            }}
                          >
                            X
                          </button>
                        ) : null}
                        {header.column.getIsPinned() !== 'right' ? (
                          <button
                            className="border rounded px-2"
                            onClick={() => {
                              header.column.pin('right')
                            }}
                          >
                           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                <path d="M12 20l8-8h-5v-4h-6v4h-5l8 8z"/>
                            </svg>
                          </button>
                        ) : null}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table
              .getRowModel()
              .rows.slice(0, 20)
              .map(row => {
                return (
                  <tr key={row.id}>
                    {(isSplit
                      ? row.getCenterVisibleCells()
                      : row.getVisibleCells()
                    ).map(cell => {
                      return (
                        <td key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
          </tbody>
        </table>
        {isSplit ? (
          <table className="border-2 border-black">
            <thead>
              {table.getRightHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} colSpan={header.colSpan}>
                      <div className="whitespace-nowrap">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </div>
                      {!header.isPlaceholder && header.column.getCanPin() && (
                        <div className="flex gap-1 justify-center">
                          {header.column.getIsPinned() !== 'left' ? (
                            <button
                              className="border rounded px-2"
                              onClick={() => {
                                header.column.pin('left')
                              }}
                            >
                              {'<='}
                            </button>
                          ) : null}
                          {header.column.getIsPinned() ? (
                            <button
                              className="border rounded px-2"
                              onClick={() => {
                                header.column.pin(false)
                              }}
                            >
                              X
                            </button>
                          ) : null}
                          {header.column.getIsPinned() !== 'right' ? (
                            <button
                              className="border rounded px-2"
                              onClick={() => {
                                header.column.pin('right')
                              }}
                            >
                              {'=>'}
                            </button>
                          ) : null}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table
                .getRowModel()
                .rows.slice(0, 20)
                .map(row => {
                  return (
                    <tr key={row.id}>
                      {row.getRightVisibleCells().map(cell => {
                        return (
                          <td key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
            </tbody>
          </table>
        ) : null}
      </div>
      <pre>{JSON.stringify(table.getState().columnPinning, null, 2)}</pre>
    </div>
  )
}

export default PinnedTable;