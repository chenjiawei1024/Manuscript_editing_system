<template>
  <v-app id="inspire">
    <v-navigation-drawer color="grey-lighten-3" expand-on-hover rail>
      <v-list>
        <v-list-item
          prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg"
          :title="userInfo?.name"
          :subtitle="userInfo?.email"
        ></v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-item prepend-icon="mdi-home-outline" title="Home" value="home" to="home"></v-list-item>
        <v-list-item prepend-icon="mdi-folder-file-outline" title="Management" value="files" to="manage"></v-list-item>
        <v-list-item prepend-icon="mdi-star-outline" title="Favorite" value="favorite" to="favorite"></v-list-item>
        <v-list-item prepend-icon="mdi-pencil-outline" title="Creation" value="creation" to="creation"></v-list-item>
        <v-list-item prepend-icon="mdi-share-variant-outline" title="Share" value="share" to="share"></v-list-item>
        <v-list-item
          prepend-icon="mdi-lightbulb-outline"
          title="Inspiration"
          value="inspiration"
          to="inspiration"
        ></v-list-item>
        <v-list-item prepend-icon="mdi-shopping-outline" title="Shop" value="shop" to="shop"></v-list-item>
        <v-list-item prepend-icon="mdi-logout" title="Logout" value="signin" to="signin"></v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main><router-view></router-view></v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { AxiosResponse } from 'axios';
import type { UserInfoType } from '@/types/user';
import instance from '@/api';

const userInfo = ref<UserInfoType>();

const getUserInfo = async () => {
  // 请求创建文件夹接口
  instance({
    method: 'get',
    url: `/api/user/${localStorage.getItem('user_id')}`,
  })
    .then((resp: AxiosResponse<UserInfoType>) => {
      userInfo.value = resp.data;
    })
    .catch((error) => {
      console.error('获取用户信息失败:', error);
    });
};
getUserInfo();
</script>
