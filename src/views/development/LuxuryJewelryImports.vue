<template>
  <div class="luxji">
    <div class="portafolio">
      <a href="https://luxuryjewelryimports.com/">
        <img src="@/assets/imgs/portafolio-luxji-1.jpg" alt="" class="img-portafolio">
      </a>
      <a href="https://luxuryjewelryimports.com/">
        <img src="@/assets/imgs/portafolio-luxji-2.jpg" alt="" class="img-portafolio">
      </a>
      <a href="https://luxuryjewelryimports.com/">
        <img src="@/assets/imgs/portafolio-luxji-3.jpg" alt="" class="img-portafolio">
      </a>
    </div>
    <div class="navegacion">
      <router-link class="nav-boton" to="/development/tulumers">[previous]</router-link>
      <router-link class="nav-boton" to="/development/centro-optico-profesional">[next]</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LuxuryJewelryImports',
}
</script>

<style lang="scss">
.luxji {
  .portafolio {
    .img-portafolio {
      width: 100%;
      vertical-align: middle;
      border: 0;
    }
  }
  .navegacion {
    background: #fff;
    width: 100%;
    display: flex;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    justify-content: center;
    align-items: middle;
    .nav-boton {
      font-size: 24px;
      font-weight: 700;
      color: #000;
      padding: 40px;
      &:hover {
        background: #000;
        color: #fff;
      }
    }
  }
}
</style>