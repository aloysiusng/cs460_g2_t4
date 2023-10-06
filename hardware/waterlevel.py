import RPi.GPIO as GPIO
import time

# Define the GPIO pin
water_level_pin = 18  # GPIO 16

# Set up GPIO
GPIO.setmode(GPIO.BCM)
GPIO.setup(water_level_pin, GPIO.IN)

try:
    while True:
        # Read the water level sensor
        water_level = GPIO.input(water_level_pin)

        # Print the water level (1 for high, 0 for low)
        print(f'Water Level: {water_level}')

        # Delay for a short interval
        time.sleep(1)

except KeyboardInterrupt:
    print("Script terminated by the user")

finally:
    # Clean up GPIO
    GPIO.cleanup()
