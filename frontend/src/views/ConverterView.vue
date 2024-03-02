<template>
  <div class="purrs purrs z-30 min-h-fit w-full justify-between rounded-lg bg-rose-300 p-8 shadow-lg dark:bg-fuchsia-950" :class="{ 'animate-pulse': isLoading }">
    <form @submit.prevent="submitForm" class="space-y-2">
      <div class="grid grid-cols-1 gap-2">
        <div>
          <input type="file" id="file" @change="onFileChange" class="hidden" />
          <label for="file" class="text-overflow-ellipsis mt-1 block w-full transform cursor-pointer overflow-hidden whitespace-nowrap rounded-md border border-gray-300 p-2 transition duration-500 ease-in-out hover:-translate-y-1 hover:scale-105 dark:border-gray-600 dark:bg-gray-700">
            {{ fileName || '(─‿‿─)♡ choose one file...' }}
          </label>
        </div>
        <div>
          <label class="text-md block font-medium text-gray-700 dark:text-gray-200">
            Quality:
            <input type="range" min="1" max="100" v-model="quality" class="mt-1 block w-full" />
          </label>
        </div>
      </div>
      <div class="grid w-full grid-cols-1 gap-2 md:grid-cols-4">
        <div>
          <label class="text-md block font-medium text-gray-700 dark:text-gray-200">
            Height:
            <input type="number" v-model="height" class="mt-1 block w-full rounded-md border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700" />
          </label>
        </div>
        <div>
          <label class="text-md block font-medium text-gray-700 dark:text-gray-200">
            Width:
            <input type="number" v-model="width" class="mt-1 block w-full rounded-md border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700" />
          </label>
        </div>
        <div>
          <label class="text-md block font-medium text-gray-700 dark:text-gray-200">
            Format:
            <select v-model="format" class="mt-1 block w-full rounded-md border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700">
              <option value="png">PNG</option>
              <option value="jpeg">JPEG</option>
              <option value="webp">WEBP</option>
            </select>
          </label>
        </div>
        <div class="flex items-end pb-1">
          <div>
            <label class="text-md block font-medium text-gray-700 dark:text-gray-200">
              Optimize:
              <select v-model="optimize" class="mt-1 block w-full rounded-md border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700">
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </label>
          </div>
        </div>
      </div>
      <button type="submit" :disabled="isLoading" class="text-md rounded bg-rose-600 px-2 py-1 text-white dark:bg-fuchsia-600 dark:text-gray-200" :class="{ 'animate-bounce': isLoading }">
        <span v-if="isLoading">Loading...</span>
        <span v-else>Submit</span>
      </button>
    </form>
    <div>
      <div v-if="image">
        <div class="purrs mt-4 flex space-x-2">
          <button @click="downloadImage" class="text-md transform rounded bg-fuchsia-600 px-2 py-1 text-white transition duration-500 ease-in-out hover:-translate-y-1 hover:scale-110 dark:bg-fuchsia-600 dark:text-gray-200">Download Image</button>
          <button @click="showDetails = !showDetails" class="text-md rounded bg-pink-600 px-2 py-1 text-white dark:bg-fuchsia-600 dark:text-gray-200">
            {{ showDetails ? 'Hide Details' : 'Show Details' }}
          </button>
          <button @click="resetZoom" class="text-md rounded bg-purple-600 px-2 py-1 text-white dark:bg-fuchsia-600 dark:text-gray-200">Reset Zoom</button>
        </div>
        <div ref="container" class="image-container mt-4">
          <img ref="image" v-if="image" :src="image" alt="Processed image" class="mt-4 rounded-lg shadow-lg" />
        </div>
        <div v-show="showDetails" class="mt-4 font-medium text-gray-700 dark:text-gray-200">
          <transition name="slide-fade">
            <div v-show="showDetails" class="details-overlay">
              <div class="rounded-lg bg-rose-300 p-8 shadow-lg dark:bg-fuchsia-950">
                <button @click="showDetails = !showDetails" class="text-md rounded bg-green-600 px-2 py-1 text-white dark:bg-purple-600 dark:text-gray-200">
                  {{ showDetails ? 'Hide Details' : 'Show Details' }}
                </button>
                <div class="flex">
                  <div class="flex flex-wrap">
                    <div class="w-full text-center font-bold">
                      <font-awesome-icon icon="file-import" class="mr-2" />
                      Input
                    </div>
                    <div class="w-1/3">Size:</div>
                    <div class="w-1/2">{{ formatSizeUnits(decodedJson.input.size) }}</div>
                    <div class="w-1/3">Dimensions:</div>
                    <div class="w-1/2">{{ decodedJson.input.dimensions.width }}x{{ decodedJson.input.dimensions.height }}px</div>
                    <div class="w-1/3">Format:</div>
                    <div class="w-1/2">{{ decodedJson.input.format }}</div>
                    <hr class="my-4 border-t border-gray-200" />
                    <div class="mt-2 w-full text-center font-bold">
                      <font-awesome-icon icon="image" class="mr-2" />
                      Output
                    </div>
                    <div class="w-1/3">Size:</div>
                    <div class="w-1/2">{{ formatSizeUnits(decodedJson.output.size) }}</div>
                    <div class="w-1/3">Dimensions:</div>
                    <div class="w-1/2">{{ decodedJson.output.dimensions.width }}x{{ decodedJson.output.dimensions.height }}px</div>
                    <div class="w-1/3">Format:</div>
                    <div class="w-1/2">{{ decodedJson.output.format }}</div>
                  </div>
                  <div class="flex flex-wrap">
                    <div class="w-full text-center font-bold">
                      <font-awesome-icon icon="ruler-combined" class="mr-2" />
                      Optimization
                    </div>
                    <div class="w-1/2">Size Reduction:</div>
                    <div class="w-1/2">{{ decodedJson.optimization.sizeReduction.toFixed(2) }}%</div>
                    <div class="w-1/2">Quality Change:</div>
                    <div class="w-1/2">{{ decodedJson.optimization.qualityChange.toFixed(2) }}%</div>
                    <div class="w-1/2">Processing:</div>
                    <div class="w-1/2">{{ decodedJson.processingTime }} ms</div>
                    <hr class="my-4 border-t border-gray-200" />
                    <div class="w-1/3">Date:</div>
                    <div class="w-1/2">{{ new Date(decodedJson.date).toLocaleString() }}</div>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .image-container.max-h-screen {
    max-height: 50vh;
    overflow: auto;
  }

  .details-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    padding: 20px;
    overflow: auto;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease-in-out;
  }

  .slide-fade-enter-active {
    transition: all 0.3s ease;
  }

  .slide-fade-leave-active {
    transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
  }

  .slide-fade-enter,
  .slide-fade-leave-to {
    transform: translateX(10px);
    opacity: 0;
  }
  .details-overlay {
    /* ... */
    transition: all 0.3s ease-in-out;
  }

  .slide-fade-enter-active,
  .slide-fade-leave-active {
    transition: all 0.3s ease;
  }

  .slide-fade-enter,
  .slide-fade-leave-to {
    transform: translateX(10px);
    opacity: 0;
  }
