export async function fetchJson(url) {
  const respuesta = await fetch(url)
  console.log('respuesta Cargada')

  if (!respuesta.ok) {
    throw new Error(`HTTP ${respuesta.status}`)
  }

  return await respuesta.json()
}
