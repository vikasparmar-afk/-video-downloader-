# Daily Task Reminder Website

A comprehensive web application to help you stay organized and never miss your daily tasks like book reading, exercise, work, and more. The app features browser notifications to remind you of your scheduled tasks.

## Features

### 🎯 Core Functionality
- **Task Management**: Add, edit, delete, and organize your daily tasks
- **Categories**: Organize tasks by type (Reading, Exercise, Work, Study, Personal, Health, Other)
- **Smart Scheduling**: Set specific reminder times with flexible repeat options
- **Completion Tracking**: Mark tasks as completed and track your progress

### 🔔 Notification System
- **Browser Notifications**: Get reminded exactly when you need to complete tasks
- **Permission Management**: Easy setup for notification permissions
- **Smart Timing**: Notifications only for pending tasks at scheduled times

### 📊 Progress Tracking
- **Daily Stats**: See today's tasks, completion count, and current streak
- **Weekly/Monthly Progress**: Visual progress bars showing completion rates
- **Streak Counter**: Track consecutive days of task completion
- **History Tracking**: All completed tasks are saved with dates

### 🎨 User Experience
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Dark Mode Support**: Automatically adapts to system preferences
- **Intuitive Interface**: Clean, modern design with easy navigation
- **Offline Support**: Works offline with service worker caching

### 🔄 Repeat Options
- **Daily**: Tasks that repeat every day
- **Weekdays Only**: Monday through Friday
- **Weekends Only**: Saturday and Sunday
- **Weekly**: Tasks that repeat every 7 days

### 💾 Data Management
- **Local Storage**: All data is stored locally in your browser
- **Data Persistence**: Tasks and progress are saved automatically
- **Export/Import**: Backup and restore your data (feature ready for implementation)

## How to Use

### Getting Started
1. Open the website in your browser
2. Click "Enable Notifications" to receive task reminders
3. Add your first task using the form at the top

### Adding Tasks
1. Enter a descriptive task title (e.g., "Read 30 pages of current book")
2. Select the appropriate category
3. Set your preferred reminder time
4. Choose how often the task should repeat
5. Add optional notes for additional context
6. Click "Add Task"

### Managing Tasks
- **Complete Tasks**: Click the ✅ Complete button when finished
- **Edit Tasks**: Click the ✏️ Edit button to modify task details
- **Delete Tasks**: Click the 🗑️ Delete button to remove tasks
- **Filter Tasks**: Use the dropdown filters to view specific categories or completion status

### Tracking Progress
- View your daily statistics in the overview cards
- Monitor weekly and monthly completion rates in the progress section
- Build and maintain your completion streak for motivation

## Technical Details

### Browser Compatibility
- Modern browsers with JavaScript enabled
- Notification API support for reminders
- Local Storage for data persistence

### Files Structure
```
├── index.html          # Main HTML structure
├── styles.css          # CSS styling and responsive design
├── script.js           # JavaScript functionality
├── manifest.json       # PWA manifest for mobile installation
├── sw.js              # Service worker for offline support
└── README.md          # This documentation
```

### Local Storage Data
The app stores the following data locally:
- `dailyTasks`: Array of all your tasks
- `completedTasks`: Object tracking completions by date
- `taskStreak`: Current consecutive completion streak
- `lastCompletionDate`: Date of last streak update

## Privacy & Security

- **No Data Collection**: All data stays on your device
- **No Server Required**: Fully client-side application
- **No Registration**: No accounts or personal information needed
- **Browser Storage Only**: Uses secure browser local storage

## Installation as PWA

You can install this app on your device:
1. Open the website in Chrome, Edge, or Safari
2. Look for the "Install" prompt or "Add to Home Screen" option
3. Follow the browser prompts to install
4. The app will appear as a standalone application on your device

## Tips for Best Results

### Task Organization
- Use descriptive task names that clearly indicate what needs to be done
- Set realistic reminder times when you're typically available
- Group similar tasks using categories for better organization
- Add notes for tasks that need additional context or instructions

### Building Habits
- Start with a few essential tasks rather than overwhelming yourself
- Set consistent times for recurring tasks
- Use the streak counter as motivation to maintain consistency
- Review and adjust your tasks regularly based on your changing needs

### Notification Management
- Ensure notifications are enabled for the best experience
- Choose reminder times when you're typically available and alert
- Consider your daily routine when scheduling task reminders
- Use different categories to prioritize different types of activities

## Troubleshooting

### Notifications Not Working
- Check that notifications are enabled in your browser settings
- Ensure the website has permission to send notifications
- Verify that your device's "Do Not Disturb" mode isn't blocking notifications

### Data Loss Prevention
- Avoid clearing your browser data if you want to keep your tasks
- Consider using the export feature (when implemented) for backups
- Multiple browser profiles will have separate data

### Performance Tips
- The app is lightweight and should run smoothly on most devices
- If you experience slowness with many tasks, try filtering to reduce displayed items
- Clear old completed task data periodically if needed

## Future Enhancements

Potential features for future versions:
- Data export/import functionality
- Task templates for common activities
- Integration with calendar applications
- Custom notification sounds
- Advanced analytics and reporting
- Task sharing and collaboration
- Sync across devices

## Support

This is a client-side web application that runs entirely in your browser. Since no server is involved:
- All functionality works offline after the initial page load
- Your data remains private and secure on your device
- No ongoing costs or subscription fees

For the best experience, use a modern browser and keep it updated.

---

**Start organizing your daily tasks today and build productive habits with consistent reminders!** 🎯
