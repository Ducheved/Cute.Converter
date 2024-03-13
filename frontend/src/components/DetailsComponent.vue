<template>
  <div
    v-if="decodedJson"
    v-show="showDetails"
    class="md:prose-md lg:prose-md bg-smoke-light prose-sm fixed inset-0 z-50 flex overflow-auto dark:prose-invert dark:prose-invert sm:prose-sm xl:prose-lg"
  >
    <transition name="slide-fade">
      <div v-show="showDetails" class="details-overlay">
        <div
          class="relative w-full rounded-lg bg-rose-300 p-8 text-black shadow-lg dark:bg-fuchsia-950 dark:text-white md:w-1/2"
        >
          <div class="flex flex-col gap-6 md:flex-row">
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
                <h5>
                  {{ decodedJson.input.dimensions.width }}x{{
                    decodedJson.input.dimensions.height
                  }}px
                </h5>
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
                <h5>
                  {{ decodedJson.output.dimensions.width }}x{{
                    decodedJson.output.dimensions.height
                  }}px
                </h5>
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
                <h5>
                  {{ decodedJson.optimization.sizeReduction.toFixed(2) }}%
                </h5>
              </div>
              <div class="w-1/2">
                <h5><strong>Quality Change:</strong></h5>
              </div>
              <div class="w-1/2">
                <h5>
                  {{ decodedJson.optimization.qualityChange.toFixed(2) }}%
                </h5>
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
            <button
              @click="toggleDetails"
              class="text-md 0 transform rounded bg-green-600 px-2 py-1 text-white transition duration-500 ease-in-out hover:-translate-y-1 hover:scale-110 dark:bg-purple-600 dark:text-white"
            >
              {{ showDetails ? 'Hide Details' : 'Show Details' }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: ['showDetails', 'decodedJson'],
  methods: {
    toggleDetails() {
      this.$emit('toggle-details');
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
  },
};
</script>
