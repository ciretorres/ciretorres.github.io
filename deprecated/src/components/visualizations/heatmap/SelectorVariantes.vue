<template>
  <div>
    <label for="selector-variante">Variables</label>
    <select
      id="selector-variante"
      v-model="varianteSeleccionada"
    >
      <option
        v-for="variante in variantes"
        :key="variante.orden"
        :value="variante.clave"
      >
        {{ variante.nombre }}
      </option>
    </select>
  </div>
</template>

<script>
import variantesjson from '@/assets/data/variantes.json'

export default {
  name: 'SelectorVariantes',
  data() {
    return {
      variantes: variantesjson,
    }
  },
  computed: {
    varianteSeleccionada: {
      get() {
        return this.$store.getters.varianteSeleccionada
      },
      set(value) {
        this.$store.commit('seleccionarVariante', value)
      },
    },
  },
}
</script>
