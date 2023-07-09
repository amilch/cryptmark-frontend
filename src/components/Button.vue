<script setup>
import Spinner from "@/components/Spinner.vue";

defineProps(['text', 'class', 'loading', 'type', 'disabled'])
</script>

<template>
  <button :type="type" :class="$props.class" :disabled="disabled">
    <template v-if="!loading">
      {{ text }}
    </template>
    <template v-else>
      <Spinner />
    </template>
  </button>
</template>
