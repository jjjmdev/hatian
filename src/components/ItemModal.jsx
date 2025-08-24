export default function ItemModal() {
	return (
		<>
			<button
				className='btn btn-soft btn-info btn-md mr-2'
				onClick={() => document.getElementById('add_item').showModal()}
			>
				+ Item
			</button>
			<dialog id='add_item' className='modal'>
				<div className='modal-box'>
					{/* <h3 className='font-bold text-lg'>Add Item</h3> */}
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

					<div className='flex gap-2 ' style={{ width: '100%' }}>
						<fieldset className='fieldset flex-1'>
							<legend className='fieldset-legend'>Sino nagbayad?</legend>
							<select defaultValue='Pick a browser' className='select'>
								<option disabled={true}>Pumili</option>
								<option>Joshua</option>
								<option>Pen</option>
							</select>
						</fieldset>

						<fieldset className='fieldset flex-1'>
							<legend className='fieldset-legend'>Magkano?</legend>
							<label className='input'>
								<span className='label'>₱</span>
								<input type='text' placeholder='49' />
							</label>
						</fieldset>
					</div>

					<div className='modal-action'>
						<form method='dialog' className='w-full'>
							<div className='flex justify-between mt-3'>
								<button className='btn btn-xs self-start'>
									+ may iba pang nagbayad
								</button>
								<div>
									<button className='btn btn-soft btn-sm btn-error mr-2'>
										Cancel
									</button>
									<button
										className='btn btn-soft btn-sm btn-success'
										onClick={(e) => e.preventDefault()}
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
