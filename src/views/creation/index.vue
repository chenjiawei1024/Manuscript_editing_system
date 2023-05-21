<template>
  <!-- 成功提示框 -->
  <v-alert
    v-model="success_alert"
    :class="$style.alert"
    density="compact"
    position="fixed"
    type="success"
    :text="success_text"
    min-width="250"
  ></v-alert>
  <v-app-bar :elevation="2">
    <template #prepend>
      <v-menu location="bottom">
        <template v-slot:activator="{ props }">
          <v-app-bar-nav-icon v-bind="props"></v-app-bar-nav-icon>
        </template>

        <v-list>
          <v-list-item v-for="(item, index) in menus" :key="index" :value="index" @click="item.clickFunc">
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
    <v-app-bar-title>{{ newFileName || 'untitled' }}</v-app-bar-title>
    <div :class="$style['tag-container']">
      <v-card
        v-for="(item, index) in fileDetail?.tags"
        :key="index"
        color="secondary"
        class="pa-1"
        :class="index > 0 && 'ml-6'"
        >{{ item.tag_name }}<span :class="$style['delete-tag']" @click="confirmDeleteTag(item.tag_id)">x</span></v-card
      >
    </div>
    <v-spacer></v-spacer>

    <v-responsive max-width="156">
      <v-btn color="success" prepend-icon="mdi-check-circle" variant="flat" @click="saveFile">
        <template v-slot:prepend>
          <v-icon color="white"></v-icon>
        </template>
        保存
      </v-btn>
    </v-responsive>
  </v-app-bar>
  <v-navigation-drawer width="300">
    <v-sheet color="grey-lighten-3" :class="$style['hot-news']" width="100%" height="128">
      <div :class="$style.title">
        <span :class="$style['title-text']">热点新闻</span>
        <span :class="$style.line"></span>
        <span :class="$style.circle"></span>
      </div>
    </v-sheet>
    <v-list>
      <v-list-item
        v-for="(item, index) in hotList"
        :key="item.hotnum"
        :title="`${index + 1}. ${item.title}`"
        link
        @click="showHotspotDeatils(index)"
      >
      </v-list-item>
    </v-list>
  </v-navigation-drawer>

  <v-main class="pa-8 h-100">
    <div style="width: 100%; height: 100%">
      <Editor
        ref="editorRef"
        v-model="editorContent"
        api-key="ej8vo2s2u5a6b5g04917ajn437b37nxf5olm4yemnyz9gcad"
        :init="{
          skin: 'snow',
          branding: false,
          height: 580,
          plugins: 'lists link image table code help wordcount',
        }"
      />
      <v-card class="w-100 mt-4" :class="$style['btn-container']">
        <template v-slot:title>文稿润色功能</template>
        <template v-slot:text>
          <div :class="$style['btn-subcontainer']">
            <v-btn color="primary" @click="createWordReplacement">词句润色</v-btn>
            <v-btn color="secondary" @click="createTagClassify">标签分类</v-btn>
            <v-btn color="purple" @click="createAITitle">标题生成</v-btn>
          </div>
        </template>
      </v-card>
    </div>
  </v-main>

  <v-navigation-drawer location="right" width="300">
    <v-sheet color="grey-lighten-3" :class="$style['hot-news']" width="100%" height="128">
      <div :class="$style.title">
        <span :class="$style['title-text']">文稿润色</span>
        <span :class="$style['title-subtext']">词句替换，标签分类，标题生成等</span>
        <span :class="$style.circle"></span>
      </div>
    </v-sheet>
    <!-- 文章标题 -->
    <v-list v-if="AITitleList.length">
      <v-list-item
        v-for="(item, index) in AITitleList"
        :key="item.title"
        :title="item.title"
        link
        @click="showAITitleDeatils(index)"
      ></v-list-item>
    </v-list>
    <!-- 词句润色 -->
    <v-list v-else-if="AIWordList.length">
      <v-list-item
        class="d-flex flex-row justify-center align-center"
        v-for="(item, index) in AIWordList"
        :key="index"
        link
      >
        <div>
          <span :class="$style['edit_before']">{{ item.before }}</span>
          <span>{{ ' ➡ ' }}</span>
          <span :class="$style['edit_after']">{{ item.after }}</span>
        </div>
      </v-list-item>
    </v-list>
    <!-- 文章标签 -->
    <v-list v-else-if="AIClassifyList.length">
      <v-list-item
        class="d-flex flex-row justify-center align-center"
        v-for="(item, index) in AIClassifyList"
        :key="index"
        link
        @click="associateTag(item.title)"
      >
        <v-card class="pa-1" color="secondary">{{ item.title }}</v-card>
      </v-list-item>
    </v-list>
    <div v-else-if="showLoading" :class="$style['loader-container']">
      <v-icon :class="$style.loader" :size="48">mdi-loading</v-icon>
    </div>
    <div v-else :class="$style['loader-container']">
      <div :class="$style['empty-text']">优化内容都会显示在此哦～</div>
    </div>
  </v-navigation-drawer>

  <v-footer app height="72">
    <v-text-field
      ref=""
      v-model:model-value="question"
      bg-color="grey-lighten-1"
      class="rounded-pill overflow-hidden"
      density="compact"
      hide-details
      append-inner-icon="mdi-magnify"
      variant="solo"
      @click:append-inner="askAIQuestions"
    ></v-text-field>
  </v-footer>
  <!-- 热点新闻detail -->
  <v-dialog v-model="showHotDetailDialog" width="450">
    <v-card>
      <v-card-title>
        <span class="headline">{{ hotDetailTitle }}</span>
      </v-card-title>
      <v-card-text>
        <span>{{ hotDetailContent }}</span>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="copyToClipboard(hotDetailContent)">复制内容</v-btn>
        <v-btn color="secondary" @click="showHotDetailDialog = false">取消</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!-- AI提问回答dialog -->
  <v-dialog v-model="showAIDialog" width="450">
    <v-card>
      <v-card-title>
        <span class="headline">回复：</span>
      </v-card-title>
      <v-card-text>
        <div :class="[$style.answer, blinking && $style.blinking]">
          {{ currentAnswer }}
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="copyToClipboard(currentAnswer)">复制回答</v-btn>
        <v-btn color="secondary" @click="closeAIDialog">取消</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!-- 文章润色列表Item Dialog -->
  <v-dialog v-model="showAITitleDialog" width="450">
    <v-card>
      <v-card-title>
        <span class="headline">文章标题</span>
      </v-card-title>
      <v-card-text>
        <span>{{ optimizedTitle }}</span>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="copyToClipboard(optimizedTitle)">复制标题</v-btn>
        <v-btn color="secondary" @click="showAITitleDialog = false">取消</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!-- 创建新文件dialog -->
  <v-dialog v-model="showCreateFileDialog" width="450">
    <v-card>
      <v-card-title>
        <span class="headline">创建新文件</span>
      </v-card-title>
      <v-card-text>
        <v-text-field v-model="newFileName" label="File name"></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="createFile">创建</v-btn>
        <v-btn color="secondary" @click="showCreateFileDialog = false">取消</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!-- 重命名dialog -->
  <v-dialog v-model="showRenameFileDialog" width="450">
    <v-card>
      <v-card-title>
        <span class="headline">重命名文件</span>
      </v-card-title>
      <v-card-text>
        <v-text-field v-model="newFileName" label="File name"></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="renameFile">重命名</v-btn>
        <v-btn color="secondary" @click="showRenameFileDialog = false">取消</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!-- 删除文件dialog -->
  <v-dialog v-model="showDeleteFileDialog" width="450">
    <v-card>
      <v-card-title>
        <span class="headline">删除文件夹</span>
      </v-card-title>
      <v-card-text> 您确认要永久删除该文件吗？此操作将无法撤销！ </v-card-text>
      <v-card-actions>
        <v-btn color="error" @click="deleteFile">Delete</v-btn>
        <v-btn color="secondary" @click="showDeleteFileDialog = false">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!-- 创建标签dialog -->
  <v-dialog v-model="showCreateTagDialog" width="450">
    <v-card>
      <v-card-title>
        <span class="headline">创建标签</span>
      </v-card-title>
      <v-card-text>
        <v-text-field v-model="tagName" label="Tag name"></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="createTag">Create</v-btn>
        <v-btn color="secondary" @click="showCreateTagDialog = false">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!-- 创建标签dialog -->
  <v-dialog v-model="showTagAssociateDialog" width="450">
    <v-card>
      <v-card-title>
        <span class="headline">关联标签</span>
      </v-card-title>
      <v-card-text> {{ `您确认要将'${tagName}'标签关联到本文件吗？` }} </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="createTag">Associate</v-btn>
        <v-btn color="secondary" @click="showTagAssociateDialog = false">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!-- 删除文件dialog -->
  <v-dialog v-model="showDeleteTagDialog" width="450">
    <v-card>
      <v-card-title>
        <span class="headline">删除标签</span>
      </v-card-title>
      <v-card-text> 您确认要删除该标签吗？</v-card-text>
      <v-card-actions>
        <v-btn color="error" @click="deleteTag">Delete</v-btn>
        <v-btn color="secondary" @click="showDeleteTagDialog = false">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!-- 创建新共享文件dialog -->
  <v-dialog v-model="showShareFileDialog" width="450">
    <v-card>
      <v-card-title>
        <span class="headline">Share file</span>
      </v-card-title>
      <v-card-text>
        <v-text-field v-model="shareFileName" label="File name"></v-text-field>
        <v-text-field v-model="shareToUser" label="User name"></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="createShareFile">Share</v-btn>
        <v-btn color="secondary" @click="showShareFileDialog = false">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import Editor from '@tinymce/tinymce-vue';
