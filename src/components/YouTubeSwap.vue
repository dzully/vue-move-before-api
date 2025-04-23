<script setup>
import { ref, onMounted } from "vue";
import { useVideoTransition } from "@/composables";

// Configuration constants
const VIDEO_DIMENSIONS = {
  width: "100%",
  height: "315px",
};

const YOUTUBE_VIDEOS = [
  {
    id: "dQw4w9WgXcQ",
    title: "YouTube video player 1",
    transitionName: "video-1",
  },
  {
    id: "y6120QOlsfU",
    title: "YouTube video player 2",
    transitionName: "video-2",
  },
];

// Component state
const videoContainers = ref([null, null]);
const videoElements = ref([null, null]);
const isSwapping = ref(false);
const swapError = ref(null);

// Initialize video transition logic with DOM refs and error handling
const { swapElements, isTransitionSupported } = useVideoTransition({
  onError: (error) => {
    swapError.value = error.message;
    console.error("Video swap error:", error);
  },
  onComplete: () => {
    isSwapping.value = false;
    swapError.value = null;
  },
});

// Format YouTube URL with appropriate parameters
const getYoutubeEmbedUrl = (videoId) =>
  `https://www.youtube.com/embed/${videoId}?autoplay=0`;

// Handle video swap with appropriate UI feedback
const handleSwapVideos = async () => {
  if (!videoElements.value[0] || !videoElements.value[1]) return;
  if (isSwapping.value) return;

  isSwapping.value = true;
  swapError.value = null;

  try {
    await swapElements(
      videoElements.value[0],
      videoElements.value[1],
      isTransitionSupported.value
    );
  } catch (error) {
    console.error("Video swap error:", error);
  }
};

// Responsive feature detection
onMounted(() => {
  if (!isTransitionSupported.value) {
    console.info(
      "View Transitions API not supported in this browser. Fallback mode active."
    );
  }
});
</script>

<template>
  <section class="video-swap-container">
    <div class="videos-container">
      <div
        v-for="(video, index) in YOUTUBE_VIDEOS"
        :key="video.id"
        :ref="(el) => (videoContainers[index] = el)"
        class="video-wrapper"
      >
        <iframe
          :ref="(el) => (videoElements[index] = el)"
          :src="getYoutubeEmbedUrl(video.id)"
          :title="video.title"
          :style="VIDEO_DIMENSIONS"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          :view-transition-name="video.transitionName"
          loading="lazy"
        ></iframe>
      </div>
    </div>

    <div class="controls">
      <button
        @click="handleSwapVideos"
        class="swap-button"
        :disabled="isSwapping || !videoElements[0] || !videoElements[1]"
        :class="{ swapping: isSwapping }"
      >
        {{ isSwapping ? "Swapping..." : "Swap Videos" }}
      </button>

      <p v-if="swapError" class="error-message">
        {{ swapError }}
      </p>

      <p v-if="!isTransitionSupported" class="info-message">
        Note: Your browser doesn't support View Transitions API. Videos will
        swap without animation.
      </p>
    </div>
  </section>
</template>

<style scoped>
.video-swap-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.25rem;
}

.videos-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
  margin-bottom: 1.25rem;
}

.video-wrapper {
  flex: 1;
  min-width: 300px;
  border: 1px solid var(--border-color, #ddd);
  border-radius: 0.25rem;
  overflow: hidden;
  transition: transform 0.2s ease-in-out;
}

.video-wrapper:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

iframe {
  width: 100%;
  height: 315px;
  display: block;
  border: 0;
}

.controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.swap-button {
  padding: 0.625rem 1.25rem;
  font-size: 1rem;
  background-color: var(--primary-color, #4caf50);
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  min-width: 150px;
}

.swap-button:hover:not(:disabled) {
  background-color: var(--primary-hover-color, #45a049);
  transform: scale(1.05);
}

.swap-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
  opacity: 0.7;
}

.swap-button.swapping {
  animation: pulse 1.5s infinite;
}

.error-message {
  color: var(--error-color, #f44336);
  font-size: 0.875rem;
  text-align: center;
  max-width: 600px;
}

.info-message {
  color: var(--info-color, #2196f3);
  font-size: 0.875rem;
  text-align: center;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
  100% {
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .videos-container {
    flex-direction: column;
  }

  .video-wrapper {
    min-width: 100%;
  }
}
</style>
