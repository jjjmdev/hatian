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

	return localStorage.setItem('persons', JSON.stringify(persons))
}

export function deletePerson(id) {
	const persons = getPersons()

	return localStorage.setItem(
		'persons',
		JSON.stringify(persons.filter((person) => person.id !== id))
	)
}

export function resetData() {
	return localStorage.setItem('persons', JSON.stringify([]))
}
