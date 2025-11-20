<template>
  <div style="padding: 24px">
    <a-space direction="vertical" size="large" style="width: 100%">
      <a-typography-title :level="3">用户列表</a-typography-title>
      <a-button type="primary" data-nb-id="users_create" data-nb-action="click" @click="$router.push('/crud/users/create')">新建</a-button>
      <a-table :data-source="dataSource" :columns="columns" row-key="id" />
    </a-space>
  </div>
</template>

<script lang="ts" setup>
import { computed, h } from 'vue';
import { usersStore } from '../store/users';

const dataSource = computed(() => usersStore.list());

const columns = [
  { title: 'ID', dataIndex: 'id' },
  { title: '姓名', dataIndex: 'name' },
  { title: '邮箱', dataIndex: 'email' },
  { title: '城市', dataIndex: 'city' },
  { title: '出生日期', dataIndex: 'birthDate' },
  {
    title: '操作',
    key: 'action',
    customRender: ({ record }: any) => h('a-space', null, [
      h('a-button', {
        size: 'small',
        'data-nb-id': `users_view_${record.id}`,
        'data-nb-action': 'click',
        onClick: () => navigate(`/crud/users/${record.id}`)
      }, { default: () => '查看' }),
      h('a-button', {
        size: 'small',
        'data-nb-id': `users_edit_${record.id}`,
        'data-nb-action': 'click',
        onClick: () => navigate(`/crud/users/${record.id}/edit`)
      }, { default: () => '编辑' }),
      h('a-popconfirm', {
        title: '确认删除？',
        'ok-text': '是',
        'cancel-text': '否',
        onConfirm: () => remove(record.id)
      }, {
        default: () => h('a-button', {
          danger: true,
          size: 'small',
          'data-nb-id': `users_delete_${record.id}`,
          'data-nb-action': 'click'
        }, { default: () => '删除' })
      })
    ])
  }
];

const navigate = (path: string) => {
  window.history.pushState({}, '', path);
  const navEvent = new PopStateEvent('popstate');
  dispatchEvent(navEvent);
};

const remove = (id: number) => {
  usersStore.remove(id);
};
</script>