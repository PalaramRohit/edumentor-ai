# Stage 1: Build the frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
# We set VITE_API_URL to empty for the build so it uses relative paths
ENV VITE_API_URL=""
RUN npm run build

# Stage 2: Build the backend and serve the frontend
FROM python:3.10-slim
WORKDIR /app

# Install backend dependencies
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r backend/requirements.txt
RUN python -m spacy download en_core_web_sm

# Copy the backend code
COPY backend/ ./backend/

# Copy the frontend build to the backend's static folder
# This matches the static_folder path configured in app.py
COPY --from=frontend-builder /app/frontend/dist ./backend/static

# Set working directory to backend to run the app
WORKDIR /app/backend
EXPOSE 5000

# Start the application
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:create_app()"]
