<script setup>
// const props = defineProps(['modelValue', 'color'])
const props = defineProps({
  modelValue: Boolean,
  color: String
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <label class="checkbox-color-container">
    <input
      type="checkbox"
      :checked="modelValue"
      @change="$emit('update:modelValue', $event.target.checked)"
    />
    <span class="color-square">
      <span class="custom-checkbox" :class="{ 'icon-check': modelValue }"></span>
      <span class="color" :style="{ backgroundColor: props.color }"></span>
    </span>

    <slot></slot>
  </label>
</template>

<style lang="scss">
::-ms-check {
  color: red;
  background: black;
  padding: 1em;
}

.checkbox-color-container {
  //box-sizing: content-box !important;
  position: relative;
  display: flex;
  align-items: center;
  //flex-grow: 1;
  cursor: pointer;
  * {
    box-sizing: content-box !important;
  }

  input {
    position: absolute;
    left: 0;
    opacity: 1;
    z-index: 0;
    // opacity: 0;
    // z-index: -1;
  }
  .color-square {
    display: flex;
    width: 30px;
    height: 27px;
    border: 1px solid black;
    border-radius: 4px;
    margin-right: 0.7em;
    span {
      flex-grow: 1;
    }
    .custom-checkbox {
      font-size: 15px;
      padding-top: 5px;
    }
    .color {
      background-color: black;
      min-width: 15px;
    }
  }
}
</style>
<!-- <template>
  <label class="checkbox-color-container">
    <input
      type="checkbox"
      :checked="value"
      @change="cambio"
    />
    <span class="color-square">
      <span
        class="custom-checkbox"
        :class="{ 'dai-icon-check': value }"
      ></span>
      <span
        class="color"
        :style="{ backgroundColor: color }"
      ></span>
    </span>

    <slot></slot>
  </label>
</template>

<script>
export default {
  props: ['value', 'color'],
  model: {
    prop: 'value',
    event: 'change',
  },
  methods: {
    cambio: function (e) {
      this.$emit('change', e.target.checked)
    },
  },
}
</script>

<style lang="scss">
::-ms-check {
  color: red;
  background: black;
  padding: 1em;
}

.checkbox-color-container {
  //box-sizing: content-box !important;
  position: relative;
  display: flex;
  align-items: center;
  //flex-grow: 1;
  cursor: pointer;
  * {
    box-sizing: content-box !important;
  }

  input {
    position: absolute;
    left: 0;
    opacity: 1;
    z-index: 0;
    // opacity: 0;
    // z-index: -1;
  }
  .color-square {
    display: flex;
    width: 30px;
    height: 27px;
    border: 1px solid black;
    border-radius: 4px;
    margin-right: 0.7em;
    span {
      flex-grow: 1;
    }
    .custom-checkbox {
      font-size: 15px;
      padding-top: 5px;
    }
    .color {
      background-color: black;
      min-width: 15px;
    }
  }
}
</style> -->
