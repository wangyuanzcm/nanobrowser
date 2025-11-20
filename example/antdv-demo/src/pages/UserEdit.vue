<template>
  <div style="padding: 24px; max-width: 640px">
    <a-typography-title :level="3">编辑用户</a-typography-title>
    <a-form layout="vertical" @finish="submit">
      <a-form-item label="姓名" name="name" :rules="[{ required: true }]">
        <a-input v-model:value="name" data-nb-id="user_edit_name" data-nb-action="input_text" />
      </a-form-item>
      <a-form-item label="邮箱" name="email" :rules="[{ required: true }]">
        <a-input v-model:value="email" data-nb-id="user_edit_email" data-nb-action="input_text" />
      </a-form-item>
      <a-form-item label="城市" name="city" :rules="[{ required: true }]">
        <a-select v-model:value="city" data-nb-id="user_edit_city" data-nb-action="select_dropdown_option">
          <a-select-option value="北京">北京</a-select-option>
          <a-select-option value="上海">上海</a-select-option>
          <a-select-option value="深圳">深圳</a-select-option>
          <a-select-option value="杭州">杭州</a-select-option>
          <a-select-option value="成都">成都</a-select-option>
          <a-select-option value="武汉">武汉</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="出生日期" name="birthDate" :rules="[{ required: true }]">
        <a-date-picker v-model:value="birthDate" format="YYYY-MM-DD" valueFormat="YYYY-MM-DD" data-nb-id="user_edit_birth_date" data-nb-action="set_date_picker_value" data-nb-role="date-picker" data-nb-format="YYYY-MM-DD" />
      </a-form-item>
      <a-space>
        <a-button html-type="submit" type="primary" data-nb-id="user_edit_submit" data-nb-action="click">保存</a-button>
        <a-button data-nb-id="user_edit_cancel" data-nb-action="click" @click="$router.push('/crud/users')">取消</a-button>
      </a-space>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { usersStore } from '../store/users';

const route = useRoute();
const id = Number(route.params.id);
const name = ref('');
const email = ref('');
const city = ref<string | undefined>();
const birthDate = ref<string | null>(null);

onMounted(() => {
  const u = usersStore.get(id);
  if (u) {
    name.value = u.name;
    email.value = u.email;
    city.value = u.city;
    birthDate.value = u.birthDate;
  }
});

const submit = () => {
  usersStore.update(id, { name: name.value, email: email.value, city: city.value, birthDate: birthDate.value || '' });
  window.history.pushState({}, '', '/crud/users');
  dispatchEvent(new PopStateEvent('popstate'));
};
</script>