import './App.css'
import { useState } from 'react'
import ItemModal from './components/ItemModal'
import PersonModal from './components/PersonModal'
import ResetModal from './components/ResetModal'
import ItemsTable from './components/ItemsTable'
import { getItems, getPersons } from './data'

function App() {
  const [persons, setPersons] = useState(getPersons())
  const [items, setItems] = useState(getItems())
  const [selectedTx, setSelectedTx] = useState(null)

  window.addEventListener('storage', () => {
    setPersons(getPersons())
    setItems(getItems())
  })

  const handleEditClick = (txId) => {
    setSelectedTx(txId)
  }

  const handleOpenModal = () => {
    setSelectedTx()
  }

  return (
    <>
      <div className='p-4 my-3 text-center w-full'>
        <ItemModal
          persons={persons}
          txId={selectedTx}
          onOpenModal={handleOpenModal}
        />
        <PersonModal persons={persons} setPersons={setPersons} />
        <ResetModal />
      </div>
      <div className='w-full text-center'>
        <ItemsTable
          items={items}
          persons={persons}
          onEditClick={handleEditClick}
        />
      </div>
    </>
  )
}

export default App
