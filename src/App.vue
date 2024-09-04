<template dark>
  <v-layout dark>
    <my-header></my-header>
    <v-main>
      <router-view> </router-view>
      <my-footer></my-footer>
    </v-main>
  </v-layout>
</template>

<script>
import MyHeader from "./components/MyHeader";
import MyFooter from "./components/MyFooter";

export default {
  name: "App",
  data() {
    return {
      drawer: false,
    };
  },
  components: {
    MyHeader,
    MyFooter,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #2c3e50;
  background-color: black;
  margin: 0px;
}
</style>