</style>

<script>
  import { submitForm, downloadImage } from '../utils/imageAPI.js';
  import { initImagePanzoom, zoomImage, resetZoom } from '../utils/imageInteract.js';

  export default {
    data() {
      return {
        selectedFile: null,
        image: null,
        quality: 20,
        height: null,
        width: null,
        format: 'jpeg',
        optimize: true,
        showDetails: false,
        decodedJson: null,
        isLoading: false,
      };
    },
    mounted() {
      this.initImagePanzoom();
    },
    methods: {
      formatSizeUnits(size) {
        if (size >= 1048576) {
          return (size / 1048576).toFixed(2) + ' MB';
        } else if (size >= 1024) {
          return (size / 1024).toFixed(2) + ' KB';
        } else {
          return size + ' bytes';
        }
      },
      onFileChange(e) {
        if (e.target.files[0]) {
          this.fileName = e.target.files[0].name;
        }
        this.selectedFile = e.target.files[0];
        const img = new Image();
        const reader = new FileReader();
        reader.onload = (event) => {
          img.onload = () => {
            this.width = img.width;
            this.height = img.height;
          };
          img.src = event.target.result;
        };
        reader.readAsDataURL(this.selectedFile);
      },
      initImagePanzoom() {
        initImagePanzoom(this.$refs);
      },

      zoomImage(e) {
        zoomImage(this.$refs.image, this.$refs.container, e);
      },
      async submitForm() {
        this.isLoading = true;
        const { image, decodedJson } = await submitForm(this.selectedFile, this.format, this.optimize, this.quality, this.height, this.width);
        this.image = image;
        this.decodedJson = decodedJson;
        this.$nextTick(() => {
          this.initImagePanzoom();
        });
        this.isLoading = false;
      },
      downloadImage() {
        downloadImage.call(this, this.image, this.format);
      },
      resetZoom() {
        resetZoom(this.$refs);
      },
    },
  };
</script>
