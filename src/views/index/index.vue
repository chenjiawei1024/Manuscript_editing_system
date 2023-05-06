<template>
  <v-app id="inspire">
    <v-navigation-drawer color="grey-lighten-3" expand-on-hover rail>
      <v-list>
        <v-list-item
          prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg"
          title="Sandra Adams"
          subtitle="sandra_a88@gmailcom"
        ></v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-item prepend-icon="mdi-home-outline" title="Home" value="home" to="home"></v-list-item>
        <v-list-item prepend-icon="mdi-folder-file-outline" title="Management" value="files" to="manage"></v-list-item>
        <v-list-item prepend-icon="mdi-star-outline" title="Favorite" value="favorite" to="favorite"></v-list-item>
        <v-list-item prepend-icon="mdi-pencil-outline" title="Creation" value="creation" to="creation"></v-list-item>
        <v-list-item
          prepend-icon="mdi-lightbulb-outline"
          title="Inspiration"
          value="inspiration"
          to="inspiration"
        ></v-list-item>
        <v-list-item prepend-icon="mdi-shopping-outline" title="Shop" value="shop" to="shop"></v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main><router-view></router-view></v-main>
  </v-app>
</template>

<script setup lang="ts">
// import { RouterLink, RouterView } from 'vue-router';
// import HelloWorld from './components/HelloWorld.vue';
</script>
