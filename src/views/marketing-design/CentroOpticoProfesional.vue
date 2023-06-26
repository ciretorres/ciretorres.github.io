<template>
  <div class="centro-optico-profesional">
    <a href="http://www.centroopticoprofesional.com/" target="_blank" class="portafolio">
      <img src="@/assets/imgs/portafolio-cop-1.jpg" alt="" class="img-portafolio">
      <img src="@/assets/imgs/portafolio-cop-2.jpg" alt="" class="img-portafolio">
      <img src="@/assets/imgs/portafolio-cop-3.jpg" alt="" class="img-portafolio">
    </a>
    <div class="navegacion">
      <router-link 
      class="nav-boton" 
      to="/marketing-design/luxji">[previous]</router-link>
      <router-link 
      class="nav-boton" 
      to="/marketing-design/expediciones-trotamundos">[next]</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CentroOpticoProfesional',
}
</script>

<style lang="scss">
.centro-optico-profesional {
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