<template>
  <div>
    <v-container>
      <!-- 成功提示框 -->
      <v-alert
        v-model="success_alert"
        :class="$style.alert"
        density="compact"
        position="fixed"
        :type="alert_type || 'success'"
        :text="success_text"
        min-width="250"
      ></v-alert>
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
          v-model:model-value="searchValue"
          density="compact"
          prepend-inner-icon="mdi-magnify"
          placeholder="搜索文件、文件夹等"
          class="mt-6 w-50"
          @input="debouncedSearch"
        ></v-text-field>

        <template #append> <v-btn icon="mdi-dots-vertical"></v-btn> </template
      ></v-app-bar>
      <v-breadcrumbs :items="breadcrumbs">
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
          title="创建文件夹"
          subtitle="文件收藏归纳，支持分享等"
          @create="showFolderDialog = true"
        ></CreateCard>
        <CreateCard
          :class="$style['button-space']"
          color="#8fcbff"
          icon="mdi-file"
          title="创建文件"
          subtitle="开始进行文稿创作~"
          @click="showFileDialog = true"
        ></CreateCard>
        <CreateCard
          :class="$style['button-space']"
          color="#f24e1e"
          icon="mdi-folder-account"
          title="创建共享文件"
          subtitle="支持文件共享~"
          @click="showShareFileDialog = true"
        ></CreateCard>
      </v-container>
      <!-- 文件/文件夹列表 -->
      <div :class="$style['card-container']">
        <v-row>
          <v-col v-for="folder in folderList" xxl="1" lg="2" cols="2" md="3" sm="3" xs="6" :key="folder.folder_id">
            <FolderCard
              :folder_id="folder.folder_id"
              :title="folder.folder_name"
              :time="formatDateToZHformat(String(folder.last_accessed_at))"
              :file_count="folder.child_file_count"
              :folder_count="folder.child_folder_count"
              @click="openFolder(folder)"
              @refresh="getFolderList(route.query?.f ? Number(route.query.f) : -1)"
            ></FolderCard>
          </v-col>
        </v-row>
        <v-row>
          <v-col v-for="file in fileList" xxl="1" lg="2" cols="2" md="3" sm="3" xs="6" :key="file.file_id">
            <FileCard
              :file_id="file.file_id"
              :title="file.file_name"
              :time="formatDateToZHformat(String(file.last_accessed_at))"
              :is_favor="file.is_favorite"
              :content="file.content"
              :is_shared="file.is_shared"
              :tags="file.tags"
              @click="openFile(file)"
              @like="getFileList(route.query?.f ? Number(route.query.f) : -1)"
            ></FileCard>
          </v-col>
        </v-row>
      </div>
      <!-- 创建新文件夹dialog -->
      <v-dialog v-model="showFolderDialog" width="450">
        <v-card>
          <v-card-title>
            <span class="headline">Create new folder</span>
          </v-card-title>
          <v-card-text>
            <v-text-field v-model="folderName" label="Folder name"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="createFolder">Create</v-btn>
            <v-btn color="secondary" @click="showFolderDialog = false">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- 创建新文件dialog -->
      <v-dialog v-model="showFileDialog" width="450">
        <v-card>
          <v-card-title>
            <span class="headline">Create new file</span>
          </v-card-title>
          <v-card-text>
            <v-text-field v-model="fileName" label="File name"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="createFile">Create</v-btn>
            <v-btn color="secondary" @click="showFileDialog = false">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- 创建新共享文件dialog -->
      <v-dialog v-model="showShareFileDialog" width="450">
        <v-card>
          <v-card-title>
            <span class="headline">Create share file</span>
          </v-card-title>
          <v-card-text>
            <v-text-field v-model="shareFileName" label="File name"></v-text-field>
            <v-text-field v-model="shareToUser" label="User name"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="createShareFile">Create</v-btn>
            <v-btn color="secondary" @click="showShareFileDialog = false">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute, onBeforeRouteUpdate } from 'vue-router';
