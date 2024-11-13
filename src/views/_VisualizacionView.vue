<script setup></script>
<template>
  <div class="">
    <div class="container">
      <aside>
        <nav aria-labelledby="h2">
          <router-link to="/visualization/intro"><h2 id="h2">Viszualization</h2></router-link>
          <div class="group" tabindex="0">
            <section id="d3js">
              <p><router-link to="/visualization/d3js">Heatmap</router-link></p>
              <p><router-link to="/visualization/multiline">Multiline</router-link></p>
              <p><router-link to="/visualization/area">Area</router-link></p>
              <p><router-link to="/visualization/sankey">Flow diagram</router-link></p>
            </section>
            <section id="maps">
              <p><router-link to="/visualization/maps">Maps</router-link></p>
            </section>
            <section>
              <p><router-link to="">Thesis-project [UAM-A]</router-link></p>
              <p><router-link to="">Interactive Solid Waste System [CDMX]</router-link></p>
              <p><router-link to="">AR-System UNIVERSUM [UIC]</router-link></p>
              <p><router-link to="">3D Gamma-Ray-Catalogue [HAWC Observatory]</router-link></p>
            </section>
          </div>
        </nav>
      </aside>
      <main id="principal">
        <router-view />
      </main>
    </div>
    <br />
    <router-link to="/">[Go back]</router-link>
  </div>
</template>

<style lang="scss">
@media screen and (min-width: 375px) {
  .container {
    display: flex;
  }
  aside {
    width: 40%;
    max-width: 300px;
    min-width: 200px;
  }
}
</style>
