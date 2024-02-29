<template>
  <div class="item mt-8 flex relative md:mt-0 md:py-1 md:pl-[calc(var(--section-gap)/2)]">
    <i
      class="flex items-center justify-center w-8 h-8 text-text md:absolute md:bg-background md:rounded-lg md:w-12 md:h-12 md:-left-6 md:top-1/2 md:-translate-y-1/2"
    >
      <slot name="icon"></slot>
    </i>
    <div class="details flex-1 ml-4 md:ml-0">
      <h3 class="text-lg font-medium mb-1 text-heading">
        <slot name="heading"></slot>
      </h3>
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  msg: {
    type: String,
    required: true
  }
})
</script>
