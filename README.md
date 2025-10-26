# Daily Work Manager App

A modern, feature-rich daily task management application with browser notifications to help you stay organized and productive.

## Features

### 📋 Task Management
- **Add, edit, and delete tasks** with priority levels (Low, Medium, High, Critical)
- **Set due dates and reminder times** for each task
- **Task descriptions** for detailed information
- **Mark tasks as complete** with visual feedback
- **Filter tasks** by All, Today, Upcoming, and Completed

### 🔔 Smart Notifications
- **Browser push notifications** for task reminders
- **Daily summary notifications** at customizable times
- **Task reminder notifications** 10 minutes before scheduled time
- **Permission management** with clear status indicators

### ⭐ Today's Focus
- **Dedicated section** for today's important tasks
- **Priority-based sorting** to highlight critical tasks
- **Clean, distraction-free interface** for daily planning

### 💾 Data Persistence
- **Local storage** keeps your tasks safe
- **Export/Import functionality** for data backup
- **Offline support** with service worker (basic)

### 📱 Modern UI/UX
- **Responsive design** works on desktop, tablet, and mobile
- **Dark/light theme support** 
- **Toast notifications** for user feedback
- **Keyboard shortcuts** for power users
- **Progressive Web App** (PWA) ready

## How to Use

### Getting Started
1. Open `index.html` in your web browser
2. Click "Enable Notifications" to receive daily reminders
3. Add your first task using the form

### Adding Tasks
1. Enter a task title (required)
2. Select priority level
3. Set due date (defaults to today)
4. Optional: Set reminder time and description
5. Click "Add Task"

### Managing Tasks
- **Complete tasks** by clicking the checkmark icon
- **Delete tasks** by clicking the trash icon
- **Filter tasks** using the filter buttons
- **View today's tasks** in the highlighted section at the top

### Notification Settings
- Click the settings button (gear icon) to customize:
  - Daily summary time
  - Enable/disable task reminders
  - Enable/disable daily summaries

### Keyboard Shortcuts
- **Ctrl/Cmd + Enter**: Submit task form quickly
- **Escape**: Close settings modal

## Installation

### Local Development
1. Clone or download the files
2. Open `index.html` in a modern web browser
3. That's it! No server required.

### Web Server (Recommended)
For full PWA features and notifications:
1. Serve the files using any web server
2. Access via `http://localhost` or your domain
3. The app will automatically register the service worker

### Files Structure
```
daily-work-manager/
├── index.html          # Main HTML file
├── styles.css          # CSS styles
├── app.js             # JavaScript functionality
├── sw.js              # Service Worker for offline support
├── manifest.json      # PWA manifest
└── README.md          # This file
```

## Browser Compatibility

- **Chrome/Chromium**: Full support including notifications
- **Firefox**: Full support including notifications
- **Safari**: Partial support (notifications may be limited)
- **Edge**: Full support including notifications

## Privacy & Data

- **No server communication**: All data stays on your device
- **Local storage only**: Tasks are saved in your browser's local storage
- **No tracking**: No analytics or external services
- **Export your data**: Full control over your information

## Technical Features

### Notifications
- Uses the Web Notifications API
- Requires user permission
- Fallback gracefully if not supported
- Smart scheduling with setTimeout

### Data Management
- localStorage for persistence
- JSON export/import
- Task sorting and filtering
- Date/time handling

### UI Components
- Modular CSS with CSS custom properties
- Responsive grid layouts
- Font Awesome icons
- Inter font family

## Customization

The app is designed to be easily customizable:

- **Colors**: Modify CSS custom properties in `:root`
- **Fonts**: Change font imports in the HTML head
- **Notifications**: Adjust timing in `app.js`
- **Layout**: Modify grid templates in CSS

## Browser Storage

The app stores data in localStorage:
- `dailyTasks`: Array of task objects
- `dailySettings`: User preferences object

## Contributing

This is a standalone HTML/CSS/JavaScript app. To contribute:
1. Fork the repository
2. Make your changes
3. Test thoroughly across browsers
4. Submit a pull request

## Future Enhancements

- [ ] Categories/tags for tasks
- [ ] Recurring tasks
- [ ] Calendar integration
- [ ] Team collaboration features
- [ ] Cloud sync options
- [ ] Mobile app versions

## License

MIT License - Feel free to use, modify, and distribute.

---

**Happy task management! 🚀**
