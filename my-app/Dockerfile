# Use the official Node.js image as the base
FROM node:16

# Install Python
RUN apt-get update && apt-get install -y python3 python3-pip

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json files to the working directory
COPY my-app/package*.json ./  

# Install Node.js application dependencies
RUN npm install

# Copy the rest of the application code to the working directory, including Python scripts
COPY my-app/. ./  

COPY ./statisfy-frontend/build /app/statisfy-frontend/build


# Copy Python dependencies and scripts
# Copy Python dependencies and scripts
COPY ../statisfy-backend/requirements.txt ./requirements.txt  
COPY ../statisfy-backend/classify_email.py ./classify_email.py
COPY ../statisfy-backend/classifier.pkl ./classifier.pkl


# Install Python dependencies
RUN pip3 install -r requirements.txt

# Set environment variable for Gmail credentials
ENV GOOGLE_APPLICATION_CREDENTIALS=/app/statisfy-backend/credentials.json

# Expose the application port (backend is running on 3004)
EXPOSE 3004

# Start the application
CMD ["npm", "start"]
