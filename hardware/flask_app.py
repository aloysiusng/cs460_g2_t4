import sqlite3
from flask import Flask, request, jsonify
import time
from datetime import datetime
import random
import json
from flask_cors import CORS
import RPi.GPIO as GPIO
# from relay import onswitch, offswitch

app = Flask(__name__)
CORS(app, resources={r"/*":{"origins":"*"}})

GPIO.setmode(GPIO.BOARD)
RelayPin = 11 # Set pin11 as Out

GPIO.setup(RelayPin, GPIO.OUT)
GPIO.output(RelayPin, GPIO.HIGH)

def onswitch(RelayPin = RelayPin):
    GPIO.setmode(GPIO.BOARD) # Set GPIO as numbering
    GPIO.setup(RelayPin, GPIO.OUT)
    GPIO.output(RelayPin, GPIO.HIGH)

def offswitch(RelayPin = RelayPin):
    GPIO.output(RelayPin, GPIO.HIGH)
    GPIO.cleanup()

@app.route('/water',methods=['GET'])
def waterPlant():
    print("helloo")
    onswitch(RelayPin)
    time.sleep(5)
    offswitch(RelayPin)
    print("done watering")
    return "Done"

if __name__ == '__main__':
    offswitch(RelayPin)
    app.run(debug=True, port=5000, host="0.0.0.0")