<p align="center">
  <img src="public/api_whatsapp.png" alt="Lightweight API for WhatsApp" width="120" height="120">
</p>

# 📱 WhatsApp Core API REST

`whatsapp-core` is an easy-to-use Docker REST API wrapper for [Baileys - Lightweight full-featured TypeScript/JavaScript WhatsApp Web API](https://github.com/WhiskeySockets/Baileys) built with [NestJS](https://nestjs.com/). It allows you to interact with WhatsApp using endpoints to enable message sending, simulate actions, fetch contacts, and more.

## ✨ Features

- 🚀 Send WhatsApp messages via API
- 🤖 Simulate user actions (e.g. composing, recording audio)
- 📲 Fetch chats, contacts, labels, and WhatsApp states
- 🔔 Manage webhooks for real-time updates
- 🔄 Server-Sent Events (SSE) for live message updates
- ⚡️ RESTful design based on NestJS
- 🔐 **NEW**: Django Gateway integration for session management
- 📱 **NEW**: QR code generation as base64 strings
- 📦 **NEW**: Containerized architecture for SaaS deployment

<br/>

## 🐳 Docker

### **Local Development:**
```bash
# Build the image
docker build -t whatsapp-core:latest .

# Run the container
docker run -d \
  --name whatsapp-core-test \
  -e DJANGO_GATEWAY_URL="http://localhost:8000" \
  -e DJANGO_API_TOKEN="your_api_token" \
  -e SESSION_ID="unique-session-id" \
  -e CONTAINER_ID="container-001" \
  -e APP_PORT="8085" \
  -p 8085:8085 \
  whatsapp-core:latest
```

### **Production (EKS/Kubernetes):**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: whatsapp-core
spec:
  replicas: 1
  selector:
    matchLabels:
      app: whatsapp-core
  template:
    metadata:
      labels:
        app: whatsapp-core
    spec:
      containers:
      - name: whatsapp-core
        image: whatsapp-core:latest
        ports:
        - containerPort: 8085
        env:
        - name: DJANGO_GATEWAY_URL
          value: "https://your-django-app.com"
        - name: DJANGO_API_TOKEN
          valueFrom:
            secretKeyRef:
              name: whatsapp-secrets
              key: api-token
        - name: SESSION_ID
          value: "user-123"
        - name: CONTAINER_ID
          value: "container-001"
        - name: APP_PORT
          value: "8085"
```

<br/>

## 🔧 Environment Variables

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `DJANGO_GATEWAY_URL` | ✅ | Django Gateway URL for session management | `http://localhost:8000` |
| `DJANGO_API_TOKEN` | ✅ | API token for Django authentication | - |
| `SESSION_ID` | ✅ | Unique session identifier | `default` |
| `CONTAINER_ID` | ❌ | Container identifier (auto-generated) | `container-001` |
| `APP_PORT` | ❌ | Application port | `8085` |
| `LOG_LEVEL` | ❌ | Logging level | `info` |

<br/>

## 👨🏻‍💻 Dev mode

Clone the repository:

```bash
git clone https://github.com/BlakePro/whatsapp-web-api-rest.git
```

Install dependencies:

```bash
cd whatsapp-web-api-rest
npm install
```

Start the server:

```bash
npm run dev
```

<br/>

## 🛠️ API Endpoints

### **Session Management:**
- `GET` /

    **Start WhatsApp session**

    Returns an HTML page displaying QR code for authentication `curl -i http://localhost:8085` or open in your browser [http://localhost:8085](http://localhost:8085)

- `GET` /qr

    **Get current WhatsApp QR code as base64**

    Returns the current QR code for WhatsApp authentication as base64 string, along with connection status
    
    `curl http://localhost:8085/qr`

    Response:
    ```json
    {
      "qr": "iVBORw0KGgoAAAANSUhEUgAA...",
      "text": "Scan this QR code to connect to WhatsApp",
      "connected": false
    }
    ```

- `POST` /qr

    **Generate QR code from custom text as base64**

    Generate a QR code from any text input and return it as base64 string
    
    `curl -X POST http://localhost:8085/qr \
    -H "Content-Type: application/json" \
    -d '{"text": "Hello World"}'`

    Response:
    ```json
    {
      "qr": "iVBORw0KGgoAAAANSUhEUgAA...",
      "text": "QR code generated for: Hello World"
    }
    ```

### **Messaging:**
- `POST`  /message
 
    **Send message text, media, location, poll, contact**

    Request Body: `application/json`

    `curl -X POST http://localhost:8085/message \
    -H "Content-Type: application/json" -d {...body}`

    *Body examples*:

    - Text:
    
      ```json
      {
        "chatId": "5215512345678@c.us",
        "text": "Hello!",
      }
      ```
    
    - Media (document):
    
      ```json
      {
        "chatId": "5215512345678@c.us",
        "media": {
            "type": "document",
            "filename": "My name of the file",
            "caption": "Hey! This is a pdf doc",
            "mimetype": "application/pdf",
            "data": "JVBERi0xLjMKJbrfrO..." // base64
        }
      }
      ```
    
    - Media (video):
    
      ```json
      {
        "chatId": "5215512345678@c.us",
        "media": {
            "type": "video",
            "caption": "Hey! This is a video",
            "data": "JVBERi0xLjMKJbrfrO..." // base64
        }
      }
      ```
    
    - Media (audio):
      ```json
      {
        "chatId": "5215512345678@c.us",
        "media": {
            "type": "audio",
            "caption": "Hey! This is an audio",
            "ptt": false, // Set to true if you want it to appear as a voice note
            "data": "JVBERi0xLjMKJbrfrO..." // base64
        }
      }
    - Media (sticker):
      ```json
      {
        "chatId": "5215512345678@c.us",
        "media": {
            "type": "sticker",
            "mimetype": "image/webp",
            "data": "JVBERi0xLjMKJbrfrO..." // base64
        }
      }
      ```
    
    - Location:
    
      ```json
      {
          "chatId": "5215512345678@c.us",
          "location": {
            "name": "Googleplex",
            "address": "1600 Amphitheatre Pkwy",
            "url": "https: //google.com",
            "latitude": 37.422,
            "longitude": -122.084
          }
      }
      ```
    
    - Contact:
    
      ```json
      {
          "chatId": "5215512345678@c.us",
          "contact": {
              "firstname": "Blake",
              "lastname": "Pro",
              "email": "blakegt@gmail.com",
              "phone": "5215512345678"
          }
      }
      ```
    
    - Poll:
    
      ```json
      {
          "chatId": "5215512345678@c.us",
          "poll": {
              "name": "Do you like Apple?",
              "options": [
                  "Yes",
                  "No",
                  "Maybe"
              ],
              "allowMultipleAnswers": false
          }
      }
      ```

### **Actions & Status:**
- `POST` /simulate

    **Simulate an action (presence)**
  - **chatId**: The chat number ID
  - **action**: The action to simulate: unavailable | available | composing | recording | paused
    ```json
    {
        "chatId": "5215512345678@c.us",
        "action": "composing",
    }
    ```
    `curl http://localhost:8085/simulate`

<br/>

- `GET` /profile/status/:chatId
    
    **Get the status of a person/group**
     - **chatId**: The chat number ID
      
    `curl http://localhost:8085/profile/status/:chatId`

<br/>

- `GET` /profile/picture/:chatId

    **Get profile url picture of a person/group**
     - **chatId**: The chat number ID
     
     `curl http://localhost:8085/picture/status/:chatId`

### **Data Retrieval:**
- `GET` /chats

    **Fetches all available chats**
    
    `curl http://localhost:8085/chats`

<br/>

- `GET` /contacts  

    **Fetches all available contacts**  

    `curl http://localhost:8085/contacts`

<br/>

- `GET` /number/:numberId  

    **Check if a given ID is on WhatsApp**
  - **number**: The phone number
  
  `curl http://localhost:8085/number/:number`

### **Session Control:**
- `GET` /logout

    **Logs out from the current WhatsApp session**
    
    `curl http://localhost:8085/logout`

<br/>

## 🛠️ Manage webhooks

- `GET`  /webhooks

    **Fetches the list of registered webhook URLs**
    
    `curl http://localhost:8085/webhooks`

<br/>

- `POST` /webhooks

    **Create a new webhook URL**
    Request Body: `application/json`
    
    
    ```bash
    curl -X POST http://localhost:8085/webhooks \
    -H "Content-Type: application/json" \
    -d { "url": "https://your-webhook-url.com" }
    ```
    
<br/>

- `DELETE` /webhooks/:indexId

    **Remove the webhook by the index in the list**
    
    `curl -X DELETE http://localhost:8085/webhooks/:indexId`

<br/>

## 🌐 Example of a webhook in an Express.js (Node.js) application

1. Create a folder in your computer and enter

2. Init the project
`npm init`

3. Install express.js
`npm i express.js`

4. Create a file index.js

5. Copy and paste in index.js and run in terminal `node index.js`

    ```js
    const express = require('express');
    
    const app = express();
    const port = 3005;
    const limit = '50mb';
    
    // Use express.json() middleware to parse JSON bodies
    app.use(express.json({ limit }));
    app.use(express.urlencoded({ extended: true, limit }));
    
    // Define a POST endpoint
    app.post('/', async (req, res) => {
      const url = `${req.protocol}://${req.get('host')}${req.url}`;
      const bodyPayload = req.body;
    
      const message = bodyPayload?.message;
      const media = bodyPayload?.media;
      const from = message?.from;
      console.log(from)

      // Body payload data 
      const payload = {
        chatId: from,
        text: 'Response from webhook'
      }
    
      // Send message to endpoint
      await fetch(`${url}/message`,
        {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
          },
        })
    
      res.send({});
    });
    
    // Start the server
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
    ```

## 🤝 Deployment

### **Local Development:**
```bash
npm run dev
```

### **Production Build:**
```bash
npm run build
npm run start:prod
```

### **Docker:**
```bash
# Build
docker build -t whatsapp-core:latest .

