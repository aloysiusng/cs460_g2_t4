package main

import (
	"fmt"
	"log"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/stianeikeland/go-rpio/v4"
)

var (
	dhtSensorPin = rpio.Pin(17)
	soilPin      = rpio.Pin(11)
	address      = 0x48
	bus          = rpio.I2C
)

func main() {
	err := rpio.Open()
	if err != nil {
		fmt.Println("Error opening GPIO:", err)
		return
	}
	defer rpio.Close()

	r := gin.Default()
	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	r.Use(cors.New(config))

	server, err := socketio.NewServer(nil)
	if err != nil {
		log.Fatal(err)
	}
	r.GET("/socket.io/", gin.WrapH(server))
	r.POST("/socket.io/", gin.WrapH(server))

	server.OnConnect("/", func(s socketio.Conn) error {
		fmt.Println("Connected to client")
		s.Emit("connect", "Server is connected")
		return nil
	})

	server.OnDisconnect("/", func(s socketio.Conn, reason string) {
		fmt.Println("Client disconnected")
		s.Emit("disconnect", "Server is disconnected")
	})

	server.OnEvent("/", "live_data", func(s socketio.Conn, count int) {
		data := getLiveData()
		s.Emit("live_data", data)
		fmt.Printf("%d - Sent data to client\n", count)
	})

	if err := r.Run("192.168.68.64:8089"); err != nil {
		log.Fatal(err)
	}
}

func getLiveData() map[string]interface{} {
	humidity, temperature, _ := readDHTSensor()
	reservoir := readAnalogSensor(0)
	moisture := readAnalogSensor(1)
	sunlight := readAnalogSensor(2)
	currentTime := time.Now().Format("02-01-2006 15:04:05")

	data := map[string]interface{}{
		"time":        currentTime,
		"moisture":    moisture,
		"temperature": temperature,
		"humidity":    humidity,
		"sunlight":    sunlight,
		"reservoir":   reservoir,
	}

	fmt.Printf("R: %d M: %d S: %d\n", reservoir, moisture, sunlight)

	return data
}

func readDHTSensor() (float32, float32, error) {
	return 0, 0, nil // Replace with actual DHT sensor reading logic
}

func readAnalogSensor(channel byte) byte {
	return 0 // Replace with actual analog sensor reading logic
}

// Please note that I've used the github.com/stianeikeland/go-rpio/v4 library for GPIO operations, 
// and the github.com/googollee/go-socket.io library for socket communication.
// Since the DHT sensor and analog sensors may require specific Go libraries, 
// you need to replace the placeholders readDHTSensor and readAnalogSensor with the appropriate logic for reading data from those sensors. 
// Additionally, you might need to adjust and optimize the code according to your specific use case.
