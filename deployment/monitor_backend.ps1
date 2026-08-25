# Target local backend API endpoint
$Url = "http://127.0.0.1:5000/api/openapi.json"
$LogFile = Join-Path $PSScriptRoot "portfolio_monitor.log"

try {
    # Send a web request to test endpoint health
    $Response = Invoke-WebRequest -Uri $Url -Method Get -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
    $Status = $Response.StatusCode
}
catch {
    if ($_.Exception.Response) {
        $Status = [int]$_.Exception.Response.StatusCode
    } else {
        $Status = 0
    }
}

$Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

# If status code is not 200 (healthy OK status)
if ($Status -ne 200) {
    Add-Content -Path $LogFile -Value "$Timestamp: Portfolio Backend API is unhealthy (Status: $Status). Attempting restart..."
    
    # Check if python processes are running and stop them
    $FlaskProcess = Get-Process -Name "python" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*app.py*" }
    if ($FlaskProcess) {
        Stop-Process -Id $FlaskProcess.Id -Force
    }
    
    # Start app.py in a background process
    Start-Process -FilePath "python" -ArgumentList "app.py" -WorkingDirectory $PSScriptRoot\.. -WindowStyle Hidden
    Add-Content -Path $LogFile -Value "$Timestamp: Restart command executed."
} else {
    Add-Content -Path $LogFile -Value "$Timestamp: Portfolio Backend API is active and healthy (Status: $Status)."
}
