// import {Gpio} from "onoff";
//
// const LED = new Gpio(23, 'out'); //use GPIO pin 4, and specify that it is output
// const blinkInterval = setInterval(blinkLED, 250); //run the blinkLED function every 250ms
//
// function blinkLED() { //function to start blinking
//     if (LED.readSync() === 0) { //check the pin state, if the state is 0 (or off)
//         LED.writeSync(1); //set pin state to 1 (turn LED on)
//     } else {
//         LED.writeSync(0); //set pin state to 0 (turn LED off)
//     }
// }
//
// function endBlink() { //function to stop blinking
//     clearInterval(blinkInterval); // Stop blink intervals
//     LED.writeSync(0); // Turn LED off
//     LED.unexport(); // Unexport GPIO to free resources
// }
//
// setTimeout(endBlink, 5000); //stop blinking after 5 seconds


import gpio from 'rpi-gpio'

const PIN_12= 12

gpio.setup(PIN_12, gpio.DIR_OUT);
gpio.setMode(gpio.MODE_RPI);
//use GPIO pin 4, and specify that it is output
const blinkInterval = setInterval(blinkLED, 250); //run the blinkLED function every 250ms

function blinkLED() { //function to start blinking
    let bitLedLit = false

    gpio.read(PIN_12, function (err, value) {
        if (err) throw err

        console.log(`the value of pin ${PIN_12} is : ${value}`)
        bitLedLit = value
    })

    if (bitLedLit === false) { //check the pin state, if the state is 0 (or off)
        gpio.write(PIN_12, true, function (err) {
            if (err) throw err
        }) //set pin state to 1 (turn LED on)
    } else {
        gpio.write(PIN_12, false, function (err) {
            if (err) throw err
        }); //set pin state to 0 (turn LED off)
    }
}

function endBlink() { //function to stop blinking
    clearInterval(blinkInterval); // Stop blink intervals
    gpio.write(PIN_12, false, err => {
        if (err) throw err
    }); // Turn LED off
    gpio.destroy(() => {
        console.log('All pins unexported');
    }); // Unexport GPIO to free resources
}

setTimeout(endBlink, 5000); //stop blinking after 5 seconds
