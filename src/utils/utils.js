export const roundTwoDecimals = (number) => {
	return Math.round(number * 100) / 100
}

export const priceAfterSC = (serviceCharge, amount) => {
	return amount + amount / 1.12 * (Number(serviceCharge) / 100)
}
