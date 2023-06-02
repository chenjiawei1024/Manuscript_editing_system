<template>
  <div>
    <v-list>
      <v-list-item class="d-flex justify-center align-center" v-for="(item, index) in AIImgList" :key="index" link>
        <!-- <img :src="item.src" /> -->
        <v-img :width="100" aspect-ratio="1" cover :src="item.src"></v-img>
        <!-- <v-img class="ma-1" :src="item.src" aspect-ratio="1" cover> -->
        <!-- <template v-slot:placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular indeterminate color="grey-lighten-5"></v-progress-circular>
            </v-row>
          </template>
          <template v-slot:error>
            <div>
              <v-img
                :src="`https://picsum.photos/500/500?image=${n * 5 + 10}`"
                :lazy-src="`https://picsum.photos/10/6?image=${n * 5 + 10}`"
                aspect-ratio="1"
                cover
                class="bg-grey-lighten-2"
              ></v-img>
            </div>
          </template> -->
        <!-- </v-img> -->
      </v-list-item>
    </v-list>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

const AIImgList = ref([
  {
    download:
      'https://unsplash.com/photos/7qjqQjt7zXQ/download?ixid=M3w0NTU2Nzh8MHwxfHNlYXJjaHwxfHxGaXJlJTI1MjBTYWZldHl8ZW58MHx8fHwxNjg1Njk2Mjg3fDA',
    src: 'https://images.unsplash.com/photo-1496483353456-90997957cf99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTU2Nzh8MHwxfHNlYXJjaHwxfHxGaXJlJTI1MjBTYWZldHl8ZW58MHx8fHwxNjg1Njk2Mjg3fDA&ixlib=rb-4.0.3&q=80&w=200',
  },
  {
    download:
      'https://unsplash.com/photos/rLm4Wq96h_0/download?ixid=M3w0NTU2Nzh8MHwxfHNlYXJjaHwyfHxGaXJlJTI1MjBTYWZldHl8ZW58MHx8fHwxNjg1Njk2Mjg3fDA',
    src: 'https://images.unsplash.com/photo-1470549584009-d347338fc0ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTU2Nzh8MHwxfHNlYXJjaHwyfHxGaXJlJTI1MjBTYWZldHl8ZW58MHx8fHwxNjg1Njk2Mjg3fDA&ixlib=rb-4.0.3&q=80&w=200',
  },
  {
    download:
      'https://unsplash.com/photos/BdTtvBRhOng/download?ixid=M3w0NTU2Nzh8MHwxfHNlYXJjaHwzfHxGaXJlJTI1MjBTYWZldHl8ZW58MHx8fHwxNjg1Njk2Mjg3fDA',
    src: 'https://images.unsplash.com/photo-1517594422361-5eeb8ae275a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTU2Nzh8MHwxfHNlYXJjaHwzfHxGaXJlJTI1MjBTYWZldHl8ZW58MHx8fHwxNjg1Njk2Mjg3fDA&ixlib=rb-4.0.3&q=80&w=200',
  },
  {
    download:
      'https://unsplash.com/photos/XOQJa4OC8P0/download?ixid=M3w0NTU2Nzh8MHwxfHNlYXJjaHw0fHxGaXJlJTI1MjBTYWZldHl8ZW58MHx8fHwxNjg1Njk2Mjg3fDA',
    src: 'https://images.unsplash.com/photo-1510772314292-9c0ad420734a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTU2Nzh8MHwxfHNlYXJjaHw0fHxGaXJlJTI1MjBTYWZldHl8ZW58MHx8fHwxNjg1Njk2Mjg3fDA&ixlib=rb-4.0.3&q=80&w=200',
  },
  {
    download:
      'https://unsplash.com/photos/xqV9QdGOSas/download?ixid=M3w0NTU2Nzh8MHwxfHNlYXJjaHw1fHxGaXJlJTI1MjBTYWZldHl8ZW58MHx8fHwxNjg1Njk2Mjg3fDA',
    src: 'https://images.unsplash.com/photo-1486915309851-b0cc1f8a0084?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTU2Nzh8MHwxfHNlYXJjaHw1fHxGaXJlJTI1MjBTYWZldHl8ZW58MHx8fHwxNjg1Njk2Mjg3fDA&ixlib=rb-4.0.3&q=80&w=200',
  },
  {
    download:
      'https://unsplash.com/photos/Rdsc2L517iQ/download?ixid=M3w0NTU2Nzh8MHwxfHNlYXJjaHw2fHxGaXJlJTI1MjBTYWZldHl8ZW58MHx8fHwxNjg1Njk2Mjg3fDA',
    src: 'https://images.unsplash.com/photo-1468245856972-a0333f3f8293?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTU2Nzh8MHwxfHNlYXJjaHw2fHxGaXJlJTI1MjBTYWZldHl8ZW58MHx8fHwxNjg1Njk2Mjg3fDA&ixlib=rb-4.0.3&q=80&w=200',
  },
  {
    download:
      'https://unsplash.com/photos/x3S1aGQNgro/download?ixid=M3w0NTU2Nzh8MHwxfHNlYXJjaHw3fHxGaXJlJTI1MjBTYWZldHl8ZW58MHx8fHwxNjg1Njk2Mjg3fDA',
    src: 'https://images.unsplash.com/photo-1543005472-1b1d37fa4eae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTU2Nzh8MHwxfHNlYXJjaHw3fHxGaXJlJTI1MjBTYWZldHl8ZW58MHx8fHwxNjg1Njk2Mjg3fDA&ixlib=rb-4.0.3&q=80&w=200',
  },
  {
    download:
      'https://unsplash.com/photos/-98jVaVuGv0/download?ixid=M3w0NTU2Nzh8MHwxfHNlYXJjaHw4fHxGaXJlJTI1MjBTYWZldHl8ZW58MHx8fHwxNjg1Njk2Mjg3fDA',
    src: 'https://images.unsplash.com/photo-1523861751938-121b5323b48b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTU2Nzh8MHwxfHNlYXJjaHw4fHxGaXJlJTI1MjBTYWZldHl8ZW58MHx8fHwxNjg1Njk2Mjg3fDA&ixlib=rb-4.0.3&q=80&w=200',
  },
  {
    download:
      'https://unsplash.com/photos/f9bkzNQyylg/download?ixid=M3w0NTU2Nzh8MHwxfHNlYXJjaHw5fHxGaXJlJTI1MjBTYWZldHl8ZW58MHx8fHwxNjg1Njk2Mjg3fDA',
    src: 'https://images.unsplash.com/photo-1489176876421-3b720db0fb3d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTU2Nzh8MHwxfHNlYXJjaHw5fHxGaXJlJTI1MjBTYWZldHl8ZW58MHx8fHwxNjg1Njk2Mjg3fDA&ixlib=rb-4.0.3&q=80&w=200',
  },
  {
    download:
      'https://unsplash.com/photos/fjmPfKvayzA/download?ixid=M3w0NTU2Nzh8MHwxfHNlYXJjaHwxMHx8RmlyZSUyNTIwU2FmZXR5fGVufDB8fHx8MTY4NTY5NjI4N3ww',
    src: 'https://images.unsplash.com/photo-1461484261293-7175bb44e871?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTU2Nzh8MHwxfHNlYXJjaHwxMHx8RmlyZSUyNTIwU2FmZXR5fGVufDB8fHx8MTY4NTY5NjI4N3ww&ixlib=rb-4.0.3&q=80&w=200',
  },
]);
</script>