# Run
docker run -d \
  --name whatsapp-core \
  -e DJANGO_GATEWAY_URL="https://your-django-app.com" \
  -e DJANGO_API_TOKEN="your_token" \
  -e SESSION_ID="user-123" \
  -p 8085:8085 \
  whatsapp-core:latest
```

## 🤝 Contributing

Feel free to contribute by creating issues or submitting pull requests. All contributions are welcome!

## 🤝 Disclaimer

This project is not affiliated, associated, authorized, endorsed by, or in any way officially connected with WhatsApp or any of its subsidiaries or its affiliates. The official WhatsApp website can be found at whatsapp.com. "WhatsApp" as well as related names, marks, emblems and images are registered trademarks of their respective owners. Also it is not guaranteed you will not be blocked by using this method. WhatsApp does not allow bots or unofficial clients on their platform, so this shouldn't be considered totally safe.

## 📜 License

This project is licensed under the MIT License.

## 👨🏻‍💻 Author

[Cristian Yosafat Hernández Ruiz - BlakePro](https://github.com/blakepro)

## 🔄 Recent Updates

- ✅ Added Django Gateway integration
- ✅ Added QR code generation as base64
- ✅ Added containerized architecture support
- ✅ Added environment variables configuration
- ✅ Added Kubernetes deployment examples
- ✅ Updated API documentation