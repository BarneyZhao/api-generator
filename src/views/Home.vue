<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <Main></Main>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Main from '@/components/Main.vue'; // @ is an alias to /src

export default Vue.extend({
  name: 'home',
  components: {
    Main,
  },
});
</script>

<style scoped lang="less">
.home {
  padding: 2rem;
}
</style>
