# VoicePilot - Azure Copilot in Your Home

VoicePilot is an interactive web application that brings Azure Copilot into your home environment. It provides a voice-controlled interface for interacting with Azure services and managing your smart home devices.

## Features

- Voice-controlled interface using Azure Speech Services
- Modern, responsive UI with Material-UI components
- Integration with Azure Cognitive Services
- Real-time voice interaction
- Smart home device management

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Azure subscription with the following services:
  - Azure Speech Services
  - Azure Cognitive Services

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/VoicePilot.git
cd VoicePilot
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your Azure credentials:
```
REACT_APP_AZURE_SPEECH_KEY=your_speech_key
REACT_APP_AZURE_SPEECH_REGION=your_region
REACT_APP_AZURE_COGNITIVE_KEY=your_cognitive_key
REACT_APP_AZURE_COGNITIVE_ENDPOINT=your_cognitive_endpoint
```

4. Start the development server:
```bash
npm start
```

## Usage

1. Open the application in your web browser
2. Allow microphone access when prompted
3. Start speaking to interact with VoicePilot
4. Use voice commands to control your smart home devices or query Azure services

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 