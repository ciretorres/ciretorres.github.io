<template>
  <div class="inicio container" style="padding:40px">
    <!-- {{ msg }} -->
    <p>
      Hello! My name is <span style="color:#20d6d6;font-weight:bolder;">Eric</span>. 
      Visualization designer
    </p>
    <p>
      I'm interested in art, data & systems to build better things for this
      freak world.
    </p>
    <p>
      Currently, I'm working on my 
      <span style="color:#d33682;font-weight:bolder;">[Master Degree's Information Design & Visualization]</span> 
      in the beautiful <a href="https://goo.gl/ba2zp3" target="_blank" style="color:#d33682;font-weight:bolder;">México City<span class="icon icon-external-link"></span></a> 
      looking for new challengues.
    </p>
    <p>Some of my <span style="color:#20d6d6;font-weight:bolder;">recent personal proyects!</span></p>
    <ul>
      <li>Visualization <router-link style="color:#fcffd0;font-weight:bolder;" to="/design">[Design]</router-link></li>      
      <li>Web <router-link style="color:#fcffd0;font-weight:bolder;" to="/development">[Development]</router-link></li>
      <li>Social <router-link style="color:#fcffd0;font-weight:bolder;" to="/marketing">[Marketing]</router-link></li>
    </ul>
    <p>Let's chat -> <span style="color:#d33682;font-weight:bolder;">WhatsApp</span><span class="icon" data-icon="c"></span></p>
    <p>Or check my code -> <span style="color:#d33682;font-weight:bolder;">Github</span><span class="icon icon-github"></span></p>
    <p>And my work -> <span style="color:#d33682;font-weight:bolder;">Behance</span><span class="icon" data-icon="b"></span></p>
    
    
    
  </div>
</template>

<script>
export default {
  name: "Inicio",
  props: {
    msg: String,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
$gap: 30px;
.container {
  background: rgba($color: #fff, $alpha: 0.05);
  // width: calc(100% - #{$gap*2});
  width: calc(100% - 60px);
  // max-width: map-get($width, "max-view");
  max-width: 1024px;
  max-width: 800px;
  border: 1px solid rgba($color: #fff, $alpha: 0.1);
  border-radius: 8px;
  margin-left: auto;
  margin-right: auto;
}
// h3 {
//   margin: 40px 0 0;
// }
// ul {
//   list-style-type: none;
//   padding: 0;
// }
// li {
//   display: inline-block;
//   margin: 0 10px;
// }
// a {
//   color: #42b983;
// }
</style>
