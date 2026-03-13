# Project Structure

## Directory Layout

```
.
├── index.html           # Main entry point
├── css/
│   └── styles.css      # All styling (single file)
├── js/
│   └── app.js          # All JavaScript logic (single file)
└── tests/
    ├── unit/           # Specific scenario tests
    │   ├── time-manager.test.js
    │   ├── timer-controller.test.js
    │   ├── task-manager.test.js
    │   ├── link-manager.test.js
    │   └── storage-service.test.js
    └── property/       # Property-based tests
        ├── time-formatting.property.test.js
        ├── timer-operations.property.test.js
        ├── task-operations.property.test.js
        ├── link-operations.property.test.js
        └── storage-persistence.property.test.js
```

## Component Architecture

The application follows a modular architecture with five main components:

1. **TimeManager**: Current time display and greeting logic
2. **TimerController**: 25-minute focus timer state and countdown
3. **TaskManager**: Task CRUD operations and persistence
4. **LinkManager**: Quick link CRUD operations and persistence
5. **StorageService**: Local Storage abstraction with error handling

## File Organization Rules

- Exactly one HTML file at root level
- Exactly one CSS file in css/ directory
- Exactly one JavaScript file in js/ directory
- Test files mirror the component structure
- Property tests tagged with format: `Feature: browser-start-page, Property {N}: {description}`

## Data Flow

1. Page load → StorageService retrieves persisted data
2. Managers initialize state from retrieved data
3. User interactions → Manager methods update state
4. Managers update DOM and persist via StorageService
5. Timers use setInterval for periodic updates
