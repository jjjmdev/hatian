export function getPersons() {
	if (!localStorage.getItem('persons')) {
		return []
	}
	return JSON.parse(localStorage.getItem('persons'))
}

export function updatePerson(id, name) {
	let found = false

	const persons = getPersons()
	persons.forEach((person) => {
		if (person.id === id) {
			person.name = name
			found = true
		}
	})

	if (!found) {
		persons.push({ id, name })
	}

	localStorage.setItem('persons', JSON.stringify(persons))
	dispatch()
	return true
}

export function deletePerson(id) {
	const persons = getPersons()

	localStorage.setItem(
		'persons',
		JSON.stringify(persons.filter((person) => person.id !== id))
	)
	dispatch()
	return true
}

export function resetData() {
	localStorage.setItem('persons', JSON.stringify([]))
	localStorage.setItem('items', JSON.stringify([]))
	dispatch()
	return true
}

export function getItems() {
	if (!localStorage.getItem('items')) {
		return []
	}
	return JSON.parse(localStorage.getItem('items'))
}

export function addItem(newItem) {
	const items = getItems()
	localStorage.setItem('items', JSON.stringify([...items, newItem]))
	dispatch()
	return true
}

function dispatch() {
	window.dispatchEvent(new Event('storage'))
}
