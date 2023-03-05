<template>
  <div class="box">
    <div class="banner_high">
      <!-- <img src="../assets/images/logo.svg" alt="" /> -->
      <h1>注册</h1>
      <div class="language">
        <div class="flag" :class="{ active: isActive }" @click="isActive = !isActive">
          <img src="../assets/images/cn_flag.svg" alt="" />
        </div>
        <div class="flag" :class="{ active: !isActive }" @click="isActive = !isActive">
          <img src="../assets/images/en_flag.svg" alt="" />
        </div>
      </div>
    </div>

    <div class="in">
      <label for="name">昵称</label>
      <div>
        <input type="text" v-model="username" placeholder="输入您的昵称" /><img
          v-if="username.length >= 5"
          src="../assets/images/ok.svg"
          alt=""
        />
      </div>

      <label for="name">电子邮箱</label>
      <div>
        <input type="text" v-model="mail" placeholder="输入您的邮箱" /><img
          v-if="mail.length >= 6"
          src="../assets/images/ok.svg"
          alt=""
        />
      </div>

      <div class="button_action">
        <button @click="username = `${username}gmail.com`">@gmail.com</button>
        <button @click="username = `${username}@yahoo.com`">@yahoo.com</button>
        <button @click="username = `${username}@outlook.com`">@outlook.com</button>
        <button @click="username = `${username}@qq.com`">@qq.com</button>
      </div>

      <!-- <label for="name">Confirmer l'adresse mail</label>
      <div>
        <input type="text" v-model="mail_confirm" placeholder="Confirmer l'adresse mail ..." /><img
          v-if="!mail"
          style="display: none"
          src="../assets/ok.svg"
          alt=""
        /><img v-else-if="mail_confirm === mail" src="../assets/ok.svg" alt="" />
      </div> -->
    </div>

    <div class="in">
      <label for="name">密码</label>
      <div>
        <!-- <v-text-field type="password"> -->
        <input v-model="password_confirmation" type="password" placeholder="至少8个字符" required />
        <img v-if="password_confirmation.length >= 8" src="../assets/images/ok.svg" alt="" />
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
        <img v-if="!password_confirmation" style="display: none" src="../assets/images/ok.svg" alt="" />
        <img v-else-if="password === password_confirmation" src="../assets/images/ok.svg" alt="" />
        <!-- </v-text-field> -->
      </div>
    </div>

    <div class="check_bar">
      <div><input type="checkbox" name="" id="" /> <label for="">记住账号</label></div>

      <a href="">忘记密码 ？</a>
    </div>

    <button class="log">登录</button>

    <span>已经注册 ？<a href="/signin">登录</a> </span>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const password = ref('');
// const userLoggedIn = ref(false);
const username = ref('');
const mail = ref('');
// const mail_confirm = ref('');
const password_confirmation = ref('');
const isActive = ref(false);

// const toggle = () => {
//   // isActive.value = !enable.value;
// };
</script>

<style lang="scss" scoped>
@import '@/assets/scss/login.scss';
</style>
