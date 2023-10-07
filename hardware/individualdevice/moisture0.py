import RPi.GPIO as GPIO
import time

# Define the GPIO pin
moisture_sensor_pin = 21  # GPIO 16

# Set up GPIO
GPIO.setmode(GPIO.BCM)
GPIO.setup(moisture_sensor_pin, GPIO.IN)

def read_moisture_level():
    # Read analog output from the soil moisture sensor
    moisture_level = GPIO.input(moisture_sensor_pin)
    print(f"moisture_level: {moisture_level}")
    # Invert the value (0 for wet, 1 for dry)
    # moisture_level = not moisture_level

    return moisture_level

try:
    while True:
        # Read the moisture level
        moisture_level = read_moisture_level()

        # Print the moisture level
        print(f'Moisture Level: {"Dry" if moisture_level else "Wet"}')

        # Delay for a short interval
        time.sleep(1)

except KeyboardInterrupt:
    print("Script terminated by the user")

finally:
    # Clean up GPIO
    GPIO.cleanup()