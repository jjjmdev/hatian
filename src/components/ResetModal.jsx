import { resetData } from '../data'

export default function ResetModal() {
	function onConfirm(e) {
		e.preventDefault()
		resetData()
		document.getElementById('reset_modal').close()
	}

	return (
		<>
			<button
				className='btn btn-soft btn-error'
				onClick={() => document.getElementById('reset_modal').showModal()}
			>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					width='16'
					height='16'
					fill='currentColor'
					className='bi bi-arrow-clockwise'
					viewBox='0 0 16 16'
				>
					<path
						fillRule='evenodd'
						d='M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z'
					/>
					<path d='M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466' />
				</svg>
			</button>
			<dialog id='reset_modal' className='modal'>
				<div className='modal-box'>
					<h3 className='font-bold text-lg'>Reset</h3>
					<p className='mb-4 mt-2'>Sure na?</p>
					<div className='modal-action'>
						<form method='dialog'>
							<button className='btn btn-soft btn-sm btn-info mr-2'>
								Cancel
							</button>
							<button
								className='btn btn-soft btn-sm btn-error'
								onClick={onConfirm}
							>
								Confirm
							</button>
						</form>
					</div>
				</div>
			</dialog>
		</>
	)
}
