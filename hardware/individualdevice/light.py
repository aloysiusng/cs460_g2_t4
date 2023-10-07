import RPi.GPIO as GPIO
GPIO.setmode(GPIO.BOARD)
GPIO.setup(8, GPIO.IN)
while True:
    print(GPIO.input(8))
    if GPIO.input(8) == 1:
        print("night time")
    else:
        print("day time")