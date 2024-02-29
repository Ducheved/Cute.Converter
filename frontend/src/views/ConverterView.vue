<template>
  <div
    class="z-30 min-h-fit p-8 purrs w-full purrs justify-between bg-rose-300 shadow-lg dark:bg-fuchsia-950 rounded-lg"
    :class="{ 'animate-pulse': isLoading }"
  >
    <form @submit.prevent="submitForm" class="space-y-2">
      <div class="grid grid-cols-1 gap-2">
        <div>
          <input type="file" id="file" @change="onFileChange" class="hidden" />
          <label
            for="file"
            class="mt-1 text-overflow-ellipsis whitespace-nowrap transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-105 overflow-hidden block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 cursor-pointer"
          >
            {{ fileName || '(─‿‿─)♡ choose one file...' }}
          </label>
        </div>
        <div>
          <label class="block text-md font-medium text-gray-700 dark:text-gray-200">
            Quality:
            <input type="range" min="1" max="100" v-model="quality" class="mt-1 block w-full" />
          </label>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-2 w-full">
        <div>
          <label class="block text-md font-medium text-gray-700 dark:text-gray-200">
            Height:
            <input
              type="number"
              v-model="height"
              class="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
            />
          </label>
        </div>
        <div>
          <label class="block text-md font-medium text-gray-700 dark:text-gray-200">
            Width:
            <input
              type="number"
              v-model="width"
              class="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
            />
          </label>
        </div>
        <div>
          <label class="block text-md font-medium text-gray-700 dark:text-gray-200">
            Format:
            <select
              v-model="format"
              class="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
            >
              <option value="png">PNG</option>
              <option value="jpeg">JPEG</option>
              <option value="webp">WEBP</option>
            </select>
          </label>
        </div>
        <div class="flex items-end pb-1">
          <div>
            <label class="block text-md font-medium text-gray-700 dark:text-gray-200">
              Optimize:
              <select
                v-model="optimize"
                class="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </label>
          </div>
        </div>
      </div>
      <button
        type="submit"
        :disabled="isLoading"
        class="px-2 py-1 bg-rose-600 text-white rounded text-md dark:bg-fuchsia-600 dark:text-gray-200"
        :class="{ 'animate-bounce': isLoading }"
      >
        <span v-if="isLoading">Loading...</span>
        <span v-else>Submit</span>
      </button>
    </form>
    <div>
      <div v-if="image">
        <div class="flex purrs space-x-2 mt-4">
          <button
            @click="downloadImage"
            class="px-2 py-1 bg-fuchsia-600 text-white rounded text-md dark:bg-fuchsia-600 dark:text-gray-200 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"
          >
            Download Image
          </button>
          <button
            @click="showDetails = !showDetails"
            class="px-2 py-1 bg-pink-600 text-white rounded text-md dark:bg-fuchsia-600 dark:text-gray-200"
          >
            {{ showDetails ? 'Hide Details' : 'Show Details' }}
          </button>
          <button
            @click="resetZoom"
            class="px-2 py-1 bg-purple-600 text-white rounded text-md dark:bg-fuchsia-600 dark:text-gray-200"
          >
            Reset Zoom
          </button>
        </div>
        <div ref="container" class="mt-4 image-container">
          <img
            ref="image"
            v-if="image"
            :src="image"
            alt="Processed image"
            class="mt-4 shadow-lg rounded-lg"
          />
        </div>
        <div v-show="showDetails" class="mt-4 font-medium text-gray-700 dark:text-gray-200">
          <transition name="slide-fade">
            <div v-show="showDetails" class="details-overlay">
              <div class="bg-rose-300 shadow-lg dark:bg-fuchsia-950 rounded-lg p-8">
                <button
                  @click="showDetails = !showDetails"
                  class="px-2 py-1 bg-green-600 text-white rounded text-md dark:bg-purple-600 dark:text-gray-200"
                >
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
                    <div class="w-1/2">
                      {{ decodedJson.input.dimensions.width }}x{{
                        decodedJson.input.dimensions.height
                      }}px
                    </div>
                    <div class="w-1/3">Format:</div>
                    <div class="w-1/2">{{ decodedJson.input.format }}</div>
                    <hr class="border-t border-gray-200 my-4" />
                    <div class="w-full text-center font-bold mt-2">
                      <font-awesome-icon icon="image" class="mr-2" />
                      Output
                    </div>
                    <div class="w-1/3">Size:</div>
                    <div class="w-1/2">{{ formatSizeUnits(decodedJson.output.size) }}</div>
                    <div class="w-1/3">Dimensions:</div>
                    <div class="w-1/2">
                      {{ decodedJson.output.dimensions.width }}x{{
                        decodedJson.output.dimensions.height
                      }}px
                    </div>
                    <div class="w-1/3">Format:</div>
                    <div class="w-1/2">{{ decodedJson.output.format }}</div>
                  </div>
                  <div class="flex flex-wrap">
                    <div class="w-full text-center font-bold">
                      <font-awesome-icon icon="ruler-combined" class="mr-2" />
                      Optimization
                    </div>
                    <div class="w-1/2">Size Reduction:</div>
                    <div class="w-1/2">
                      {{ decodedJson.optimization.sizeReduction.toFixed(2) }}%
                    </div>
                    <div class="w-1/2">Quality Change:</div>
                    <div class="w-1/2">
                      {{ decodedJson.optimization.qualityChange.toFixed(2) }}%
                    </div>
                    <div class="w-1/2">Processing:</div>
                    <div class="w-1/2">{{ decodedJson.processingTime }} ms</div>
                    <hr class="border-t border-gray-200 my-4" />
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
import { submitForm, downloadImage } from '../utils/imageAPI.js'
import { initImagePanzoom, zoomImage, resetZoom } from '../utils/imageInteract.js'

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
      isLoading: false
    }
  },
  mounted() {
    this.initImagePanzoom()
  },
  methods: {
    formatSizeUnits(size) {
      if (size >= 1048576) {
        return (size / 1048576).toFixed(2) + ' MB'
      } else if (size >= 1024) {
        return (size / 1024).toFixed(2) + ' KB'
      } else {
        return size + ' bytes'
      }
    },
    onFileChange(e) {
      if (e.target.files[0]) {
        this.fileName = e.target.files[0].name
      }
      this.selectedFile = e.target.files[0]
      const img = new Image()
      const reader = new FileReader()
      reader.onload = (event) => {
        img.onload = () => {
          this.width = img.width
          this.height = img.height
        }
        img.src = event.target.result
      }
      reader.readAsDataURL(this.selectedFile)
    },
    initImagePanzoom() {
      initImagePanzoom(this.$refs)
    },

    zoomImage(e) {
      zoomImage(this.$refs.image, this.$refs.container, e)
    },
    async submitForm() {
      this.isLoading = true
      const { image, decodedJson } = await submitForm(
        this.selectedFile,
        this.format,
        this.optimize,
        this.quality,
        this.height,
        this.width
      )
      this.image = image
      this.decodedJson = decodedJson
      this.$nextTick(() => {
        this.initImagePanzoom()
      })
      this.isLoading = false
    },
    downloadImage() {
      downloadImage.call(this, this.image, this.format)
    },
    resetZoom() {
      resetZoom(this.$refs)
    }
  }
}
</script>
