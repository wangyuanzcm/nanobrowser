<template>
  <div style="padding: 24px; max-width: 640px">
    <a-typography-title :level="3">用户详情</a-typography-title>
    <a-descriptions bordered :column="1">
      <a-descriptions-item label="ID">{{ user?.id }}</a-descriptions-item>
      <a-descriptions-item label="姓名">{{ user?.name }}</a-descriptions-item>
      <a-descriptions-item label="邮箱">{{ user?.email }}</a-descriptions-item>
      <a-descriptions-item label="城市">{{ user?.city }}</a-descriptions-item>
      <a-descriptions-item label="出生日期">{{ user?.birthDate }}</a-descriptions-item>
    </a-descriptions>
    <a-space style="margin-top: 16px">
      <a-button data-nb-id="users_detail_back" data-nb-action="click" @click="$router.push('/crud/users')">返回</a-button>
      <a-button type="primary" data-nb-id="users_detail_edit" data-nb-action="click" @click="$router.push(`/crud/users/${user?.id}/edit`)">编辑</a-button>
    </a-space>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { usersStore, type User } from '../store/users';

const route = useRoute();
const id = Number(route.params.id);
const user = ref<User | null>(null);

onMounted(() => {
  user.value = usersStore.get(id);
});
</script>