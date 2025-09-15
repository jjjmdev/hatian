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
                    <td className='actions'>
                      <button
                        className='btn btn-ghost btn-xs'
                        onClick={() => {
                          if (
                            confirm(
                              `Do you want to delete item: ${item.itemName}?`
                            )
                          ) {
                            deleteItem(item.txId)
                          }
                        }}
                      >
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='16'
                          height='16'
                          fill='currentColor'
                          className='bi bi-trash'
                          viewBox='0 0 16 16'
                        >
                          <path d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z' />
                          <path d='M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z' />
                        </svg>
                      </button>
                      <button
                        className='btn btn-ghost btn-xs'
                        onClick={() => {
                          document.querySelector('#add_item').checked = true
                          onEditClick(item.txId)
                        }}
                      >
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='16'
                          height='16'
                          fill='currentColor'
                          className='bi bi-pencil-square'
                          viewBox='0 0 16 16'
                        >
                          <path d='M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z' />
                          <path
                            fillRule='evenodd'
                            d='M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z'
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>

            <tfoot>
              <tr>
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

      <div
        className='divider'
        style={{ width: '75%', margin: '1.5rem auto 0.5rem' }}
      ></div>
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
