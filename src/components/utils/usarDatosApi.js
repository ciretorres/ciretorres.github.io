import { ref } from 'vue'
import { api } from './utiles'

/**
 * Composable que permite consultar datos desde los endpoints de la `api` definida,
 * con comportamiento reactivo.
 *
 * @param {String} endPoint Path del enPoint con el dominio que se ha definido en utiles.js
 *
 * @returns Propiedades | Funciones
 */
export default function (endPoint) {
  /**
   * Objeto|Array reactivo que contendrá los datos consultados desde cada endPoint
   */
  const datos = ref([])

  /**
   * Función asincrona que consulta los datos con los parámetros actualizados
   */
  async function consultarDatos() {
    const { data } = await api.get(endPoint)
    datos.value = data
    // try {
    //   const response = await api.get(endPoint)
    //   console.log(response)
    //   datos.value = response
    // } catch (error) {
    //   console.error(error)
    // }
  }

  /**
   * Ejecuta la consulta de datos si el endPoint es válido
   */
  function validarEndPoint() {
    if (endPoint !== undefined) consultarDatos()
  }

  validarEndPoint()

  return {
    datos,
  }
}
