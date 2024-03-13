<template>
  <div
    class="purrs z-30 w-full justify-between rounded-lg bg-rose-300 p-8 shadow-lg dark:bg-fuchsia-950"
    :class="{ 'animate-pulse': isLoading }"
  >
    <div class="w-full rounded-md bg-gray-200" v-if="isLoading">
      <div
        class="h-2 rounded-md bg-green-500"
        :style="{ width: `${uploadProgress}%` }"
      ></div>
    </div>
    <form @submit.prevent="submitForm" class="space-y-2">
      <div class="grid grid-cols-1 gap-2">
        <div>
          <input type="file" id="file" @change="onFileChange" class="hidden" />
          <div class="flex">
            <label
              for="file"
              class="text-overflow-ellipsis mt-1 block w-full transform cursor-pointer overflow-hidden whitespace-nowrap rounded-md border border-fuchsia-800 p-2 transition duration-500 ease-in-out hover:-translate-y-1 hover:scale-105 dark:border-gray-600 dark:border-rose-300 dark:bg-gray-700"
            >
              {{ fileName || '(─‿‿─)♡ choose one file...' }}
            </label>
            <button
              type="button"
              @click="clearFile"
              class="inline-block px-4 first:border-0 dark:border-white"
            >
              <font-awesome-icon icon="trash" />
            </button>
          </div>
          <ErrorModal
            :show="errorModal.show"
            :message="errorModal.message"
            @close="errorModal.show = false"
          />
        </div>
        <div>
          <label class="text-md block font-medium text-black dark:text-white">
            Quality:
            <input
              type="range"
              min="1"
              max="100"
              v-model="quality"
              class="mt-1 block w-full rounded-md"
            />
          </label>
        </div>
      </div>
      <div class="grid w-full grid-cols-1 gap-2 md:grid-cols-5">
        <div>
          <label class="text-md block font-medium text-black dark:text-white">
            Height:
            <input
              type="number"
              v-model="height"
              class="mt-1 block w-full rounded-md border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700"
              :class="{ 'animate-ping': isButtonPressed }"
              v-model.number="height"
              @input="updateCropArea"
            />
          </label>
        </div>
        <div>
          <label class="text-md block font-medium text-black dark:text-white">
            Width:
            <input
              type="number"
              v-model="width"
              class="mt-1 block w-full rounded-md border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700"
              :class="{ 'animate-ping': isButtonPressed }"
              v-model.number="width"
              @input="updateCropArea"
            />
          </label>
        </div>
        <div>
          <label class="text-md block font-medium text-black dark:text-white">
            Format:
            <select
              v-model="format"
              class="mt-1 block w-full rounded-md border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700"
            >
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
              <select
                v-model="optimize"
                class="mt-1 block w-full rounded-md border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </label>
          </div>
        </div>
      </div>
      <div
        class="flex flex-wrap items-stretch justify-start gap-2 md:flex-nowrap"
      >
        <button
          type="submit"
          :disabled="isLoading"
          class="text-md 0 transform rounded bg-rose-600 px-2 py-1 text-white transition duration-500 ease-in-out hover:-translate-y-1 hover:scale-110 dark:bg-fuchsia-600 dark:text-white"
          :class="{ 'animate-bounce': isLoading }"
        >
          <span v-if="isLoading">Loading...</span>
          <span v-else>Submit</span>
        </button>
        <button
          v-if="image"
          type="button"
          @click="downloadImage"
          class="text-md 0 transform rounded bg-fuchsia-600 px-2 py-1 text-white transition duration-500 ease-in-out hover:-translate-y-1 hover:scale-110 dark:bg-emerald-600 dark:text-white"
        >
          Download Image
        </button>
        <button
          v-if="image && decodedJson"
          type="button"
          @click="toggleDetails"
          class="text-md 0 transform rounded bg-green-600 px-2 py-1 text-white transition duration-500 ease-in-out hover:-translate-y-1 hover:scale-110 dark:bg-cyan-600 dark:text-white"
        >
          {{ showDetails ? 'Hide Details' : 'Show Details' }}
        </button>
        <button
          v-if="!cropSelected && imageUrl && !imageProcessed"
          class="text-md 0 transform rounded bg-cyan-600 px-2 py-1 text-white transition duration-500 ease-in-out hover:-translate-y-1 hover:scale-110 dark:bg-rose-600 dark:text-white"
          type="button"
          @click="selectCrop"
        >
          Crop Image
        </button>
      </div>
    </form>
    <div v-if="imageUrl && !imageProcessed">
      <div v-if="cropSelected">
        <transition name="crop-animation">
          <vue-cropper
            class="mt-4 rounded-lg shadow-lg"
            ref="cropper"
            :src="imageUrl"
            :aspect-ratio="null"
            @crop="updateCroppedImage"
            :options="{ aspectRatio: 1, viewMode: 1 }"
            v-if="cropSelected"
          >
          </vue-cropper>
        </transition>
        <h5>Hold Shift to resize proportionally</h5>
      </div>
    </div>
    <div>
      <div v-if="image">
        <div ref="container" class="image-container mt-4">
          <img
            ref="image"
            v-if="!cropSelected"
            :src="image"
            alt="Processed image"
            class="mt-4 rounded-lg shadow-lg"
          />
        </div>
        <DetailsComponent
          :showDetails="showDetails"
          :decodedJson="decodedJson"
          @toggle-details="toggleDetails"
        />
      </div>
    </div>
  </div>
</template>

<script>
import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';

import DetailsComponent from '@/components/DetailsComponent.vue';
import ErrorModal from '@/components/ErrorModal.vue';

import {
  initImagePanzoom,
  zoomImage,
  resetZoom,
} from '@/utils/imageInteract.js';
import {
  updateCropArea,
  selectCrop,
  updateCroppedImage,
  cropImage,
} from '@/utils/cropUtils.js';
import { submitForm, downloadImage, clearFormFile } from '@/utils/imageAPI.js';
import { onFileChange } from '@/utils/onFileChange.js';

export default {
  components: {
    VueCropper,
    DetailsComponent,
    ErrorModal,
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
      x: null,
      y: null,
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
      clearFormFile(this);
    },
    updateCroppedImage() {
      updateCroppedImage(this);
    },
    updateCropArea() {
      updateCropArea(this);
    },
    selectCrop() {
      selectCrop(this);
    },
    toggleDetails() {
      this.showDetails = !this.showDetails;
      if (this.showDetails) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    },
    onFileChange(e) {
      onFileChange(this, e);
    },
    cropImage() {
      cropImage(this);
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
      await submitForm(this);
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
