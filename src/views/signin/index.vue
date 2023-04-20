<template>
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
        <label for="name">{{ isActive ? 'Email Address' : '电子邮箱' }}</label>
        <div>
          <input
            type="text"
            v-model="username"
            :placeholder="isActive ? 'Please enter the correct email' : '请输入正确邮箱'"
          /><img v-if="username.length >= 4" src="@/assets/images/ok.svg" alt="" />
        </div>

        <div class="button_action">
          <button @click="username = `${username}gmail.com`">@gmail.com</button>
          <button @click="username = `${username}@outlook.com`">@outlook.com</button>
          <button @click="username = `${username}@qq.com`">@qq.com</button>
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
          <input type="checkbox" name="" id="" /> <label for="">{{ isActive ? 'Remember Me' : '记住账号' }}</label>
        </div>

        <a href="">{{ isActive ? 'Forget Password ?' : '忘记密码？' }}</a>
      </div>

      <button class="log">{{ isActive ? 'Sign In' : '登录' }}</button>

      <span
        >{{ isActive ? "Don't have an account yet? " : '还没有账号？'
        }}<a href="/signup">{{ isActive ? ' Sign Up' : '注册' }}</a>
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const password = ref('');
// const userLoggedIn = ref(false);
const username = ref('');
const isActive = ref(false);
// method: {
//   changeStep() {
//     this.$emit('nextStep', 'signinfr');
//   },
// },
</script>

<style lang="scss" scoped>
@import '@/assets/scss/login.scss';
</style>
