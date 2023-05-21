<template>
  <div class="login-container">
    <v-alert
      v-model:model-value="controlAlert"
      class="alert"
      density="compact"
      position="fixed"
      :type="controlType"
      :text="controlText"
      min-width="250"
    ></v-alert>
    <div class="box">
      <div class="banner_high">
        <!-- <img src="../assets/images/logo.svg" alt="" /> -->
        <h1>注册</h1>
        <div class="language">
          <div class="flag" :class="{ active: isActive }" @click="isActive = !isActive">
            <img src="@/assets/images/cn_flag.svg" alt="" />
          </div>
          <div class="flag" :class="{ active: !isActive }" @click="isActive = !isActive">
            <img src="@/assets/images/en_flag.svg" alt="" />
          </div>
        </div>
      </div>

      <div class="in">
        <label for="name">昵称</label>
        <div>
          <input type="text" v-model="username" placeholder="输入您的昵称" /><img
            v-if="username.length >= 5"
            src="@/assets/images/ok.svg"
            alt=""
          />
        </div>

        <label for="name">电子邮箱</label>
        <div>
          <input type="text" v-model="mail" placeholder="输入您的邮箱" /><img
            v-if="mail.length >= 6"
            src="@/assets/images/ok.svg"
            alt=""
          />
        </div>

        <div class="button_action">
          <button @click="mail = `${mail}gmail.com`">@gmail.com</button>
          <button @click="mail = `${mail}@outlook.com`">@outlook.com</button>
          <button @click="mail = `${mail}@qq.com`">@qq.com</button>
        </div>
      </div>

      <div class="in">
        <label for="name">密码</label>
        <div>
          <!-- <v-text-field type="password"> -->
          <input
            v-model="password_confirmation"
            autocomplete="off"
            type="password"
            placeholder="至少8个字符"
            required
          />
          <img v-if="password_confirmation.length >= 8" src="@/assets/images/ok.svg" alt="" />
          <!-- </v-text-field> -->
        </div>
        <div class="password_bar">
          <div :class="{ bar: true, green: password_confirmation.length > 1 }"></div>
          <div :class="{ bar: true, green: password_confirmation.length > 3 }"></div>
          <div :class="{ bar: true, green: password_confirmation.length > 5 }"></div>
          <div :class="{ bar: true, green: password_confirmation.length > 7 }"></div>
        </div>
        <label for="name">确认密码</label>
        <div>
          <!-- <v-text-field type="password"> -->
          <input v-model="password" type="password" placeholder="再次确认密码 ..." required />
          <img v-if="!password_confirmation" style="display: none" src="@/assets/images/ok.svg" alt="" />
          <img v-else-if="password === password_confirmation" src="@/assets/images/ok.svg" alt="" />
          <!-- </v-text-field> -->
        </div>
      </div>

      <div class="check_bar">
        <div><input type="checkbox" name="" id="" /> <label for="">记住账号</label></div>

        <a href="">忘记密码 ？</a>
      </div>

      <button class="log" @click="signup()">注册</button>

      <span>已经注册 ？<a href="/signin">登录</a> </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import bcrypt from 'bcryptjs';
import axios from 'axios';

const router = useRouter();

const password = ref('');
const username = ref('');
const mail = ref('');
const password_confirmation = ref('');
const isActive = ref(false);

// 注册
const signup = () => {
  axios({
    method: 'post',
    url: '/api/user',
    data: {
      name: username.value,
      password: bcrypt.hashSync(password.value, 10),
      email: mail.value,
    },
  })
    .then(() => {
      // 校验成功，跳转到指定路由
      showAlertTimeOut('注册成功！');
      setTimeout(() => {
        router.push('/signin');
      }, 1100);
    })
    .catch((error) => {
      console.error('登陆失败:', error);
    });
};

const controlAlert = ref(false);
const controlText = ref('');
const controlType = ref();
const showAlertTimeOut = (text: string, type = 'success', delay?: number) => {
  controlType.value = type;
  controlText.value = text;
  controlAlert.value = true;
  setTimeout(() => {
    controlAlert.value = false;
    controlText.value = '';
    controlType.value = '';
  }, delay || 1000);
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/login.scss';
</style>
