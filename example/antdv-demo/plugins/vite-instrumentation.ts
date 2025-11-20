import type { Plugin, IndexHtmlTransformContext } from 'vite';

export default function nbInstrumentationPlugin(): Plugin {
  let enabled = false;

  return {
    name: 'nb-instrumentation',
    configResolved(config) {
      console.log('config', config.command, config.mode);
      return (enabled = config.command === 'serve' ? true : config.mode === 'test');
    },
    transformIndexHtml(html: string, ctx?: IndexHtmlTransformContext) {
      if (!enabled) return html;
      return {
        html,
        tags: [{ tag: 'script', injectTo: 'body', attrs: { src: '/nb-instrumentation.js' } }],
      };
    },
  };
}
