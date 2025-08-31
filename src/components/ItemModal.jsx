import { useState } from 'react'
import { getPersons, addItem } from '../data.js'
import { roundTwoDecimals, priceAfterSC } from '../utils/utils'

export default function ItemModal() {
	let persons = getPersons()

	const [payers, setPayers] = useState(
		persons.length && [
			{
				id: crypto.randomUUID(),
				personId: persons[0].id,
				amount: '0',
			},
		]
	)
	const [itemName, setItemName] = useState('')
	const [serviceCharge, setServiceCharge] = useState('0')
	const [buyers, setBuyers] = useState(
		persons.length && persons.map(({ id }) => id)
	) // [id1, id2, id3]
	const [afterSC, setAfterSC] = useState(true)

	let limitAdd = payers.length >= persons.length
	let totalAmount =
		payers.length &&
		payers.reduce((total, payer) => {
			const amount = Number(payer.amount)

			if (afterSC) {
				return total + amount
			}

			return priceAfterSC(serviceCharge, amount)
		}, 0)

	function onOpen() {
		const newPersons = getPersons()
		if (persons !== newPersons) {
			persons = newPersons
			resetForm()
		}
	}

	const handleAddClick = (e) => {
		e.preventDefault()
		setPayers([
			...payers,
			{ id: crypto.randomUUID(), personId: persons[0].id, amount: '0' },
		])
	}

	const handleDeleteClick = (id) => {
		setPayers(payers.filter((payer) => id !== payer.id))
	}

	const handleChange = (e, id) => {
		const { name, value } = e.target
		const index = payers.findIndex((payer) => payer.id === id)

		setPayers((payers) => {
			const newArray = [...payers]
			newArray[index][name] = value
			return newArray
		})
	}

	const renderpayers = () => {
		return (
			payers.length &&
			payers.map(({ id, personId, amount }, index) => (
				<PayerRow
					id={id}
					key={id}
					persons={persons}
					renderDelete={index > 0}
					personId={personId}
					amount={amount}
					onDeleteClick={handleDeleteClick}
					onChangeValue={handleChange}
					serviceCharge={serviceCharge}
					afterSC={afterSC}
					setAfterSC={setAfterSC}
				/>
			))
		)
	}

	const handleBuyersChange = (e, id) => {
		const checked = e.target.checked

		if (checked) {
			setBuyers([...buyers, id])
		} else {
			const index = buyers.indexOf(id)
			setBuyers([...buyers.slice(0, index), ...buyers.slice(index + 1)])
		}
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		console.log(afterSC)
		// Close the modal
		document.querySelector('#add_item').checked = false
		addItem({
			txId: crypto.randomUUID(),
			itemName,
			serviceCharge: Number(serviceCharge),
			payers: payers.map((payer) => {
				let amount = Number(payer.amount)

				if (!afterSC) {
					amount = priceAfterSC(serviceCharge, amount)
				}

				return {
					...payer,
					amount,
				}
			}),
			buyers,
			total: totalAmount,
		})
		resetForm()
	}

	const resetForm = () => {
		setItemName('')
		setServiceCharge('0')
		setAfterSC(true)
		setPayers(
			persons.length && [
				{
					id: crypto.randomUUID(),
					personId: persons[0].id,
					amount: '0',
				},
			]
		)
		setBuyers(persons.length && persons.map(({ id }) => id))
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
					{persons.length ? (
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
									<legend className='fieldset-legend'>
										May service charge?
									</legend>
									<label className='input validator'>
										<span className='label'>%</span>
										<input
											type='number'
											placeholder='0'
											value={serviceCharge === '0' ? '' : serviceCharge}
											onChange={(e) => {
												setServiceCharge(e.target.value)
												if (e.target.value === '' || e.target.value === '0') {
													setAfterSC(true)
												}
											}}
										/>
									</label>
								</fieldset>
							</div>

							{renderpayers()}
							<div className='w-full flex justify-between mt-1'>
								<button
									className='btn btn-xs'
									onClick={handleAddClick}
									disabled={limitAdd}
								>
									+ may iba pang nagbayad
								</button>

								<span className='badge badge-sm badge-soft badge-info'>
									<strong>
										Total:
										{totalAmount ? ' ₱' + roundTwoDecimals(totalAmount) : ''}
									</strong>
								</span>
							</div>

							<div className='modal-action'>
								<div className='flex w-full'>
									<div className='flex-1'>
										<BuyersList
											persons={persons}
											buyers={buyers}
											onBuyersChange={handleBuyersChange}
										/>
									</div>

									<div className='mt-3 flex-1 text-right'>
										<label
											htmlFor='add_item'
											className='btn btn-soft btn-sm btn-error mr-2'
										>
											Cancel
										</label>
										<button
											className='btn btn-soft btn-sm btn-success'
											type='submit'
										>
											Submit
										</button>
									</div>
								</div>
							</div>
						</form>
					) : (
						<>
							<h3 className='text-lg font-bold'>Wait lang!</h3>
							<p className='py-2'>Lagay ka muna ng Person.</p>
							<div className='modal-action'>
								<label
									htmlFor='add_item'
									className='btn btn-soft btn-sm btn-info'
								>
									Ok
								</label>
							</div>
						</>
					)}
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
	serviceCharge,
	afterSC,
	setAfterSC,
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
				<legend className='fieldset-legend w-full flex justify-between'>
					<span>Magkano?</span>

					{serviceCharge !== '0' && serviceCharge !== '' && (
						<label className='swap'>
							<input
								type='checkbox'
								checked={afterSC}
								onChange={(e) => setAfterSC(e.target.checked)}
							/>
							<div className='swap-off'>
								<span className='badge badge-xs badge-soft badge-accent'>
									Before SC
								</span>
							</div>
							<div className='swap-on'>
								<span className='badge badge-xs badge-soft badge-success'>
									After SC
								</span>
							</div>
						</label>
					)}
				</legend>
				<label className='input validator'>
					<span className='label'>₱</span>
					<input
						type='number'
						className='validator'
						placeholder='0'
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

const BuyersList = ({ persons, buyers, onBuyersChange }) => {
	return (
		<fieldset className='fieldset bg-base-100 border-base-300 rounded-box w-64 border px-3 pb-2'>
			<legend className='fieldset-legend pb-1'>Mga Maghahati:</legend>
			<div className='grid grid-cols-2 w-full gap-0.5 text-left'>
				{persons.map(({ id, name }) => (
					<label key={id}>
						<input
							type='checkbox'
							checked={buyers.includes(id)}
							className='checkbox checkbox-xs mr-1'
							onChange={(e) => onBuyersChange(e, id)}
						/>
						{name}
					</label>
				))}
			</div>
		</fieldset>
	)
}
