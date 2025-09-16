import { Ellipsis, Trash, Pencil } from 'lucide-react'

import { getPersonName, deleteItem } from '../data'
import { roundTwoDecimals } from '../utils/utils'

export default function ItemsTable({ onEditClick, persons, items }) {
  const txs = computeTxs(items, persons)

  if (!items || items.length < 1) {
    return (
      <>
        <div style={{ opacity: '30%' }}>No data available.</div>
        <div style={{ opacity: '30%' }}>Add ka muna ng person and item.</div>
      </>
    )
  }

  return (
    <>
      <div className='w-full flex items-center flex-col'>
        <h1 className='font-semibold text-xl'>Utangan</h1>
        <div className='overflow-x-auto md:px-10 w-fit'>
          <table className='table table-zebra table-xs text-center'>
            <thead>
              <tr>
                <th>Name</th>
                <th>Will Receive</th>
                <th>Will Pay</th>
              </tr>
            </thead>
            <tbody>
              {persons.map((person, index) => {
                const tally = computeTallyOfPerson(txs, person.id)
                return (
                  <tr key={index}>
                    <th>{person.name}</th>
                    {tally > 0 ? (
                      <ColoredTableData
                        index={index}
                        key={index}
                        amount={tally}
                      />
                    ) : (
                      <td>
                        <span className='opacity-30'>—</span>
                      </td>
                    )}
                    {tally < 0 ? (
                      <ColoredTableData
                        index={index}
                        key={index}
                        amount={tally}
                      />
                    ) : (
                      <td>
                        <span className='opacity-30'>—</span>
                      </td>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div
        className='divider'
        style={{ width: '75%', margin: '1.5rem auto 0.5rem' }}
      ></div>

      <div className='w-full flex items-center flex-col'>
        <h1 className='font-semibold text-xl mt-5'>Nagbayad</h1>
        <div className='overflow-x-auto md:px-10 w-fit'>
          <table className='table table-zebra table-xs text-center'>
            <thead>
              <tr>
                <th>Item</th>
                {persons.map((person, index) => (
                  <th key={index}>{person.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>
                      <div>{item.itemName}</div>
                    </td>
                    {persons.map((person, index) => {
                      const amount = item.payers.find(
                        (payer) => payer.personId === person.id
                      )?.amount

                      return (
                        <td key={index}>
                          {amount ? (
                            '₱' + amount
                          ) : (
                            <span className='opacity-30'>—</span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
            <tfoot>
              <tr>
                <td></td>
                {persons.map((person, index) => {
                  return (
                    <td key={index}>
                      ₱{computeTotalSpentOfPerson(items, person.id)}
                    </td>
                  )
                })}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div
        className='divider'
        style={{ width: '75%', margin: '1.5rem auto 0.5rem' }}
      ></div>

      <div className='w-full flex items-center flex-col'>
        <h1 className='font-semibold text-xl mt-5'>Hatian Breakdown</h1>
        <div className='overflow-x-auto md:px-10 px-2 w-full md:w-fit'>
          <table className='table table-zebra text-center table-xs table-pin-rows table-pin-cols text-nowrap table-auto'>
            <thead>
              <tr>
                <td></td>
                <td>Item</td>
                <td>Paid By?</td>
                <td>Hatian</td>
                {persons.map((person, index) => (
                  <td key={index}>{person.name}</td>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                return (
                  <tr key={item.txId}>
                    <td className='actions'>
                      <div className='dropdown'>
                        <div
                          tabIndex={0}
                          role='button'
                          className='btn btn-xs m-1'
                        >
                          <Ellipsis size={14} />
                        </div>
                        <ul
                          tabIndex={0}
                          className='dropdown-content menu bg-base-100 rounded-box z-1 w-min-content p-2 shadow-sm'
                        >
                          <li>
                            <button
                              className='btn btn-ghost btn-xs'
                              onClick={() => {
                                document.activeElement.blur()
                                document.querySelector(
                                  '#add_item'
                                ).checked = true
                                onEditClick(item.txId)
                              }}
                            >
                              Edit <Pencil size={12} />
                            </button>
                          </li>
                          <li>
                            <button
                              className='btn btn-ghost btn-xs'
                              onClick={() => {
                                document.activeElement.blur()

                                if (
                                  confirm(
                                    `Do you want to delete item: ${item.itemName}?`
                                  )
                                ) {
                                  deleteItem(item.txId)
                                }
                              }}
                            >
                              Delete <Trash size={12} />
                            </button>
                          </li>
                        </ul>
                      </div>
                    </td>
                    <td>
                      <div className='font-bold text-xs'>{item.itemName}</div>
                      <div>₱{roundTwoDecimals(item.total)}</div>
                      <div>
                        {item.serviceCharge
                          ? '(SC: ' + item.serviceCharge + '%)'
                          : ''}
                      </div>
                    </td>
                    <td>
                      {item.payers.map(({ id, personId, amount }) => (
                        <div key={id} className='w-full'>
                          {getPersonName(personId)}
                          {amount < item.total ? (
                            ' – ₱' + roundTwoDecimals(amount)
                          ) : (
                            <div>(Full)</div>
                          )}
                        </div>
                      ))}
                    </td>
                    <td>
                      <div>
                        ₱{roundTwoDecimals(item.total / item.buyers.length)} ea.
                      </div>
                      <div>
                        {item.buyers.length}{' '}
                        {item.buyers.length > 1 ? 'persons' : 'person'}
                      </div>
                    </td>
                    {persons.map((person, index) => {
                      const amount =
                        roundTwoDecimals(txs[person.id][item.txId]) || 0
                      return (
                        <ColoredTableData
                          index={index}
                          key={index}
                          amount={amount}
                        />
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>

            <tfoot>
              <tr>
                <td></td>
                <td className='text-info'>
                  ₱
                  {roundTwoDecimals(
                    items.reduce((total, item) => total + item.total, 0)
                  )}
                </td>
                <td></td>
                <td className='text-right'>Receive/Pay:</td>
                {persons.map((person, index) => {
                  const tally = computeTallyOfPerson(txs, person.id)
                  return (
                    <ColoredTableData
                      index={index}
                      key={index}
                      amount={tally}
                    />
                  )
                })}
                <td></td>
              </tr>
              <tr className='text-xs text-center'>
                <td></td>
                <td></td>
                <td></td>
                <td className='text-right'>Consumed:</td>
                {persons.map((person, index) => {
                  const TotalConsumed = computeTotalConsumedOfPerson(
                    items,
                    person.id
                  )
                  return <td key={index}>₱{TotalConsumed}</td>
                })}
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </>
  )
}

const computeTxs = (items, persons) => {
  let txs = {}
  persons.forEach((person) => {
    txs[person.id] = {}
  })

  persons.forEach((person) => {
    items.forEach((item) => {
      const paidByThisPerson =
        item.payers.find((payer) => payer.personId === person.id)?.amount || 0
      let amountShare = 0
      if (item.buyers.includes(person.id)) {
        amountShare = item.total / item.buyers.length
      }

      txs[person.id][item.txId] = paidByThisPerson - amountShare
    })
  })

  return txs
}

const computeTallyOfPerson = (txs, id) => {
  let total = 0
  Object.values(txs[id]).forEach((amount) => {
    total += amount
  })

  return roundTwoDecimals(total)
}

const ColoredTableData = ({ amount, index }) => {
  if (amount === 0) {
    return (
      <td key={index}>
        <span className='opacity-30'>—</span>
      </td>
    )
  }

  return (
    <td key={index} className={amount > 0 ? 'text-success' : 'text-warning'}>
      {amount > 0 ? '₱' + amount : '-₱' + Math.abs(amount)}
    </td>
  )
}

const computeTotalConsumedOfPerson = (items, id) => {
  let total = 0

  items.forEach((item) => {
    if (item.buyers.includes(id)) {
      total += item.total / item.buyers.length
    }
  })

  return roundTwoDecimals(total)
}

const computeTotalSpentOfPerson = (items, id) => {
  const total = items.reduce((total, item) => {
    return (total +=
      item.payers.find(({ personId }) => personId === id)?.amount || 0)
  }, 0)

  return total
}
