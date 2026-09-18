<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import sankeyData from '@/assets/data/sankey.json'

function isPrimitive(value) {
  return (
    value === null ||
    typeof value !== 'object'
  )
}
function isSimpleObject(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.values(value).every(isPrimitive)
  )
}
function formatJson(value, level = 0) {
  const indent = '  '.repeat(level)
  const childIndent = '  '.repeat(level + 1)

  if (isPrimitive(value)) {
    return JSON.stringify(value)
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return '[]'
    }

    return [
      '[',
      value
        .map(item => `${childIndent}${formatJson(item, level + 1)}`)
        .join(',\n'),
      `${indent}]`,
    ].join('\n')
  }

  if (isSimpleObject(value)) {
    const entries = Object.entries(value)
      .map(([key, item]) => {
        return `${JSON.stringify(key)}: ${formatJson(item)}`
      })
      .join(', ')

    return `{ ${entries} }`
  }

  const entries = Object.entries(value)
    .map(([key, item]) => {
      return [
        `${childIndent}${JSON.stringify(key)}:`,
        formatJson(item, level + 1),
      ].join(' ')
    })
    .join(',\n')

  return [
    '{',
    entries,
    `${indent}}`,
  ].join('\n')
}
// formateando el json con filas completas
const formattedData = formatJson(sankeyData)

const downloadUrl = ref('')

onMounted(() => {
  const blob = new Blob(
    [formattedData],
    { type: 'application/json' },
  )

  downloadUrl.value = URL.createObjectURL(blob)
})

onBeforeUnmount(() => {
  if (downloadUrl.value) {
    URL.revokeObjectURL(downloadUrl.value)
  }
})
</script>

<template>
  <section class="sankey-page">
    <h1>Sankey Diagram</h1>

    <figure
      class="sankey"
      aria-labelledby="sankey-title"
    >
      <figcaption id="sankey-title">
        Diagrama de flujo de datos
      </figcaption>

      <ClientOnly>
        <SankeyComponent
          :datos="sankeyData"
          titulo="Diagrama de flujo de datos"
        />

        <template #fallback>
          <p class="sankey__loading">
            Cargando diagrama…
          </p>
        </template>
      </ClientOnly>
    </figure>

    <section
      class="data-section"
      aria-labelledby="data-title"
    >
      <div class="data-section__header">
        <h2 id="data-title">Datos del diagrama</h2>

        <a
          v-if="downloadUrl"
          :href="downloadUrl"
          download="sankey.json"
        >
          Descargar JSON
        </a>
      </div>

      <pre class="json-viewer"><code>{{ formattedData }}</code></pre>
    </section>
  </section>
</template>

<style scoped>
.sankey-page {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.sankey {
  width: 100%;
  margin: 0;
}

.sankey figcaption {
  margin-bottom: 0.75rem;
  font-size: 1.125rem;
  font-weight: 600;
}

.sankey__loading {
  min-height: 500px;
  display: grid;
  place-items: center;
  color: #64748b;
}

.data-section {
  margin-top: 2rem;
}

.data-section__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.data-section h2 {
  margin: 0;
  font-size: 1.25rem;
}

.data-section a {
  color: #2563eb;
  text-decoration: underline;
}

.json-viewer {
  width: 100%;
  box-sizing: border-box;
  max-height: 500px;
  overflow: auto;
  margin: 0;
  padding: 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  background: #0f172a;
  color: #e2e8f0;
  font-size: 0.875rem;
  line-height: 1.5;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.json-viewer code {
  display: block;
  width: 100%;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
}
</style>
