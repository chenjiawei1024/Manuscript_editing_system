<template>
  <v-alert
    v-model:model-value="controlAlert"
    class="alert"
    density="compact"
    position="fixed"
    :type="controlType"
    :text="controlText"
    min-width="250"
  ></v-alert>
  <div class="login-container">
    <div class="box">
      <div class="banner_high">
        <img src="@/assets/images/logo.svg" alt="" />
        <div class="language">
          <div class="flag" :class="{ active: !isActive }">
            <img src="@/assets/images/cn_flag.svg" alt="" @click="isActive = !isActive" />
          </div>
          <div class="flag" :class="{ active: isActive }">
            <img src="@/assets/images/en_flag.svg" alt="" @click="isActive = !isActive" />
          </div>
        </div>
      </div>

      <h1>{{ isActive ? 'Sign In' : '登录' }}</h1>

      <div class="in">
        <label for="name">{{ isActive ? 'Username' : '用户名' }}</label>
        <div>
          <input
            type="text"
            v-model="username"
            :placeholder="isActive ? 'Please enter your name' : '请输入您的昵称'"
          /><img v-if="username.length >= 4" src="@/assets/images/ok.svg" alt="" />
        </div>
      </div>

      <div class="in">
        <label for="name">{{ isActive ? 'Password' : '密码' }}</label>
        <div>
          <input
            v-model="password"
            type="password"
            :placeholder="isActive ? '8 character minimum' : '至少八个字符'"
            required
          /><img v-if="password.length >= 8" src="@/assets/images/ok.svg" alt="" />
        </div>
      </div>

      <div class="password_bar">
        <div :class="{ bar: true, green: password.length > 1 }"></div>
        <div :class="{ bar: true, green: password.length > 3 }"></div>
        <div :class="{ bar: true, green: password.length > 5 }"></div>
        <div :class="{ bar: true, green: password.length > 7 }"></div>
      </div>

      <div class="check_bar">
        <div>
          <input v-model="rememberMe" type="checkbox" name="" id="" />
          <label for="">{{ isActive ? 'Remember Me' : '记住账号' }}</label>
        </div>

        <a href="">{{ isActive ? 'Forget Password ?' : '忘记密码？' }}</a>
      </div>

      <button class="log" @click="signin()">{{ isActive ? 'Sign In' : '登录' }}</button>

      <span
        >{{ isActive ? "Don't have an account yet? " : '还没有账号？'
        }}<a href="/signup">{{ isActive ? ' Sign Up' : '注册' }}</a>
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import type { signinRespItem } from '../../types/signin';

const router = useRouter();
const route = useRoute();

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

// token失效提示框
const hasToken = () => {
  if (route.query?.expired) {
    showAlertTimeOut('Token expired', 'error', 2000);
  }
};
hasToken();

const username = ref(localStorage.getItem('user_name') || '');
const password = ref('');
const isActive = ref(false);
// 初始化rememberMe按钮
const rememberMe = ref(!!localStorage.getItem('remember_me') || false);

// 登录
const signin = () => {
  if (rememberMe.value) {
    localStorage.setItem('user_name', username.value);
    localStorage.setItem('remember_me', '1');
  } else {
    localStorage.removeItem('user_name');
    localStorage.removeItem('remember_me');
  }
  if (password.value.length >= 8 && username.value) {
    axios({
      method: 'post',
      url: '/api/user/login',
      data: {
        name: username.value,
        password: password.value,
      },
    })
      .then((resp: signinRespItem) => {
        // 校验成功，存储token值, 跳转到指定路由
        localStorage.setItem('token', resp.data.token);
        localStorage.setItem('user_id', String(resp.data.user_id));
        showAlertTimeOut('Login successfully!');
        setTimeout(() => {
          router.push('/index');
        }, 1100);
      })
      .catch((error) => {
        showAlertTimeOut(error.response.data.message, 'error');
        console.error(error.response.data.message);
      });
  } else {
    showAlertTimeOut('Please enter the correct user password', 'warning');
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/login.scss';
.alert {
  left: 50%;
  transform: translateX(-50%);
  top: 40px;
}
</style>
