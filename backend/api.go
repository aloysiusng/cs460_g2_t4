package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
	"github.com/googollee/go-socket.io"
	"github.com/twilio/twilio-go"
	"github.com/twilio/twilio-go/client"
)

// Replace with your Twilio Account SID and Auth Token
const (
	accountSid = "YOUR_TWILIO_ACCOUNT_SID"
	authToken  = "YOUR_TWILIO_AUTH_TOKEN"
)

var (
	db *sql.DB
)

func main() {
	// Initialize the SQLite database
	var err error
	db, err = sql.Open("sqlite3", "watering.db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

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

	if err := r.Run("192.168.68.64:8087"); err != nil {
		log.Fatal(err)
	}
}

// Add necessary structs here to match your database tables

func getLiveData() map[string]interface{} {
	// Replace with your logic to read sensor data
	return nil
}

func sendSMSNotification(number string, threshold int, toggle int, reservoirLevel int) error {
	if toggle != 1 {
		return fmt.Errorf("Notifications switched off")
	}

	if reservoirLevel >= threshold {
		return fmt.Errorf("Reservoir level sufficient")
	}

	client := client.NewClient(accountSid, authToken, nil)
	_, err := client.Messages.SendMessage(
		"YOUR_TWILIO_PHONE_NUMBER",
		"+65"+number,
		"Hello Owner! Your system reservoir is currently below "+strconv.Itoa(convertThreshold(threshold))+".\n\nPlease fill up the reservoir!",
		nil,
	)
	if err != nil {
		return err
	}

	return nil
}

func convertThreshold(input int) int {
	reservoirFull := 125
	return (input * 100) / reservoirFull
}

func updateTable(tableName string, data map[string]interface{}) error {
	tx, err := db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	columns := ""
	values := ""
	args := []interface{}{}
	for key, value := range data {
		columns += key + ","
		values += "?,"
		args = append(args, value)
	}
	columns = columns[:len(columns)-1]
	values = values[:len(values)-1]

	query := fmt.Sprintf("INSERT INTO %s (%s) VALUES (%s)", tableName, columns, values)
	_, err = tx.Exec(query, args...)
	if err != nil {
		return err
	}

	err = tx.Commit()
	if err != nil {
		return err
	}

	return nil
}

func getLatestRecord(tableName string) (map[string]interface{}, error) {
	query := fmt.Sprintf("SELECT * FROM %s ORDER BY id DESC LIMIT 1", tableName)
	row := db.QueryRow(query)

	data := make(map[string]interface{})
	// Scan the data from the row into the data map here
	return data, nil
}

func updateRecord(tableName string, data map[string]interface{}) error {
	tx, err := db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	values := ""
	args := []interface{}{}
	for key, value := range data {
		values += key + "=?,"
		args = append(args, value)
	}
	values = values[:len(values)-1]

	query := fmt.Sprintf("UPDATE %s SET %s", tableName, values)
	_, err = tx.Exec(query, args...)
	if err != nil {
		return err
	}

	err = tx.Commit()
	if err != nil {
		return err
	}

	return nil
}
