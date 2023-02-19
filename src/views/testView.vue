<template>
  <Editor
    api-key="ej8vo2s2u5a6b5g04917ajn437b37nxf5olm4yemnyz9gcad"
    :init="{
      skin: 'oxide-dark',
      content_css: 'dark',
      branding: false,
      plugins: 'lists link image table code help wordcount',
    }"
  />
</template>

<script setup lang="ts">
import Editor from '@tinymce/tinymce-vue';
</script>
