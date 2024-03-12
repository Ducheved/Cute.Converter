<template>
  <div class="purrs z-30  w-full justify-between rounded-lg bg-rose-300 p-8 shadow-lg dark:bg-fuchsia-950"
    :class="{ 'animate-pulse': isLoading }">
    <div class="w-full bg-gray-200 rounded-md" v-if="isLoading">
      <div class="h-2 bg-green-500 rounded-md" :style="{ width: `${uploadProgress}%` }"></div>
    </div>
    <form @submit.prevent="submitForm" class="space-y-2">
      <div class="grid grid-cols-1 gap-2">
        <div>
          <input type="file" id="file" @change="onFileChange" class="hidden" />
          <div class="flex">
            <label for="file"
              class="text-overflow-ellipsis mt-1 block w-full transform cursor-pointer overflow-hidden whitespace-nowrap rounded-md border border-fuchsia-800 dark:border-rose-300 p-2 transition duration-500 ease-in-out hover:-translate-y-1 hover:scale-105 dark:border-gray-600 dark:bg-gray-700">
              {{ fileName || '(─‿‿─)♡ choose one file...' }}
            </label>
            <button type="button" @click="clearFile" class="inline-block px-4 first:border-0 dark:border-white">
              <font-awesome-icon icon="trash" />
            </button>
          </div>
          <div v-if="errorModal.show" class="modal">
            <div class="modal-content mt-2 gap-4 mb-2 mt-2 flex items-center justify-start">
              <p class="text-xl text-rose-800 text-bold block font-medium text-black dark:text-white">
                <font-awesome-icon icon="exclamation-triangle" /> {{ errorModal.message }}
              </p>
              <button class="text-md rounded bg-rose-800 px-2 py-1 text-white dark:bg-fuchsia-600 dark:text-white"
                @click="errorModal.show = false">Ok</button>
            </div>
          </div>
        </div>
        <div>
          <label class="text-md block font-medium text-black dark:text-white">
            Quality:
            <input type="range" min="1" max="100" v-model="quality" class="mt-1 rounded-md block w-full" />
          </label>
        </div>
      </div>
      <div class="grid w-full grid-cols-1 gap-2 md:grid-cols-5">
        <div>
          <label class="text-md block font-medium text-black dark:text-white">
            Height:
            <input type="number" v-model="height"
              class="mt-1 block w-full rounded-md border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700"
              :class="{ 'animate-ping': isButtonPressed }" v-model.number="height" @input="updateCropArea" />
          </label>
        </div>
        <div>
          <label class="text-md block font-medium text-black dark:text-white">
            Width:
            <input type="number" v-model="width"
              class="mt-1 block w-full rounded-md border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700"
              :class="{ 'animate-ping': isButtonPressed }" v-model.number="width" @input="updateCropArea" />
          </label>
        </div>
        <div>
          <label class="text-md block font-medium text-black dark:text-white">
            Format:
            <select v-model="format"
              class="mt-1 block w-full rounded-md border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700">
              <option value="png">PNG</option>
              <option value="jpeg">JPEG</option>
              <option value="webp">WEBP</option>
            </select>
          </label>
        </div>
        <div class="flex items-end pb-1">
          <div>
            <label class="text-md block font-medium text-black dark:text-white">
              Optimize:
              <select v-model="optimize"
                class="mt-1 block w-full rounded-md border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700">
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </label>
          </div>
        </div>
      </div>
      <div class="flex flex-wrap md:flex-nowrap gap-2 items-stretch justify-start">
        <button type="submit" :disabled="isLoading"
          class="bg-rose-600 dark:bg-fuchsia-600  text-md transform rounded 0 px-2 py-1 text-white transition duration-500 ease-in-out hover:-translate-y-1 hover:scale-110  dark:text-white"
          :class="{ 'animate-bounce': isLoading }">
          <span v-if="isLoading">Loading...</span>
          <span v-else>Submit</span>
        </button>
        <button v-if="image" type="button" @click="downloadImage"
          class="bg-fuchsia-600 dark:bg-emerald-600  text-md transform rounded 0 px-2 py-1 text-white transition duration-500 ease-in-out hover:-translate-y-1 hover:scale-110  dark:text-white">Download
          Image</button>
        <button v-if="image" type="button" @click="toggleDetails"
          class="bg-green-600 dark:bg-cyan-600  text-md transform rounded 0 px-2 py-1 text-white transition duration-500 ease-in-out hover:-translate-y-1 hover:scale-110  dark:text-white">
          {{ showDetails ? 'Hide Details' : 'Show Details' }}
        </button>
        <button v-if="!cropSelected && imageUrl && !imageProcessed"
          class="bg-cyan-600 dark:bg-rose-600  text-md transform rounded 0 px-2 py-1 text-white transition duration-500 ease-in-out hover:-translate-y-1 hover:scale-110  dark:text-white"
          type="button" @click="selectCrop">Crop Image</button>
      </div>
    </form>
    <div v-if="imageUrl && !imageProcessed">
      <div v-if="cropSelected">
        <transition name="crop-animation">
          <vue-cropper class="mt-4 rounded-lg shadow-lg" ref="cropper" :src="imageUrl" :aspect-ratio="null"
            @crop="updateCroppedImage" :options="{ aspectRatio: 1, viewMode: 1 }" v-if="cropSelected">
          </vue-cropper>
        </transition>
        <h5>Hold Shift to resize proportionally</h5>
      </div>
    </div>
    <div>
      <div v-if="image">
        <div ref="container" class="image-container mt-4">
          <img ref="image" v-if="!cropSelected" :src="image" alt="Processed image" class="mt-4 rounded-lg shadow-lg" />
        </div>
        <div v-show="showDetails"
          class="fixed md:prose-md lg:prose-md prose-sm dark:prose-invert sm:prose-sm xl:prose-lg dark:prose-invert inset-0 z-50 overflow-auto bg-smoke-light flex">
          <transition name="slide-fade">
            <div v-show="showDetails" class="details-overlay">
              <div
                class="relative text-black dark:text-white w-full md:w-1/2  rounded-lg bg-rose-300 p-8 shadow-lg dark:bg-fuchsia-950">
                <div class="flex gap-6 flex-col md:flex-row">
                  <div class="flex flex-wrap">
                    <div class="w-full text-center font-bold">
                      <font-awesome-icon icon="file-import" class="mr-2" />
                      Input
                    </div>
                    <div class="w-1/2">
                      <h5><strong>Size:</strong></h5>
                    </div>
                    <div class="w-1/2">
                      <h5>{{ formatSizeUnits(decodedJson.input.size) }}</h5>
                    </div>
                    <div class="w-1/2">
                      <h5><strong>Dimensions:</strong></h5>
                    </div>
                    <div class="w-1/2">
                      <h5>{{ decodedJson.input.dimensions.width }}x{{ decodedJson.input.dimensions.height }}px</h5>
                    </div>
                    <div class="w-1/2">
                      <h5><strong>Format:</strong></h5>
                    </div>
                    <div class="w-1/2">
                      <h5>{{ decodedJson.input.format }}</h5>
                    </div>
                    <hr class="my-4 border-t border-gray-200" />
                    <div class="mt-2 w-full text-center font-bold">
                      <font-awesome-icon icon="image" class="mr-2" />
                      Output
                    </div>
                    <div class="w-1/2">
                      <h5><strong>Size:</strong></h5>
                    </div>
                    <div class="w-1/2">
                      <h5>{{ formatSizeUnits(decodedJson.output.size) }}</h5>
                    </div>
                    <div class="w-1/2">
                      <h5><strong>Dimensions:</strong></h5>
                    </div>
                    <div class="w-1/2">
                      <h5>{{ decodedJson.output.dimensions.width }}x{{ decodedJson.output.dimensions.height }}px</h5>
                    </div>
                    <div class="w-1/2">
                      <h5><strong>Format:</strong></h5>
                    </div>
                    <div class="w-1/2">
                      <h5>{{ decodedJson.output.format }}</h5>
                    </div>
                  </div>
                  <div class="flex flex-wrap">
                    <div class="w-full text-center font-bold">
                      <font-awesome-icon icon="ruler-combined" class="mr-2" />
                      Optimization
                    </div>
                    <div class="w-1/2">
                      <h5><strong>Size Reduction:</strong></h5>
                    </div>
                    <div class="w-1/2">
                      <h5>{{ decodedJson.optimization.sizeReduction.toFixed(2) }}%</h5>
                    </div>
                    <div class="w-1/2">
                      <h5><strong>Quality Change:</strong></h5>
                    </div>
                    <div class="w-1/2">
                      <h5>{{ decodedJson.optimization.qualityChange.toFixed(2) }}%</h5>
                    </div>
                    <div class="w-1/2">
                      <h5><strong>Processing:</strong></h5>
                    </div>
                    <div class="w-1/2">
                      <h5>{{ decodedJson.processingTime }} ms</h5>
                    </div>
                    <div class="w-1/2">
                      <h5><strong>Date:</strong></h5>
                    </div>
                    <div class="w-1/2">
                      <h5>{{ new Date(decodedJson.date).toLocaleString() }}</h5>
                    </div>
                  </div>
                  <button @click="toggleDetails"
                    class="bg-green-600 dark:bg-purple-600  text-md transform rounded 0 px-2 py-1 text-white transition duration-500 ease-in-out hover:-translate-y-1 hover:scale-110  dark:text-white">
                    {{ showDetails ? 'Hide Details' : 'Show Details' }}
                  </button>
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
import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';

