<script setup>
defineProps(['label', 'modelValue'])
defineEmits(['update:modelValue'])
</script>

<template>
  <div class="form-check">
    <input
        class="form-check-input"
        type="checkbox"
        :id="$.uid"
        :checked="modelValue"
        @input="$emit('update:modelValue', $event.target.checked)"
    />
    <label class="form-check-label" :for="$.uid">{{ label }}</label>
  </div>
</template>