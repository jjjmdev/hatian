import './App.css'
import ItemModal from './components/ItemModal'
import PersonModal from './components/PersonModal'
import ResetModal from './components/ResetModal'
import ItemsTable from './components/ItemsTable'

function App() {
	return (
		<>
			<div className='p-4 my-3 text-center w-full'>
				<ItemModal />
				<PersonModal />
				<ResetModal />
			</div>
			<div className='w-full text-center px-10'>
				<ItemsTable />
			</div>
		</>
	)
}

export default App
