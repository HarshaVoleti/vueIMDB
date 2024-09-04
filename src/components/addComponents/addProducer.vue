<template>
  <v-dialog v-model="dialog" theme="dark" max-width="500px">
    <v-card bg-color="black">
      <v-card-title>Add Producer</v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="isFormValid">
          <!-- Name Input -->
          <v-text-field
            variant="solo"
            required
            clearable
            label="Name"
            bg-color="grey-darken-4"
            v-model="producer.name"
            :rules="[requiredRule]"
          ></v-text-field>
          <!-- Gender Input -->
          <v-select
            variant="solo"
            required
            clearable
            label="Gender"
            bg-color="grey-darken-4"
            v-model="producer.gender"
            :items="['Male', 'Female', 'Other']"
            :rules="[requiredRule]"
          ></v-select>
          <!-- Date of Birth Input -->
          <v-dialog ref="dateDialog" v-model="dateDialog" width="290px" persistent>
            <template v-slot:activator>
              <v-text-field
                v-model="formattedDate"
                label="Date of Birth"
                readonly
                bg-color="grey-darken-4"
                variant="solo"
                required
                clearable
                @click="dateDialog = true"
                :rules="[requiredRule]"
              ></v-text-field>
            </template>
            <v-date-picker
              variant="solo"
              required
              clearable
              bg-color="grey-darken-4"
              v-model="producer.dob"
              @update:modelValue="onDateSelected"
              @change="dateDialog = false"
            ></v-date-picker>
          </v-dialog>
          <!-- Bio Input -->
          <v-textarea
            variant="solo"
            required
            clearable
            label="Bio"
            bg-color="grey-darken-4"
            v-model="producer.bio"
            :rules="[requiredRule]"
          ></v-textarea>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" @click="closeDialog">Cancel</v-btn>
        <v-btn color="primary" @click="saveProducer">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      producer: {
        id: 0, // Default value for id
        name: "",
        gender: "",
        dob: null, // ISO format date stored here
        bio: "",
      },
      isFormValid: false,
      dialog: false,
      dateDialog: false,
      requiredRule: (value) => !!value || "This field is required",
    };
  },
  computed: {
    // Computed property to format the date in dd-mm-yyyy format
    formattedDate() {
      if (!this.producer.dob) return "";

      const date = new Date(this.producer.dob);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();

      return `${day}-${month}-${year}`;
    },
  },
  methods: {
    openDialog() {
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
    },
    saveProducer() {
      if (this.isFormValid) {
        // Prepare the data to be sent to the API
        const producerData = {
          id: 0, // id is set to 0 as per requirement
          name: this.producer.name,
          gender: this.producer.gender,
          dateOfBirth: this.producer.dob, // ISO date format
          bio: this.producer.bio,
        };

        this.$store.dispatch("addProducer", producerData);
        this.$emit("producer-added", producerData);
        this.closeDialog();
        (this.producer = {
          id: 0,
          name: "",
          gender: "",
          dob: null,
          bio: "",
        }),
          (this.isFormValid = false);
      }
    },
    onDateSelected(date) {
      this.producer.dob = date;
      this.dateDialog = false;
    },
  },
};
</script>
