const {calTips, celToFahren, fahrenToCel, add} = require('../src/math')

test('Test Calculate Tips', () => {
    const total = calTips(10, 0.3)
    expect(total).toBe(13)
})

test('Test Calculate Tips default value', () => {
    const total = calTips(10)
    expect(total).toBe(12.5)
})

test('Test Translate F to C', () => {
    const temp = fahrenToCel(50)
    expect(temp).toBe(10)
})

test('Test Translate C to F', () => {
    const temp = celToFahren(10)
    expect(temp).toBe(50)
})

// test('Async test', (done) => {
//     setTimeout(() => {
//         expect(1).toBe(2)
//         done()
//     }, 2000)
// })

test('Test add two number', (done) => {
    add(2, 3).then((sum) => {
        expect(sum).toBe(5)
        done()
    })
})

test('Test add two number with async/await', async () => {
    const sum = await add(11,20)
    expect(sum).toBe(30)
})