import instance, { getHotList } from '@/api';
import type { AIRespItem, NewsItem, AIRespListItem } from '@/types/creation';
import type { AxiosResponse } from 'axios';
import { computed } from 'vue';
import type { FileDetailItem } from '@/types/manage';
import { onBeforeUnmount } from 'vue';

const route = useRoute();
const isNew = computed(() => {
  return !newFileName.value;
});

const file_id = ref();

// 已有用户在编辑，锁定该文件
const lockFile = () => {
  file_id.value = route.query.file_id;
  if (route.query.file_id) {
    instance({
      method: 'patch',
      url: `/api/file/lock/${route.query.file_id}`,
    })
      .then(() => {
        console.log('锁定成功!');
      })
      .catch((error) => {
        console.error('网络问题:', error);
      });
    window.addEventListener('beforeunload', handleBeforeUnload);
  }
};
const handleBeforeUnload = () => {
  if (file_id.value) {
    instance({
      method: 'patch',
      url: `/api/file/unlock/${file_id.value}`,
    })
      .then(() => {
        console.log('解锁成功!');
      })
      .catch((error) => {
        console.error('网络问题:', error);
      });
  }
};
lockFile();

// 离开页面，解锁该文件
onBeforeUnmount(() => {
  handleBeforeUnload();
  window.removeEventListener('beforeunload', handleBeforeUnload);
});

