Guide
- Test on Android Emulator, and run the code on PC
1. Download android studio
  - Find Virtual Device Manager, and click on it
  - Click on Create Virtual Device
  - Select any phone that support playstore, and select next
  - The system image as of now, i am using the S version to test, but all is fine.
  - Name your AVD, and select finish
  - Locate to the device, and click start
2. Run the code on PC (Mac/Windows)
  - Create a folder on your Desktop, named it whatever you like
  - on terminal, cd to that folder (e.g. cd /Desktop/IDS)
  - Make sure to have Git install
      -  on windows, can installed it by heading to the terminal: winget install --id Git.Git -e --source winget
      -  on macos, can install it here: https://git-scm.com/downloads
  - on terminal: git clone https://github.com/yeosj/MobileIDS
  - Open any compiler, for this guide i will be using: visual studio code
  - Drag the folder into visual studio code
  - update dependencies if necessary (e.g. npm -i)
  - on terminal: npx expo start
  - type (r) reload, (a) android, so expo will load the file into your emulator

- Code to APK
Be sure that you are at the same directory as app.js
1. Install EAS CLI
  - run in terminal: npm install -g eas-cli or yarn global add eas-cli
2. Log in to your expo account
  - run in terminal: expo login
3. Configure the project
  - run in terminal: npx eas-cli init
4. Run build
  - run in terminal: eas build:run -p android


Suricata Installation:
Before Suricata can be used it has to be installed. Suricata can be installed on various distributions using binary packages
Follow suricata documentation for installation process.

After installation, replace suricata.yaml file with the given suricata.yaml file (Found in Source Code for backend folder)
Add the provided javascript files and service files for files to be uploaded to the server and install the service files
