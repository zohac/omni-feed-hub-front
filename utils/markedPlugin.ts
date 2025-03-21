// utils/markedPlugin.ts
import { marked } from 'marked'

const renderer = new marked.Renderer()

renderer.image = ({ href, title, text }) => {
  return `<img src="${href}" alt="${text}" title="${title}" class="article-image">`
}

export const markedWithImageClass = (markdown: string) => {
  return marked(markdown, { renderer })
}
