import { useState } from 'react'
import { getPersonName, getPersons, getItems } from '../data'
import { roundTwoDecimals } from '../utils/utils'

export default function ItemsTable() {
	const [items, setItems] = useState(getItems())
	const [persons, setPersons] = useState(getPersons())
	const txs = computeTxs(items, persons)

	window.addEventListener('storage', () => {
		const newItems = getItems()
		const newPersons = getPersons()

		if (items !== newItems) {
			setItems(newItems)
		}
		if (persons !== newPersons) {
			setPersons(newPersons)
		}
	})

	return (
		<>
			<div className='overflow-x-auto'>
				<table
					className='table table-zebra text-center table-xs table-pin-rows table-pin-cols text-nowrap'
					style={{ maxWidth: '1200px', margin: '0 auto' }}
				>
					{/* head */}
					<thead>
						<tr>
							<td>Presyo</td>
							<th>Item Name</th>
							<td>SC?</td>
							<td>Paid By?</td>
							<td>Hatian</td>
							{persons.map((person) => (
								<td>{person.name}</td>
							))}
						</tr>
					</thead>
					<tbody>
						{items.map((item) => {
							return (
								<tr key={item.txId}>
									<td>₱{item.total}</td>
									<th>{item.itemName}</th>
									<td>{item.serviceCharge ? item.serviceCharge + '%' : '—'}</td>
									<td>
										{item.payers.map(({ id, personId, amount }) => (
											<div key={id} className='w-full'>
												{getPersonName(personId)}
												{amount < item.total && ' – ₱' + amount}
											</div>
										))}
									</td>
									<td>₱{roundTwoDecimals(item.total / item.buyers.length)}</td>
									{persons.map((person, index) => {
										const amount =
											roundTwoDecimals(txs[person.id][item.txId]) || 0
										return <ColoredTableData index={index} amount={amount} />
									})}
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
							<td></td>
							<td></td>
							<td className='text-right'>Total:</td>
							{persons.map((person, index) => {
								const tally = computeTallyOfPerson(txs, person.id)
								return <ColoredTableData index={index} amount={tally} />
							})}
						</tr>
						<tr className='text-xs text-center'>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td className='text-right'>Spent:</td>
							{persons.map((person, index) => {
								const totalSpent = computeTotalSpentOfPerson(items, person.id)
								return <td key={index}>₱{totalSpent}</td>
							})}
						</tr>
					</tfoot>
				</table>
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
	return (
		<td key={index} className={amount > 0 ? 'text-success' : 'text-warning'}>
			{amount === 0 ? '—' : amount > 0 ? '₱' + amount : '-₱' + Math.abs(amount)}
		</td>
	)
}

const computeTotalSpentOfPerson = (items, id) => {
	let total = 0

	items.forEach((item) => {
		if (item.buyers.includes(id)) {
			total += item.total / item.buyers.length
		}
	})

	return roundTwoDecimals(total)
}
