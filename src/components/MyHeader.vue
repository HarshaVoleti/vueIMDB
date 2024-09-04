<template>
  <nav>
    <v-app-bar scroll-behavior="hide" color="grey-darken-4">
      <!-- Burger menu icon to open the drawer -->
      <v-app-bar-nav-icon @click="toggleDrawer" v-if="$vuetify.display.smAndDown">
      </v-app-bar-nav-icon>
      <v-app-bar-title class="bold">MovieBox</v-app-bar-title>
      <v-spacer></v-spacer>

      <!-- Navigation buttons visible on larger screens -->
      <template v-if="$vuetify.display.mdAndUp">
        <v-btn text class="d-none d-md-flex" :to="'/'">Home</v-btn>
        <v-btn text class="d-none d-md-flex" :to="'/actors'">Actors</v-btn>
        <v-btn text class="d-none d-md-flex" :to="'/genres'">Genres</v-btn>
        <v-btn text class="d-none d-md-flex" :to="'/producers'">Producers</v-btn>
        <v-btn text class="d-none d-md-flex" to="/add-movie">Add Movie</v-btn>
      </template>

      <!-- Drawer for smaller screens -->
    </v-app-bar>
    <v-navigation-drawer class="bg-grey-darken-4" app v-model="drawer" temporary absolute>
      <v-list-item :to="'/'">
        <v-list-item-title>Home</v-list-item-title>
      </v-list-item>
      <v-list-item :to="'/actors'">
        <v-list-item-title>Actors</v-list-item-title>
      </v-list-item>
      <v-list-item :to="'/genres'">
        <v-list-item-title>Genres</v-list-item-title>
      </v-list-item>
      <v-list-item :to="'/producers'">
        <v-list-item-title>producers</v-list-item-title>
      </v-list-item>
      <v-list-item :to="'/add-movie'">
        <v-list-item-title>Add Movie</v-list-item-title>
      </v-list-item>
    </v-navigation-drawer>
  </nav>
</template>

<script>
export default {
  name: "MyHeader",
  data() {
    return {
      msg: "Welcome to Your Vue.js App",
      drawer: false,
    };
  },
  methods: {
    toggleDrawer() {
      console.log("Movies Modal Opened");
      this.drawer = !this.drawer;
    },
    goToActors() {
      console.log("Actors Page");
      this.$router.push("/actors");
    },
    goToAddMovie() {
      console.log("Add Movie Page");
      this.$router.push("/add-movie");
    },
  },
};
</script>

<style></style>
