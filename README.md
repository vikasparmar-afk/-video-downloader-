# Daily Task Reminder with WhatsApp Integration

A modern, feature-rich web application to help you manage and track your daily tasks with intelligent notifications through both browser alerts and WhatsApp messages.

## Features

### Core Functionality
- ✅ **Task Management**: Add, edit, and delete daily tasks with categories
- 📅 **Flexible Scheduling**: Daily, weekdays, weekends, or weekly recurring tasks
- ⏰ **Smart Reminders**: Set specific times for task notifications
- 📊 **Progress Tracking**: Visual progress bars for weekly and monthly completion
- 🔥 **Streak Counter**: Track your consistency with completion streaks
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

### Notification System
- 🔔 **Browser Notifications**: Native browser push notifications
- 📱 **WhatsApp Integration**: Send reminders directly to your WhatsApp
- 🎯 **Dual Notification Support**: Get notified through both channels simultaneously

### Data Management
- 💾 **Local Storage**: All data stored locally in your browser
- 📤 **Export/Import**: Backup and restore your task data
- 🏆 **Achievement Tracking**: Monitor your task completion statistics

## WhatsApp Integration Setup

The application uses the CallMeBot service for free WhatsApp messaging. To set up WhatsApp notifications:

1. **Add CallMeBot Contact**: Add the phone number `+34 644 41 83 82` to your contacts (name it "CallMeBot")

2. **Activate API**: Send the message `I allow callmebot to send me messages` to the CallMeBot contact

3. **Get API Key**: Wait for the response message containing your API key: `API Activated for your phone number. Your APIKEY is: XXXXXXXX`

4. **Configure in App**: 
   - Go to the Notification Settings section
   - Enable WhatsApp notifications
   - Enter your phone number with country code (e.g., +1234567890)
   - Enter your API key from step 3
   - Click "Save Settings" and then "Send Test Message"

### WhatsApp Features
- 📱 **Rich Formatting**: Messages include task details, time, and emojis
- ✅ **Delivery Confirmation**: Test message functionality to verify setup
- 🔒 **Secure Storage**: API keys are stored locally and encrypted
- 🎯 **Smart Notifications**: Only sends WhatsApp messages for pending tasks

## Installation

This is a client-side web application. Simply serve the files through any web server:

### Option 1: Local Development
```bash
# Clone or download the files to a directory
# Serve using Python (if available)
python -m http.server 8000

# Or use Node.js
npx serve .

# Then open http://localhost:8000
```

### Option 2: Static Hosting
Upload the files to any static hosting service like:
- GitHub Pages
- Netlify
- Vercel
- Firebase Hosting

## File Structure

```
├── index.html          # Main HTML structure
├── styles.css          # CSS styling and responsive design
├── script.js           # Main application logic
├── whatsapp.js         # WhatsApp integration module
├── app.js              # PWA configuration
├── manifest.json       # Web app manifest
├── sw.js              # Service worker for offline support
└── README.md          # This documentation
```

## Usage

### Adding Tasks
1. Fill in the task title (e.g., "Read 30 pages")
2. Select a category (Reading, Exercise, Work, Study, Personal, Health, Other)
3. Set the reminder time
4. Choose frequency (Daily, Weekdays Only, Weekends Only, Weekly)
5. Add optional notes
6. Click "Add Task"

### Managing Notifications
- **Browser Notifications**: Click "Enable Notifications" when prompted
- **WhatsApp Notifications**: Configure in the Notification Settings section
- **Dual Setup**: Enable both for maximum reliability

### Task Categories
- 📚 **Reading**: Books, articles, educational content
- 🏃 **Exercise**: Workouts, sports, physical activities
- 💼 **Work**: Professional tasks and meetings
- 📖 **Study**: Learning, courses, skill development
- 🏠 **Personal**: Household tasks and personal care
- 🏥 **Health**: Medical appointments, medication reminders
- 📝 **Other**: Miscellaneous tasks

## Technical Details

### Browser Compatibility
- Chrome/Edge 80+
- Firefox 75+
- Safari 13+
- Mobile browsers with PWA support

### Data Storage
- Uses HTML5 localStorage for data persistence
- No server required - fully client-side
- Export functionality for data backup

### Progressive Web App (PWA)
- Installable on mobile devices
- Offline functionality with service worker
- App-like experience on mobile platforms

### WhatsApp API Limitations
- Uses CallMeBot free service (some rate limiting may apply)
- Requires initial setup with phone verification
- Works with WhatsApp Web/mobile app installed

## Privacy & Security

- **Local Data**: All task data stays on your device
- **No Tracking**: No analytics or user tracking
- **API Security**: WhatsApp API keys stored locally only
- **Open Source**: Full source code available for inspection

## Troubleshooting

### WhatsApp Not Working
1. Verify phone number format includes country code (+1234567890)
2. Ensure CallMeBot contact is saved properly
3. Confirm API activation message was received
4. Test with a simple message first

### Browser Notifications Not Working
1. Check browser notification permissions
2. Ensure HTTPS connection (required for notifications)
3. Verify time settings are correct

### Data Issues
1. Export data regularly as backup
2. Clear browser cache if experiencing issues
3. Check localStorage isn't full

## Contributing

This is an open-source project. Feel free to:
- Report bugs or issues
- Suggest new features
- Submit pull requests
- Improve documentation

## License

MIT License - See LICENSE file for details

## Support

For support with:
- **App Issues**: Check browser console for errors
- **WhatsApp Setup**: Visit [CallMeBot Documentation](https://www.callmebot.com/blog/free-api-whatsapp-messages/)
- **General Usage**: Refer to this README

---

**Stay organized and never miss your daily tasks! 🎯**
