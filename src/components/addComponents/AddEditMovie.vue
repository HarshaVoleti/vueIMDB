<template>
  <v-overlay :model-value="showOverlay">
    <v-container
      fluid
      class="d-flex flex-column align-center justify-center"
      style="height: 100vh; width: 100vw"
    >
      <v-progress-circular
        color="primary"
        size="64"
        v-if="loading"
        indeterminate
      ></v-progress-circular>
      <h1 class="text-center mt-4" style="color: white">{{ message }}</h1>
    </v-container>
  </v-overlay>

  <v-container fluid min-height="100vh">
    <v-row class="py-0 d-flex align-center justify-center">
      <v-col cols="12" lg="8" md="8" sm="10" xs="10">
        <h1 class="my-10 text-center" style="color: white">
          {{ isEditing ? "Edit Movie" : "Add a Movie" }}
        </h1>
        <v-form ref="form" v-model="isFormValid" class="form-group">
          <v-text-field
            required
            clearable
            class="form-control mb-5"
            bg-color="grey-darken-4"
            variant="solo"
            label="Movie Name"
            v-model="movie.name"
            :rules="[requiredRule]"
          ></v-text-field>
          <v-text-field
            required
            clearable
            col="10"
            class="mb-5"
            bg-color="grey-darken-4"
            variant="solo"
            label="Year of release"
            v-model="movie.yearOfRelease"
            :rules="[requiredRule, yearRule]"
          ></v-text-field>
          <v-file-input
            required
            show-size
            accept="image/*"
            label="Poster ( preferred 4:5 )"
            prepend-icon="mdi-camera"
            variant="solo"
            bg-color="grey-darken-4"
            v-model="newPoster"
            @change="previewImage"
            :rules="[requiredRule]"
          ></v-file-input>
          <v-img
            v-if="previewPosterURL"
            :src="previewPosterURL"
            max-width="200"
            aspect-ratio="4/5"
            class="my-4"
          ></v-img>
          <v-textarea
            required
            label="Plot"
            variant="solo"
            bg-color="grey-darken-4"
            v-model="movie.plot"
            :rules="[requiredRule]"
          ></v-textarea>
          <v-select
            label="Actors"
            multiple
            bg-color="grey-darken-4"
            variant="solo"
            :items="actors"
            :item-props="itemProps"
            v-model="selectedactors"
            :rules="[requiredRule, minTwoRule]"
          >
            <template v-slot:append>
              <v-btn @click="openActorDialog" color="warning">
                <!-- <v-icon icon="mdi-add" start></v-icon> -->
                Add Actor
              </v-btn>
            </template>
          </v-select>

          <v-select
            required
            chips
            label="Genres"
            multiple
            bg-color="grey-darken-4"
            variant="solo"
            :items="genres"
            :item-props="itemProps"
            v-model="selectedgenres"
            :rules="[requiredRule, minTwoRule]"
          >
            <template v-slot:append>
              <v-btn @click="openGenreDialog" color="warning"> Add Genre </v-btn>
            </template>
          </v-select>
          <v-select
            required
            chips
            clearable
            label="Producer"
            bg-color="grey-darken-4"
            variant="solo"
            :items="producers"
            :item-props="itemProps"
            v-model="selectedproducer"
            :rules="[requiredRule]"
          >
            <template v-slot:append>
              <v-btn @click="openProducerDialog" color="warning"> Add Producer </v-btn>
            </template>
          </v-select>
          <v-btn :loading="loading" @click="validateForm" color="primary"
            >Add Movie</v-btn
          >
        </v-form>
      </v-col>
    </v-row>
    <notification-dialog
      ref="movienotificationDialog"
      :title="notificationTitle"
      :message="notificationMessage"
      @dialog-closed="handleDialog"
    ></notification-dialog>
    <notification-dialog
      ref="notificationDialog"
      :title="notificationTitle"
      :message="notificationMessage"
      @dialog-closed="fetchOptions"
    ></notification-dialog>
    <add-actor ref="addActorDialog" @actor-added="handleAdded"></add-actor>
    <!-- Add Producer Dialog -->
    <add-producer ref="addProducerDialog" @producer-added="handleAdded"></add-producer>
    <!-- Add Genre Dialog -->
    <add-genre ref="addGenreDialog" @genre-added="handleAdded"></add-genre>
  </v-container>
</template>

<script>
import addActor from "./addActor.vue";
import addProducer from "./addProducer.vue";
import addGenre from "./addGenre.vue";
import { storage } from "@/../firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { mapGetters } from "vuex";
import NotificationDialog from "@/components/NotificationDialog.vue";

