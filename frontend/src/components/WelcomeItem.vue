<template>
  <div class="item relative mt-8 flex md:mt-0 md:py-1 md:pl-[calc(var(--section-gap)/2)]">
    <i class="text-text md:bg-background flex h-8 w-8 items-center justify-center md:absolute md:-left-6 md:top-1/2 md:h-12 md:w-12 md:-translate-y-1/2 md:rounded-lg">
      <slot name="icon"></slot>
    </i>
    <div class="details ml-4 flex-1 md:ml-0">
      <h3 class="text-heading mb-1 text-lg font-medium">
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
      required: true,
    },
  });
</script>
