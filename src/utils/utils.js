export const roundTwoDecimals = (number) => {
	return Math.round(number * 100) / 100
}

export const priceAfterSC = (serviceCharge, amount) => {
	return amount + amount * 0.88 * (Number(serviceCharge) / 100)
}
