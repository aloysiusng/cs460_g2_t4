package main

import (
	"fmt"
	"strconv"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/sns"
)

func sendSMSNotification(number string, threshold int, toggle int, reservoirLevel int) error {
	if toggle != 1 {
		return fmt.Errorf("Notifications switched off")
	}

	if reservoirLevel >= threshold {
		return fmt.Errorf("Reservoir level sufficient")
	}

	// Initialize an AWS session with your configured credentials
	sess, err := session.NewSession(&aws.Config{
		Region: aws.String("YOUR_AWS_REGION"), // Replace with your AWS region
	})
	if err != nil {
		return err
	}

	// Create an SNS client
	svc := sns.New(sess)

	message := "Hello Owner! Your system reservoir is currently below " + strconv.Itoa(convertThreshold(threshold)) + ".\n\nPlease fill up the reservoir!"

	// Publish SMS message
	_, err = svc.Publish(&sns.PublishInput{
		Message:     aws.String(message),
		PhoneNumber: aws.String("+65" + number), // Replace with recipient's phone number
	})

	return err
}