import type { AxiosResponse } from 'axios';

import { formatDateToZHformat, debounce } from '@/utils/index';
import type { FileDetailItem, FolderDetailItem, breadcrumbItem } from '@/types/manage';

import CreateCard from './components/CreateCard/index.vue';
import FolderCard from './components/FolderCard/index.vue';
import FileCard from './components/FileCard/index.vue';
import instance from '@/api';

const router = useRouter();
const route = useRoute();
// 是否展示文件夹dialog
const showFolderDialog = ref(false);
// 是否展示文件dialog
const showFileDialog = ref(false);
// 创建文件夹dialog表单
const folderName = ref('');
const fileName = ref('');
// folder显示列表
const folderList = ref<FolderDetailItem[]>([]);
// file显示列表
const fileList = ref<FileDetailItem[]>([]);
const breadcrumbs = ref<breadcrumbItem[]>([
  {
    title: '我的文件',
    href: '/manage',
    to: { path: '/manage' },
  },
]);

// 顶部菜单栏添加按钮菜单列表
const addMenus = ref([
  {
    title: '创建文件',
    clickFunc: () => {
      showFileDialog.value = true;
    },
  },
  {
    title: '创建文件夹',
    clickFunc: () => {
      showFolderDialog.value = true;
    },
  },
]);

const createFolder = async () => {
  // 请求创建文件夹接口
  instance({
    method: 'post',
    url: '/api/folder',
    data: {
      folder_name: folderName.value,
      owner: localStorage.getItem('user_id'),
      parent: route.query?.f,
    },
  })
    .then(() => {
      showSuccessAlert('文件夹创建成功！');
      getFolderList(route.query?.f ? Number(route.query.f) : -1);
      // 重置dialog
      showFolderDialog.value = false;
      folderName.value = '';
    })
    .catch((error) => {
      console.error('登陆失败:', error);
    });
};

const createFile = async () => {
  // 请求创建文件接口
  instance({
    method: 'post',
    url: '/api/file',
    data: {
      file_name: fileName.value,
      owner: localStorage.getItem('user_id'),
      parent: route.query?.f,
    },
  })
    .then(() => {
      showSuccessAlert('文稿创建成功！');
      getFileList(route.query?.f ? Number(route.query.f) : -1);
      // 重置dialog
      showFileDialog.value = false;
      fileName.value = '';
    })
    .catch((error) => {
      console.error('登陆失败:', error);
    });
};

// 是否展示共享文件dialog
const showShareFileDialog = ref(false);
const shareFileName = ref('');
const shareToUser = ref('');
const createShareFile = async () => {
  // 请求创建文件夹接口
  instance({
    method: 'post',
    url: '/api/sfile',
    data: {
      file_name: shareFileName.value,
      receiver_name: shareToUser.value,
      sharer_id: localStorage.getItem('user_id'),
      parent: route.query?.f ? Number(route.query.f) : -1,
    },
  })
    .then(() => {
      showSuccessAlert('共享文稿创建成功！');
      getFileList(route.query?.f ? Number(route.query.f) : -1);
      // 重置dialog
      showShareFileDialog.value = false;
      shareFileName.value = '';
      shareToUser.value = '';
    })
    .catch((error) => {
      console.error('登陆失败:', error);
    });
};

const openFolder = (folder: FolderDetailItem) => {
  breadcrumbs.value.push({
    title: folder.folder_name,
    href: `/manage?f=${folder.folder_id}`,
    to: { path: '/manage', query: { f: folder.folder_id } },
  });
  router.push({ path: '/manage', query: { f: folder.folder_id } });
  getFolderList(folder.folder_id);
  getFileList(folder.folder_id);
};

