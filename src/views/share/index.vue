<template>
  <div>
    <v-container class="ml-7 mr-7 w-auto" :fluid="true">
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
      <div :class="$style.title">共享文件</div>
      <v-divider class="mb-2"></v-divider>
      <!-- 按钮组 -->
      <v-container class="d-flex flex-row" :fluid="true">
        <CreateCard
          color="#f24e1e"
          icon="mdi-folder-account"
          title="创建共享文件"
          subtitle="支持文件共享~"
          @click="showShareFileDialog = true"
        ></CreateCard>
      </v-container>
      <!-- 文件/文件夹列表 -->
      <v-container class="w-auto" :fluid="true">
        <v-row>
          <v-col v-for="file in fileList" xxl="1" lg="2" cols="2" md="3" sm="3" xs="6" :key="file.file_id">
            <FileCard
              :file_id="file.file_id"
              :title="file.file_name"
              :time="formatDateToZHformat(String(file.last_accessed_at))"
              :is_favor="file.is_favorite"
              :content="file.content"
              :tags="file.tags"
              @click="openFile(file)"
              @like="getFileList()"
            ></FileCard>
          </v-col>
        </v-row>
      </v-container>
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
import { useRouter, useRoute } from 'vue-router';
import type { AxiosResponse } from 'axios';

import { formatDateToZHformat, debounce } from '@/utils/index';
import type { FileDetailItem } from '@/types/manage';

import CreateCard from '../manage/components/CreateCard/index.vue';
import FileCard from '../manage/components/FileCard/index.vue';
import instance from '@/api';

const router = useRouter();
const route = useRoute();
//是否展示文件dialog
const showFileDialog = ref(false);
// 创建文件dialog表单
const fileName = ref('');
// file显示列表
const fileList = ref<FileDetailItem[]>([]);

// 顶部菜单栏添加按钮菜单列表
const addMenus = ref([
  {
    title: '创建文件',
    clickFunc: () => {
      showFileDialog.value = true;
    },
  },
]);
const createFile = async () => {
  // 请求创建文件夹接口
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
      getFileList();
      // 重置dialog
      showFileDialog.value = false;
      fileName.value = '';
    })
    .catch((error) => {
      console.error('登陆失败:', error);
    });
};

const openFile = (file: FileDetailItem) => {
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
// 获取文件列表请求
const getFileList = async () => {
  // 请求获取文件夹列表接口
  instance({
    method: 'get',
    url: `/api/sfile/${localStorage.getItem('user_id')}`,
  })
    .then((resp: AxiosResponse<FileDetailItem[]>) => {
      fileList.value = resp.data;
    })
    .catch((error) => {
      console.error('获取文件列表请求失败:', error);
    });
};
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

// 搜索功能
const searchValue = ref('');

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
  getFileListByName();
};
const debouncedSearch = debounce(search, 1000);

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
      showSuccessAlert('文稿创建成功！');
      getFileList();
      // 重置dialog
      showShareFileDialog.value = false;
      shareFileName.value = '';
      shareToUser.value = '';
    })
    .catch((error) => {
      console.error('登陆失败:', error);
    });
};
</script>

<style lang="scss" module>
.title {
  color: #202020;
  font-weight: 700;
  font-size: 16px;
  line-height: 44px;
  margin: 8px 0 2px 16px;
}

.item-hover:hover {
  background-color: rgb(247, 247, 247);
  cursor: pointer;
}

.alert {
  left: 50%;
  transform: translateX(-50%);
  top: 40px;
  z-index: 10000;
}
</style>
