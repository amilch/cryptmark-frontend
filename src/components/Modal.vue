<script setup>
import {reactive, onMounted, onUnmounted} from 'vue'
import * as bootstrap from 'bootstrap'

defineProps(['title'])

const state = reactive({
  modal: null
})

onMounted(() => {
  state.modal = new bootstrap.Modal('#bootstrapModal', {
    backdrop: 'static',
    keyboard: false
  })
  show()
})

onUnmounted(() => {
  hide()
})

function show() {
  state.modal.show()
}

function hide() {
  state.modal.hide()
}
</script>

<template>
  <div
    class="modal fade"
    id="bootstrapModal"
    tabindex="-1"
    aria-labelledby="bootstrapModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="bootstrapModalLabel">{{ title }}</h5>
<!--          <button-->
<!--            type="button"-->
<!--            class="btn-close"-->
<!--            data-bs-dismiss="modal"-->
<!--            aria-label="Close"-->
<!--          ></button>-->
        </div>
        <div class="modal-body">
          <slot></slot>
        </div>
        <div class="modal-footer">
          <slot name="footer">
            <button type="button" class="btn btn-link text-decoration-none" data-bs-dismiss="modal">
              Close
            </button>
            <button type="button" class="btn btn-light">Save changes</button>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>
