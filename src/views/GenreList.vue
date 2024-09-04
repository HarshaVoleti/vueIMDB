<template>
  <v-container>
    <v-btn class="my-10" @click="openGenreDialog" color="warning"> Add Genre </v-btn>

    <v-row>
      <v-col v-for="genre in genres" :key="genre.id" cols="12" md="4">
        <v-list-item height="50px" rounded style="background-color: gray">
          <template v-slot:append>
            <v-btn
              color="grey-lighten-1"
              icon="mdi-delete"
              variant="text"
              @click.stop="confirmDeleteGenre(genre.id)"
            ></v-btn>
          </template>
          <v-list-item-title>{{ genre.name }}</v-list-item-title>
        </v-list-item>
      </v-col>
    </v-row>

    <add-genre ref="addGenreDialog" @genre-added="handleGenreAdded"></add-genre>

    <!-- Confirmation Dialog -->
    <v-dialog v-model="confirmDialog" max-width="400">
      <v-card>
        <v-card-title class="headline">Confirm Deletion</v-card-title>
        <v-card-text>Are you sure you want to delete this genre?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="deleteGenre">Confirm</v-btn>
          <v-btn color="grey" text @click="closeDialog">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <notification-dialog
      ref="notificationDialog"
      :title="notificationTitle"
      :message="notificationMessage"
      @dialog-closed="fetchGenresList"
    ></notification-dialog>
  </v-container>
</template>

<script>
import addGenre from "../components/addComponents/addGenre.vue";
import NotificationDialog from "@/components/NotificationDialog.vue";

export default {
  components: {
    addGenre,
    NotificationDialog,
  },
  data() {
    return {
      genres: [],
      confirmDialog: false,
      genreIdToDelete: null,
      notificationTitle: "",
      notificationMessage: "",
    };
  },
  methods: {
    fetchGenresList() {
      this.$store.dispatch("fetchGenres").then(() => {
        this.genres = this.getGenres;
      });
    },
    handleGenreAdded(success, message) {
      this.notificationTitle = success ? "Success" : "Error";
      this.notificationMessage = message;
      this.$refs.notificationDialog.openDialog();
    },
    openGenreDialog() {
      this.$refs.addGenreDialog.openDialog();
    },
    confirmDeleteGenre(id) {
      this.genreIdToDelete = id;
      this.confirmDialog = true;
    },
    closeDialog() {
      this.confirmDialog = false;
      this.genreIdToDelete = null;
    },
    deleteGenre() {
      if (this.genreIdToDelete !== null) {
        this.$store
          .dispatch("deleteGenre", this.genreIdToDelete)
          .then(() => {
            this.handleGenreAdded(true, "Producer deleted successfully.");
          })
          .catch((error) => {
            this.handleGenreAdded(false, error.message || "Error deleting producer.");
          })
          .finally(() => {
            this.closeDialog();
          });
      }
    },
  },
  computed: {
    getGenres() {
      return this.$store.getters.getGenres;
    },
  },
  beforeCreate() {
    this.$store.dispatch("fetchGenres").then(() => {
      this.genres = this.getGenres;
    });
  },
};
</script>
