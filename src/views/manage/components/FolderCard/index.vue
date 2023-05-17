<template>
  <div>
    <v-alert
      v-model="success_alert"
      :class="$style.alert"
      density="compact"
      position="fixed"
      type="success"
      :text="success_text"
      min-width="250"
    ></v-alert>
    <v-hover v-slot="{ isHovering, props }">
      <v-card
        v-bind="props"
        :height="228"
        class="pa-3 w-100"
        :class="isHovering && $style['card-hover']"
        :elevation="isHovering ? 2 : 0"
      >
        <div :class="$style['folder-container']">
          <img :class="$style['folder-img']" src="./imgs/folder.svg" />
          <div :class="$style['folder-content']">
            <span :class="$style.word">{{ isEmpty && '[空]' }}</span>
          </div>
        </div>
        <div :class="$style['content-container']">
          <div :class="$style.title">
            <span>{{ title }}</span>
            <v-menu location="bottom">
              <template v-slot:activator="{ props }">
                <v-icon v-bind="props">mdi-dots-horizontal</v-icon>
              </template>

              <v-list>
                <v-list-item
                  v-for="(item, index) in operationMenus"
                  :key="index"
                  :value="index"
                  @click="item.clickFunc"
                >
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
          <dic :class="$style.time">{{ time }}</dic>
        </div>
      </v-card>
    </v-hover>
    <!-- 重命名文件夹dialog -->
    <v-dialog v-model="showRenameDialog" width="450">
      <v-card>
        <v-card-title>
          <span class="headline">重命名</span>
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="newFolderName" label="New folder name"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="renameFolder">Rename</v-btn>
          <v-btn color="secondary" @click="showRenameDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- 删除文件夹dialog -->
    <v-dialog v-model="showDeleteDialog" width="450">
      <v-card>
        <v-card-title>
          <span class="headline">删除文件夹</span>
        </v-card-title>
        <v-card-text> 您确认要永久删除该文件夹吗？此操作将无法撤销！ </v-card-text>
        <v-card-actions>
          <v-btn color="error" @click="deleteFolder">Delete</v-btn>
          <v-btn color="secondary" @click="showDeleteDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script lang="ts" setup>
import axios from 'axios';
import { ref } from 'vue';

const props = defineProps<{
  folder_id: number;
  title: String;
  time: String;
}>();

const isEmpty = ref(true);
const showDeleteDialog = ref(false);
const showRenameDialog = ref(false);
const emits = defineEmits(['refresh']);

// 文件夹更多操作
const operationMenus = ref([
  // 重命名
  {
    title: '重命名',
    clickFunc: () => {
      showRenameDialog.value = true;
    },
  },
  // 删除
  {
    title: '删除',
    clickFunc: () => {
      showDeleteDialog.value = true;
    },
  },
]);

const success_alert = ref(false);
const success_text = ref('');
const showSuccessAlert = (text: string) => {
  success_text.value = text;
  success_alert.value = true;
  setTimeout(() => {
    success_alert.value = false;
    success_text.value = '';
  }, 1000);
};

const newFolderName = ref('');
const renameFolder = () => {
  // 请求创建文件夹接口
  axios({
    method: 'patch',
    url: `/api/folder/${props.folder_id}`,
    data: {
      folder_name: newFolderName.value,
    },
  })
    .then(() => {
      showSuccessAlert('rename successfully！');
      emits('refresh');
      showRenameDialog.value = false;
    })
    .catch((error) => {
      console.error('rename fail:', error);
    });
};

const deleteFolder = () => {
  // 请求创建文件夹接口
  axios({
    method: 'delete',
    url: `/api/folder/${props.folder_id}`,
  })
    .then(() => {
      showSuccessAlert('delete successfully！');
      emits('refresh');
      showDeleteDialog.value = false;
    })
    .catch((error) => {
      console.error('delete fail:', error);
    });
};
</script>
<style lang="scss" module>
.card-hover:hover {
  background-color: rgb(247, 247, 247);
  cursor: pointer;
}

.folder-container {
  width: 100%;
  height: 148px;

  .folder-img {
    display: block;
  }

  .folder-content {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: calc(100% - 8px);
    border: 1px solid #e9e9e9;
    background-color: #fff;
    margin-top: -1px;

    .word {
      color: rgba(32, 32, 32, 0.6);
    }
  }
}
.content-container {
  min-width: 0;
  width: 100%;
  padding-top: 8px;
  padding-left: 8px;
  height: 56px;
  box-sizing: border-box;

  .title {
    display: flex;
    justify-content: space-between;
    font-size: 16px;
    font-weight: 700;
    max-width: 100%;
    line-height: 24px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: calc(100% - 7px);
  }

  .time {
    color: rgba(32, 32, 32, 0.5);
    padding: 2px 0;
    font-size: 12px;
    line-height: 20px;
  }
}

.alert {
  left: 50%;
  transform: translateX(-50%);
  top: 40px;
  z-index: 10000;
}
</style>
