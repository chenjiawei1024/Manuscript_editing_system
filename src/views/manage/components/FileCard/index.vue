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
        :height="218"
        class="pa-0 w-100"
        :class="[$style.container, isHovering && $style['card-hover']]"
        :elevation="isHovering ? 2 : 0"
      >
        <div :class="$style['file-container']">
          <v-tooltip v-if="tags && tags.length" location="bottom" :text="tags[0].tag_name">
            <template v-slot:activator="{ props }">
              <v-icon v-if="tags && tags.length" v-bind="props" :class="$style.tag">mdi-tag-multiple</v-icon>
            </template>
          </v-tooltip>
          <div :class="$style['file-content']">
            <span v-if="isEmpty" :class="$style.word"> [空] </span>
            <span v-else :class="[$style.word, $style['text-container']]" v-html="content"></span>
          </div>
        </div>
        <div :class="$style['content-container']">
          <div :class="$style.title">
            <span>{{ title }}</span>
            <v-hover v-slot="{ isHovering, props }">
              <v-icon v-bind="props" color="#ffb357" :elevation="isHovering ? 4 : 0" @click.stop="emitLike">{{
                islike_text
              }}</v-icon>
            </v-hover>
          </div>
          <dic :class="$style.time">{{ time }}</dic>
        </div>
      </v-card>
    </v-hover>
  </div>
</template>
<script lang="ts" setup>
import instance from '@/api';
import type { TagDetailItem } from '@/types/manage';
import { computed } from 'vue';
import { ref } from 'vue';

const props = defineProps<{
  file_id: number;
  title: String;
  time: String;
  is_favor: boolean;
  content: string;
  tags?: Array<TagDetailItem>;
}>();

const emits = defineEmits<{
  (event: 'like'): void;
}>();

const islike_text = computed(() => (props.is_favor ? 'mdi-star' : 'mdi-star-outline'));

const isEmpty = ref(!props.content);

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

const emitLike = () => {
  instance({
    method: 'patch',
    url: `/api/file/${props.file_id}/favor`,
  })
    .then(() => {
      if (!props.is_favor) {
        showSuccessAlert('文件收藏成功！');
      } else {
        showSuccessAlert('文件取消收藏！');
      }
      emits('like');
    })
    .catch((error) => {
      console.error('收藏失败:', error);
    });
};
</script>
<style lang="scss" module>
.card-hover:hover {
  background-color: rgb(247, 247, 247);
  cursor: pointer;
}

.container {
  border: #e9e9e9 1px solid;
  .file-container {
    position: relative;
    width: 100%;
    height: 148px;

    .tag {
      position: absolute;
      left: 0;
      top: 0;
    }

    .file-img {
      display: block;
    }

    .file-content {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      width: 100%;
      border-bottom: 1px solid #e9e9e9;
      background-color: #fff;
      margin-top: -1px;
      background-color: #fafafa;
      padding: 8px;

      .text-container {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 5;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .word {
        color: rgba(32, 32, 32, 0.6);
      }
    }
  }
  .content-container {
    min-width: 0;
    width: 100%;
    padding: 8px;
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
}

.alert {
  left: 50%;
  transform: translateX(-50%);
  top: 40px;
  z-index: 10000;
}
</style>
