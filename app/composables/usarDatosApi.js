import { ref } from 'vue'
import { fetchJson } from '~/components/utils/fetchJson'

/**
 * Composable que permite consultar datos desde los endpoints de la `api` definida,
 * con comportamiento reactivo.
 *
 * @param {string} endPoint Path del enPoint con el dominio que se ha definido en utiles.js
 *
 * @returns Propiedades | Funciones
 */
export function useDatosApi(endPoint) {
  /**
   * Objeto|Array reactivo que contendrá los datos consultados desde cada endPoint
   */
  const datos = ref(null)
  const pending = ref(false)
  const error = ref(null)

  /**
   * Función asincrona que consulta los datos con los parámetros actualizados
   */
  const consultarDatos = async () => {
    const config = useRuntimeConfig()

    pending.value = true
    error.value = null

    try {
      // const url = `/data/consorcio_evolucion_variantes.json`
      // const url = `${config.app.baseURL}data/consorcio_variantes_heatmap.json`
      const url = `${config.app.baseURL}${endPoint}`

      datos.value = await fetchJson(url)
      console.log('datos Cargados')

      return datos.value
    } catch (err) {
      error.value = err
      console.error('No se pudo cargar el JSON:', err)

      return null
    } finally {
      pending.value = false
    }
  }

  /**
   * Ejecuta la consulta de datos si el endPoint es válido
   */
  // function validarEndPoint() {
  //   if (endPoint !== undefined) consultarDatos()
  // }

  // validarEndPoint()

  return {
    datos,
    pending,
    error,
    consultarDatos,
  }
}
