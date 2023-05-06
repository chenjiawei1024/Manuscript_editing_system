<template>
  <div>
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
          <div :class="$style.title">{{ title }}</div>
          <dic :class="$style.time">{{ time }}</dic>
        </div>
      </v-card>
    </v-hover>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

const props = defineProps<{
  title: String;
  time: String;
}>();

const isEmpty = ref(true);
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
</style>
