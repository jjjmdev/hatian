import './App.css'
import { useState } from 'react'
import ItemModal from './components/ItemModal'
import PersonModal from './components/PersonModal'
import ResetModal from './components/ResetModal'
import ItemsTable from './components/ItemsTable'

function App() {
	const [selectedTx, setSelectedTx] = useState(null)

	const handleEditClick = (txId) => {
		setSelectedTx(txId)
	}

	const handleOpenModal = () => {
		setSelectedTx()
	}

	return (
		<>
			<div className='p-4 my-3 text-center w-full'>
				<ItemModal txId={selectedTx} onOpenModal={handleOpenModal} />
				<PersonModal />
				<ResetModal />
			</div>
			<div className='w-full text-center'>
				<ItemsTable onEditClick={handleEditClick} />
			</div>
		</>
	)
}

export default App
