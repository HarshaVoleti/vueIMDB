<template>
  <div>
    <v-container>
      <v-btn class="my-5 mx-5" @click="openActorDialog" color="warning">
        Add Actor
      </v-btn>
      <v-row>
        <v-col v-for="actor in actors" :key="actor.id" cols="12" md="4">
          <v-list-item
            height="100px"
            rounded
            style="background-color: gray; color: white"
          >
            <template v-slot:append>
              <v-btn
                color="grey-lighten-1"
                icon="mdi-delete"
                variant="text"
                @click.stop="confirmDeleteActor(actor.id)"
              ></v-btn>
            </template>
            <v-list-item-title>{{ actor.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ actor.bio }}</v-list-item-subtitle>
          </v-list-item>
        </v-col>
      </v-row>

      <!-- Add Actor Dialog -->
      <add-actor ref="addActorDialog" @actor-added="handleActorAdded"></add-actor>

      <!-- Confirmation Dialog -->
      <v-dialog v-model="confirmDialog" max-width="400">
        <v-card>
          <v-card-title class="headline">Confirm Deletion</v-card-title>
          <v-card-text>Are you sure you want to delete this actor?</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" text @click="deleteActor">Confirm</v-btn>
            <v-btn color="grey" text @click="closeDialog">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Notification Dialog -->
      <notification-dialog
        ref="notificationDialog"
        :title="notificationTitle"
        :message="notificationMessage"
        @dialog-closed="fetchActorsList"
      ></notification-dialog>
    </v-container>
  </div>
</template>

<script>
import addActor from "@/components/addComponents/addActor.vue";
import NotificationDialog from "@/components/NotificationDialog.vue";

export default {
  data() {
    return {
      actors: [],
      confirmDialog: false,
      actorIdToDelete: null,
      notificationTitle: "",
      notificationMessage: "",
    };
  },
  components: {
    addActor,
    NotificationDialog,
  },
  methods: {
    openActorDialog() {
      this.$refs.addActorDialog.openDialog();
    },
    handleActorAdded(success, message) {
      this.notificationTitle = success ? "Success" : "Error";
      this.notificationMessage = message;
      this.$refs.notificationDialog.openDialog();
    },
    fetchActorsList() {
      this.actors = this.getActors;
    },
    confirmDeleteActor(id) {
      this.actorIdToDelete = id;
      this.confirmDialog = true;
    },
    closeDialog() {
      this.confirmDialog = false;
      this.actorIdToDelete = null;
    },
    deleteActor() {
      if (this.actorIdToDelete !== null) {
        this.$store
          .dispatch("deleteActor", this.actorIdToDelete)
          .then(() => {
            this.handleActorAdded(true, "Actor deleted successfully.");
          })
          .catch((error) => {
            this.handleActorAdded(false, error.message || "Error deleting actor.");
          })
          .finally(() => {
            this.closeDialog();
          });
      }
    },
  },
  computed: {
    getActors() {
      return this.$store.getters.getActors;
    },
  },
  beforeCreate() {
    this.$store.dispatch("fetchActors").then(() => {
      this.actors = this.getActors;
    });
  },
};
</script>
