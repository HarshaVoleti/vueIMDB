<template>
  <v-dialog v-model="visible" max-width="500px">
    <v-card>
      <v-card-title>{{ title }}</v-card-title>
      <v-card-text>{{ message }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="closeDialog">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "Notification",
    },
    message: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      visible: false,
    };
  },
  methods: {
    openDialog() {
      this.visible = true;
    },
    closeDialog() {
      this.visible = false;
      this.$emit("dialog-closed");
    },
  },
};
</script>
