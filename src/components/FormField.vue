<script setup>
import { Field } from "vee-validate"

defineProps(['name', 'label', 'autofocus', 'type', 'validateOnInput'])
</script>

<template>
  <div class="form-floating mb-4">
    <Field :name="name" v-slot="{ field, errors, errorMessage }" :validateOnInput="validateOnInput">
      <input
          :autofocus="autofocus"
          v-bind="field"
          :class="{ 'form-control': true, 'is-invalid': !!errors.length }"
          :id="$.uid"
          :placeholder="label"
          :type="type"
      />
      <label :for="$.uid">{{ $props.label }}</label>
      <div class="invalid-feedback">
        {{ errorMessage }}
      </div>
    </Field>
  </div>
</template>