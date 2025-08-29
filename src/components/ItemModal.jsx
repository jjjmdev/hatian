import { useState } from 'react'
import { getPersons } from '../data.js'

export default function ItemModal() {
	let persons = getPersons()

	const [payerArray, setPayerArray] = useState(
		persons.length && [
			{
				id: crypto.randomUUID(),
				personId: persons[0].id,
				amount: '0',
			},
		]
	)
	let limitAdd = payerArray.length >= persons.length

	function onOpen() {
		document.getElementById('add_item').showModal()

		const newPersons = getPersons()
		if (persons !== newPersons) {
			persons = newPersons
			setPayerArray(
				persons.length && [
					{
						id: crypto.randomUUID(),
						personId: persons[0].id,
						amount: '0',
					},
				]
			)
		}
	}

	const handleAddClick = (e) => {
		e.preventDefault()
		setPayerArray([
			...payerArray,
			{ id: crypto.randomUUID(), personId: persons[0].id, amount: '0' },
		])
	}

	const handleDeleteClick = (id) => {
		console.log('called')
		setPayerArray(payerArray.filter((payer) => id !== payer.id))
	}

	const handleChange = (e, id) => {
		const { name, value } = e.target
		const index = payerArray.findIndex((payer) => payer.id === id)

		console.log(name, value, index)
		setPayerArray((payerArray) => {
			const newArray = [...payerArray]
			newArray[index][name] = value
			return newArray
		})
	}

	const renderPayerArray = () => {
		console.log(payerArray)
		return payerArray.map(({ id, personId, amount }, index) => (
			<PayerDefaultElement
				id={id}
				key={id}
				persons={persons}
				renderDelete={index > 0}
				personId={personId}
				amount={amount}
				onDeleteClick={handleDeleteClick}
				onChangeValue={handleChange}
			/>
		))
	}

	return (
		<>
			<button className='btn btn-soft btn-info btn-md mr-2' onClick={onOpen}>
				+ Item
			</button>
			<dialog id='add_item' className='modal'>
				<div className='modal-box m-2'>
					<div className='flex gap-2 ' style={{ width: '100%' }}>
						<fieldset className='fieldset flex-1'>
							<legend className='fieldset-legend'>Ano binili?</legend>
							<input type='text' className='input' placeholder='Yum Burger' />
						</fieldset>

						<fieldset className='fieldset flex-1'>
							<legend className='fieldset-legend'>May service charge?</legend>
							<label className='input'>
								<span className='label'>%</span>
								<input type='text' placeholder='0' defaultValue={'0'} />
							</label>
						</fieldset>
					</div>

					{renderPayerArray()}

					<div className='modal-action'>
						<form method='dialog' className='w-full'>
							<div
								className={
									'flex mt-3 ' + (limitAdd ? 'justify-end' : 'justify-between')
								}
							>
								<button
									className='btn btn-xs self-start'
									onClick={handleAddClick}
									style={{ display: limitAdd ? 'none' : 'block' }}
								>
									+ may iba pang nagbayad
								</button>
								<div className='justify-self-end self-end'>
									<button className='btn btn-soft btn-sm btn-error mr-2'>
										Cancel
									</button>
									<button
										className='btn btn-soft btn-sm btn-success'
										type='submit'
										// onClick={(e) => e.preventDefault()}
									>
										Submit
									</button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</dialog>
		</>
	)
}

const PayerDefaultElement = ({
	id,
	persons,
	onChangeValue,
	onDeleteClick,
	renderDelete,
	personId,
	amount,
}) => {
	return (
		<div className='flex gap-2 ' style={{ width: '100%' }}>
			<fieldset className='fieldset flex-1'>
				<legend className='fieldset-legend flex justify-between w-full'>
					<span>Sino nagbayad?</span>
					{renderDelete && (
						<button
							className='btn btn-soft btn-xs btn-warning'
							onClick={() => onDeleteClick(id)}
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
					)}
				</legend>
				<select
					className='select'
					name='personId'
					value={personId}
					onChange={(e) => onChangeValue(e, id)}
				>
					<option disabled={true}>Pumili</option>
					{persons.map((person, index) => {
						return (
							<option value={person.id} key={index}>
								{person.name}
							</option>
						)
					})}
				</select>
			</fieldset>

			<fieldset className='fieldset flex-1 self-end'>
				<legend className='fieldset-legend'>Magkano?</legend>
				<label className='input'>
					<span className='label'>₱</span>
					<input
						type='number'
						className='validator'
						placeholder='49'
						required
						name='amount'
						value={amount === '0' ? '' : amount}
						onChange={(e) => onChangeValue(e, id)}
					/>
				</label>
			</fieldset>
		</div>
	)
}
