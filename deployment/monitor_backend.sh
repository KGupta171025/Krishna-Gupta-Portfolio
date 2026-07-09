#!/bin/bash

# Target local backend API endpoint
URL="http://127.0.0.1:5000/api/contact"
LOG_FILE="/var/log/portfolio_monitor.log"

# Query the HTTP response status code with a 5-second timeout
STATUS=$(curl -o /dev/null -s -w "%{http_code}\n" --max-time 5 "$URL")

# If the status code is not 200 (OK) or 400/429 (which are expected API validation codes)
if [ "$STATUS" -eq 000 ] || [ "$STATUS" -ge 500 ]; then
    echo "$(date): Portfolio Backend API is unhealthy (Status: $STATUS). Initiating automatic restart..." >> "$LOG_FILE"
    systemctl restart portfolio.service
else
    echo "$(date): Portfolio Backend API is active and healthy (Status: $STATUS)." >> "$LOG_FILE"
fi
