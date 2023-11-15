# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0.

from awscrt import mqtt, http
from awsiot import mqtt_connection_builder
import sys
import threading
import time
import json
from utils.command_line_utils import CommandLineUtils
import requests

# This sample uses the Message Broker for AWS IoT to send and receive messages
# through an MQTT connection. On startup, the device connects to the server,
# subscribes to a topic, and begins publishing messages to that topic.
# The device should receive those same messages back from the message broker,
# since it is subscribed to that same topic.

# cmdData is the arguments/input from the command line placed into a single struct for
# use in this sample. This handles all of the command line parsing, validating, etc.
# See the Utils/CommandLineUtils for more information.
cmdData = CommandLineUtils.parse_sample_input_pubsub()

received_count = 0
received_all_event = threading.Event()

# Callback when connection is accidentally lost.
def on_connection_interrupted(connection, error, **kwargs):
    print("Connection interrupted. error: {}".format(error))


# Callback when an interrupted connection is re-established.
def on_connection_resumed(connection, return_code, session_present, **kwargs):
    print("Connection resumed. return_code: {} session_present: {}".format(return_code, session_present))

    if return_code == mqtt.ConnectReturnCode.ACCEPTED and not session_present:
        print("Session did not persist. Resubscribing to existing topics...")
        resubscribe_future, _ = connection.resubscribe_existing_topics()

        # Cannot synchronously wait for resubscribe result because we're on the connection's event-loop thread,
        # evaluate result with a callback instead.
        resubscribe_future.add_done_callback(on_resubscribe_complete)


def on_resubscribe_complete(resubscribe_future):
    resubscribe_results = resubscribe_future.result()
    print("Resubscribe results: {}".format(resubscribe_results))

    for topic, qos in resubscribe_results['topics']:
        if qos is None:
            sys.exit("Server rejected resubscribe to topic: {}".format(topic))


# Callback when the subscribed topic receives a message
def on_message_received(topic, payload, dup, qos, retain, **kwargs):
    print("Received message from topic '{}': {}".format(topic, payload))
    global received_count
    received_count += 1

    wateredSuccess = waterPlant()
    while not wateredSuccess:
        wateredSuccess = waterPlant()

    if received_count == cmdData.input_count:
        received_all_event.set()

# Callback when the connection successfully connects
def on_connection_success(connection, callback_data):
    assert isinstance(callback_data, mqtt.OnConnectionSuccessData)
    print("Connection Successful with return code: {} session present: {}".format(callback_data.return_code, callback_data.session_present))

# Callback when a connection attempt fails
def on_connection_failure(connection, callback_data):
    assert isinstance(callback_data, mqtt.OnConnectionFailuredata)
    print("Connection failed with error code: {}".format(callback_data.error))

# Callback when a connection has been disconnected or shutdown successfully
def on_connection_closed(connection, callback_data):
    print("Connection closed")

def log(message, file):
    f = open(file, "a")
    f.write(message + "\n")
    f.close()

import RPi.GPIO as GPIO
# from relay import onswitch, offswitch
import datetime
import Adafruit_DHT
from time import sleep
from gpiozero import Buzzer, InputDevice

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

wateringscheduleFile = "wateringschedule.txt"
plant_id = "c325ae6d-5554-4605-bac1-b5bad7af14e1"

def getWaterRatio():
    ratioWaterLevel = None
    try:
        # set to same board at top when water pump prob fixed:
        GPIO.output(PIN_TRIGGER, GPIO.LOW)
        time.sleep(2)
        GPIO.output(PIN_TRIGGER, GPIO.HIGH)
        time.sleep(0.00001)
        GPIO.output(PIN_TRIGGER, GPIO.LOW)
        while GPIO.input(PIN_ECHO)==0:
                pulse_start_time = time.time()
        while GPIO.input(PIN_ECHO)==1:
                pulse_end_time = time.time()
        pulse_duration = pulse_end_time - pulse_start_time
        distance = round(pulse_duration * 17150, 2)
        global previousWaterDistance
        previousWaterDistance = 12.02
        # if distance > previousWaterDistance:
        #     previousWaterDistance = distance
        ratioWaterLevel = (1 - (distance / previousWaterDistance)) * 100
    except:
        pass
    return ratioWaterLevel

