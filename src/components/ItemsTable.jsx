import { useState } from 'react'
import { getPersons, getItems } from '../data'

export default function ItemsTable() {
	const [items, setItems] = useState(getItems())
	const [persons, setPersons] = useState(getPersons())

	console.log(items, persons)

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
				<table className='table table-zebra'>
					{/* head */}
					<thead>
						<tr>
							<th></th>
							<th>Name</th>
							<th>Job</th>
							<th>Favorite Color</th>
						</tr>
					</thead>
					<tbody>
						{/* row 1 */}
						<tr>
							<th>1</th>
							<td>Cy Ganderton</td>
							<td>Quality Control Specialist</td>
							<td>Blue</td>
						</tr>
						{/* row 2 */}
						<tr>
							<th>2</th>
							<td>Hart Hagerty</td>
							<td>Desktop Support Technician</td>
							<td>Purple</td>
						</tr>
						{/* row 3 */}
						<tr>
							<th>3</th>
							<td>Brice Swyre</td>
							<td>Tax Accountant</td>
							<td>Red</td>
						</tr>

						<tr>
							<th>3</th>
							<td>Brice Swyre</td>
							<td>Tax Accountant</td>
							<td>Red</td>
						</tr>
					</tbody>
				</table>
			</div>
		</>
	)
}
