# WebApp - Cordova Android App

This is a Cordova-based Android application that wraps a Google Apps Script web application.

## Prerequisites

- Node.js and npm installed
- Cordova CLI installed globally: `npm install -g cordova`
- Android SDK installed and configured

## Setup Instructions

1. Clone this repository
2. Navigate to the project directory
3. Install dependencies: `npm install`
4. Add Android platform: `cordova platform add android`
5. Build the app: `cordova build android`
6. Run on device/emulator: `cordova run android`

## Building for Production

To build a production-ready APK:

```bash
cordova build android --release