def getSunlightLevel():
    sunlightLevel = None
    try:
        sunlightLevel = 0 if GPIO.input(8) == 1 else 1
    except:
        sunlightLevel = None
    return sunlightLevel

def getData():

    humidity, temperature = Adafruit_DHT.read_retry(DHT_SENSOR, DHT_PIN)
    ratioWaterLevel = getWaterRatio()
    sunlightLevel = getSunlightLevel()
    no_rain = InputDevice(raindropsPin).is_active
    

    last_watered_time_stamp = None
    f = open(wateringscheduleFile, "r")
    lines = f.readlines()
    if len(lines) != 0:
        last_watered_time_stamp = lines[-1].split(" ")[-1]
    else: 
        last_watered_time_stamp = None
    f.close()
    # import os
    # # get the current working directory
    # current_working_directory = os.getcwd()
    # # print output to the console
    # print(f"current_working_directory: {current_working_directory}")

    return {"humidity_level": round(humidity, 3) if humidity != None else -1, 
    "temperature": round(temperature, 3) if temperature != None else -1,
    "water_level": round(ratioWaterLevel, 3) if ratioWaterLevel != None else -1, 
    "raining": True if not no_rain else False, 
    "last_watered_time_stamp": last_watered_time_stamp, 
    "sunlight_level" : 0 if sunlightLevel else 1,
    "plant_id": plant_id, 
    "moisture_level": 1}


def onswitch(RelayPin = RelayPin):
    GPIO.setmode(GPIO.BOARD) # Set GPIO as numbering
    GPIO.setup(RelayPin, GPIO.OUT)
    GPIO.output(RelayPin, GPIO.HIGH)


def offswitch(RelayPin = RelayPin):
    GPIO.output(RelayPin, GPIO.HIGH)
    GPIO.cleanup()

# import pandas as pd
def waterPlant():
    try:
        # raise Exception("Cannot")
        onswitch(RelayPin)
        time.sleep(20)
        
        offswitch(RelayPin)
        # t = pd.Timestamp(datetime.datetime.now())
        # t = t.replace(hour=7, minute=0, second=0)
        # print(t)
        log(f"watered at {datetime.datetime.now()}", wateringscheduleFile)
        # log(f"watered at {t}", wateringscheduleFile)
        return True
    except:
        return False

def printtempdata():
    print(f"message_string['humidity_level']/25 > thresholds['min_moisture_level']: {float(message_string['humidity_level'])/25 > int(thresholds['min_moisture_level'])}")
    print(f"message_string['temperature']/100 + 24 > thresholds['temperature_threshold']: {float(message_string['temperature'])/100 + 24 > int(thresholds['temperature_threshold'])}")
    print(f"message_string['humidity_level'] /25 : {float(message_string['humidity_level']) /25}, thresholds['min_moisture_level']: {int(thresholds['min_moisture_level'])}")
    print(f"message_string['temperature'] /100 + 24 : {float(message_string['temperature']) /100 + 24}, thresholds['temperature_threshold']: {int(thresholds['temperature_threshold'])}")
    print("---------------------------------------------------------")

def getThresholds():
    url = "https://bi78gkwb12.execute-api.ap-southeast-1.amazonaws.com/api/post_email_water_level_low_alert"
    r = requests.post(url, json={
    "plant_id":"c325ae6d-5554-4605-bac1-b5bad7af14e1" }, 
    headers={"Content-Type": "application/json"})
    return r.status_code, r.json()

def getThresholds():
    url = "https://bi78gkwb12.execute-api.ap-southeast-1.amazonaws.com/api/get_threshold?plant_id=c325ae6d-5554-4605-bac1-b5bad7af14e1"
    r = requests.get(url)
    return r.json()["data"][0]
