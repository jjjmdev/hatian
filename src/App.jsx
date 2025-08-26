import './App.css'
import ItemModal from './components/ItemModal'
import PersonModal from './components/PersonModal'
import ResetModal from './components/ResetModal'

function App() {
	return (
		<div className='p-4 my-3 mx-auto w-100'>
			<ItemModal />
			<PersonModal />
			<ResetModal />
		</div>
	)
}

export default App
