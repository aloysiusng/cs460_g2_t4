import RPi.GPIO as GPIO
import time
 
RelayPin = 13 # Set pin11 as Out
 
def onswitch(RelayPin = RelayPin):
    GPIO.setmode(GPIO.BOARD) # Set GPIO as numbering
    GPIO.setup(RelayPin, GPIO.OUT)
    GPIO.output(RelayPin, GPIO.HIGH)
 
def loop():
    while True:
        try:
            print( 'Relay Channel One is On')
            # GPIO.output(11, GPIO.LOW)
            # setup()
            onswitch()
            time.sleep(5)
            print( 'Relay Channel One is Off')
            # GPIO.output(11, GPIO.HIGH)
            # GPIO.cleanup()
            offswitch()
            time.sleep(5)
        except Exception as error:
            print(f"error: {error}")
 
def offswitch(RelayPin = RelayPin):
    GPIO.output(RelayPin, GPIO.HIGH)
    GPIO.cleanup()
 
if __name__ == '__main__': # Program start from here
    # setup()
    onswitch()
    try:
        loop()
    except KeyboardInterrupt: # When Control C is pressed program will destroy()
        offswitch()


# https://www.14core.com/wiring-single-channel-relay-with-raspberry-pi-on-wiringpi-python/