// Make sure that you're using Node v16.x and up

// Setup the sensor input
const mcpadc = require('mcp-spi-adc');
const Gpio = require('onoff').Gpio;
const schedule = require('node-schedule');

const completelyWet = 395;
const completelyDry = 780;
const pumpRelay = new Gpio(13, 'low'); // IMPORTANT: Use 'high' if relay uses low level trigger

function getSensorReadings(sensor) {
    return new Promise((resolve, reject) => {
        sensor.read((readError, reading) => {
            if (readError) {
                return reject(new Error(`There was an error getting the sensor reading:
                    ${readError}`));
            }

            return resolve(reading);
        });
    });
};

function getMoistureLevel() {
    const readingPromises = [];
    let readings = {};
    readings.rawValues = [];
    readings.values = [];

    return new Promise((resolve, reject) => {
        const sensor = mcpadc.open(5, {speedHz: 20000}, (error) => {
            if (error) {
                return reject(new Error(`There was an error accessing the sensor: ${error}`));
            }

            let iterator = 50; // Just need a large number of readings to try for better accuracy

            while (iterator >= 0) {
                readingPromises.push(getSensorReadings(sensor)
                    .then(reading => {
                        readings.rawValues.push(reading.rawValue);
                        readings.values.push(reading.value);
                    }).catch(error => {
                        return reject(error);
                    })
                );

                iterator--;
            }

            return Promise.all(readingPromises).then(() => {
                const averageRawValue = readings.rawValues.reduce((a, b) => a + b, 0) / 50;
                const averageValue = readings.values.reduce((a, b) => a + b, 0) / 50;
    
                // Set the value to a percentage based on the max reading
                return resolve({
                    rawValue: averageRawValue,
                    value: averageValue,
                    soilDrynessPercentage: averageRawValue > 0 ? ((averageRawValue / completelyWet) * 100).toFixed(0) : 0,
                });
            });
        });
    });
};

function shouldWater(moistureLevel) {
    // Adjust this value based on your sensor and the needs of your plant
    // Value represents a percentage
    // if (moistureLevel <= 45) {
    //     return true;
    // }
    num = Math.random();
    if (num %2 == 1){
        console.log("water plant now!");
        return true;
    }
    console.log("dont water plant now!");

    return false;
};

function waterThePlant() {
    return new Promise((resolve, reject) => {
        pumpRelay.read(async (error, status) => {
            if (error) {
                return reject(new Error(`There was an error getting the pump relay status: ${error}`));
            }

            const moistureLevel = await getMoistureLevel();
            const needsWater = shouldWater(moistureLevel.soilDrynessPercentage);

            if (status !== 0 && needsWater) {
                pumpRelay.writeSync(0); // closes the circuit and starts the pump
            }

            return resolve({
                status: `The plant is being watered.`,
            });
        });
    });
};

function stopWateringPlant() {
    return new Promise((resolve, reject) => {
        pumpRelay.read((error, status) => {
            if (error) {
                return reject(new Error(`There was an error getting the pump relay status: ${error}`));
            }

            if (status !== 1) {
                pumpRelay.writeSync(1); // opens the circuit and stops the pump
            }

            return resolve({
                status: `The plant is not being watered.`,
            });
        });
    });
};

const shouldWaterPlant = async () => {
    // Run every day at 7 a.m.
    console.log("watering plant from shouldWaterPlant");
    // await waterThePlant();
    setTimeout(() => {
                    console.log("waterThePlant")
                    waterThePlant();
                    console.log("done waterThePlant");
                    setTimeout(() => {
                        console.log("stopWateringPlant");
                        stopWateringPlant();
                        console.log("done stopWateringPlant");
                    }, 3000);
                }, 3000);
    
    // return schedule.scheduleJob('0 7 * * *', async () => {
    //     if (shouldWater) {
    //         // Water the plant for three seconds
    //         setTimeout(() => {
    //             waterThePlant();

    //             setTimeout(() => {
    //                 stopWateringPlant();
    //             }, 3000);
    //         }, 3000);
    //     }
    // });
    return "success"

};

// shouldWaterPlant().then()

// (async () => await shouldWaterPlant())();
console.log("shouldWaterPlant")
shouldWaterPlant().then((user) => console.log(user));