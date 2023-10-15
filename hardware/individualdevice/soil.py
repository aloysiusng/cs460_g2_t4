import RPi.GPIO as GPIO
import time

print ("test")

#GPIO SETUP
channel = 26
# channel = 36
GPIO.setmode(GPIO.BCM)
GPIO.setup(channel, GPIO.IN)
 
print ("test")

Bing = GPIO.input(channel)

print(Bing)

def callback(channel):
        if GPIO.input(channel):
                print ("Water Detected!")
        else:
                print ("Water not Detected!")
 
# callback(channel)
# GPIO.add_event_detect(channel, GPIO.BOTH, bouncetime=300)  # let us know when the pin goes HIGH or LOW
# GPIO.add_event_callback(channel, callback)  # assign function to GPIO PIN, Run function on change
 

while True:
#     callback(26)
        Bing = GPIO.input(channel)
        print(f"Bing: {Bing}")
        time.sleep(2)
# print ("test") 

# # # infinite loop
# while True:
#         time.sleep(0)