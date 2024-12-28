const calTips = (total, tipPercent = 0.25) => total + (total * tipPercent)

const fahrenToCel = (temp) => {
    return (temp - 32) / 1.8
}

const celToFahren = (temp) => {
    return (temp * 1.8) + 32
}

const add = (a, b) => {
    return new Promise((resolve, reject) => {
        if (a <0 || b < 0) {
            return reject('Number must be non-negative')
        }

        setTimeout(() => {
            resolve(a + b)
        }, 2000)
    })
}

module.exports = {
    calTips,
    fahrenToCel,
    celToFahren,
    add
}