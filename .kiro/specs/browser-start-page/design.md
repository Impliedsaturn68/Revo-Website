# Design Document: Browser Start Page

## Overview

The Browser Start Page is a single-page web application that provides a productivity-focused dashboard for browser users. The application is built using vanilla HTML, CSS, and JavaScript without external dependencies, ensuring fast load times and broad compatibility.

The design follows a component-based architecture where each major feature (greeting display, focus timer, task list, quick links) is implemented as a self-contained module with clear responsibilities. All data persistence is handled through the browser's Local Storage API, making the application fully client-side with no server requirements.

Key design principles:
- Simplicity: Minimal dependencies, straightforward implementation
- Performance: Fast load times, responsive interactions
- Persistence: Reliable data storage across sessions
- Maintainability: Clear separation of concerns, well-organized code

## Architecture

The application follows a modular architecture with clear separation between presentation (HTML), styling (CSS), and behavior (JavaScript). The architecture consists of:

### High-Level Structure

```
┌─────────────────────────────────────┐
│         index.html (View)           │
│  - Greeting Display                 │
│  - Focus Timer UI                   │
│  - Task List UI                     │
│  - Quick Links UI                   │
└─────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│      app.js (Controller/Logic)      │
│  - TimeManager                      │
│  - TimerController                  │
│  - TaskManager                      │
│  - LinkManager                      │
│  - StorageService                   │
└─────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│    Local Storage (Persistence)      │
│  - tasks: Task[]                    │
│  - links: Link[]                    │
└─────────────────────────────────────┘
```

### Component Responsibilities

1. **TimeManager**: Handles current time display and greeting logic
2. **TimerController**: Manages focus timer state and countdown logic
3. **TaskManager**: Handles task CRUD operations and persistence
4. **LinkManager**: Handles quick link CRUD operations and persistence
5. **StorageService**: Provides abstraction over Local Storage with error handling

### Data Flow

1. On page load, StorageService retrieves persisted data
2. Managers initialize their state from retrieved data
3. User interactions trigger manager methods
4. Managers update DOM and persist changes via StorageService
5. Timers use setInterval for periodic updates

## Components and Interfaces

### TimeManager

Responsible for displaying current time, date, and time-based greeting.

```javascript
class TimeManager {
  constructor(timeElement, dateElement, greetingElement)
  
  // Updates time display every second
  start(): void
  
  // Stops the update interval
  stop(): void
  
  // Returns greeting based on current hour
  private getGreeting(): string
  
  // Formats time in 12-hour format with AM/PM
  private formatTime(date: Date): string
  
  // Formats date in readable format
  private formatDate(date: Date): string
  
  // Updates all display elements
  private updateDisplay(): void
}
```

### TimerController

Manages the 25-minute focus timer with start, stop, and reset functionality.

```javascript
class TimerController {
  constructor(displayElement, startButton, stopButton, resetButton)
  
  // Starts or resumes the timer
  start(): void
  
  // Pauses the timer
  stop(): void
  
  // Resets timer to 25:00
  reset(): void
  
  // Formats seconds as MM:SS
  private formatTime(seconds: number): string
  
  // Updates display element
  private updateDisplay(): void
  
  // Handles timer completion
  private onComplete(): void
  
  // Timer tick handler
  private tick(): void
}
```

### TaskManager

Handles task list operations including add, toggle, delete, and persistence.

```javascript
class TaskManager {
  constructor(taskListElement, taskInputElement, addButton, storageService)
  
  // Adds a new task
  addTask(text: string): void
  
  // Toggles task completion status
  toggleTask(taskId: string): void
  
  // Removes a task
  deleteTask(taskId: string): void
  
  // Loads tasks from storage
  loadTasks(): void
  
  // Saves tasks to storage
  private saveTasks(): void
  
  // Renders task list to DOM
  private render(): void
  
  // Creates task DOM element
  private createTaskElement(task: Task): HTMLElement
}
```

### LinkManager

Handles quick links operations including add, delete, and persistence.

```javascript
class LinkManager {
  constructor(linksContainer, nameInput, urlInput, addButton, storageService)
  
  // Adds a new link
  addLink(name: string, url: string): void
  
  // Removes a link
  deleteLink(linkId: string): void
  
  // Loads links from storage
  loadLinks(): void
  
  // Saves links to storage
  private saveLinks(): void
  
  // Renders links to DOM
  private render(): void
  
  // Creates link DOM element
  private createLinkElement(link: Link): HTMLElement
  
  // Validates URL format
  private isValidUrl(url: string): boolean
}
```

### StorageService

Provides abstraction over Local Storage with error handling and JSON serialization.