export default {
  components: {
    VueCropper,
  },
  data() {
    return {
      isButtonPressed: false,
      imageProcessed: false,
      showCropper: true,
      cropSelected: false,
      fileName: '',
      selectedFile: null,
      image: null,
      quality: 50,
      height: null,
      width: null,
      format: 'jpeg',
      optimize: true,
      showDetails: false,
      decodedJson: null,
      isLoading: false,
      uploadProgress: 0,
      errorModal: {
        show: false,
        message: '',
      },
      imageUrl: null,
      croppedImage: null,
    };
  },
  mounted() {
    this.initImagePanzoom();
  },
  methods: {
    clearFile() {
      this.selectedFile = null;
      this.image = null;
      this.decodedJson = null;
      this.cropSelected = false;
      this.showCropper = true;
      this.showDetails = false;
      this.fileName = '';
      this.isLoading = false;
      this.uploadProgress = 0;
      this.errorModal.show = false;
      this.errorModal.message = '';
      this.imageUrl = null;
      this.croppedImage = null;
      this.height = null;
      this.width = null;
      this.quality = 20;
      this.format = 'jpeg';
      this.optimize = true;
    },
    updateCroppedImage() {
      if (this.$refs.cropper) {
        this.$refs.cropper.getCroppedCanvas({
          width: this.width,
          height: this.height,
        }).toBlob((blob) => {
          this.croppedImage = blob;
          this.width = Math.round(this.$refs.cropper.getData().width);
          this.height = Math.round(this.$refs.cropper.getData().height);
        });
      }
    },
    updateCropArea() {
      const data = this.$refs.cropper.getData();
      data.width = this.width;
      data.height = this.height;
      this.$refs.cropper.setData(data);
    },
    selectCrop() {
      this.cropSelected = true;
    },
    toggleDetails() {
      this.showDetails = !this.showDetails;
      if (this.showDetails) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    },
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
        this.selectedFile = e.target.files[0];
        this.fileName = this.selectedFile.name;
        this.imageUrl = URL.createObjectURL(this.selectedFile);
      }
      this.selectedFile = e.target.files[0];
      const img = new Image();
      const reader = new FileReader();
      reader.onload = (event) => {
        img.onload = () => {
          this.width = img.width;
          this.height = img.height;
          this.initImagePanzoom();
        };
        img.onerror = () => {
          this.errorModal.show = true;
          this.errorModal.message = 'Failed to load image';
        };
        img.src = event.target.result;
      };
      reader.onerror = () => {
        this.errorModal.show = true;
        this.errorModal.message = 'Failed to read file';
      };
      reader.readAsDataURL(this.selectedFile);
    },
    cropImage() {
      if (this.$refs.cropper) {
        this.$refs.cropper.getCroppedCanvas({
          width: this.width,
          height: this.height,
        }).toBlob((blob) => {
          this.croppedImage = blob;
          this.width = Math.round(this.$refs.cropper.getData().width);
          this.height = Math.round(this.$refs.cropper.getData().height);
          this.showCropper = false;
        });
      }
    },
    previewImage() {
      const previewUrl = this.$refs.cropper.getCroppedCanvas().toDataURL();
      window.open(previewUrl);
      this.imageProcessed = true;
    },
    initImagePanzoom() {
      initImagePanzoom(this.$refs);
    },
    zoomImage(e) {
      zoomImage(this.$refs.image, this.$refs.container, e);
    },
    async submitForm() {
      if (this.cropSelected && !this.croppedImage) {
        await this.cropImage();
      }
      if (!this.selectedFile) {
        this.errorModal.show = true;
        this.errorModal.message = 'File not selected';
        return;
      }
      const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp', 'image/tiff', 'image/gif', 'image/avif'];
      if (!allowedTypes.includes(this.selectedFile.type)) {
        this.errorModal.show = true;
        this.errorModal.message = 'Invalid file type';
        return;
      }
      this.isLoading = true;
      let progress = 0;
      let progressInterval = null;
      try {
        progressInterval = setInterval(() => {
          if (progress < 90) {
            progress += 10;
            this.uploadProgress = progress;
          }
        }, 1000);
                  if (this.width <= 0 || this.height <= 0) {
            this.errorModal.show = true;
            this.errorModal.message = 'Invalid image dimensions';
            return;
          }
        const { image, decodedJson } = await submitForm(
          this.cropSelected ? this.croppedImage : this.selectedFile,
          this.format,
          this.optimize,
          this.quality,
          this.height,
          this.width,);
        this.image = image;
        this.decodedJson = decodedJson;
        this.$nextTick(() => {
          this.initImagePanzoom();
        });
        this.errorModal.show = false;
        this.errorModal.message = '';
        this.cropSelected = false;
      } catch (error) {
        this.errorModal.show = true;
        this.errorModal.message = error.message;
      } finally {
        clearInterval(progressInterval);
        this.uploadProgress = 100;
        setTimeout(() => {
          this.uploadProgress = 0;
          this.isLoading = false;
        }, 2000);
      }
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
