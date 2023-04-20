<template>
  <v-app-bar :elevation="2">
    <template #prepend>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
    </template>
    <v-app-bar-title>Creation</v-app-bar-title>
    <v-spacer></v-spacer>

    <v-responsive max-width="156">
      <v-text-field
        bg-color="grey-lighten-2"
        class="rounded-pill overflow-hidden"
        density="compact"
        hide-details
        variant="solo"
      ></v-text-field>
    </v-responsive>
  </v-app-bar>
  <v-navigation-drawer width="300">
    <v-sheet color="grey-lighten-5" height="128" width="100%"></v-sheet>
    <v-list>
      <v-list-item v-for="item in hotList" :key="item.hotnum" :title="item.title" link @click="showHotspotDeatils">
      </v-list-item>
    </v-list>
  </v-navigation-drawer>

  <v-main>
    <div>
      <Editor
        api-key="ej8vo2s2u5a6b5g04917ajn437b37nxf5olm4yemnyz9gcad"
        :init="{
          skin: 'oxide-dark',
          content_css: 'dark',
          branding: false,
          plugins: 'lists link image table code help wordcount',
        }"
      />
    </div>
  </v-main>

  <v-navigation-drawer location="right">
    <v-list>
      <v-list-item v-for="n in 5" :key="n" :title="`Item ${n}`" link> </v-list-item>
    </v-list>
  </v-navigation-drawer>

  <v-footer app height="72">
    <v-text-field
      bg-color="grey-lighten-1"
      class="rounded-pill overflow-hidden"
      density="compact"
      hide-details
      variant="solo"
    ></v-text-field>
  </v-footer>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import Editor from '@tinymce/tinymce-vue';
import { getHotList } from '@/api';
import type { NewsItem } from '@/types/creation';

const hotList = ref<NewsItem[]>([]);

const getHotSpots = async () => {
  const resp = await getHotList();
  hotList.value = resp;
};
getHotSpots();

const showHotspotDeatils = () => {};
</script>
