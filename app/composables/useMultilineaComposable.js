import { ref } from 'vue'
import { fetchJson } from '~/components/utils/fetchJson'

export function useConsorcioEvolucionVariantes() {
  const datos = ref(null)
  const pending = ref(false)
  const error = ref(null)

  const cargarDatos = async () => {
    const config = useRuntimeConfig()

    pending.value = true
    error.value = null

    try {
      // const url = `/data/consorcio_evolucion_variantes.json`
      const url = `${config.app.baseURL}data/consorcio_evolucion_variantes.json`

      datos.value = await fetchJson(url)
      console.warn('muestras Cargadas')

      return datos.value
    } catch (err) {
      error.value = err
      console.error('No se pudo cargar el JSON:', err)

      return null
    } finally {
      pending.value = false
    }
  }

  return {
    datos,
    pending,
    error,
    cargarDatos,
  }
}