const showRenameFileDialog = ref(false);

// 顶部菜单栏添加按钮菜单列表
const menus = ref([
  {
    title: '重命名',
    clickFunc: () => {
      showRenameFileDialog.value = true;
    },
  },
  {
    title: '创建标签',
    clickFunc: () => {
      showCreateTagDialog.value = true;
    },
  },
  {
    title: '分享文件',
    clickFunc: () => {
      showShareFileDialog.value = true;
    },
  },
  {
    title: '删除文件',
    clickFunc: () => {
      showDeleteFileDialog.value = true;
    },
  },
]);

const fileDetail = ref<FileDetailItem | null>(null);
const getFileDetail = () => {
  if (route.query?.file_id) {
    instance({
      method: 'get',
      url: `/api/file/${route.query.file_id}`,
    })
      .then((resp: AxiosResponse<FileDetailItem>) => {
        fileDetail.value = resp.data;
        shareFileName.value = resp.data.file_name;
      })
      .catch((error) => {
        console.error('网络问题:', error);
      });
  }
};
getFileDetail();

const success_alert = ref(false);
const success_text = ref('');
const hotList = ref<NewsItem[]>([]);
// hotItem细节展示
const showHotDetailDialog = ref(false);
const hotDetailTitle = ref('');
const hotDetailContent = ref('');
// AI提问dialog
const showAIDialog = ref(false);

// 文章润色dialog
const optimizedTitle = ref('');
const showAITitleDeatils = (index: number) => {
  showAITitleDialog.value = true;
  optimizedTitle.value = AITitleList.value[index].title;
};

const editorContent = ref(route.query.content as string);

const getHotSpots = async () => {
  const resp = await getHotList();
  hotList.value = resp;
};
// TODO: 要用的时候再打开！！！ 会有限额
// getHotSpots();

const showHotspotDeatils = (index: number) => {
  showHotDetailDialog.value = true;
  hotDetailTitle.value = hotList.value[index].title;
  hotDetailContent.value = hotList.value[index].digest;
};