```javascript
class StorageService {
  // Retrieves and deserializes data
  get(key: string): any | null
  
  // Serializes and stores data
  set(key: string, value: any): boolean
  
  // Removes data by key
  remove(key: string): void
  
  // Clears all storage
  clear(): void
  
  // Checks if storage is available
  isAvailable(): boolean
}
```

## Data Models

### Task

Represents a single to-do item.

```javascript
interface Task {
  id: string;          // Unique identifier (timestamp-based)
  text: string;        // Task description
  completed: boolean;  // Completion status
  createdAt: number;   // Timestamp of creation
}
```

### Link

Represents a quick access link.

```javascript
interface Link {
  id: string;      // Unique identifier (timestamp-based)
  name: string;    // Display name for the link
  url: string;     // Target URL
  createdAt: number; // Timestamp of creation
}
```

### TimerState

Represents the current state of the focus timer.

```javascript
interface TimerState {
  remainingSeconds: number;  // Time remaining in seconds
  isRunning: boolean;        // Whether timer is active
  intervalId: number | null; // setInterval reference
}
```

### Storage Keys

Constants for Local Storage keys:

```javascript
const STORAGE_KEYS = {
  TASKS: 'browser-start-page-tasks',
  LINKS: 'browser-start-page-links'
};
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Time Format Correctness

*For any* Date object, the formatted time output should match the 12-hour format pattern "HH:MM:SS AM/PM" where HH is 01-12, MM and SS are 00-59, and the period is either AM or PM.

**Validates: Requirements 1.1**

### Property 2: Date Format Readability

*For any* Date object, the formatted date output should contain the month name, day number, and four-digit year in a readable format.

**Validates: Requirements 1.2**

### Property 3: Greeting Time Range Correctness

*For any* hour of the day (0-23), the greeting function should return exactly one of "Good morning" (5-11), "Good afternoon" (12-16), "Good evening" (17-20), or "Good night" (21-4), with no gaps or overlaps in coverage.

**Validates: Requirements 1.3, 1.4, 1.5, 1.6**

### Property 4: Timer Format Correctness

*For any* non-negative integer representing seconds, the timer format function should return a string in "MM:SS" format where MM is 00-99 and SS is 00-59.

**Validates: Requirements 2.1**

### Property 5: Timer State Transitions

*For any* timer state, starting a stopped timer should set isRunning to true, and stopping a running timer should set isRunning to false, with the remaining time preserved during stop operations.

**Validates: Requirements 2.3, 2.4**

### Property 6: Timer Reset Idempotence

*For any* timer state, calling reset should set remainingSeconds to 1500 (25 minutes) and isRunning to false, and calling reset multiple times should produce the same result.

**Validates: Requirements 2.5**

### Property 7: Task Addition Increases List Size

*For any* task list and any non-empty task text, adding the task should increase the list length by exactly one.

**Validates: Requirements 3.1**

### Property 8: Task Order Preservation

*For any* sequence of tasks added to an empty list, the order of tasks in the list should match the order in which they were added.

**Validates: Requirements 3.2**

### Property 9: Task Toggle Idempotence

*For any* task, toggling its completion status twice should return it to its original completion state.

**Validates: Requirements 3.3**

### Property 10: Task Completion Status

*For any* task, when marked as completed, the task's completed property should be true, and when marked as not completed, it should be false.

**Validates: Requirements 3.4**

### Property 11: Task Deletion Decreases List Size

*For any* non-empty task list and any task ID in that list, deleting the task should decrease the list length by exactly one and the task should no longer be present.

**Validates: Requirements 3.5**

### Property 12: Task Persistence Round Trip

*For any* array of valid tasks, saving to storage and then loading from storage should produce an equivalent array with the same tasks in the same order with the same properties.

**Validates: Requirements 3.6, 3.7, 5.1, 5.3**

### Property 13: Empty Task Rejection

*For any* string composed entirely of whitespace characters (spaces, tabs, newlines) or empty string, attempting to add it as a task should be rejected and the task list should remain unchanged.

**Validates: Requirements 3.8**

### Property 14: Link Addition Increases List Size

*For any* link list and any valid name and URL pair, adding the link should increase the list length by exactly one.

**Validates: Requirements 4.1**

### Property 15: Link Count Consistency

*For any* link list, the number of rendered link elements should equal the number of links in the data model.

**Validates: Requirements 4.2**

### Property 16: Link Deletion Decreases List Size

*For any* non-empty link list and any link ID in that list, deleting the link should decrease the list length by exactly one and the link should no longer be present.

**Validates: Requirements 4.4**

### Property 17: Link Persistence Round Trip

*For any* array of valid links, saving to storage and then loading from storage should produce an equivalent array with the same links in the same order with the same properties.

**Validates: Requirements 4.5, 4.6, 5.2, 5.4**

### Property 18: Empty Link Field Rejection

*For any* link addition attempt where either the name or URL field is empty or contains only whitespace, the addition should be rejected and the link list should remain unchanged.

**Validates: Requirements 4.7, 4.8**

### Property 19: Corrupted Storage Recovery

*For any* invalid JSON string or corrupted data in Local Storage, loading the data should return an empty array without throwing errors, allowing the application to initialize with empty data structures.

**Validates: Requirements 5.5**

### Property 20: JSON Serialization Round Trip

*For any* valid task or link object, serializing to JSON and then deserializing should produce an equivalent object with all properties preserved.

**Validates: Requirements 5.6**

## Error Handling

The application implements defensive error handling at key integration points:

### Local Storage Errors

1. **Storage Unavailable**: Check `localStorage` availability before any operation
   - If unavailable (private browsing, disabled), gracefully degrade to in-memory storage
   - Display a warning message to the user about data not persisting

2. **Quota Exceeded**: Catch `QuotaExceededError` when writing to storage
   - Log error to console
   - Notify user that storage is full
   - Continue operation with in-memory state

3. **Corrupted Data**: Handle JSON parse errors when reading from storage
   - Catch `SyntaxError` during `JSON.parse()`
   - Log warning to console
   - Return empty array/object as fallback
   - Initialize with clean state

### Input Validation Errors

1. **Empty Input**: Prevent submission of empty or whitespace-only strings
   - Trim input before validation
   - Show visual feedback (e.g., red border) for invalid input
   - Do not modify application state

2. **Invalid URL Format**: Validate URL structure before adding links
   - Check for protocol (http:// or https://)
   - Provide helpful error message
   - Allow user to correct input

### Timer Edge Cases

1. **Negative Time**: Ensure timer never displays negative values
   - Clamp remaining seconds to minimum of 0
   - Stop timer when reaching 0

2. **Multiple Start Calls**: Prevent multiple intervals from running
   - Clear existing interval before starting new one
   - Maintain single source of truth for timer state

### DOM Manipulation Errors

1. **Missing Elements**: Check for element existence before manipulation
   - Use optional chaining or null checks
   - Log warnings for missing elements
   - Fail gracefully without breaking other features

2. **Event Handler Errors**: Wrap event handlers in try-catch
   - Log errors to console
   - Prevent one component's error from breaking others

## Testing Strategy

The Browser Start Page will employ a comprehensive testing strategy combining unit tests for specific scenarios and property-based tests for universal correctness guarantees.

### Testing Approach

**Unit Tests**: Focus on specific examples, edge cases, and integration points
- Specific time formatting examples (midnight, noon, edge hours)
- Timer boundary conditions (0 seconds, 25 minutes, completion)
- Empty list operations
- Storage error scenarios
- DOM integration points

**Property-Based Tests**: Verify universal properties across randomized inputs
- Time and date formatting for all possible Date values
- Greeting correctness for all 24 hours
- Task and link operations with random valid data
- Storage round-trip with various data structures
- State transitions with random sequences of operations

### Property-Based Testing Configuration

**Framework**: fast-check (JavaScript property-based testing library)

**Configuration**:
- Minimum 100 iterations per property test
- Each test tagged with format: `Feature: browser-start-page, Property {N}: {description}`
- Seed-based reproducibility for failed tests
- Shrinking enabled to find minimal failing cases

**Example Test Structure**:
```javascript
// Feature: browser-start-page, Property 3: Greeting Time Range Correctness
fc.assert(
  fc.property(fc.integer({min: 0, max: 23}), (hour) => {
    const greeting = getGreeting(hour);
    if (hour >= 5 && hour <= 11) return greeting === "Good morning";
    if (hour >= 12 && hour <= 16) return greeting === "Good afternoon";
    if (hour >= 17 && hour <= 20) return greeting === "Good evening";
    return greeting === "Good night";
  }),
  { numRuns: 100 }
);
```

### Test Organization

```
tests/
├── unit/
│   ├── time-manager.test.js
│   ├── timer-controller.test.js
│   ├── task-manager.test.js
│   ├── link-manager.test.js
│   └── storage-service.test.js
└── property/
    ├── time-formatting.property.test.js
    ├── timer-operations.property.test.js
    ├── task-operations.property.test.js
    ├── link-operations.property.test.js
    └── storage-persistence.property.test.js
```

### Coverage Goals

- Unit test coverage: Focus on critical paths and error handling
- Property test coverage: All 20 correctness properties implemented
- Integration testing: Manual browser testing across target browsers
- Performance testing: Manual verification of load times and responsiveness

### Testing Tools

- **Test Runner**: Jest or Vitest
- **Property Testing**: fast-check
- **DOM Testing**: jsdom for Node.js environment
- **Coverage**: Built-in coverage tools from test runner
- **Browser Testing**: Manual testing in Chrome, Firefox, Edge, Safari

