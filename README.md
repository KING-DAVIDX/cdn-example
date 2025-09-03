# KingCDN API Documentation

## Overview

KingCDN is an enterprise-grade file distribution network built on a modern Node.js stack that leverages Telegram's infrastructure for robust file storage and delivery. The system provides a simple REST API for uploading and retrieving files through a global content delivery network, offering reliable file hosting with automatic CDN distribution.

## Architecture

The application is built with:
- **Node.js** with Express.js server
- **MongoDB** for metadata storage
- **Telegram Bot API** for file storage and distribution
- **Multer** for file upload handling
- **Axios** for HTTP requests

## Base URL

All API requests should be made to:
```
https://king-cdn.zone.id
```

*(For local development, use: `http://localhost:7860`)*

## Environment Setup

To run KingCDN locally, you need to configure these environment variables:

```bash
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
TELEGRAM_CHANNEL_ID=your_telegram_channel_id_here
MONGO_URL=your_mongodb_connection_string
PORT=7860 # optional, defaults to 7860
```

## API Endpoints

### Upload File

Upload files to the CDN with a simple POST request.

**Endpoint**: `POST /upload`

**Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| file | File | Yes | The file to upload (max 2GB, Telegram's limit) |

**Example Request**:

```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('https://king-cdn.zone.id/upload', {
  method: 'POST',
  body: formData
});
const data = await response.json();
```

**Success Response (200 OK)**:
```json
{
  "uploaded_by": "King David",
  "file_id": "9850f8cf99fdd99d",
  "file_url": "https://king-cdn.zone.id/file/9850f8cf99fdd99d"
}
```

**Error Response**:
```json
{
  "error": "Upload failed"
}
```

### Retrieve File

Retrieve files from the CDN using the file ID returned from the upload operation.

**Endpoint**: `GET /file/:id`

**Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | String | Yes | The file ID returned from upload |

**Example Request**:

```javascript
// Direct URL access
// https://king-cdn.zone.id/file/9850f8cf99fdd99d

// Or programmatically
const fileId = '9850f8cf99fdd99d';
const fileUrl = `https://king-cdn.zone.id/file/${fileId}`;
```

**Response**: Successful requests return the file with appropriate Content-Type header and redirect to the Telegram CDN.

**Error Response (404 Not Found)**:
```json
{
  "error": "File not found"
}
```

## How It Works

1. **Upload Process**:
   - Client sends file to `/upload` endpoint
   - Server forwards file to Telegram channel via Bot API
   - System generates a unique ID and stores metadata in MongoDB
   - Returns a permanent URL for the uploaded file

2. **Retrieval Process**:
   - Client requests file using the generated ID
   - Server looks up the Telegram file ID in database
   - Redirects to Telegram's CDN for efficient file delivery

## Database Schema

The application uses MongoDB with the following schema:

```javascript
{
  fileId: String,        // Unique identifier for public access
  telegramFileId: String, // Telegram's internal file identifier
  fileUrl: String,       // Public access URL
  uploadedAt: Date       // Timestamp of upload
}
```

## Example Implementation

Here's a complete example of how to integrate KingCDN into your application:

```javascript
// Upload a file to KingCDN
async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await fetch('https://king-cdn.zone.id/upload', {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    
    if (data.error) {
      console.error('Upload failed:', data.error);
      return null;
    }
    
    console.log('File uploaded successfully:', data.file_url);
    return data.file_url;
  } catch (error) {
    console.error('Upload error:', error);
    return null;
  }
}

// Usage
const fileInput = document.getElementById('fileInput');
fileInput.addEventListener('change', async (e) => {
  if (e.target.files.length > 0) {
    const fileUrl = await uploadFile(e.target.files[0]);
    if (fileUrl) {
      // Do something with the file URL
      console.log('File available at:', fileUrl);
    }
  }
});
```

## Error Handling

All API endpoints return appropriate HTTP status codes along with JSON error messages when something goes wrong. Common error responses include:

- `400 Bad Request`: Invalid parameters or no file uploaded
- `404 Not Found`: File not found
- `500 Internal Server Error`: Server-side issues

## Rate Limits

Currently, KingCDN does not enforce rate limits, but we reserve the right to implement them if necessary to ensure service stability for all users. Note that Telegram's API may have its own rate limits.

## Deployment

1. Set up environment variables as described above
2. Install dependencies: `npm install`
3. Start the server: `npm start`
4. The server will run on the specified PORT (default: 7860)

## Support

For questions or support, please contact our team or refer to the official documentation at [https://king-cdn.zone.id/docs.html](https://king-cdn.zone.id/docs.html).

---

© 2025 KingCDN • Engineered with precision by King David

*Built with Node.js, Express, MongoDB, and Telegram Bot API*