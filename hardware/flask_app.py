import sqlite3
from flask import Flask, request, jsonify
import time
from datetime import datetime
import random
import json
from flask_cors import CORS
import RPi.GPIO as GPIO
# from relay import onswitch, offswitch
import datetime
import Adafruit_DHT
from time import sleep
from gpiozero import Buzzer, InputDevice

app = Flask(__name__)
CORS(app, resources={r"/*":{"origins":"*"}})

# GPIO.setmode(GPIO.BOARD)

# for water pump
RelayPin = 13 # Set pin13 as Out

# for ultrasonic sensor
PIN_TRIGGER = 7
PIN_ECHO = 11
global previousWaterDistance
previousWaterDistance = 0 #in cm

# temperature and humidity
DHT_SENSOR = Adafruit_DHT.DHT22
# DHT_PIN = 4
DHT_PIN = 22

# for raindrops module
raindropsPin = 21

# GPIO.setup(RelayPin, GPIO.OUT)
# GPIO.output(RelayPin, GPIO.HIGH)

def onswitch(RelayPin = RelayPin):
    GPIO.setmode(GPIO.BOARD) # Set GPIO as numbering
    GPIO.setup(RelayPin, GPIO.OUT)
    GPIO.output(RelayPin, GPIO.HIGH)


def offswitch(RelayPin = RelayPin):
    GPIO.output(RelayPin, GPIO.HIGH)
    GPIO.cleanup()

def log(message, file):
    f = open(file, "a")
    f.write(message + "\n")
    f.close()

@app.route('/water',methods=['GET'])
def waterPlant():
    try:
        # raise Exception("Cannot")
        onswitch(RelayPin)
        time.sleep(5)
        
        offswitch(RelayPin)
        log(f"watered at {datetime.datetime.now()}", "wateringschedule.txt")
        return jsonify({'status': 200,
                            'data': {
                                'wateringDone': True
                            }})
    except:
        return jsonify({'status': 404,
                            'data': {
                                'errorMsg': 'Failed to water plant. Please try again.'
                            }})

    
@app.route('/',methods=['GET'])
def landingPage():
    return "Hello welcome to the api!"
    

@app.route('/waterlevel',methods=['GET'])
def getWaterLevelUltrasonic():
    ratioWaterLevel = None
    try:
        # set to same board at top when water pump prob fixed:
        GPIO.setmode(GPIO.BOARD)

        GPIO.setup(PIN_TRIGGER, GPIO.OUT)
        GPIO.setup(PIN_ECHO, GPIO.IN)

        GPIO.output(PIN_TRIGGER, GPIO.LOW)

        # print( "Waiting for sensor to settle")

        time.sleep(2)

        print( "Calculating distance")

        GPIO.output(PIN_TRIGGER, GPIO.HIGH)

        time.sleep(0.00001)

        GPIO.output(PIN_TRIGGER, GPIO.LOW)
        pulse_start_time = 0
        pulse_end_time = 0
        while GPIO.input(PIN_ECHO)==0:
                pulse_start_time = time.time()
        while GPIO.input(PIN_ECHO)==1:
                pulse_end_time = time.time()

        pulse_duration = pulse_end_time - pulse_start_time
        distance = round(pulse_duration * 17150, 2)
        print( "Distance:",distance,"cm")

        global previousWaterDistance
        # print(f"previousWaterDistance: {previousWaterDistance}")
        if distance > previousWaterDistance:
            previousWaterDistance = distance
        ratioWaterLevel = (1 - (distance / previousWaterDistance)) * 100
        
    finally:
        GPIO.cleanup()
    
    if ratioWaterLevel != None:
        return jsonify({'status': 200,
                            'data': {
                                'ratioWaterLevel': round(ratioWaterLevel, 3),
                                'time_stamp': datetime.datetime.now()
                            }})
    else:
        return jsonify({'status': 404,
                            'data': {}})

@app.route('/getLight',methods=['GET'])
def getLight():
    try:
        GPIO.setmode(GPIO.BOARD)
        GPIO.setup(8, GPIO.IN)
        return jsonify({'status': 200,
                    'data': {
                        'daytime': False if GPIO.input(8) == 1 else True,
                        'time_stamp': datetime.datetime.now()
                    }})
    except:
        return jsonify({'status': 404,
                            'data': {
                                'errorMsg': 'Failed to retrieve data from light sensor'
                            }})
    
@app.route('/gettemp',methods=['GET'])
def getTemperatureAndLight():
    humidity, temperature = Adafruit_DHT.read_retry(DHT_SENSOR, DHT_PIN)

    if humidity is not None and temperature is not None:
        return jsonify({'status': 200,
                            'data': {
                                'temperature': round(temperature, 3),
                                'humidity': round(humidity, 3),
                                'time_stamp': datetime.datetime.now()
                            }})

    else:
        return jsonify({'status': 404,
                            'data': {
                                'errorMsg': 'Failed to retrieve data from humidity sensor'
                            }})
    
@app.route('/weather',methods=['GET'])
def getWeather():
    no_rain = InputDevice(raindropsPin)
    return jsonify({'status': 200,
                'data': {
                    'weather': "Raining" if not no_rain.is_active else "Sunny",
                    'time_stamp': datetime.datetime.now()
                }})


if __name__ == '__main__':
    previousWaterDistance = 0 #in cm
    onswitch(RelayPin)
    offswitch(RelayPin)
    app.run(debug=True, port=5000, host="0.0.0.0")