# Technology Stack

## Core Technologies

- **HTML5**: Semantic markup for structure
- **CSS3**: Styling with modern features
- **Vanilla JavaScript**: No frameworks or libraries
- **Local Storage API**: Client-side data persistence

## Key Constraints

- No external dependencies or frameworks
- No build process required
- No server-side components
- Must work in modern browsers (Chrome 90+, Firefox 88+, Edge 90+, Safari 14+)

## Testing

- **Test Framework**: Jest or Vitest
- **Property-Based Testing**: fast-check library
- **DOM Testing**: jsdom for Node.js environment
- **Coverage**: Built-in coverage tools from test runner

### Common Commands

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run property-based tests only
npm run test:property

# Run unit tests only
npm run test:unit
```

## Code Organization

- Component-based architecture with clear separation of concerns
- Each feature implemented as a self-contained module
- Clear separation: HTML (structure), CSS (style), JavaScript (behavior)
