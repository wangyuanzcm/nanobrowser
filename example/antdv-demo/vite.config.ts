import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import nbInstrumentationPlugin from './plugins/vite-instrumentation';

export default defineConfig({
  plugins: [vue(), nbInstrumentationPlugin()],
});
