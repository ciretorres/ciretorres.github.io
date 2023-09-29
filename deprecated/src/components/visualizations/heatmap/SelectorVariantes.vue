<script setup>
import { computed } from 'vue'

import { useStore } from '@/stores/index'
const store = useStore()

import variantesjson from '@/assets/data/variantes.json'
const variantes = variantesjson

const varianteSeleccionada = computed({
  // getter
  get() {
    return store.variante_seleccionada
  },
  // setter
  set(newValue) {
    store.seleccionarVariante(newValue)
  }
})
</script>

<template>
  <div>
    <label for="selector-variante">Variables</label>
    <select id="selector-variante" v-model="varianteSeleccionada">
      <option v-for="variante in variantes" :key="variante.orden" :value="variante.clave">
        {{ variante.nombre }}
      </option>
    </select>
  </div>
</template>
