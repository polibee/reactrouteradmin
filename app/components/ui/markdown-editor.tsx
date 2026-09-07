import {
  Bold,
  Code,
  Columns2,
  Edit3,
  Eye,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  Link as LinkIcon,
  List,
  Minus,
  Quote,
} from 'lucide-react'
import { useRef, useState } from 'react'
import { Button } from '~/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { Textarea } from '~/components/ui/textarea'

export interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: string
  className?: string
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = '在此编写 Markdown 内容...',
  minHeight = '320px',
  className = '',
}: MarkdownEditorProps) {
  const [mode, setMode] = useState<'edit' | 'preview' | 'split'>('edit')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const insertText = (prefix: string, suffix = '', defaultText = '') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = value.substring(start, end) || defaultText

    const replacement = `${prefix}${selected}${suffix}`
    const newValue =
      value.substring(0, start) + replacement + value.substring(end)
    onChange(newValue)

    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selected.length,
      )
    }, 0)
  }

  const renderPreview = (content: string) => {
    if (!content.trim()) {
      return (
        <div className="text-muted-foreground py-8 text-center text-xs italic">
          暂无预览内容，请在左侧编辑器中输入文本...
        </div>
      )
    }

    const blocks = content.split('\n\n')
    return (
      <div className="text-foreground/90 max-w-none space-y-3 text-xs leading-relaxed sm:text-sm">
        {blocks.map((block, idx) => {
          if (block.startsWith('# ')) {
            return (
              <h1
                key={idx}
                className="text-foreground border-b pt-2 pb-1.5 text-xl font-bold"
              >
                {block.replace('# ', '')}
              </h1>
            )
          }
          if (block.startsWith('## ')) {
            return (
              <h2
                key={idx}
                className="text-foreground border-b pt-1.5 pb-1 text-lg font-bold"
              >
                {block.replace('## ', '')}
              </h2>
            )
          }
          if (block.startsWith('### ')) {
            return (
              <h3
                key={idx}
                className="text-foreground pt-1 text-base font-semibold"
              >
                {block.replace('### ', '')}
              </h3>
            )
          }
          if (block.startsWith('> ')) {
            return (
              <blockquote
                key={idx}
                className="border-primary/40 bg-muted/30 text-muted-foreground rounded-r border-l-4 py-1 pl-3 italic"
              >
                {block.replace('> ', '')}
              </blockquote>
            )
          }
          if (block.startsWith('```')) {
            const lines = block.split('\n')
            const codeContent =
              lines.slice(1, -1).join('\n') || lines.slice(1).join('\n')
            return (
              <pre
                key={idx}
                className="overflow-x-auto rounded-md border bg-zinc-900 p-3 font-mono text-xs text-zinc-100"
              >
                <code>{codeContent}</code>
              </pre>
            )
          }
          if (block.startsWith('- ')) {
            const items = block.split('\n').map((l) => l.replace(/^- /, ''))
            return (
              <ul key={idx} className="list-disc space-y-1 pl-5">
                {items.map((it, itemIdx) => (
                  <li key={itemIdx}>{it}</li>
                ))}
              </ul>
            )
          }
          if (block === '---') {
            return <hr key={idx} className="border-border my-3" />
          }
          return (
            <p key={idx} className="whitespace-pre-line">
              {block}
            </p>
          )
        })}
      </div>
    )
  }

  return (
    <div
      className={`bg-card overflow-hidden rounded-lg border shadow-xs ${className}`}
    >
      {/* 顶部工具栏 */}
      <div className="bg-muted/40 flex flex-wrap items-center justify-between gap-1 border-b p-2">
        <div className="flex flex-wrap items-center gap-0.5">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={() => insertText('**', '**', '粗体文字')}
            title="加粗 (Bold)"
          >
            <Bold className="size-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={() => insertText('*', '*', '斜体文字')}
            title="斜体 (Italic)"
          >
            <Italic className="size-3.5" />
          </Button>
          <div className="bg-border mx-1 h-4 w-px" />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={() => insertText('# ', '', '主标题')}
            title="一级标题 (H1)"
          >
            <Heading1 className="size-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={() => insertText('## ', '', '二级标题')}
            title="二级标题 (H2)"
          >
            <Heading2 className="size-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={() => insertText('### ', '', '三级标题')}
            title="三级标题 (H3)"
          >
            <Heading3 className="size-3.5" />
          </Button>
          <div className="bg-border mx-1 h-4 w-px" />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={() =>
              insertText('[', '](https://example.com)', '链接文本')
            }
            title="超链接"
          >
            <LinkIcon className="size-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={() => insertText('> ', '', '引用说明文字')}
            title="引用块"
          >
            <Quote className="size-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={() => insertText('```ts\n', '\n```', '// 代码内容')}
            title="代码块"
          >
            <Code className="size-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={() => insertText('- ', '', '列表项内容')}
            title="无序列表"
          >
            <List className="size-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={() => insertText('\n---\n', '')}
            title="分割线"
          >
            <Minus className="size-3.5" />
          </Button>
        </div>

        {/* 模式切换 */}
        <Tabs
          value={mode}
          onValueChange={(val) => setMode(val as 'edit' | 'preview' | 'split')}
          className="h-7"
        >
          <TabsList className="h-7 p-0.5">
            <TabsTrigger value="edit" className="h-6 gap-1 px-2 text-[11px]">
              <Edit3 className="size-3" />
              编辑
            </TabsTrigger>
            <TabsTrigger value="preview" className="h-6 gap-1 px-2 text-[11px]">
              <Eye className="size-3" />
              预览
            </TabsTrigger>
            <TabsTrigger value="split" className="h-6 gap-1 px-2 text-[11px]">
              <Columns2 className="size-3" />
              分屏
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* 编辑与预览主体容器 */}
      <div
        className={`grid ${
          mode === 'split'
            ? 'grid-cols-1 divide-y md:grid-cols-2 md:divide-x md:divide-y-0'
            : 'grid-cols-1'
        }`}
        style={{ minHeight }}
      >
        {/* 编辑区 */}
        {(mode === 'edit' || mode === 'split') && (
          <div className="flex h-full flex-col p-2">
            <Textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="w-full flex-1 resize-y border-none p-2 font-mono text-xs shadow-none focus-visible:ring-0 sm:text-sm"
              style={{ minHeight }}
            />
          </div>
        )}

        {/* 预览区 */}
        {(mode === 'preview' || mode === 'split') && (
          <div
            className="bg-muted/10 h-full overflow-y-auto p-4"
            style={{ minHeight }}
          >
            {renderPreview(value)}
          </div>
        )}
      </div>
    </div>
  )
}
