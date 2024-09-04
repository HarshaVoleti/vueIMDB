<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card theme="dark">
      <v-card-title>Add Genre</v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="isFormValid">
          <!-- Name Input -->
          <v-text-field
            variant="solo"
            required
            clearable
            label="Name"
            v-model="genre.name"
            :rules="[requiredRule]"
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" @click="closeDialog">Cancel</v-btn>
        <v-btn color="primary" @click="saveGenre">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      genre: {
        id: 0, // Default value for id
        name: "", // Name of the genre
      },
      isFormValid: false,
      dialog: false,
      requiredRule: (value) => !!value || "This field is required",
    };
  },
  methods: {
    openDialog() {
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
    },
    saveGenre() {
      if (this.isFormValid) {
        // Prepare the data to be sent to the API
        const genreData = {
          id: 0, // id is set to 0 as per requirement
          name: this.genre.name,
        };

        this.$store.dispatch("addGenre", genreData);
        this.$emit("genre-added", genreData);
        this.closeDialog();
      }
    },
  },
};
</script>
