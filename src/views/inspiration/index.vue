<template>
  <v-container class="ml-7 mr-7 w-auto" :fluid="true" :class="$style['img-container']">
    <!-- 成功提示框 -->
    <!-- <v-alert
      v-model="success_alert"
      :class="$style.alert"
      density="compact"
      position="fixed"
      type="success"
      :text="success_text"
      min-width="250"
    ></v-alert> -->
    <v-row>
      <v-col v-for="n in 100" cols="4" sm="3" md="2" lg="1" :key="n">
        <v-hover v-slot="{ isHovering, props }">
          <v-card
            v-bind="props"
            :elevation="isHovering ? 12 : 0"
            @click="showDownload(`https://picsum.photos/500/500?image=${n * 5 + 10}`)"
          >
            <v-img
              :src="`https://picsum.photos/500/500?image=${n * 5 + 10}`"
              :lazy-src="`https://picsum.photos/10/6?image=${n * 5 + 10}`"
              aspect-ratio="1"
              cover
              class="bg-grey-lighten-2"
            >
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular indeterminate color="grey-lighten-5"></v-progress-circular>
                </v-row>
              </template>
              <template v-slot:error>
                <div>
                  <v-img
                    :src="`https://picsum.photos/500/500?image=${n * 5 + 10}`"
                    :lazy-src="`https://picsum.photos/10/6?image=${n * 5 + 10}`"
                    aspect-ratio="1"
                    cover
                    class="bg-grey-lighten-2"
                  ></v-img>
                </div>
              </template>
            </v-img>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
    <v-dialog v-model="showDownloadDialog" width="450">
      <v-card>
        <v-card-title>
          <span class="headline">Download Image</span>
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="file_name" label="Image name"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="downloadImg">Download</v-btn>
          <v-btn color="secondary" @click="showDownloadDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

const file_name = ref('');
const showDownloadDialog = ref(false);
const downloadUrl = ref('');

// const copyUrl = async (url: string) => {
//   await navigator.clipboard.writeText(url);
//   const newUrl = url.replaceAll('500', '1500');
//   const link = document.createElement('a');
//   link.href = newUrl;
//   link.download = file_name.value;
//   link.click();
// };
const downloadImg = async () => {
  showDownloadDialog.value = false;
  const newUrl = downloadUrl.value.replaceAll('500', '1500');
  downloadUrl.value = '';
  fetch(newUrl)
    .then((response) => response.blob())
    .then((blob) => {
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = file_name.value;

      // 触发点击事件进行下载
      downloadLink.click();
      // showSuccessAlert('download successfully!');

      // 清理URL对象
      URL.revokeObjectURL(downloadLink.href);
    });
};

const showDownload = (url: string) => {
  downloadUrl.value = url;
  showDownloadDialog.value = true;
};

// const success_text = ref('');
// const success_alert = ref(false);
// /** success弹框显示隐藏 */
// const showSuccessAlert = (text: string) => {
//   success_text.value = text;
//   success_alert.value = true;
//   setTimeout(() => {
//     success_alert.value = false;
//     success_text.value = '';
//   }, 1000);
// };
</script>
<style lang="scss" module>
.img-container {
  overflow: scroll;
  height: calc(100vh - 32px);
}
</style>
