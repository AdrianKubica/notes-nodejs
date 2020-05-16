import { calculateTip, fahrenheitToCelsius, celsiusToFahrenheit, add } from '../src/math'

test('Should calculate total with tip', () => {
    expect(calculateTip(10, .3)).toBe(13)
})

test('Should calculate total with default tip', () => {
    expect(calculateTip(10)).toBe(12.5)
})

test('Should convert 32F to 0C', () => {
    expect(fahrenheitToCelsius(32)).toBe(0)
})

test('Should convert 0C to 32F', () => {
    expect(celsiusToFahrenheit(0)).toBe(32)
})

test('Async test demo', (done) => {
    setTimeout(() => {
        expect(1).toBe(1)
        done()
    }, 2000)
})

test('Should add two numbers', (done) => {
    add(6, 4).then((sum) => {
        expect(sum).toBe(10)
        done()
    })
})

test('Should add two numbers async/await', async () => {
    expect(await add(6,4)).toBe(10)
})