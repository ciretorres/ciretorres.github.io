<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: 'VTODAS',
  },

  opciones: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue'])

function actualizarValor(event) {
  emit('update:modelValue', event.target.value)
}
</script>

<template>
  <label class="selector-tipo">
    <span>Tipo de variante</span>

    <select
      :value="props.modelValue"
      @change="actualizarValor"
    >
      <option value="VTODAS">VTODAS</option>

      <option
        v-for="tipo in props.opciones.filter(tipo => tipo !== 'VTODAS')"
        :key="tipo"
        :value="tipo"
      >
        {{ tipo }}
      </option>
    </select>
  </label>
</template>

<style scoped>
.selector-tipo {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-width: 240px;
  color: #374151;
  font-size: 14px;
}

.selector-tipo select {
  padding: 8px 10px;
  border: 1px solid #d1d5db;
  border-radius: 5px;
  background: white;
  color: #111827;
}
</style>
