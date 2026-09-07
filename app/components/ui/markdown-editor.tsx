import { useState, useRef } from 'react'
import { Button } from '~/components/ui/button'
import { Textarea } from '~/components/ui/textarea'
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs'
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  Link as LinkIcon,
  Quote,
  Code,
  List,
  Minus,
  Eye,
  Columns2,
  Edit3,
} from 'lucide-react'

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
    const newValue = value.substring(0, start) + replacement + value.substring(end)
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
        <div className="text-xs text-muted-foreground italic py-8 text-center">
          暂无预览内容，请在左侧编辑器中输入文本...
        </div>
      )
    }

    const blocks = content.split('\n\n')
    return (
      <div className="space-y-3 text-xs sm:text-sm text-foreground/90 leading-relaxed max-w-none">
        {blocks.map((block, idx) => {
          if (block.startsWith('# ')) {
            return (
              <h1 key={idx} className="text-xl font-bold border-b pb-1.5 pt-2 text-foreground">
                {block.replace('# ', '')}
              </h1>
            )
          }
          if (block.startsWith('## ')) {
            return (
              <h2 key={idx} className="text-lg font-bold border-b pb-1 pt-1.5 text-foreground">
                {block.replace('## ', '')}
              </h2>
            )
          }
          if (block.startsWith('### ')) {
            return (
              <h3 key={idx} className="text-base font-semibold pt-1 text-foreground">
                {block.replace('### ', '')}
              </h3>
            )
          }
          if (block.startsWith('> ')) {
            return (
              <blockquote
                key={idx}
                className="border-l-4 border-primary/40 pl-3 py-1 italic bg-muted/30 rounded-r text-muted-foreground"
              >
                {block.replace('> ', '')}
              </blockquote>
            )
          }
          if (block.startsWith('```')) {
            const lines = block.split('\n')
            const codeContent = lines.slice(1, -1).join('\n') || lines.slice(1).join('\n')
            return (
              <pre
                key={idx}
                className="bg-zinc-900 text-zinc-100 p-3 rounded-md font-mono text-xs overflow-x-auto border"
              >
                <code>{codeContent}</code>
              </pre>
            )
          }
          if (block.startsWith('- ')) {
            const items = block.split('\n').map((l) => l.replace(/^- /, ''))
            return (
              <ul key={idx} className="list-disc pl-5 space-y-1">
                {items.map((it, itemIdx) => (
                  <li key={itemIdx}>{it}</li>
                ))}
              </ul>
            )
          }
          if (block === '---') {
            return <hr key={idx} className="my-3 border-border" />
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
    <div className={`rounded-lg border bg-card shadow-xs overflow-hidden ${className}`}>
      {/* 顶部工具栏 */}
      <div className="flex flex-wrap items-center justify-between border-b bg-muted/40 p-2 gap-1">
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
          <div className="h-4 w-px bg-border mx-1" />
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
          <div className="h-4 w-px bg-border mx-1" />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={() => insertText('[', '](https://example.com)', '链接文本')}
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
            <TabsTrigger value="edit" className="h-6 px-2 text-[11px] gap-1">
              <Edit3 className="size-3" />
              编辑
            </TabsTrigger>
            <TabsTrigger value="preview" className="h-6 px-2 text-[11px] gap-1">
              <Eye className="size-3" />
              预览
            </TabsTrigger>
            <TabsTrigger value="split" className="h-6 px-2 text-[11px] gap-1">
              <Columns2 className="size-3" />
              分屏
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* 编辑与预览主体容器 */}
      <div
        className={`grid ${
          mode === 'split' ? 'grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x' : 'grid-cols-1'
        }`}
        style={{ minHeight }}
      >
        {/* 编辑区 */}
        {(mode === 'edit' || mode === 'split') && (
          <div className="h-full flex flex-col p-2">
            <Textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="flex-1 w-full border-none shadow-none focus-visible:ring-0 resize-y font-mono text-xs sm:text-sm p-2"
              style={{ minHeight }}
            />
          </div>
        )}

        {/* 预览区 */}
        {(mode === 'preview' || mode === 'split') && (
          <div className="h-full p-4 overflow-y-auto bg-muted/10" style={{ minHeight }}>
            {renderPreview(value)}
          </div>
        )}
      </div>
    </div>
  )
}
