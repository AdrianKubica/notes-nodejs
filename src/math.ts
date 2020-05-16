export const calculateTip = (total: number, tipPercent: number = .25) => total * (1 + tipPercent)

export const fahrenheitToCelsius = (temp: number) => {
    return (temp - 32) / 1.8
}

export const celsiusToFahrenheit = (temp: number) => {
    return (temp * 1.8) + 32
}

export const add = (a: number, b: number) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(a + b)
        }, 2000)
    })
}