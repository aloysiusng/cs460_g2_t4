package main

import (
	"database/sql"
	"fmt"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
)

var db *sql.DB

func main() {
	r := gin.Default()
	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	r.Use(cors.New(config))

	r.GET("/getdata", getData)
	r.GET("/getalldata", getAllData)

	db, _ = sql.Open("sqlite3", "sensors_data.db")

	r.Run("192.168.68.64:8088")
}

func getData(c *gin.Context) {
	var data interface{}
	err := db.QueryRow("SELECT * FROM sensors_data ORDER BY timestamp DESC LIMIT 1").Scan(&data)
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}
	c.JSON(http.StatusOK, data)
}

func getAllData(c *gin.Context) {
	rows, err := db.Query("SELECT * FROM sensors_data ORDER BY timestamp DESC")
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}
	defer rows.Close()

	var data []interface{}
	for rows.Next() {
		var item interface{}
		err := rows.Scan(&item)
		if err != nil {
			fmt.Println(err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
			return
		}
		data = append(data, item)
	}

	c.JSON(http.StatusOK, gin.H{"status": 200, "data": data})
}
