<template>
  <div>
    <v-container>
      <v-app-bar :elevation="2">
        <template #prepend>
          <v-menu location="bottom">
            <template v-slot:activator="{ props }">
              <v-app-bar-nav-icon v-bind="props" icon="mdi-plus"></v-app-bar-nav-icon>
            </template>

            <v-list>
              <v-list-item v-for="(item, index) in addMenus" :key="index" :value="index" @click="item.clickFunc">
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>

        <v-divider vertical class="ml-2 mr-7 mt-6" length="18"></v-divider>

        <v-text-field
          density="compact"
          prepend-inner-icon="mdi-magnify"
          placeholder="搜索文件、文件夹等"
          class="mt-6 w-50"
        ></v-text-field>

        <template #append> <v-btn icon="mdi-dots-vertical"></v-btn> </template
      ></v-app-bar>
      <v-breadcrumbs :items="items">
        <template v-slot:divider>
          <v-icon icon="mdi-chevron-right"></v-icon>
        </template>
      </v-breadcrumbs>
      <v-divider class="mb-2"></v-divider>
      <!-- 按钮组 -->
      <v-container class="d-flex flex-row">
        <CreateCard
          color="#f5bf5b"
          icon="mdi-folder"
          title="创建文件"
          subtitle="创建文件、文件夹等"
          @create="showDialog = true"
        ></CreateCard>
        <CreateCard
          :class="$style['button-space']"
          color="#8fcbff"
          icon="mdi-file"
          title="创建文件"
          subtitle="创建文件、文件夹等"
          @click="showDialog = true"
        ></CreateCard>
        <CreateCard
          :class="$style['button-space']"
          color="#f5bf5b"
          icon="mdi-folder"
          title="创建文件"
          subtitle="创建文件、文件夹等"
        ></CreateCard>
      </v-container>
      <!-- 文件/文件夹列表 -->
      <v-container>
        <v-row>
          <v-col v-for="n in 3" xxl="1" lg="2" cols="2" md="3" sm="3" xs="6" :key="n">
            <FolderCard title="abcacb" time="4月8日 19:46" @click="openFolder"></FolderCard>
          </v-col>
        </v-row>
        <v-row>
          <v-col v-for="n in 3" xxl="1" lg="2" cols="2" md="3" sm="3" xs="6" :key="n">
            <FileCard title="abcacb" time="4月8日 19:46"></FileCard>
          </v-col>
        </v-row>
      </v-container>
      <!-- 创建新文件夹dialog -->
      <v-dialog v-model="showDialog" width="450">
        <v-card>
          <v-card-title>
            <span class="headline">Create new folder</span>
          </v-card-title>
          <v-card-text>
            <v-text-field v-model="folderName" label="Folder name"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="createFolder">Create</v-btn>
            <v-btn color="secondary" @click="showDialog = false">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-row no-gutters>
        <v-col cols="3" sm="4" v-for="(folder, index) in folders" :key="index" @click="openFolder(folder)">
          <v-card>{{ folder.name }}</v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import CreateCard from './components/CreateCard/index.vue';
import FolderCard from './components/FolderCard/index.vue';
import FileCard from './components/FileCard/index.vue';

const router = useRouter();
//是否展示dialog
const showDialog = ref(false);
// 创建文件夹dialog表单
const folderName = ref('');
const folders = ref([] as any);
const items = ref([
  {
    title: 'Dashboard',
    disabled: false,
    href: 'breadcrumbs_dashboard',
  },
  {
    title: 'Link 1',
    disabled: false,
    href: 'breadcrumbs_link_1',
  },
  {
    title: 'Link 2',
    disabled: true,
    href: 'breadcrumbs_link_2',
  },
]);

const addMenus = ref([
  {
    title: '创建文件',
    clickFunc: () => {
      showDialog.value = true;
    },
  },
  { title: '创建文件夹' },
]);

const createFolder = async () => {
  // TODO: 请求创建文件夹接口

  // TODO: 请求获取文件夹接口
  getFolderList();
  // localStorage.setItem('folders', JSON.stringify(folders.value));
  // 重置dialog
  showDialog.value = false;
  folderName.value = '';
};

const openFolder = (folder: any) => {
  // TODO: 根据文件夹跳转动态路由
  // router.push({ name: 'manage', params: { folder: folder } });
};

// TODO: 获取文件夹列表请求
const getFolderList = async () => {};
</script>

<style lang="scss" module>
.item-hover:hover {
  background-color: rgb(247, 247, 247);
  cursor: pointer;
}

.button-space {
  margin-left: 24px;
}
</style>
