<template>
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
</template>

<script>
import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';

export default {
  components: {
    VueCropper,
  },
  props: {
    imageUrl: {
      type: String,
      required: true,
    },
    cropSelected: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    updateCroppedImage() {
      if (this.$refs.cropper) {
        this.$refs.cropper
          .getCroppedCanvas({
            width: this.width,
            height: this.height,
          })
          .toBlob((blob) => {
            this.$emit('crop-updated', blob);
          });
      }
    },
  },
};
</script>
