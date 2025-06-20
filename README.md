# node-red-contrib-api-call

A Node-RED node for making API calls with flexible configuration options

## Features

- Make HTTP requests to external APIs
- Support for various authentication methods (API keys, tokens)
- Flexible configuration of API endpoints
- Dynamic value support from message properties, flow, or global context
- Easy integration with other Node-RED nodes

## Installation

Run the following command in your Node-RED user directory (typically ~/.node-red):

```bash
npm install node-red-contrib-api-call
```

## Usage

1. Add the "API" node to your flow from the "api" category
2. Configure the API endpoint and authentication details
3. Connect it to other nodes as needed

## Configuration

- **API URL**: The endpoint URL to call
- **Method**: HTTP method (GET, POST, etc.)
- **Authorization**: API key or token configuration
- **Property**: Message property to store the response (default: `msg.payload`)

## License

MIT