const openFile = async (file: FileDetailItem) => {
  instance({
    method: 'get',
    url: `/api/file/lock/${file.file_id}`,
  })
    .then((resp: AxiosResponse<boolean>) => {
      if (!resp.data) {
        router.push({
          path: '/creation',
          query: {
            file_id: file.file_id,
            file_name: file.file_name,
            content: file.content,
          },
        });
      } else {
        showSuccessAlert('oops! the file is locked!', 'error');
      }
    })
    .catch((error) => {
      console.error('获取文件状态:', error);
    });
};

// 获取文件夹列表请求
const getFolderList = async (parentid?: number) => {
  // 请求获取文件夹列表接口
  instance({
    method: 'get',
    url: `/api/folder/${parentid || -1}`,
  })
    .then((resp: AxiosResponse<FolderDetailItem[]>) => {
      folderList.value = resp.data;
    })
    .catch((error) => {
      console.error('获取文件夹列表请求失败:', error);
    });
};
// 获取文件列表请求
const getFileList = async (parentid?: number) => {
  // 请求获取文件夹列表接口
  instance({
    method: 'get',
    url: '/api/file',
    params: {
      parent_id: parentid || -1,
      owner: localStorage.getItem('user_id'),
    },
  })
    .then((resp: AxiosResponse<FileDetailItem[]>) => {
      fileList.value = resp.data;
    })
    .catch((error) => {
      console.error('获取文件列表请求失败:', error);
    });
};
getFolderList();
getFileList();

const success_text = ref('');
const success_alert = ref(false);
const alert_type = ref<'error' | 'success' | 'warning' | 'info' | undefined>();
/** success弹框显示隐藏 */
const showSuccessAlert = (text: string, type?: 'error' | 'success' | 'warning' | 'info') => {
  success_text.value = text;
  success_alert.value = true;
  alert_type.value = type;
  setTimeout(() => {
    success_alert.value = false;
    success_text.value = '';
    alert_type.value = undefined;
  }, 1000);
};

// 添加路由守卫，来监听路由query变化
onBeforeRouteUpdate(async (to, from, next) => {
  // 若存在index，则为回退
  const index = breadcrumbs.value.findIndex((b) => b.href === to.fullPath);
  if (index !== -1) {
    breadcrumbs.value.splice(index + 1);
  }
  if (to.query?.f) {
    getFolderList(Number(to.query?.f));
    getFileList(Number(to.query?.f));
  } else {
    getFolderList();
    getFileList();
  }
  next();
});

// 搜索功能
const searchValue = ref('');

// 获取文件夹列表请求
const getFolderListByName = async () => {
  if (searchValue.value) {
    instance({
      method: 'get',
      url: `/api/folder/search/${searchValue.value}`,
    })
      .then((resp: AxiosResponse<FolderDetailItem[]>) => {
        folderList.value = resp.data;
      })
      .catch((error) => {
        console.error('获取文件夹列表请求失败:', error);
      });
  } else {
    getFolderList();
  }
};
// 获取文件列表请求
const getFileListByName = async () => {
  if (searchValue.value) {
    instance({
      method: 'get',
      url: `/api/file/search/${searchValue.value}`,
    })
      .then((resp: AxiosResponse<FileDetailItem[]>) => {
        fileList.value = resp.data;
      })
      .catch((error) => {
        console.error('获取文件列表请求失败:', error);
      });
  } else {
    getFileList();
  }
};
const search = () => {
  getFolderListByName();
  getFileListByName();
};
const debouncedSearch = debounce(search, 1000);
</script>

<style lang="scss" module>
.card-container {
  overflow-y: scroll;

  &::-webkit-scrollbar {
    width: 0; /* 隐藏滚动条 */
    background-color: transparent; /* 使滚动条透明 */
  }
}
.item-hover:hover {
  background-color: rgb(247, 247, 247);
  cursor: pointer;
}

.button-space {
  margin-left: 24px !important;
}

.alert {
  left: 50%;
  transform: translateX(-50%);
  top: 40px;
  z-index: 10000;
}
</style>
