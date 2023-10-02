import axios from 'axios'
const public_path = process.env.BASE_URL
/**
 * Instancia de axios
 */
export const api = axios.create({
  baseURL: public_path + 'datasets',
  // baseURL: process.env.VUE_APP_API_DOMAIN,
})
// console.log(public_path + 'datasets')
