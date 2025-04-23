# YouTube Swap Component

A high-performance Vue 3 component that demonstrates modern DOM APIs for element transitions:

- Uses the **View Transitions API** for smooth animations
- Leverages the **moveBefore API** for performant DOM node movement
- Implements proper feature detection and fallbacks

## Features

- Smooth animated transitions between swapped videos
- Responsive design with mobile support
- Progressive enhancement with fallbacks for unsupported browsers
- Comprehensive error handling
- Fully tested with Vitest

## Requirements

This component requires a browser that supports:

- View Transitions API (for animations)
- moveBefore API (for DOM manipulation)

Chrome with the experimental flag `#atomic-move` enabled provides the best experience.

## Project Structure

```text
src/
├── components/
│   ├── YouTubeSwap.vue          # Main component
│   └── __tests__/               # Component tests
│       └── YouTubeSwap.spec.js  
├── composables/
│   ├── index.js                 # Composables barrel file
│   ├── useVideoTransition.js    # Video transition logic
│   └── __tests__/               # Composable tests
│       └── useVideoTransition.spec.js
```

## Implementation Notes

The component has been carefully designed following these principles:

- **Modularity**: Logic is extracted into composables for reuse
- **Single Responsibility**: Each function does one thing well
- **Error Handling**: Graceful fallbacks for all potential errors
- **Responsive Design**: Works on all screen sizes
- **Performance**: Optimized for minimal reflows and repaints
- **Accessibility**: Proper ARIA attributes and keyboard support

## Usage Example

```vue
<template>
  <YouTubeSwap />
</template>

<script setup>
import YouTubeSwap from '@/components/YouTubeSwap.vue';
</script>
```

## Browser Compatibility

- Modern Chrome (with #atomic-move flag): Full support
- Other browsers: Fallback to non-animated swapping

## Future Improvements

- Add custom video selection
- Support more video providers beyond YouTube
- Add animation customization options
