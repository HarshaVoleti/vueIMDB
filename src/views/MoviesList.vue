<template>
  <v-container fluid class="moviesList mb-10">
    <v-container fluid class="select-container py-0 d-flex align-end justify-end">
      <v-text-field
        prepend-inner-icon="mdi-magnify"
        hide-details
        clearable
        rounded
        v-model="query"
        @input="handleSearch"
        class="my-5"
        bg-color="grey-darken-4"
        variant="solo"
        color="transparent"
        placeholder="Search"
      ></v-text-field>
      <v-select
        class="select-box my-5 ml-5"
        v-model="selectedGenre"
        :items="genres"
        hide-details
        rounded
        base-color="transparent"
        color="transparent"
        item-color="black"
        :item-props="itemProps"
      >
      </v-select>
    </v-container>
    <v-row>
      <v-col
        class="d-flex justify-center"
        v-for="movie in filteredMovies"
        :key="movie.id"
        col="3"
        lg="3"
        md="4"
        sm="12"
        xs="12"
      >
        <v-card
          height="400px"
          width="250px"
          class="moviecard d-flex align-end"
          :style="{
            backgroundImage: `url(${movie.posterURL})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            alignItems: 'end',
          }"
        >
          <v-card-item
            class="title-background"
            :style="{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }"
          >
            <v-card-title class="title-text">{{ movie.name }}</v-card-title>
          </v-card-item>
          <div class="hover-buttons">
            <v-btn class="my-3" @click="openMovieDialog(movie, false)" color="#007bff"
              >View Details</v-btn
            >
            <v-btn class="my-3" @click="goToEditMovie(movie)" color="#ffc107">Edit</v-btn>
            <v-btn class="my-3" @click="openConfirmDialog(movie)" color="#dc3545"
              >Delete</v-btn
            >
          </div>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-if="currentmovie != null" v-model="ismoviedialogopen">
      <v-card>
        <v-card-title>
          <span class="headline">{{ currentmovie.name }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" md="4">
                <v-img :src="currentmovie.posterURL" aspect-ratio="1"></v-img>
              </v-col>
              <v-col cols="12" md="8">
                <v-row>
                  <v-col cols="12">
                    <h3>Plot</h3>
                    <p>{{ currentmovie.plot }}</p>
                  </v-col>
                  <v-col cols="12">
                    <h3>Year of Release</h3>
                    <p>{{ currentmovie.yearOfRelease }}</p>
                  </v-col>
                  <v-col cols="12">
                    <h3>Genres</h3>
                    <p>{{ currentmovie.genres.map((genre) => genre.name).join(", ") }}</p>
                  </v-col>
                  <v-col cols="12">
                    <h3>Actors</h3>
                    <p>{{ currentmovie.actors.map((actor) => actor.name).join(", ") }}</p>
                  </v-col>
                  <v-col cols="12">
                    <h3>Producer</h3>
                    <p>{{ currentmovie.producer.name }}</p>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn v-if="isEditing" @click="openConfirmDialog()">Edit</v-btn>
          <v-btn @click="closeDialog()">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-if="isConfirmDialogOpen" v-model="isConfirmDialogOpen" max-width="500px">
      <v-card>
        <v-card-title
          >Are you sure you want to {{ isEditing ? "Edit" : "Delete" }}this
          movie?</v-card-title
        >
        <v-card-actions>
          <v-btn @click="isEditing ? editMovie() : deleteMovie()">Sure</v-btn>
          <v-btn @click="closeDialog()">No</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <notification-dialog
      ref="notificationDialog"
      :title="notificationTitle"
      :message="notificationMessage"
      @dialog-closed="fetchMoviesList"
    ></notification-dialog>
  </v-container>
</template>

<script>
import { formToJSON } from "axios";
import NotificationDialog from "../components/NotificationDialog.vue";
export default {
  data() {
    return {
      movies: [],
      genres: [],
      selectedGenre: { id: 1, name: "All" },
      filteredMovies: [],
      count: 0,
      query: "",
      isEditing: false,
      ismoviedialogopen: false,
      isConfirmDialogOpen: false,
      currentmovie: {},
      notificationTitle: "",
      notificationMessage: "",
    };
  },
  components: {
    NotificationDialog,
  },
  methods: {
    itemProps(item) {
      return {
        title: item.name,
      };
    },
    handleSearch() {
      if ((this.query = "")) {
        this.filteredMovies = this.movies;
      } else {
        this.filteredMovies = this.movies.filter((movie) =>
          movie.name.includes(this.query)
        );
      }
    },
    handleMovieDelete(success, message) {
      this.notificationTitle = success ? "Success" : "Error";
      this.notificationMessage = message;
      this.$refs.notificationDialog.openDialog();
    },
    fetchMoviesList() {
      this.$store.dispatch("fetchMovies").then(() => {
        this.movies = this.getMovies;
        this.filteredMovies = this.movies;
      });
    },
    filterMovies() {
      this.count++;
      console.log(
        ` this selected genre is ${this.selectedGenred} pressed with ${this.count}`
      );
      if (this.selectedGenre.name === "All") {
        this.filteredMovies = this.movies;
      } else {
        if (this.selectedGenre) {
          this.filteredMovies = this.movies.filter((movie) =>
            movie.genres.some((genre) => genre.name === this.selectedGenre.name)
          );
        } else {
          // If no genre is selected, show all movies
          this.filteredMovies = this.movies;
        }
      }
    },
    goToEditMovie(movie) {
      this.$router.push({ name: `edit-movie`, params: { id: movie.id } });
    },
    openMovieDialog(movie, isEditing) {
      this.isEditing = isEditing;
      this.currentmovie = movie;
      this.ismoviedialogopen = true;
      console.log("Movie Dialog Opened with editing" + isEditing);
    },
    openConfirmDialog(movie) {
      this.currentmovie = movie;
      this.isConfirmDialogOpen = true;
    },
    closeDialog() {
      this.isConfirmDialogOpen = false;
      console.log("Movie Dialog Closed");
      this.ismoviedialogopen = false;
      console.log("Movie Dialog Closed 1");
      this.isEditing = false;
      console.log("Movie Dialog Closed 2");
      this.currentmovie = null;
      console.log("Movie Dialog Closed 3");
    },
    deleteMovie() {
      console.log("Delete Movie" + this.currentmovie.name);
      this.$store.dispatch("deleteMovie", this.currentmovie.id).then(() => {
        this.handleMovieDelete(true, "Movie deleted successfully.");
      });
      this.closeDialog();
    },
  },
  watch: {
    selectedGenre: function (val, oldval) {
      console.log(val + " " + oldval);
      this.filterMovies();
    },
  },
  computed: {
    getMovies() {
      return this.$store.getters.getMovies;
    },
    getGenres() {
      return this.$store.getters.getGenres;
    },
  },
  beforeCreate() {
    this.$store.dispatch("fetchMovies").then(() => {
      this.movies = this.getMovies;
      this.filteredMovies = this.movies;
    });
    this.$store.dispatch("fetchGenres").then(() => {
      this.genres = [{ id: 1, name: "All" }, ...this.getGenres];
    });
  },
};
</script>

<style scoped>
.moviesList {
  margin: 0px;
  padding: 0px;
}

.cardclass {
  background-color: brown;
  border: 1px solid black;
}

.moviecard {
  align-items: center;
  background-color: black;
  height: 400px;
}

.title-background {
  justify-content: center;
  width: 100%;
}

.title-text {
  color: white;
  font-weight: 700;
}

.select-container {
  align-items: end;
  display: flex;
  justify-self: end;
  border-bottom: 0px !important;
}

.select-box {
  width: 200px;
  max-width: 200px;
  color: #ffffff;
  background-color: #212121;
  border-radius: 25px;
  border-bottom: 0px !important;
  /* margin: 20px 40px 20px 40px; */
}

.select-box .v-field__outline {
  display: none;
}

/* Hide the bottom border if it's applied directly */
.select-box .v-input__control {
  border-bottom: none !important;
}

/* Hide the focused underline */
.select-box .v-field__overlay::after {
  display: none;
}

.hover-buttons {
  width: 100%;
  height: 100%;
  display: none;
  position: absolute;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
}

.moviecard:hover {
  transform: scale(1.05);
}

.moviecard:hover .hover-buttons {
  display: flex;
}

.v-field__outline {
  display: none;
}

.v-select .v-select__selections input .v-field__outline {
  display: none;
}
</style>
