import { useState } from 'react'
import { getPersonName, getPersons, getItems } from '../data'

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
				<table className='table table-zebra text-center table-xs text-nowrap'>
					{/* head */}
					<thead>
						<tr>
							<th>Presyo</th>
							<th>Item Name</th>
							<th>SC?</th>
							<th>Paid By?</th>
							<th>Hatian</th>
							{persons.map((person) => (
								<th>{person.name}</th>
							))}
						</tr>
					</thead>
					<tbody>
						{items.map((item) => {
							return (
								<tr key={item.txId}>
									<td>₱{item.total}</td>
									<td>{item.itemName}</td>
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
								₱{items.reduce((total, item) => total + item.total, 0)}
							</td>
							<td></td>
							<td></td>
							<td></td>
							<td className='text-right'>Total:</td>
							{persons.map((person, index) => {
								const total = computeTotalOfPerson(txs, person.id)
								return <ColoredTableData index={index} amount={total} />
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

const computeTotalOfPerson = (txs, id) => {
	let total = 0
	Object.values(txs[id]).forEach((amount) => {
		total += amount
	})

	return roundTwoDecimals(total)
}

const roundTwoDecimals = (number) => {
	return Math.round(number * 100) / 100
}

const ColoredTableData = ({ amount, index }) => {
	return (
		<td key={index} className={amount > 0 ? 'text-success' : 'text-warning'}>
			{amount === 0 ? '—' : amount > 0 ? '₱' + amount : '-₱' + Math.abs(amount)}
		</td>
	)
}
