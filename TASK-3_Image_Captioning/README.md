# TASK-3: AI Image Captioning System

## 🖼️ Intelligent Image Captioning Application

An AI-powered web application that generates intelligent captions for images using deep learning models. The system automatically analyzes images and produces descriptive, contextually relevant captions.

## Features

- 🤖 AI-powered image analysis and caption generation
- 🖼️ Image upload functionality
- 📝 Real-time caption generation
- 🌐 Web-based interface
- 🎨 Clean and responsive UI
- ⚡ Fast processing with Flask backend

## Project Structure

```
TASK-3_AI_Image_Captioning/
├── app.py                 # Flask application backend
├── requirements.txt       # Python dependencies
├── templates/
│   └── index.html        # HTML frontend template
├── static/
│   └── style.css         # CSS styling
└── README.md             # Project documentation
```

## Technologies Used

- **Backend**: Python, Flask
- **Frontend**: HTML5, CSS3, JavaScript
- **AI/ML**: Deep Learning model for image captioning
- **Image Processing**: PIL/Pillow

## Installation & Setup

### Prerequisites

- Python 3.7 or higher
- pip (Python package manager)

### Steps

1. Navigate to the project directory:

   ```bash
   cd task-3_AI\ Image\ Captioning
   ```

2. Install required dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Run the Flask application:

   ```bash
   python app.py
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5000
   ```

## Usage

1. Upload an image from your device
2. Click the "Generate Caption" button
3. View the AI-generated caption for your image
4. Try with different images to see various captions

## Dependencies

- Flask - Web framework
- PIL/Pillow - Image processing
- NumPy - Numerical computing
- TensorFlow/PyTorch - Deep learning framework
- (See requirements.txt for complete list)

## Features in Development

- Multiple image upload
- Caption confidence scoring
- Image history/gallery
- Advanced filtering options
- Export captions functionality

## API Endpoints

- `GET /` - Main web interface
- `POST /upload` - Upload and caption image
- `GET /history` - View captioning history

## Performance

- Average response time: < 2 seconds per image
- Supported image formats: JPG, PNG, GIF, WebP
- Maximum file size: 10MB

## Author

CODSOFT Internship Task

## License

MIT License

---

_Last updated: 2024_
