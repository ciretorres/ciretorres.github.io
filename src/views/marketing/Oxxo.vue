<template>
  <div class="oxxo">
    <div class="portafolio">
      <img src="@/assets/imgs/header-oxxo.png" alt="" class="img-portafolio">
      <div class="container contenido">
        <div class="contenedor-link">
          <a href="https://www.oxxo.com/" class="logo-link"><img src="@/assets/imgs/logo-oxxo.png" alt="" class="logo-img"></a>
        </div>
        <div class="navegacion">
          <router-link class="nav-boton" to="/marketing/loreto-fish">[previous]</router-link>
          <router-link class="nav-boton" to="/marketing/cem">[next]</router-link>
        </div>
        <div class="redes-sociales">
          <div style="display:flex;justify-content:space-between">
            <span class="icon icon-github"></span>
            <span class="icon icon-github"></span>
            <span class="icon icon-github"></span>
          </div>
        </div>
        <!-- <div class="posts">

        </div>
        <div class="navegacion">
          <router-link class="nav-boton" to="/marketing/loreto-fish">[previous]</router-link>
          <router-link class="nav-boton" to="/marketing/cem">[next]</router-link>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Oxxo',
}
</script>

<style lang="scss" scoped>
.oxxo {
  width: 100%;
  height: 100%;
  .portafolio {
    background: #f5f5f5;
    width: 100%;
    height: 500px;
    .img-portafolio {
      position: absolute;
      width: 100%;
      vertical-align: middle;
      border: 0;
    }
    .contenido {
      position: relative;
      background: red;
      max-width: 768px;
      height: 100%;
      margin-top: 0px;
      .contenedor-link {
        width: 100%;
        position: relative;        
        text-align: center;
        .logo-link {
          width: 100%;
          .logo-img {
            position: relative;
            width: 60%;
            top: 40px;
            @media (min-width:768px) {
              width: 45%;
              top: 60px;
            }
          }
        }
      }
      .navegacion {
        position: relative;
        display: flex;
        justify-content: center;
        top: 60px;
        .nav-boton {
          font-size: 24px;
          font-weight: 700;
          color: #000;
          padding: 24px;
          @media (min-width:768px) {
            padding: 40px;
          }
          &:hover {
            background: #000;
            color: #fff;
          }
        }
      }
      .redes-sociales {
        width: 60%;
        position: relative;
        display: block;
        margin: auto;
        top: 60px;
        background: #000;
        font-size: 32px;
        @media (min-width:768px) {
          width: 45%;
          top: 70px;
          
        }
      }
      
    }
    
    
  }
}
</style>