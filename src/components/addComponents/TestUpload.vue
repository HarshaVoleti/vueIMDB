<template>
  <div>
    <v-file-input
      rounded
      required
      show-size
      accept="image/*"
      label="Poster ( preferred 4:5 )"
      prepend-icon="mdi-camera"
      variant="solo"
      bg-color="grey-darken-4"
      v-model="newPoster"
    ></v-file-input>
    <v-btn @click="uploadimage">Upload</v-btn>
    <div v-if="uploading" >Progress is {{ progress }}</div>
  </div>
</template>

<script>
import { storage } from "@/../firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export default {
    name : "TestUpload",
  data() {
    return { 
        newPoster: null, 
        uploading: false, 
        progress: 0, 
        downloadURL: null, 
    };
  },
  methods: {
    async uploadimage() {
        console.log("uploading started");
      this.uploading = true;
      console.log("uploading is set to" + this.uploading);
      const storageRef = ref(storage, `posters/${this.newPoster.name}`);
      console.log(storageRef + "is set");
      const uploadTask = uploadBytesResumable(storageRef, this.newPoster);
      console.log("upload tsk is set " + uploadTask);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
            console.log("uploading snaposhot started");
            this.uploading = true;
            this.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("progress is " + this.progress);
            if(this.progress >= 100){
                this.uploading = false;
                console.log("upload done");
            }
        },
        (error) => {
          console.error("Upload failed:", error);
          this.uploading = false;
        },
        () => {
            console.log("getting download URL");
         getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            this.downloadURL = downloadURL;
            console.log("download URL is" + this.downloadURL);
            this.uploading = false;
          });
        }
      );
    },
  },
};
</script>
