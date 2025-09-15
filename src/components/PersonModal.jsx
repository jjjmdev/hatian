import { useState } from 'react'
import { updatePerson, deletePerson } from '../data.js'

export default function PersonModal({ persons, setPersons }) {
  function onOpen() {
    document.getElementById('add_person').showModal()
  }

  function handleAddClick() {
    setPersons([...persons, { id: crypto.randomUUID(), name: '' }])
  }

  function handleDeleteClick(id, name) {
    if (confirm(`Remove ${name} from the list?`)) {
      deletePerson(id)
    }
  }

  return (
    <>
      <button className='btn btn-soft btn-success btn-md mr-2' onClick={onOpen}>
        + Person
      </button>
      <dialog id='add_person' className='modal'>
        <div className='modal-box min-w-[300px]'>
          <h3 className='font-bold text-lg'>Mga Kahati</h3>

          <div className='modal-names-input mt-2'>
            {persons.map(({ id, name }) => {
              return (
                <NameInput
                  id={id}
                  name={name}
                  key={id}
                  onDelete={() => handleDeleteClick(id, name)}
                />
              )
            })}
          </div>
          <div className='flex justify-between mt-3'>
            <button className='btn btn-xs self-start' onClick={handleAddClick}>
              + Dagdagan
            </button>
            <div className='modal-action'>
              <form method='dialog'>
                <button className='btn btn-sm btn-soft btn-success'>
                  Done
                </button>
              </form>
            </div>
          </div>
        </div>
      </dialog>
    </>
  )
}

function NameInput({ id, name, onDelete }) {
  const [isDisabled, setIsDisabled] = useState(name === '' ? false : true)
  const [nameInput, setNameInput] = useState(name)

  function handleEditClick() {
    if (isDisabled) {
      setIsDisabled(false)
      return
    }

    updatePerson(id, nameInput)
    setIsDisabled(true)

    return
  }

  return (
    <div className='join'>
      <input
        type='text'
        placeholder='Pangalan'
        className='input join-item field-sizing-content w-40'
        disabled={isDisabled}
        value={nameInput}
        onChange={(e) => setNameInput(e.target.value)}
      />
      <button
        className='btn btn-soft btn-info join-item'
        onClick={handleEditClick}
      >
        {isDisabled ? (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='16'
            height='16'
            fill='currentColor'
            className='bi bi-pencil-square'
            viewBox='0 0 16 16'
          >
            <path d='M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z' />
            <path
              fillRule='evenodd'
              d='M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z'
            />
          </svg>
        ) : (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='16'
            height='16'
            fill='currentColor'
            className='bi bi-check-lg'
            viewBox='0 0 16 16'
          >
            <path d='M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z' />
          </svg>
        )}
      </button>
      <button className='btn btn-soft btn-warning join-item' onClick={onDelete}>
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
    </div>
  )
}
