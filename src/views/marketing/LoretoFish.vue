<template>
  <div class="loreto-fish">
    <div class="portafolio">
      <img src="@/assets/imgs/header-loreto-fish.png" alt="" class="img-portafolio">
      <div class="container contenido">
        <div class="contenedor-link">
          <a href="https://www.loretofish.com/" class="logo-link">
            <img src="@/assets/imgs/logo-loreto-fish.png" alt="" class="logo-img">
          </a>
        </div>
        <div class="navegacion">
          <router-link class="nav-boton" to="/marketing/bibiki">[previous]</router-link>
          <router-link class="nav-boton" to="/marketing/oxxo">[next]</router-link>
        </div>
        <div class="redes-sociales">
          <div class="flexbox">
            <a href="https://www.facebook.com/loretofish/" target="_blank"><span class="icon icon-facebook"></span></a>
            <a href="https://twitter.com/loretofish_" target="_blank"><span class="icon icon-twitter"></span></a>
            <a href="https://www.instagram.com/loretofish/" target="_blank"><span class="icon icon-instagrem"></span></a>            
          </div>
        </div>
        <div class="posts">
          <img src="@/assets/imgs/post-loreto-fish-1.png" alt="" class="post-img">
        </div>
        <div class="navegacion my-8">
          <router-link class="nav-boton" to="/marketing/bibiki">[previous]</router-link>
          <router-link class="nav-boton" to="/marketing/oxxo">[next]</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoretoFish',
}
</script>

<style lang="scss" scoped>
.loreto-fish {
  width: 100%;
  height: 100%;
  .portafolio {
    background: #f5f5f5;
    width: 100%;
    height: auto;
    .img-portafolio {
      position: absolute;
      width: 100%;
      vertical-align: middle;
      border: 0;
    }
    .contenido {
      position: relative;
      // background: red;
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
        width: 80%;
        position: relative;
        display: block;
        margin: auto;
        top: 80px;
        @media (min-width:768px) {
          width: 45%;
          top: 70px;          
        }
        .flexbox {
          display: flex;
          justify-content: space-between;
          a {
            text-decoration: none;
          }
          .icon {
            position: relative;
            background: lightseagreen;
            color: #fff;
            width: 40px;
            height: 40px;
            border-radius: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
            &:hover {
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
            }
          }
          
        }
      }
      .posts {
        width: 100%;
        position: relative;
        top: 80px;
        @media (min-width:768px) {
          top: 60px;
        }
        .post-img {
          position: relative;
          width: 80%;
          display: block;
          margin: auto;
          top: 40px;
          margin-bottom: 24px;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.7);
          @media (min-width:768px) {
            width: 45%;
            top: 60px;
          } 
        }
      }
    }
  }
}
</style>