<template>
  <v-hover v-slot="{ isHovering, props }">
    <v-card
      :height="68"
      :width="260"
      class="pa-3"
      v-bind="props"
      :elevation="isHovering ? 4 : 2"
      @click="emits('create')"
    >
      <div :class="$style['content-container']">
        <v-icon :color="color" size="44" class="mr-2">{{ icon || 'mdi-folder' }}</v-icon>
        <div :class="$style['title-container']">
          <div :class="$style.title">{{ title }}</div>
          <div :class="$style.subtitle">{{ subtitle }}</div>
        </div>
        <v-icon size="20" class="my-3">mdi-plus</v-icon>
      </div>
    </v-card>
  </v-hover>
</template>

<script lang="ts" setup>
const props = defineProps<{
  icon: string;
  color: string;
  title: string;
  subtitle: string;
}>();

const emits = defineEmits(['create']);
</script>

<style lang="scss" module>
.content-container {
  display: flex;
  flex-direction: row;

  .title-container {
    width: 148px;
    margin-right: 16px;

    .title {
      font-size: 13px;
      line-height: 20px;
      font-weight: 700;
      text-overflow: ellipsis;
    }

    .subtitle {
      font-size: 12px;
      line-height: 20px;
      text-overflow: ellipsis;
    }
  }
}
</style>
