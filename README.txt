INTERACTIVE VIDEO WEBSITE
=========================

This is a simple interactive video website where images pop up at specific times.

SETUP INSTRUCTIONS:
1. Create the folder structure as shown above
2. Place your video file in the assets folder and name it "video.mp4"
3. Place your popup images in the assets folder as "popup1.jpg" and "popup2.jpg"
4. Open the project in VS Code
5. Open index.html in your browser

CONFIGURATION:
- Edit script.js to change popup times (lines 3-6)
- Adjust timing: { time: 10, id: 'popup1' } means popup1 appears at 10 seconds
- Add more popups by adding to the POPUP_TIMES array

OPENING IN VS CODE:
1. Open VS Code
2. Click "File" → "Open Folder"
3. Select the "interactive-video-website" folder
4. Install "Live Server" extension (optional but recommended)
5. Right-click on index.html and select "Open with Live Server"

TESTING:
1. The video will play normally
2. At 10 seconds, video pauses and popup1.jpg appears
3. Click the image to close it and continue
4. At 25 seconds, popup2.jpg appears
5. Use Previous/Next buttons to navigate between steps
6. Click on step indicators to jump to specific points

TROUBLESHOOTING:
- If video doesn't play: Check browser console for errors
- If images don't appear: Check file paths in index.html
- If timing is off: Adjust the time values in script.js
- For cross-browser testing: Use MP4 format for video