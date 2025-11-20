<template>
  <div style="padding: 24px; max-width: 640px">
    <a-typography-title :level="3">新建用户</a-typography-title>
    <a-form layout="vertical" @finish="submit">
      <a-form-item label="姓名" name="name" :rules="[{ required: true }]">
        <a-input v-model:value="name" data-nb-id="user_name" data-nb-action="input_text" placeholder="请输入姓名" />
      </a-form-item>
      <a-form-item label="邮箱" name="email" :rules="[{ required: true }]">
        <a-input v-model:value="email" data-nb-id="user_email" data-nb-action="input_text" placeholder="请输入邮箱" />
      </a-form-item>
      <a-form-item label="城市" name="city" :rules="[{ required: true }]">
        <a-select v-model:value="city" data-nb-id="user_city" data-nb-action="select_dropdown_option" placeholder="请选择城市">
          <a-select-option value="北京">北京</a-select-option>
          <a-select-option value="上海">上海</a-select-option>
          <a-select-option value="深圳">深圳</a-select-option>
          <a-select-option value="杭州">杭州</a-select-option>
          <a-select-option value="成都">成都</a-select-option>
          <a-select-option value="武汉">武汉</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="出生日期" name="birthDate" :rules="[{ required: true }]">
        <a-date-picker v-model:value="birthDate" format="YYYY-MM-DD" valueFormat="YYYY-MM-DD" data-nb-id="user_birth_date" data-nb-action="set_date_picker_value" data-nb-role="date-picker" data-nb-format="YYYY-MM-DD" />
      </a-form-item>
      <a-space>
        <a-button html-type="submit" type="primary" data-nb-id="user_create_submit" data-nb-action="click">提交</a-button>
        <a-button data-nb-id="user_create_cancel" data-nb-action="click" @click="$router.push('/crud/users')">取消</a-button>
      </a-space>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { usersStore } from '../store/users';

const name = ref('');
const email = ref('');
const city = ref<string | undefined>();
const birthDate = ref<string | null>(null);

const submit = () => {
  if (!name.value || !email.value || !city.value || !birthDate.value) return;
  usersStore.create({ name: name.value, email: email.value, city: city.value, birthDate: birthDate.value! });
  window.history.pushState({}, '', '/crud/users');
  const navEvent = new PopStateEvent('popstate');
  dispatchEvent(navEvent);
};
</script>