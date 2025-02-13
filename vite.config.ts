import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: [
        'vue',
        {
          '@vueuse/core': [
            'onClickOutside',
            'useDraggable',
            'useElementBounding',
            'clamp',
            'unrefElement',
            'tryOnMounted',
          ],
        },
      ],
      dts: './src/auto-imports.d.ts',
    }),
  ],
});
