<template>
  <a-layout style="min-height: 100vh">
    <a-layout-header>
      <a-menu theme="dark" mode="horizontal" :selectedKeys="selected">
        <a-menu-item key="home" @click="go('/')">交互示例</a-menu-item>
        <a-menu-item key="users" @click="go('/crud/users')">CRUD 测试</a-menu-item>
      </a-menu>
    </a-layout-header>
    <a-layout-content style="padding: 24px">
      <router-view />
    </a-layout-content>
    <InstrumentationDebug :open="debugOpen" @update:open="v => debugOpen = v" />
    <div :style="fbStyle" @mousedown.prevent="onFbMouseDown">
      <a-button type="primary" size="large" @click.stop="openDebug">埋点调试</a-button>
    </div>
  </a-layout>
  </template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import InstrumentationDebug from './pages/InstrumentationDebug.vue';

const route = useRoute();
const selected = computed(() => {
  if (route.path.startsWith('/crud')) return ['users'];
  return ['home'];
});

const go = (path: string) => {
  window.history.pushState({}, '', path);
  dispatchEvent(new PopStateEvent('popstate'));
};

const debugOpen = ref(false);
const openDebug = () => { debugOpen.value = true; };

const fbLeft = ref(24);
const fbTop = ref(96);
const fbStyle = computed(() => ({ position: 'fixed', left: fbLeft.value + 'px', top: fbTop.value + 'px', zIndex: 1000 }));
let dragStartX = 0;
let dragStartY = 0;
let startLeft = 0;
let startTop = 0;
let dragging = false;
const onFbMouseDown = (e: MouseEvent) => {
  dragging = true;
  dragStartX = e.clientX;
  dragStartY = e.clientY;
  startLeft = fbLeft.value;
  startTop = fbTop.value;
  window.addEventListener('mousemove', onFbMouseMove);
  window.addEventListener('mouseup', onFbMouseUp);
};
const onFbMouseMove = (e: MouseEvent) => {
  if (!dragging) return;
  const dx = e.clientX - dragStartX;
  const dy = e.clientY - dragStartY;
  const w = window.innerWidth;
  const h = window.innerHeight;
  const bw = 140;
  const bh = 48;
  const nl = Math.max(0, Math.min(w - bw, startLeft + dx));
  const nt = Math.max(0, Math.min(h - bh, startTop + dy));
  fbLeft.value = nl;
  fbTop.value = nt;
};
const onFbMouseUp = () => {
  dragging = false;
  window.removeEventListener('mousemove', onFbMouseMove);
  window.removeEventListener('mouseup', onFbMouseUp);
};
</script>