# Powershell script to create a local venv in this project and install dependencies
$envPath = (Resolve-Path .)\\.venv
if (-Not (Test-Path $envPath)) {
    python -m venv .venv
}
.\.venv\Scripts\Activate.ps1
pip install --upgrade pip
pip install -r requirements.txt
python -m spacy download en_core_web_sm
Write-Host "Environment setup complete. Activate with: .\.venv\Scripts\Activate.ps1" -ForegroundColor Green
