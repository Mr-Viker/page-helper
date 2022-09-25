<template>
  <div id="app">
      <Tag />
  </div>
</template>


<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Tag from './tag/index.vue';

@Component({
    components: { Tag },
})
export default class App extends Vue {
  
  
}
</script>


<style lang="scss">
#app {
    padding-top: 36px;
}
</style>
