<template>
  <main>
    <TheWelcome />
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TheWelcome from '../components/TheWelcome.vue';
import { getHotList } from '../api';
const data = ref({});
data.value = getHotList();
console.log(data.value);
</script>
