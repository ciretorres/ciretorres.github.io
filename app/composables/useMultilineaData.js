import { computed } from 'vue'

/**
 * Transforma, filtra y agrupa los registros.
 * @param {*} datosOriginales
 * @param {*} param1
 * @returns
 */
export function useMultilineData(
  datosOriginales,
  {
    fechaMinima = '2021-01-01',
    fechaMaxima = '2021-06-30',
  } = {},
) {
  const variantes = ['VSIN', 'VIN', 'VOM', 'VOC', 'VOI']


  /**
 * Convierte la estructura columnar del JSON:
 * {
 *   fecha_recoleccion: { 0: '1900-01-01', 1: '1900-01-01' },
 *   estado: { 0: 'Ciudad de México', 1: 'Oaxaca' },
 *   tipo_variante: { 0: 'VSIN', 1: 'VOC' }
 * }
 *
 * en una estructura de registros:
 * [
 *   {
 *     fecha_recoleccion: '1900-01-01',
 *     estado: 'Ciudad de México',
 *     tipo_variante: 'VSIN'
 *   }
 * ]
 */
  const registros = computed(() => {
    // obtén todos los objetos
    const fechas = datosOriginales.fecha_recoleccion ?? {}
    const estados = datosOriginales.estado ?? {}
    const tipos = datosOriginales.tipo_variante ?? {}
    const variantesOms = datosOriginales.variante_oms ?? {}
    const linajes = datosOriginales.linaje_pangolin ?? {}

    // itera en el de fechas porque todos tiene la misma longitud
    return Object.keys(fechas).map(indice => ({
      fecha_recoleccion: fechas[indice],
      estado: estados[indice] ?? '',
      tipo_variante: tipos[indice] ?? '',
      variante_oms: variantesOms[indice] ?? '',
      linaje_pangolin: linajes[indice] ?? '',
    }))
  })

  /**
   * Filtra por fecha, agrupa los registros y cuenta las variantes.
   */
  const datosMultilinea = computed(() => {
    const registrosFiltrados = registros.value.filter((registro) => {
      // if (!fechaMinima) {
      //   return true
      // }
      // return registro.fecha_recoleccion > fechaMinima
      const fecha = registro.fecha_recoleccion

      return (
        (!fechaMinima || fecha >= fechaMinima)
        && (!fechaMaxima || fecha <= fechaMaxima)
      )
    })

    const agrupados = registrosFiltrados.reduce(
      (acumulado, registro) => {
        const fecha = registro.fecha_recoleccion

        if (!acumulado[fecha]) {
          acumulado[fecha] = {
            fecha_recoleccion: fecha,
            VSIN: 0,
            VIN: 0,
            VOM: 0,
            VOC: 0,
            VOI: 0,
          }
        }

        // if (Object.hasOwn(acumulado[fecha], registro.tipo_variante)) {
        //   acumulado[fecha][registro.tipo_variante]++
        // }
        if (variantes.includes(registro.tipo_variante)) {
          acumulado[fecha][registro.tipo_variante]++
        }

        return acumulado
      },
      {},
    )

    return Object.values(agrupados).sort((a, b) => {
      return a.fecha_recoleccion.localeCompare(b.fecha_recoleccion)
    })
  })

  return {
    registros,
    datosMultilinea,
  }
}
