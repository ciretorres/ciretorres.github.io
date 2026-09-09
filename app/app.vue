<script setup>
// useHead({
//   meta: [
//     { name: 'viewport', content: 'width=device-width, initial-scale=1' }
//   ],
//   link: [
//     { rel: 'icon', href: '/favicon.ico' }
//   ],
//   htmlAttrs: {
//     lang: 'en'
//   }
// })

// const title = 'Nuxt Starter Template'
// const description = 'A production-ready starter template powered by Nuxt UI. Build beautiful, accessible, and performant applications in minutes, not hours.'

// useSeoMeta({
//   title,
//   description,
//   ogTitle: title,
//   ogDescription: description,
//   ogImage: 'https://ui.nuxt.com/assets/templates/nuxt/starter-light.png',
//   twitterCard: 'summary_large_image'
// })
</script>

<template>
  <div class="p-3">
    <header>
      <nav aria-label="Principal">
        <nuxt-link to="/"><h1>I'm Eric. web developer</h1></nuxt-link>
      </nav>
    </header>

    <main id="principal">
      <NuxtPage />
    </main>

    <section
      id="contacto"
      aria-label="Contacto"
    >
      <h2>
        Code
        <a
          href="https://github.com/ciretorres/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Github</a>,
        <a
          href="https://raw.githubusercontent.com/ciretorres/ciretorres.github.io/refs/heads/develop/src/assets/docs/CV_EricTorres(english)_compressed.pdf"
          target="_blank"
          rel="noopener noreferrer"
        >
          CurriculumVitae</a>.
      </h2>
    </section>
  <!-- <UApp>
    <UHeader>
      <template #left>
        <NuxtLink
          to="/"
          class="focus-visible:outline-3 outline-primary/25 rounded-md p-1 -ms-1"
        >
          <AppLogo class="w-auto h-6 shrink-0" />
        </NuxtLink>

        <TemplateMenu />
      </template>

      <template #right>
        <UColorModeButton />

        <UButton
          to="https://github.com/nuxt-ui-templates/starter"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
          color="neutral"
          variant="ghost"
        />
      </template>
    </UHeader>

    <UMain>
      <NuxtPage />
    </UMain>

    <USeparator icon="i-simple-icons-nuxtdotjs" />

    <UFooter>
      <template #left>
        <p class="text-sm text-muted">
          Built with Nuxt UI • © {{ new Date().getFullYear() }}
        </p>
      </template>

      <template #right>
        <UButton
          to="https://github.com/nuxt-ui-templates/starter"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
          color="neutral"
          variant="ghost"
        />
      </template>
    </UFooter>
  </UApp> -->
  </div>
</template>