// AI请求时的loading状态
const showLoading = ref(false);
const showLoadingStatus = () => {
  // 清空数据，展示loading状态
  AITitleList.value = [];
  AIClassifyList.value = [];
  AIWordList.value = [];
  showLoading.value = true;
};

// AI辅助搜索(问题)
const question = ref<string>('');
// 返回结果
const currentAnswer = ref('');
const randomAnswer = ref<string>('');
const currentIndex = ref(0);
const typingSpeed = ref(100);
const blinking = ref(true);
const askAIQuestions = async () => {
  randomAnswer.value = '';
  showAIDialog.value = true;
  instance({
    method: 'post',
    url: '/api/creation',
    data: {
      question: question.value,
    },
  })
    .then((resp: AxiosResponse<AIRespItem>) => {
      randomAnswer.value = resp.data.result;
      typeWriter();
    })
    .catch((error) => {
      randomAnswer.value = '网络问题，无法获取答案，请重新尝试！';
      console.error('网络问题:', error);
    });
};
// 打字机回答实现
const typeWriter = () => {
  const intervalId = setInterval(() => {
    if (currentIndex.value < randomAnswer.value.length) {
      currentAnswer.value += randomAnswer.value.charAt(currentIndex.value);
      currentIndex.value++;
    } else {
      clearInterval(intervalId);
      blinking.value = false; // 将blinking标记为false，停止闪烁
    }
  }, typingSpeed.value);
};
// 关闭AI弹窗，同时清空相应数据
const closeAIDialog = () => {
  question.value = '';
  showAIDialog.value = false;
  currentAnswer.value = '';
  randomAnswer.value = '';
};

// 复制文本
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error('复制失败:', err);
  }
  showSuccessAlert('复制成功!');
};

const showSuccessAlert = (text: string) => {
  success_text.value = text;
  success_alert.value = true;
  setTimeout(() => {
    success_alert.value = false;
    success_text.value = '';
  }, 1000);
};

// 文稿词句替换
const AIWordList = ref<any[]>([]);
const createWordReplacement = () => {
  const html = editorContent.value;
  const tag = document.createElement('div');
  tag.innerHTML = html;
  const text = tag.textContent;
  showLoadingStatus();
  instance({
    method: 'post',
    url: '/api/creation/word',
    data: {
      question: text,
    },
  })
    .then((resp: AxiosResponse<AIRespListItem>) => {
      AIWordList.value = resp.data.result || [];
      showLoading.value = false;
    })
    .catch((error) => {
      randomAnswer.value = '网络问题，无法获取答案，请重新尝试！';
      console.error('网络问题:', error);
      showLoading.value = false;
    });
};

// 文章标签
const AIClassifyList = ref<any[]>([]);
const createTagClassify = () => {
  const html = editorContent.value;
  const tag = document.createElement('div');
  tag.innerHTML = html;
  const text = tag.textContent;
  showLoadingStatus();
  instance({
    method: 'post',
    url: '/api/creation/classify',
    data: {
      question: text,
    },
  })
    .then((resp: AxiosResponse<AIRespListItem>) => {
      AIClassifyList.value = resp.data.result
        ? resp.data.result.map((item) => {
            return { title: item };
          })
        : [];
      showLoading.value = false;
    })
    .catch((error) => {
      console.error('网络问题:', error);
      showLoading.value = false;
    });
};

const AITitleList = ref<any[]>([]);
const showAITitleDialog = ref(false);
// 文章标题自动生成
const createAITitle = () => {
  const html = editorContent.value;
  const tag = document.createElement('div');
  tag.innerHTML = html;
  const text = tag.textContent;
  showLoadingStatus();
  instance({
    method: 'post',
    url: '/api/creation/title',
    data: {
      question: text,
    },
  })
    .then((resp: AxiosResponse<AIRespListItem>) => {
      AITitleList.value = resp.data.result
        ? resp.data.result.map((item) => {
            return { title: item };
          })
        : [];
      showLoading.value = false;
    })
    .catch((error) => {
      randomAnswer.value = '网络问题，无法获取答案，请重新尝试！';
      console.error('网络问题:', error);
      showLoading.value = false;
    });
};

// 用于创建新的文稿
const showCreateFileDialog = ref(false);
const newFileName = ref(route.query.file_name || '');

const createFile = async () => {
  // 请求创建文件夹接口
  instance({
    method: 'post',
    url: '/api/file',
    data: {
      file_name: newFileName.value,
      owner: localStorage.getItem('user_id'),
      content: editorContent.value,
    },
  })
    .then(() => {
      showSuccessAlert('文稿创建成功！');
      // 重置dialog
      showCreateFileDialog.value = false;
    })
    .catch((error) => {
      console.error('创建失败:', error);
    });
};

