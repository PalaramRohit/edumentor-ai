$ErrorActionPreference = "Stop"

try {
    # 1. Create User
    $userBody = @{
        name = "Test User"
        email = "test@example.com"
        branch = "Computer Science"
        year = 3
        target_role = "Backend Developer"
    } | ConvertTo-Json

    Write-Host "Creating user..."
    $userResponse = Invoke-RestMethod -Uri "http://127.0.0.1:5000/users/" -Method Post -Body $userBody -ContentType "application/json"
    $userId = $userResponse._id
    Write-Host "User created with ID: $userId"

    # 2. Generate Roadmap
    $roadmapBody = @{
        user_id = $userId
        missing_skills = @("Docker", "Kubernetes", "GraphQL")
        hours_per_week = 5
        weeks = 4
    } | ConvertTo-Json

    Write-Host "Generating roadmap for missing skills: Docker, Kubernetes, GraphQL..."
    $roadmapResponse = Invoke-RestMethod -Uri "http://127.0.0.1:5000/roadmap/generate" -Method Post -Body $roadmapBody -ContentType "application/json"
    
    Write-Host "`nRoadmap Generated Successfully!"
    Write-Host "-------------------------------"
    $roadmapResponse.roadmap | ConvertTo-Json -Depth 10
}
catch {
    Write-Error "Test failed: $_"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Error "Response content: $($reader.ReadToEnd())"
    }
}
