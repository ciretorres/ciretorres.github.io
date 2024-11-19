import axios from 'axios'
const public_path = import.meta.env.BASE_URL
/**
 * Instancia de axios
 */
export const api = axios.create({
  baseURL: public_path + 'datasets',
  // baseURL: process.env.VUE_APP_API_DOMAIN,
})

/**
 * Devuelve una petición fetch con promesa de un JSON si la respuesta https es correcta,
 * en caso contrario devolverá el objetoEsperado que se esperaba de la respuesta.
 * @param {String} url
 * @param {Object|Array} objetoEsperado
 * @returns {Promise}
 */
export async function fetchJSON(url, objetoEsperado = {}) {
  const response = await fetch(url)

  if (response.ok) {
    return response.json()
  }

  console.error(`no se pudieron cargar los datos de: ${url}`)
  return objetoEsperado
  // return fetch(url).then(response => {
  //   if (response.ok) {
  //     return response.json()
  //   }
  //   console.error(`no se pudieron cargar los datos de: ${url}`)
  //   return []
  // })
}