export default {
  components: {
    addActor,
    addProducer,
    addGenre,
    NotificationDialog,
  },
  data() {
    return {
      showOverlay: false,
      message: "",
      movie: {
        id: 0,
        name: "",
        yearOfRelease: null,
        plot: "",
        posterURL: "",
        producerId: null,
        actorIds: [],
        genreIds: [],
      },
      loading: false,
      selectedactors: [],
      selectedgenres: [],
      selectedproducer: null,
      progress: 0,
      newPoster: null,
      previewPosterURL: "",
      isEditing: false,
      actors: [],
      genres: [],
      fetchingdata: false,
      producers: [],
      isFormValid: false,
      isDialogOpen: false,
      dialogType: "none",
      requiredRule: (value) => !!value || "This field is required",
      minTwoRule: (value) => value.length >= 2 || "Select at least 2 items",
      yearRule: (v) => {
        const currentYear = new Date().getFullYear();
        return (
          (v && /^\d{4}$/.test(v) && v >= 1900 && v <= currentYear) ||
          `Please enter a valid year between 1900 and ${currentYear}`
        );
      },
    };
  },
  methods: {
    handleMovieFunction(success, message) {
      this.notificationTitle = success ? "Success" : "Error";
      this.notificationMessage = message;
      this.$refs.movienotificationDialog.openDialog();
    },
    handleAdded(success, message) {
      this.notificationTitle = success ? "Success" : "Error";
      this.notificationMessage = message;
      this.fetchingdata = true;
      this.$refs.notificationDialog.openDialog();
    },
    fetchOptions() {
      this.$store.dispatch("fetchActors").then(() => {
        this.actors = this.getactors;
      });
      this.$store.dispatch("fetchGenres").then(() => {
        this.genres = this.getgenres;
      });
      this.$store.dispatch("fetchProducers").then(() => {
        this.producers = this.getproducers;
      });
    },
    openActorDialog() {
      this.$refs.addActorDialog.openDialog();
    },
    openProducerDialog() {
      this.$refs.addProducerDialog.openDialog();
    },
    openGenreDialog() {
      this.$refs.addGenreDialog.openDialog();
    },
    closeOverlay() {
      (this.message = ""), (this.showOverlay = false);
      this.loading = false;
    },
    itemProps(item) {
      return {
        title: item.name,
        subtitle: item.id,
      };
    },
    openDialog(dialogType) {
      this.isDialogOpen = true;
      this.dialogType = dialogType;
    },
    closeDialog() {
      this.isDialogOpen = false;
      this.dialogType = "none";
    },
    previewImage() {
      if (this.newPoster) {
        this.previewPosterURL = URL.createObjectURL(this.newPoster);
      } else {
        this.previewPosterURL = this.movie.posterURL || "";
      }
    },
    handleDialog() {
      this.$router.push("/").then(() => {
        this.$root.$emit("fetchMovies");
      });
    },
    async validateForm() {
      this.$refs.form.validate();
      if (this.isFormValid) {
        this.loading = true;
        this.showOverlay = true;
        if (this.newPoster) {
          try {
            const downloadURL = await this.uploadimage();
            this.movie.posterURL = downloadURL;
            this.movie.actorIds = this.selectedactors.map((a) => a.id);
            this.movie.genreIds = this.selectedgenres.map((g) => g.id);
            this.movie.producerId = this.selectedproducer.id;
            if (this.isEditing) {
              this.$store.dispatch("editMovie", this.movie).then(() => {
                this.handleMovieFunction(true, "Movie edited successfully.");
              });
            } else {
              this.$store.dispatch("addMovie", this.movie).then(() => {
                this.handleMovieFunction(true, "Movie added successfully.");
              });
            }
          } catch (error) {
            this.errorMessage = "Error processing the movie: " + error.message;
            this.loading = false;
          } finally {
          }
        } else {
          this.errorMessage = "Please upload a poster image.";
        }
      } else {
        console.log("Form is invalid.");
      }
    },
    async uploadimage() {
      this.loading = true;
      return new Promise((resolve, reject) => {
        const storageRef = ref(storage, `posters/${this.newPoster.name}`);
        const uploadTask = uploadBytesResumable(storageRef, this.newPoster);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            this.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          },
          (error) => {
            this.errorMessage = "Image Upload Failed";
            this.loading = false;
            reject(error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(downloadURL);
            } catch (error) {
              this.errorMessage = "Failed to get download URL";
              this.loading = false;
              reject(error);
            } finally {
              this.loading = false;
            }
          }
        );
      });
    },
    clearError() {
      this.$store.commit("SET_ERROR", "");
    },
    editMovie() {},
  },
  watch: {
    errorMessage(newVal) {
      if (newVal) {
        this.showOverlay = true;
        this.message = newVal;
      }
    },
    successMessage(newVal) {
      if (newVal) {
        this.showOverlay = true;
        this.message = newVal;
      }
    },
  },
  computed: {
    getactors() {
      return this.$store.getters.getActors;
    },
    getgenres() {
      return this.$store.getters.getGenres;
    },
    getproducers() {
      return this.$store.getters.getProducers;
    },
    getmovie() {
      return this.$store.getters.getMovie;
    },
    getError() {
      return this.$store.getters.error;
    },
    ...mapGetters({
      errorMessage: "notifications/errorMessage",
      successMessage: "notifications/successMessage",
      actors: "getActors",
      genres: "getGenres",
      producers: "getProducers",
    }),
  },
  mounted() {
    this.$store.dispatch("fetchActors").then(() => {
      this.actors = this.getactors;
    });
    this.$store.dispatch("fetchGenres").then(() => {
      this.genres = this.getgenres;
    });
    this.$store.dispatch("fetchProducers").then(() => {
      this.producers = this.getproducers;
    });
    const movieId = this.$route.params.id;
    if (movieId) {
      console.log("Movie Id" + movieId);
      this.$store.dispatch("fetchMovie", movieId).then(() => {
        const editingmovie = this.getmovie;
        this.selectedactors = editingmovie.actors;
        this.selectedgenres = editingmovie.genres;
        this.selectedproducer = editingmovie.producer;
        this.movie.name = editingmovie.name;
        this.movie.plot = editingmovie.plot;
        this.movie.id = editingmovie.id;
        this.movie.posterURL = editingmovie.posterURL;
        this.movie.yearOfRelease = editingmovie.yearOfRelease;
        this.previewPosterURL = editingmovie.posterURL;
        this.isEditing = true;
      });
    }
    if (this.isEditing && this.movie.posterURL) {
      this.previewPosterURL = this.movie.posterURL;
    }
  },
};
</script>
