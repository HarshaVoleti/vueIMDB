<template>
    <v-footer class="bg-grey-darken-4">
        <v-row justify="center" no-gutters>
            <v-btn v-for="link in links" :key="link" class="mx-2" color="white" rounded="xl" variant="text">
                {{ link }}
            </v-btn>
            <v-col class="text-center mt-4" cols="12">
                <div>
                    <v-btn v-for="icon in icons" :key="icon" :icon="icon" class="mx-4" variant="text"></v-btn>
                </div>
                <div>
                    <p>designed and developed by @Harsha Voleti</p>
                </div>
                <h4 class="my-3">
                    {{ new Date().getFullYear() }} — <strong>Movie Box</strong>
                </h4>

            </v-col>
        </v-row>
    </v-footer>
</template>
<script>
    export default {
        data: () => ({
            icons: [
                'mdi-facebook',
                'mdi-twitter',
                'mdi-linkedin',
                'mdi-instagram',
            ],
        }),
    }
</script>