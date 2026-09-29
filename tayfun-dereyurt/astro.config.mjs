import { defineConfig } from 'astro/config';

const githubPages = process.env.DEPLOY_TARGET === 'github-pages';

export default defineConfig({
  output: 'static',
  site: githubPages
    ? 'https://tdereyurt.github.io'
    : 'https://tayfun-dereyurt-ai-data.swift-earth-1167.chatgpt.site',
  base: githubPages ? '/consulting_webpage' : '/',
});
