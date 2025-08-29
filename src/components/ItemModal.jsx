import { useState } from 'react'
import { getPersons } from '../data.js'

export default function ItemModal() {
	let persons = getPersons()

	const [itemName, setItemName] = useState('')
	const [serviceCharge, setServiceCharge] = useState('0')

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
		setPayerArray(payerArray.filter((payer) => id !== payer.id))
	}

	const handleChange = (e, id) => {
		const { name, value } = e.target
		const index = payerArray.findIndex((payer) => payer.id === id)

		setPayerArray((payerArray) => {
			const newArray = [...payerArray]
			newArray[index][name] = value
			return newArray
		})
	}

	const renderPayerArray = () => {
		return payerArray.map(({ id, personId, amount }, index) => (
			<PayerRow
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

	const handleSubmit = (e) => {
		e.preventDefault()
		// Close the modal
		document.querySelector('#add_item').checked = false
		console.log({
			itemName,
			serviceCharge,
			payer: payerArray,
		})
	}

	return (
		<>
			<label
				htmlFor='add_item'
				className='btn btn-soft btn-info btn-md mr-2'
				onClick={onOpen}
			>
				+ Item
			</label>

			<input type='checkbox' id='add_item' className='modal-toggle' />
			<div className='modal' role='dialog'>
				<div className='modal-box m-2'>
					<form onSubmit={handleSubmit}>
						<div className='flex gap-2 ' style={{ width: '100%' }}>
							<fieldset className='fieldset flex-1'>
								<legend className='fieldset-legend'>Ano binili?</legend>
								<input
									type='text'
									className='input'
									placeholder='Yum Burger'
									required
									value={itemName}
									onChange={(e) => setItemName(e.target.value)}
								/>
							</fieldset>

							<fieldset className='fieldset flex-1'>
								<legend className='fieldset-legend'>May service charge?</legend>
								<label className='input validator'>
									<span className='label'>%</span>
									<input
										type='number'
										placeholder='0'
										value={serviceCharge === '0' ? '' : serviceCharge}
										onChange={(e) => setServiceCharge(e.target.value)}
									/>
								</label>
							</fieldset>
						</div>

						{renderPayerArray()}
						<div className='w-full flex justify-end mt-1'>
							<span className='badge badge-sm badge-soft badge-info'>
								<strong>
									Total:{' ₱'}
									{payerArray.reduce((total, payer) => {
										return total + Number(payer.amount)
									}, 0)}
								</strong>
							</span>
						</div>
						<div className='modal-action'>
							<div className={'flex mt-3 w-full ' + 'justify-between'}>
								<div className='self-start'>
									<button
										className='btn btn-xs'
										onClick={handleAddClick}
										disabled={limitAdd}
									>
										+ may iba pang nagbayad
									</button>
								</div>

								<div className='justify-self-end self-end'>
									<label
										htmlFor='add_item'
										className='btn btn-soft btn-sm btn-error mr-2'
									>
										Cancel
									</label>
									<button
										className='btn btn-soft btn-sm btn-success'
										type='submit'
										// onClick={(e) => e.preventDefault()}
									>
										Submit
									</button>
								</div>
							</div>
						</div>
					</form>
				</div>
			</div>
		</>
	)
}

const PayerRow = ({
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
					required
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
				<label className='input validator'>
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
