<template>
  <div class="design">
    <div class="container p-2">
      <p class="color-red">[Marketing & Design]</p>
      <ul>        
        <li><router-link target="_blank" class="color-white" to="/development/centro-optico-profesional">Centro Óptico Profesional <span class="color-yellow">[Retail]</span></router-link></li>
        <li><router-link target="_blank" class="color-white" to="/development/expediciones-trotamundos">Expediciones Trotamundos <span class="color-yellow">[Travel]</span></router-link></li>
        <li><router-link class="color-white" to="/marketing/oxxo">OXXO México <span class="color-yellow">{{ arrayMessage.a }}</span></router-link></li>
        <li><router-link class="color-white" to="/marketing/cem">Circuito Exterior Mexiquense <span class="color-yellow">{{ arrayMessage.b }}</span></router-link></li>
        <li><router-link class="color-white" to="/marketing/bibiki">Bibiki <span class="color-yellow">{{ arrayMessage.c }}</span></router-link></li>
        <li><router-link class="color-white" to="/marketing/loreto-fish">Loreto Fish <span class="color-yellow">{{ arrayMessage.d }}</span></router-link></li>
        <li><router-link class="color-white" to="/design/visualization/d3js">Go to <span class="color-yellow">[Vis]</span></router-link></li>
      </ul>
      <router-link class="color-red" to="/">[Back]</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Design',
  data() {
    return {
      public_path: process.env.BASE_URL,
      salutation: ['[Clic me!]', '[No over here]', '[hellou!]', '[yei]'],
      arrayMessage: {
        a: ' ',
        b: ' ',
        c: ' ',
        d: ' ',
        e: ' '
      }
    }
  },
  mounted(){
    setInterval(() => {
      const r = ['a', 'b','c','d']
      let item = r[Math.floor(Math.random() * r.length)]
      this.arrayMessage = {
        a: '',
        b: '',
        c: '',
        d: '',
      }
      let choose = this.salutation[Math.floor(Math.random() * this.salutation.length)]
      this.arrayMessage[item] = choose

    }, 1000);
  }
}
</script>

<style lang="scss" scoped>
.color-white {
  color: #fff;
  text-decoration: none;
}
</style>