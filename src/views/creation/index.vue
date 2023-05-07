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
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
    </template>
    <!-- TODO: 需要修改成文件名称，若不存在，则直接显示untitled -->
    <v-app-bar-title>Creation</v-app-bar-title>
    <v-spacer></v-spacer>

    <v-responsive max-width="156">
      <v-btn color="success" prepend-icon="mdi-check-circle" variant="flat" @click="saveFile">
        <template v-slot:prepend>
          <v-icon color="white"></v-icon>
        </template>
        保存
      </v-btn>
      <!-- <v-text-field
        bg-color="grey-lighten-2"
        class="rounded-pill overflow-hidden"
        density="compact"
        hide-details
        variant="solo"
      ></v-text-field> -->
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
          // content_css: 'dark',
          branding: false,
          height: 580,
          plugins: 'lists link image table code help wordcount',
        }"
      />
      <v-card class="w-100 mt-4" :class="$style['btn-container']">
        <template v-slot:title>文稿润色功能</template>
        <template v-slot:text>
          <div :class="$style['btn-subcontainer']">
            <v-btn color="primary" @click="createWordReplacement">词句替换</v-btn>
            <v-btn color="secondary" @click="createTypoCorrection">别字纠错</v-btn>
            <v-btn color="purple" @click="createAITitle">标题生成</v-btn>
          </div>
        </template>
      </v-card>
    </div>
  </v-main>

  <v-navigation-drawer location="right">
    <v-sheet color="grey-lighten-3" :class="$style['hot-news']" width="100%" height="128">
      <div :class="$style.title">
        <span :class="$style['title-text']">文稿润色</span>
        <span :class="$style['title-subtext']">词句替换，别字纠错等</span>
        <span :class="$style.circle"></span>
      </div>
    </v-sheet>
    <v-list v-if="optimizedList.length">
      <v-list-item v-for="item in optimizedList" :key="item.title" :title="item.title" link></v-list-item>
    </v-list>
    <div v-else :class="$style['empty-text']">优化内容都会显示在此哦～</div>
  </v-navigation-drawer>

  <v-footer app height="72">
    <v-text-field
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
  <!-- 创建新文件dialog -->
  <v-dialog v-model="showCreateFileDialog" width="450">
    <v-card>
      <v-card-title>
        <span class="headline">Create new file</span>
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
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import Editor from '@tinymce/tinymce-vue';
import { getHotList } from '@/api';
import type { AIRespItem, NewsItem } from '@/types/creation';
import axios from 'axios';

const route = useRoute();
const isNew = !route.query;

const success_alert = ref(false);
const success_text = ref('');
const hotList = ref<NewsItem[]>([]);
// hotItem细节展示
const showHotDetailDialog = ref(false);
const hotDetailTitle = ref('');
const hotDetailContent = ref('');
// AI提问dialog
const showAIDialog = ref(false);

const editorContent = ref(route.query.content);

const editorRef = ref();

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
  axios({
    method: 'post',
    url: '/api/creation',
    data: {
      question: question.value,
    },
  })
    .then((resp: AIRespItem) => {
      randomAnswer.value = resp.data.result;
      typeWriter();
      console.log(resp);
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
    console.log('复制成功');
  } catch (err) {
    console.error('复制失败:', err);
  }
  showSuccessAlert('复制成功!');
  showHotDetailDialog.value = false;
  console.log(editorRef.value);
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
const createWordReplacement = () => {
  axios({
    method: 'post',
    url: '/api/creation/word',
    data: {
      question: editorContent.value,
    },
  })
    .then((resp: AIRespItem) => {
      // TODO: 传给list
      console.log(resp);
    })
    .catch((error) => {
      randomAnswer.value = '网络问题，无法获取答案，请重新尝试！';
      console.error('网络问题:', error);
    });
};

// 别字纠错
const createTypoCorrection = () => {
  axios({
    method: 'post',
    url: '/api/creation/typo',
    data: {
      question: question.value,
    },
  })
    .then((resp: AIRespItem) => {
      randomAnswer.value = resp.data.result;
      typeWriter();
      console.log(resp);
    })
    .catch((error) => {
      randomAnswer.value = '网络问题，无法获取答案，请重新尝试！';
      console.error('网络问题:', error);
    });
};

// 文章标题自动生成
const createAITitle = () => {
  // axios({
  //   method: 'post',
  //   url: '/api/creation/title',
  //   data: {
  //     question: question.value,
  //   },
  // })
  //   .then((resp: AIRespItem) => {
  //     randomAnswer.value = resp.data.result;
  //     typeWriter();
  //     console.log(resp);
  //   })
  //   .catch((error) => {
  //     randomAnswer.value = '网络问题，无法获取答案，请重新尝试！';
  //     console.error('网络问题:', error);
  //   });
};

// 用于创建新的文稿
const showCreateFileDialog = ref(false);
const newFileName = ref('');

const createFile = async () => {
  // 请求创建文件夹接口
  axios({
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
      newFileName.value = '';
    })
    .catch((error) => {
      console.error('登陆失败:', error);
    });
};

const saveFile = () => {
  if (isNew) {
    showCreateFileDialog.value = true;
  } else {
    axios({
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

// 文稿润色功能
const optimizedList = ref<any[]>([]);
</script>
<style lang="scss" module>
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
</style>
