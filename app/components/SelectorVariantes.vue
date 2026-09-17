<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: 'VTODAS'
  },

  opciones: {
    type: Array,
    default: () => []
  }
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
      <option value="VTODAS">
        VTODAS
      </option>

      <option
        v-for="tipo in props.opciones.filter(
          tipo => tipo !== 'VTODAS'
        )"
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

<!-- <script setup>
import variantesJson from '@/assets/data/variantes.json'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])

// ordenando variables en una copia
const variantes = [...variantesJson].sort(
  (a, b) => a.orden - b.orden,
)

function cambiarVariante(event) {
  emit('update:modelValue', event.target.value)
}
</script>

<template>
  <div class="selector-variantes">
    <label for="selector-variante">Variables</label>

    <select
      id="selector-variante"
      :value="props.modelValue"
      @change="cambiarVariante"
    >
      <option
        v-for="variante in variantes"
        :key="variante.clave"
        :value="variante.clave"
      >
        {{ variante.nombre }}
      </option>
    </select>
  </div>
</template> -->
