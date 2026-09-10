<script setup>
import * as d3 from 'd3'

import consorcioEvolucionVariantes from '@/assets/datasets/consorcio_evolucion_variantes.json'

const datosGrafica = consorcioEvolucionVariantes

/**
 * Construcción de objetoDatos
 */
function Objeto(fecha_recoleccion, tipo_variante) {
  // Constructor
  return {
    fecha_recoleccion: fecha_recoleccion,
    tipo_variante: tipo_variante,
  }
}
function Objeto2(
  fecha_recoleccion,
  tipo_variante_0,
  tipo_variante_1,
  tipo_variante_2,
  tipo_variante_3,
  tipo_variante_4,
) {
  // Constructor
  return {
    fecha_recoleccion: fecha_recoleccion,
    VSIN: tipo_variante_0,
    VIN: tipo_variante_1,
    VOM: tipo_variante_2,
    VOC: tipo_variante_3,
    VOI: tipo_variante_4,
  }
}

/**
 * Formateando datos
 */

// Obteniendo keys o nombre de la variable columna obj
const asArray = Object.entries(datosGrafica)
const dateArray = Object.values(asArray[0][1])
const varianteArray = Object.values(asArray[2][1])
const dataBase = []
for (let i = 0; i < dateArray.length; i++) {
  const nuevoObjeto = Objeto(
    // estadoArray[i],
    dateArray[i],
    varianteArray[i],
    // OMSArray[i]
  )
  dataBase.push(nuevoObjeto)
}

/**
 * Filtrando baseDatos por fecha_recolección
 * this.fecha_actualización '2021-04-30' -6 en mes
 */
const dateFiltered = dataBase.filter(d => d.fecha_recoleccion > '2020-12-31')
const onlyDate = dateFiltered.map(d => d['fecha_recoleccion'])

function filterUniqueDates(data) {
  const lookup = new Set()

  return data.filter((d) => {
    const serialised = d
    if (lookup.has(serialised)) {
      return false
    }
    else {
      lookup.add(serialised)
      return true
    }
  })
}

const uniqueValueDate = filterUniqueDates(onlyDate)
const datosMultilinea = []
for (let i = 0; i < uniqueValueDate.length; i++) {
  const arrVSIN = []
  const arrVIN = []
  const arrVOM = []
  const arrVOC = []
  const arrVOI = []
  for (let j = 0; j < dateFiltered.length; j++) {
    if (dateFiltered[j].fecha_recoleccion === uniqueValueDate[i]) {
      if (dateFiltered[j].tipo_variante === 'VSIN') {
        arrVSIN.push(dateFiltered[j].tipo_variante)
      }
      if (dateFiltered[j].tipo_variante === 'VIN') {
        arrVIN.push(dateFiltered[j].tipo_variante)
      }
      if (dateFiltered[j].tipo_variante === 'VOM') {
        arrVOM.push(dateFiltered[j].tipo_variante)
      }
      if (dateFiltered[j].tipo_variante === 'VOC') {
        arrVOC.push(dateFiltered[j].tipo_variante)
      }
      if (dateFiltered[j].tipo_variante === 'VOI') {
        arrVOI.push(dateFiltered[j].tipo_variante)
      }
    }
  }
  const nuevoObjeto = Objeto2(
    uniqueValueDate[i],
    arrVSIN.length,
    arrVIN.length,
    arrVOM.length,
    arrVOC.length,
    arrVOI.length,
  )
  datosMultilinea.push(nuevoObjeto)
}
// console.log(datosMultilinea)
</script>

<template>
  <article>
    <h3>Multiline</h3>

    <section aria-label="Componente de multilinea">
      <ClientOnly>
        <MultilineaComponent
          ref="lineasRef"
          :multilineas-id="'lineas'"
          :datos="datosMultilinea"
          :nombre-columna-horizontal="'fecha_recoleccion'"
          :variables="[
            { id: 'VSIN', nombre: 'VSIN', color: '#a6cee3' },
            { id: 'VIN', nombre: 'VIN', color: '#b2df8a' },
            { id: 'VOM', nombre: 'VOM', color: '#fb9a99' },
            { id: 'VOC', nombre: 'VOC', color: '#fdbf6f' },
            { id: 'VOI', nombre: 'VOI', color: '#cab2d6' },
          ]"
          :conversion-temporal="d3.timeParse('%Y-%m-%d')"
        />
      </ClientOnly>
    </section>
  </article>
</template>
