<template>
  <a-drawer v-model:open="drawerOpen" placement="right" width="800" title="埋点调试">
    <a-space direction="vertical" size="large" style="width: 100%">
      <a-card title="控制">
        <a-space>
          <a-button type="primary" @click="scan">扫描埋点</a-button>
          <a-input v-model:value="filter" placeholder="按 id 或 action 过滤" style="width: 260px" />
          <a-tag v-if="mapLoaded" color="green">已检测到 nanobrowser-map</a-tag>
          <a-tag v-else color="red">未检测到 nanobrowser-map</a-tag>
        </a-space>
      </a-card>
      <a-card title="payload">
        <a-space>
          <a-input v-model:value="payloadText" placeholder="文本" style="width: 160px" />
          <a-select v-model:value="payloadOption" placeholder="城市（如：北京）" style="width: 160px">
            <a-select-option value="北京">北京</a-select-option>
            <a-select-option value="上海">上海</a-select-option>
            <a-select-option value="深圳">深圳</a-select-option>
            <a-select-option value="杭州">杭州</a-select-option>
            <a-select-option value="成都">成都</a-select-option>
            <a-select-option value="武汉">武汉</a-select-option>
          </a-select>
          <a-date-picker v-model:value="payloadDate" format="YYYY-MM-DD" valueFormat="YYYY-MM-DD" style="width: 180px" />
          <a-time-picker v-model:value="payloadValue" format="HH:mm:ss" valueFormat="HH:mm:ss" style="width: 200px" />
        </a-space>
      </a-card>
      <a-card title="元素">
        <a-table :data-source="rows" :columns="columns" row-key="selector" />
      </a-card>
    </a-space>
  </a-drawer>
</template>

<script lang="ts" setup>
import { computed, ref, h, resolveComponent } from 'vue';
import { message } from 'ant-design-vue';

const api: any = (window as any).__nbInstrumentation;
const filter = ref('');
const scan = () => api && api.scan();
const mapLoaded = computed(() => !!(api && api.state && api.state.map));
const rows = computed(() => {
  const f = filter.value.trim().toLowerCase();
  const list = (api && api.state && api.state.elements) || [];
  if (!f) return list;
  return list.filter((x: any) => (x.id || '').toLowerCase().includes(f) || (x.action || '').toLowerCase().includes(f));
});
const Button = resolveComponent('a-button');
const columns = [
  { title: 'id', dataIndex: 'id' },
  { title: 'action', dataIndex: 'action' },
  { title: 'role', dataIndex: 'role' },
  { title: 'format', dataIndex: 'format' },
  { title: 'selector', dataIndex: 'selector' },
  { title: 'page', dataIndex: 'page' },
  {
    title: '操作',
    fixed: 'right',
    key: 'op',
    customRender: ({ record }: any) => {
      const run = () => {
        if (!api) return;
        const payload = buildPayload(record);
        let ok = api.runElement(record, payload);
        if (!ok && record.page && location.pathname !== record.page) {
          window.history.pushState({}, '', record.page);
          dispatchEvent(new PopStateEvent('popstate'));
          setTimeout(() => { api.scan(); const ok2 = api.runElement(record, payload); if (ok2) message.success('已执行'); else message.error('执行失败或未找到元素'); }, 500);
          return;
        }
        if (ok) message.success('已执行'); else message.error('执行失败或未找到元素');
      };
      return h(Button as any, { size: 'small', type: 'link', onClick: run }, { default: () => '运行' });
    }
  }
];

const payloadText = ref('示例输入');
const payloadOption = ref('北京');
const payloadDate = ref('1990-01-01');
const payloadValue = ref('12:00:00');

function buildPayload(record: any) {
  const a = (record && record.action) || '';
  if (a === 'input_text') return { text: payloadText.value };
  if (a === 'select_dropdown_option') return { option: payloadOption.value };
  if (a === 'set_date_picker_value') {
    const fmt = (record && record.format) || '';
    if (fmt === 'YYYY-MM-DD') return { value: payloadDate.value };
    if (fmt === 'HH:mm:ss') return { value: payloadValue.value };
    return {};
  }
  return {};
}
</script>
const props = defineProps<{ open: boolean }>();
const emit = defineEmits(['update:open']);
const drawerOpen = computed({ get: () => props.open, set: (v: boolean) => emit('update:open', v) });