// 保存文件
const saveFile = () => {
  if (isNew.value) {
    showCreateFileDialog.value = true;
  } else {
    instance({
      method: 'patch',
      url: `/api/file/${route.query.file_id}`,
      data: {
        content: editorContent.value,
      },
    })
      .then(() => {
        showSuccessAlert('保存成功！');
      })
      .catch((error) => {
        console.error('保存失败:', error);
      });
  }
};

// 重命名文件
const renameFile = () => {
  instance({
    method: 'patch',
    url: `/api/file/${route.query.file_id}`,
    data: {
      file_name: newFileName.value,
    },
  })
    .then(() => {
      showRenameFileDialog.value = false;
      showSuccessAlert('修改成功！');
    })
    .catch((error) => {
      console.error('修改失败:', error);
    });
};

// 删除文件
const showDeleteFileDialog = ref(false);
const deleteFile = () => {
  instance({
    method: 'delete',
    url: `/api/file/${route.query.file_id}`,
  })
    .then(() => {
      showDeleteFileDialog.value = false;
      showSuccessAlert('删除成功！');
    })
    .catch((error) => {
      console.error('删除失败:', error);
    });
};

// 创建标签
const showCreateTagDialog = ref(false);
const showTagAssociateDialog = ref(false);
const tagName = ref('');
const createTag = () => {
  instance({
    method: 'patch',
    url: `/api/tag/${route.query.file_id}`,
    data: {
      tag_name: tagName.value,
    },
  })
    .then(() => {
      showCreateTagDialog.value = false;
      showTagAssociateDialog.value = false;
      tagName.value = '';
      getFileDetail();
      showSuccessAlert('标签创建成功！');
    })
    .catch((error) => {
      console.error('删除失败:', error);
    });
};

const associateTag = (name: string) => {
  tagName.value = name;
  showTagAssociateDialog.value = true;
};

const tag_id = ref<number | null>(null);
const showDeleteTagDialog = ref(false);
const deleteTag = () => {
  instance({
    method: 'delete',
    url: `/api/tag/${tag_id.value}`,
  })
    .then(() => {
      showDeleteTagDialog.value = false;
      getFileDetail();
      showSuccessAlert('删除成功！');
    })
    .catch((error) => {
      console.error('删除失败:', error);
    });
};
const confirmDeleteTag = (id: number) => {
  tag_id.value = id;
  showDeleteTagDialog.value = true;
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
      showSuccessAlert('文稿共享成功！');
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
.tag-container {
  display: flex;

  .delete-tag {
    margin: 0 8px;
    cursor: pointer;
  }
}

.hot-news {
  background-color: #f5f5f5;
  display: flex;
  justify-content: center;
  align-items: center;
}

.title {
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
}

.title-text {
  font-size: 28px;
  font-weight: bold;
  text-align: center;
  color: #333;
  z-index: 1;
}
.title-subtext {
  font-size: 14px;
  text-align: center;
  color: #333;
  z-index: 1;
}

.line {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  width: 100%;
  height: 1px;
  background-color: #ccc;
  z-index: 0;
}

.circle {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 50%);
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #333;
}

.alert {
  left: 50%;
  // transform: translateX(-50%);
  top: 40px;
  z-index: 10000;
}

.btn-container {
  background-color: #f5f5f5 !important;
}

.btn-subcontainer {
  display: flex;
  justify-content: space-around;
}

.empty-text {
  font-size: 16px;
  padding: 16px;
  text-align: center;
}

.answer {
  font-family: monospace;
  font-size: 16px;
  line-height: 1.5;
}

.blinking:after {
  content: '|';
  display: inline-block;
  margin-left: 5px;
  animation: blink 1s infinite;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

.edit_before {
  background-color: yellow;
}

.edit_after {
  background-color: green;
}

.loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100% - 128px);
  width: 100%;
}

.loader {
  // width: 20px; /* 设置圆环的宽度 */
  // height: 20px; /* 设置圆环的高度 */
  animation: spin 1s linear infinite; /* 设置动画，名称为"spin"，持续时间为2秒，线性运动，无限循环 */
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  } /* 起始状态，圆环没有旋转 */
  100% {
    transform: rotate(360deg);
  } /* 最终状态，圆环旋转一周，360度 */
}
</style>
