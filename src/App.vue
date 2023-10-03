<template>
  <RouterView />
</template>

<style lang="scss">
@import '@/scss/app.scss';

.oxxo,
.circuito-exterior-mexiquense,
.bibiki,
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
    .container {
      background: transparent;
      .color-red {
        display: flex;
        justify-content: center;
      }
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
            @media (min-width: 768px) {
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
          @media (min-width: 768px) {
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
        @media (min-width: 768px) {
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
            // background: red;
            color: #fff;
            width: 40px;
            height: 40px;
            border-radius: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
            &.bg-red {
              background: red;
            }
            &.bg-darkblue {
              background: darkblue;
            }
            &.bg-lightskyblue {
              background: lightskyblue;
            }
            &.bg-lightseagreen {
              background: lightseagreen;
            }
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
        @media (min-width: 768px) {
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
          @media (min-width: 768px) {
            width: 45%;
            top: 60px;
          }
        }
        .post-video {
          position: relative;
          width: 80%;
          display: block;
          margin: auto;
          top: 40px;
          @media (min-width: 768px) {
            width: 640px;
            height: 360px;
            top: 60px;
          }
        }
      }
    }
  }
}

.luxji,
.centro-optico-profesional,
.expediciones-trotamundos,
.tulumers {
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
  .contenedor {
    background: white;
    .color-red {
      display: flex;
      justify-content: center;
    }
  }
}

.color-white {
  color: #fff;
  text-decoration: none;
  &:hover {
    font-weight: bold;
  }
}
// header {
//   line-height: 1.5;
//   max-height: 100vh;
// }

// .logo {
//   display: block;
//   margin: 0 auto 2rem;
// }

// nav {
//   width: 100%;
//   font-size: 12px;
//   text-align: center;
//   margin-top: 2rem;
// }

// nav a.router-link-exact-active {
//   color: var(--color-text);
// }

// nav a.router-link-exact-active:hover {
//   background-color: transparent;
// }

// nav a {
//   display: inline-block;
//   padding: 0 1rem;
//   border-left: 1px solid var(--color-border);
// }

// nav a:first-of-type {
//   border: 0;
// }

// @media (min-width: 1024px) {
//   header {
//     display: flex;
//     place-items: center;
//     padding-right: calc(var(--section-gap) / 2);
//   }

//   .logo {
//     margin: 0 2rem 0 0;
//   }

//   header .wrapper {
//     display: flex;
//     place-items: flex-start;
//     flex-wrap: wrap;
//   }

//   nav {
//     text-align: left;
//     margin-left: -1rem;
//     font-size: 1rem;

//     padding: 1rem 0;
//     margin-top: 1rem;
//   }
// }
</style>