if __name__ == '__main__':
    GPIO.setmode(GPIO.BOARD)
    GPIO.setup(8, GPIO.IN)
    GPIO.setup(PIN_TRIGGER, GPIO.OUT)
    GPIO.setup(PIN_ECHO, GPIO.IN)

    # Create the proxy options if the data is present in cmdData
    proxy_options = None
    if cmdData.input_proxy_host is not None and cmdData.input_proxy_port != 0:
        proxy_options = http.HttpProxyOptions(
            host_name=cmdData.input_proxy_host,
            port=cmdData.input_proxy_port)

    # Create a MQTT connection from the command line data
    mqtt_connection = mqtt_connection_builder.mtls_from_path(
        endpoint=cmdData.input_endpoint,
        port=cmdData.input_port,
        cert_filepath=cmdData.input_cert,
        pri_key_filepath=cmdData.input_key,
        ca_filepath=cmdData.input_ca,
        on_connection_interrupted=on_connection_interrupted,
        on_connection_resumed=on_connection_resumed,
        client_id=cmdData.input_clientId,
        clean_session=False,
        keep_alive_secs=30,
        http_proxy_options=proxy_options,
        on_connection_success=on_connection_success,
        on_connection_failure=on_connection_failure,
        on_connection_closed=on_connection_closed)

    if not cmdData.input_is_ci:
        print(f"Connecting to {cmdData.input_endpoint} with client ID '{cmdData.input_clientId}'...")
    else:
        print("Connecting to endpoint with client ID")
    connect_future = mqtt_connection.connect()

    # Future.result() waits until a result is available
    connect_future.result()
    print("Connected!")

    message_count = cmdData.input_count
    # message_topic = cmdData.input_topic
    message_topic = f"device/{plant_id}/data"
    # message_string = cmdData.input_message
    import json

    message_string = getData()

    watering_topic = f"water/{plant_id}/data"
    topic = watering_topic
    # Subscribe -  TODO: to get watering requests???
    print("Subscribing to topic '{}'...".format(topic))
    subscribe_future, packet_id = mqtt_connection.subscribe(
        topic=topic,
        qos=mqtt.QoS.AT_LEAST_ONCE,
        callback=on_message_received)

    subscribe_result = subscribe_future.result()
    print("Subscribed with {}".format(str(subscribe_result['qos'])))

    # Publish message to server desired number of times.
    # This step is skipped if message is blank.
    # This step loops forever if count was set to 0.

    if message_string:
        if message_count == 0:
            print("Sending messages until program killed")
        else:
            print("Sending {} message(s)".format(message_count))

        publish_count = 1
        while (publish_count <= message_count) or (message_count == 0):
            message_string = getData()
            message = "{} [{}]".format(message_string, publish_count)
            print("Publishing message to topic '{}': {}".format(message_topic, message_string))
            message_json = json.dumps(message_string)
            mqtt_connection.publish(
                topic=message_topic,
                payload=message_json,
                qos=mqtt.QoS.AT_LEAST_ONCE)
            # send every second for now
            time.sleep(3)
            publish_count += 1

            # log(f"Published {message_string} to AWS Iot Core\n")

            subscribe_result = subscribe_future.result()
            thresholds = getThresholds()

            printtempdata()

            if float(message_string["humidity_level"])/25 > int(thresholds["min_moisture_level"]) or \
                    float(message_string["temperature"])/100 + 24 > float(thresholds["temperature_threshold"]):
                        # message_string["water_level"] > thresholds["water_threshold"]
                print("threshold hit so watering:")
                printtempdata()
                waterPlant()
                print("watering done")
            
            print(f"message_string['water_level']: {message_string['water_level']}")
            if -1 < float(message_string["water_level"]) and float(message_string["water_level"]) > int(thresholds["min_water_level"]):
                data = getThresholds()
                print("sending email:", data.status_code)

    # Wait for all messages to be received.
    # This waits forever if count was set to 0.
    if message_count != 0 and not received_all_event.is_set():
        print("Waiting for all messages to be received...")

    received_all_event.wait()
    print("{} message(s) received.".format(received_count))

    # Disconnect
    print("Disconnecting...")
    disconnect_future = mqtt_connection.disconnect()
    disconnect_future.result()
    print("Disconnected!")