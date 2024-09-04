<template>
  <div>
    <v-container>
      <v-btn class="my-5 mx-5" @click="openProducerDialog" color="warning">
        Add Producer
      </v-btn>
      <v-row>
        <v-col v-for="producer in producers" :key="producer.id" cols="12" md="4">
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
                @click.stop="confirmDeleteProducer(producer.id)"
              ></v-btn>
            </template>
            <v-list-item-title>{{ producer.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ producer.bio }}</v-list-item-subtitle>
          </v-list-item>
        </v-col>
      </v-row>

      <!-- Add Producer Dialog -->
      <add-producer
        ref="addProducerDialog"
        @producer-added="handleProducerAdded"
      ></add-producer>

      <!-- Confirmation Dialog -->
      <v-dialog v-model="confirmDialog" max-width="400">
        <v-card>
          <v-card-title class="headline">Confirm Deletion</v-card-title>
          <v-card-text>Are you sure you want to delete this producer?</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" text @click="deleteProducer">Confirm</v-btn>
            <v-btn color="grey" text @click="closeDialog">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Notification Dialog -->
      <notification-dialog
        ref="notificationDialog"
        :title="notificationTitle"
        :message="notificationMessage"
        @dialog-closed="fetchProducersList"
      ></notification-dialog>
    </v-container>
  </div>
</template>

<script>
import addProducer from "@/components/addComponents/addProducer.vue";
import NotificationDialog from "@/components/NotificationDialog.vue";

export default {
  data() {
    return {
      producers: [],
      confirmDialog: false,
      producerIdToDelete: null,
      notificationTitle: "",
      notificationMessage: "",
    };
  },
  components: {
    addProducer,
    NotificationDialog,
  },
  methods: {
    openProducerDialog() {
      this.$refs.addProducerDialog.openDialog();
    },
    handleProducerAdded(success, message) {
      this.notificationTitle = success ? "Success" : "Error";
      this.notificationMessage = message;
      this.$refs.notificationDialog.openDialog();
    },
    fetchProducersList() {
      this.producers = this.getProducers;
    },
    confirmDeleteProducer(id) {
      this.producerIdToDelete = id;
      this.confirmDialog = true;
    },
    closeDialog() {
      this.confirmDialog = false;
      this.producerIdToDelete = null;
    },
    deleteProducer() {
      if (this.producerIdToDelete !== null) {
        this.$store
          .dispatch("deleteProducer", this.producerIdToDelete)
          .then(() => {
            this.handleProducerAdded(true, "Producer deleted successfully.");
          })
          .catch((error) => {
            this.handleProducerAdded(false, error.message || "Error deleting producer.");
          })
          .finally(() => {
            this.closeDialog();
          });
      }
    },
  },
  computed: {
    getProducers() {
      return this.$store.getters.getProducers;
    },
  },
  beforeCreate() {
    this.$store.dispatch("fetchProducers").then(() => {
      this.producers = this.getProducers;
    });
  },
};
</script>
