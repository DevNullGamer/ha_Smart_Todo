import * as esbuild from 'esbuild';
import { argv } from 'process';

const watch = argv.includes('--watch');

const ctx = await esbuild.context({
  entryPoints: ['smart-todo-card.ts'],
  bundle: true,
  outfile: '../custom_components/smart_todo/www/smart-todo-card.js',
  format: 'esm',
  minify: !watch,
  sourcemap: watch ? 'inline' : false,
  target: 'es2022',
});

if (watch) {
  await ctx.watch();
  console.log('Watching for changes...');
} else {
  await ctx.rebuild();
  await ctx.dispose();
  console.log('Build complete → custom_components/smart_todo/www/smart-todo-card.js');
}
