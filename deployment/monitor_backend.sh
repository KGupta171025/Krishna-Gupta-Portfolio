#!/bin/bash

# Target local backend API endpoint
URL="http://127.0.0.1:5000/api/openapi.json"
LOG_FILE="/var/log/portfolio_monitor.log"

# Query the HTTP response status code with a 5-second timeout
STATUS=$(curl -o /dev/null -s -w "%{http_code}" --max-time 5 "$URL")

# If the status code is not 200 (OK)
if [ "$STATUS" -ne 200 ]; then
    echo "$(date): Portfolio Backend API is unhealthy (Status: $STATUS). Initiating automatic restart..." >> "$LOG_FILE"
    systemctl restart portfolio.service
else
    echo "$(date): Portfolio Backend API is active and healthy (Status: $STATUS)." >> "$LOG_FILE"
fi
