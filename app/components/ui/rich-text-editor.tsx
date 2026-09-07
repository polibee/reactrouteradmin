import { Color } from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { Table } from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import TextAlign from '@tiptap/extension-text-align'
import { TextStyle } from '@tiptap/extension-text-style'
import Underline from '@tiptap/extension-underline'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import type React from 'react'
import { useEffect, useRef, useState } from 'react'

import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Check,
  Code,
  FileText,
  FolderOpen,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Minus,
  Palette,
  Plus,
  Quote,
  Redo,
  RemoveFormatting,
  Strikethrough,
  Table as TableIcon,
  Trash2,
  Type,
  Underline as UnderlineIcon,
  Undo,
  Unlink,
} from 'lucide-react'
import { htmlToMarkdown, markdownToHtml } from '~/lib/markdown'
import { MediaPickerModal } from '~/modules/media/components/media-picker-modal'
import { Button } from './button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu'
import { Input } from './input'
import { Label } from './label'

export interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: string
  disabled?: boolean
  className?: string
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = '请在此输入正文内容，支持 Markdown 语法与可视化排版...',
  minHeight = '360px',
  disabled = false,
  className = '',
}: RichTextEditorProps) {
  const [isMarkdownMode, setIsMarkdownMode] = useState(false)
  const [markdownContent, setMarkdownContent] = useState('')
  const canvasRef = useRef<HTMLDivElement>(null)

  // Dialog states
  const [linkDialogOpen, setLinkDialogOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [linkText, setLinkText] = useState('')
  const [linkNewTab, setLinkNewTab] = useState(true)

  const [imageDialogOpen, setImageDialogOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [imageAlt, setImageAlt] = useState('')
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false)

  const editor = useEditor({
    editable: !disabled,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https',
        HTMLAttributes: {
          class:
            'text-primary underline font-medium hover:opacity-80 transition-opacity',
        },
      }),
      Image.configure({
        inline: false,
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto my-3 border shadow-xs mx-auto',
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse table-auto w-full my-4 border text-xs',
        },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class: 'border bg-muted/50 font-semibold p-2 text-left',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'border p-2',
        },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    editorProps: {
      attributes: {
        class:
          'tiptap ProseMirror prose dark:prose-invert max-w-none min-h-[320px] focus:outline-none p-4 text-sm leading-relaxed cursor-text',
      },
    },
    content: value || '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange(html)
    },
  })

  // Synchronize external value with editor if changed externally
  useEffect(() => {
    if (editor && value !== editor.getHTML() && !isMarkdownMode) {
      editor.commands.setContent(value || '', { emitUpdate: false })
    }
  }, [value, editor, isMarkdownMode])

  // Sync disabled state
  useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled)
    }
  }, [disabled, editor])

  // Link dialog handlers
  const handleOpenLinkDialog = () => {
    if (!editor) return
    const prevUrl = editor.getAttributes('link').href || ''
    const { from, to } = editor.state.selection
    const selectedText = editor.state.doc.textBetween(from, to, ' ')

    setLinkUrl(prevUrl)
    setLinkText(selectedText)
    setLinkNewTab(true)
    setLinkDialogOpen(true)
  }

  const handleApplyLink = () => {
    if (!editor || !linkUrl.trim()) return

    if (linkText.trim()) {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .insertContent({
          type: 'text',
          text: linkText,
          marks: [
            {
              type: 'link',
              attrs: {
                href: linkUrl,
                target: linkNewTab ? '_blank' : '_self',
              },
            },
          ],
        })
        .run()
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({
          href: linkUrl,
          target: linkNewTab ? '_blank' : '_self',
        })
        .run()
    }

    setLinkDialogOpen(false)
  }

  const handleRemoveLink = () => {
    if (!editor) return
    editor.chain().focus().unsetLink().run()
    setLinkDialogOpen(false)
  }

  // Image dialog handlers
  const handleOpenImageDialog = () => {
    setImageUrl('')
    setImageAlt('')
    setImageDialogOpen(true)
  }

  const handleApplyImage = () => {
    if (!editor || !imageUrl.trim()) return

    editor
      .chain()
      .focus()
      .setImage({
        src: imageUrl,
        alt: imageAlt.trim() || undefined,
      })
      .run()

    setImageDialogOpen(false)
  }

  // Markdown mode toggle
  const handleToggleMarkdownMode = () => {
    if (isMarkdownMode) {
      // Switch from Markdown back to WYSIWYG
      const convertedHtml = markdownToHtml(markdownContent)
      if (editor) {
        editor.commands.setContent(convertedHtml, { emitUpdate: false })
      }
      onChange(convertedHtml)
      setIsMarkdownMode(false)
    } else {
      // Switch from WYSIWYG to Markdown
      const currentHtml = editor ? editor.getHTML() : value || ''
      const convertedMd = htmlToMarkdown(currentHtml)
      setMarkdownContent(convertedMd)
      setIsMarkdownMode(true)
    }
  }

  const handleMarkdownTextareaChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const val = e.target.value
    setMarkdownContent(val)
    onChange(markdownToHtml(val))
  }

  // Focus editor when clicking anywhere in canvas container
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (isMarkdownMode || !editor) return
    // If click was on the outer padding or empty space below lines
    if (e.target === canvasRef.current) {
      editor.commands.focus('end')
    }
  }

  if (!editor) {
    return (
      <div
        style={{ minHeight }}
        className="bg-muted/20 text-muted-foreground flex items-center justify-center rounded-lg border text-xs"
      >
        <span>正在载入 TipTap 官方编辑器...</span>
      </div>
    )
  }

  // Character and word metrics
  const textContent = isMarkdownMode
    ? markdownContent
    : editor.state.doc.textContent
  const charCount = textContent.length
  const wordCount = textContent.trim()
    ? textContent.trim().split(/\s+/).filter(Boolean).length
    : 0

  return (
    <div
      className={`bg-card text-card-foreground focus-within:ring-ring flex flex-col overflow-hidden rounded-lg border shadow-xs transition-all focus-within:ring-1 ${className}`}
    >
      {/* 官方规范工具栏 (TipTap Official Standard Toolbar) */}
      <div className="bg-muted/20 text-muted-foreground flex flex-wrap items-center gap-1 border-b p-1.5 select-none">
        {/* 段落与标题选择 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={disabled || isMarkdownMode}>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="hover:text-foreground hover:bg-muted/80 h-8 gap-1.5 px-2 text-xs font-normal"
            >
              <Type className="text-primary size-3.5" />
              <span className="font-medium">
                {editor.isActive('heading', { level: 1 })
                  ? '一级标题 (H1)'
                  : editor.isActive('heading', { level: 2 })
                    ? '二级标题 (H2)'
                    : editor.isActive('heading', { level: 3 })
                      ? '三级标题 (H3)'
                      : editor.isActive('blockquote')
                        ? '引用块'
                        : editor.isActive('codeBlock')
                          ? '代码块'
                          : '常规正文'}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-44 text-xs">
            <DropdownMenuItem
              onClick={() => editor.chain().focus().setParagraph().run()}
              className={
                editor.isActive('paragraph') ? 'bg-muted font-semibold' : ''
              }
            >
              <span>常规正文 (Paragraph)</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className={
                editor.isActive('heading', { level: 1 })
                  ? 'bg-muted font-semibold'
                  : ''
              }
            >
              <Heading1 className="text-primary mr-2 size-4" />
              <span className="text-sm font-bold">一级大标题 (H1)</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={
                editor.isActive('heading', { level: 2 })
                  ? 'bg-muted font-semibold'
                  : ''
              }
            >
              <Heading2 className="text-primary mr-2 size-4" />
              <span className="text-xs font-semibold">二级副标题 (H2)</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              className={
                editor.isActive('heading', { level: 3 })
                  ? 'bg-muted font-semibold'
                  : ''
              }
            >
              <Heading3 className="text-primary mr-2 size-4" />
              <span className="text-xs font-medium">三级小标题 (H3)</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={
                editor.isActive('blockquote') ? 'bg-muted font-semibold' : ''
              }
            >
              <Quote className="text-muted-foreground mr-2 size-3.5" />
              <span>引用块 (Blockquote)</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={
                editor.isActive('codeBlock') ? 'bg-muted font-semibold' : ''
              }
            >
              <Code className="text-muted-foreground mr-2 size-3.5" />
              <span className="font-mono text-xs">代码块 (Code Block)</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="bg-border/60 mx-1 h-4 w-px" />

        {/* 基础行内排版 */}
        <Button
          type="button"
          variant={editor.isActive('bold') ? 'secondary' : 'ghost'}
          size="sm"
          className={`h-8 w-8 p-0 ${editor.isActive('bold') ? 'bg-muted text-foreground font-bold' : ''}`}
          title="粗体 (Bold)"
          disabled={disabled || isMarkdownMode}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="size-3.5" />
        </Button>

        <Button
          type="button"
          variant={editor.isActive('italic') ? 'secondary' : 'ghost'}
          size="sm"
          className={`h-8 w-8 p-0 ${editor.isActive('italic') ? 'bg-muted text-foreground' : ''}`}
          title="斜体 (Italic)"
          disabled={disabled || isMarkdownMode}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="size-3.5" />
        </Button>

        <Button
          type="button"
          variant={editor.isActive('underline') ? 'secondary' : 'ghost'}
          size="sm"
          className={`h-8 w-8 p-0 ${editor.isActive('underline') ? 'bg-muted text-foreground' : ''}`}
          title="下划线 (Underline)"
          disabled={disabled || isMarkdownMode}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon className="size-3.5" />
        </Button>

        <Button
          type="button"
          variant={editor.isActive('strike') ? 'secondary' : 'ghost'}
          size="sm"
          className={`h-8 w-8 p-0 ${editor.isActive('strike') ? 'bg-muted text-foreground' : ''}`}
          title="删除线 (Strikethrough)"
          disabled={disabled || isMarkdownMode}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="size-3.5" />
        </Button>

        <Button
          type="button"
          variant={editor.isActive('code') ? 'secondary' : 'ghost'}
          size="sm"
          className={`h-8 w-8 p-0 font-mono text-xs ${editor.isActive('code') ? 'bg-muted text-foreground' : ''}`}
          title="行内代码 (Inline Code)"
          disabled={disabled || isMarkdownMode}
          onClick={() => editor.chain().focus().toggleCode().run()}
        >
          <Code className="size-3.5" />
        </Button>

        {/* 文字调色 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={disabled || isMarkdownMode}>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="文字颜色"
            >
              <Palette className="size-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="grid w-36 grid-cols-4 gap-1 p-2"
          >
            {[
              { color: '#09090b', title: '默认黑' },
              { color: '#2563eb', title: '科技蓝' },
              { color: '#16a34a', title: '成功绿' },
              { color: '#dc2626', title: '警示红' },
              { color: '#d97706', title: '琥珀橙' },
              { color: '#9333ea', title: '优雅紫' },
              { color: '#64748b', title: '次级灰' },
              { color: '#0284c7', title: '天空蓝' },
            ].map((c) => (
              <button
                key={c.color}
                type="button"
                className="border-border/60 size-6 cursor-pointer rounded-full border transition-transform hover:scale-110"
                style={{ backgroundColor: c.color }}
                title={c.title}
                onClick={() => editor.chain().focus().setColor(c.color).run()}
              />
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 荧光背景高亮 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={disabled || isMarkdownMode}>
            <Button
              type="button"
              variant={editor.isActive('highlight') ? 'secondary' : 'ghost'}
              size="sm"
              className="h-8 w-8 p-0"
              title="荧光高亮"
            >
              <Highlighter className="size-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="grid w-36 grid-cols-4 gap-1 p-2"
          >
            {[
              { color: '#fef08a', title: '柠檬黄' },
              { color: '#bbf7d0', title: '薄荷绿' },
              { color: '#bae6fd', title: '海盐蓝' },
              { color: '#fbcfe8', title: '樱花粉' },
              { color: '#fed7aa', title: '暖阳橙' },
              { color: '#e9d5ff', title: '丁香紫' },
              { color: '#e2e8f0', title: '浅灰' },
              { color: 'transparent', title: '清除高亮' },
            ].map((c) => (
              <button
                key={c.color}
                type="button"
                className="border-border/60 size-6 cursor-pointer rounded-full border transition-transform hover:scale-110"
                style={{ backgroundColor: c.color }}
                title={c.title}
                onClick={() =>
                  c.color === 'transparent'
                    ? editor.chain().focus().unsetHighlight().run()
                    : editor
                        .chain()
                        .focus()
                        .setHighlight({ color: c.color })
                        .run()
                }
              />
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="bg-border/60 mx-1 h-4 w-px" />

        {/* 对齐排版 */}
        <Button
          type="button"
          variant={
            editor.isActive({ textAlign: 'left' }) ? 'secondary' : 'ghost'
          }
          size="sm"
          className="h-8 w-8 p-0"
          title="居左对齐"
          disabled={disabled || isMarkdownMode}
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
        >
          <AlignLeft className="size-3.5" />
        </Button>

        <Button
          type="button"
          variant={
            editor.isActive({ textAlign: 'center' }) ? 'secondary' : 'ghost'
          }
          size="sm"
          className="h-8 w-8 p-0"
          title="居中对齐"
          disabled={disabled || isMarkdownMode}
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
        >
          <AlignCenter className="size-3.5" />
        </Button>

        <Button
          type="button"
          variant={
            editor.isActive({ textAlign: 'right' }) ? 'secondary' : 'ghost'
          }
          size="sm"
          className="h-8 w-8 p-0"
          title="居右对齐"
          disabled={disabled || isMarkdownMode}
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
        >
          <AlignRight className="size-3.5" />
        </Button>

        <Button
          type="button"
          variant={
            editor.isActive({ textAlign: 'justify' }) ? 'secondary' : 'ghost'
          }
          size="sm"
          className="h-8 w-8 p-0"
          title="两端对齐"
          disabled={disabled || isMarkdownMode}
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        >
          <AlignJustify className="size-3.5" />
        </Button>

        <div className="bg-border/60 mx-1 h-4 w-px" />

        {/* 列表 */}
        <Button
          type="button"
          variant={editor.isActive('bulletList') ? 'secondary' : 'ghost'}
          size="sm"
          className="h-8 w-8 p-0"
          title="无序列表"
          disabled={disabled || isMarkdownMode}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="size-3.5" />
        </Button>

        <Button
          type="button"
          variant={editor.isActive('orderedList') ? 'secondary' : 'ghost'}
          size="sm"
          className="h-8 w-8 p-0"
          title="有序列表"
          disabled={disabled || isMarkdownMode}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="size-3.5" />
        </Button>

        <div className="bg-border/60 mx-1 h-4 w-px" />

        {/* 插入超链接 */}
        <Button
          type="button"
          variant={editor.isActive('link') ? 'secondary' : 'ghost'}
          size="sm"
          className="h-8 w-8 p-0"
          title="插入/修改超链接"
          disabled={disabled || isMarkdownMode}
          onClick={handleOpenLinkDialog}
        >
          <LinkIcon className="size-3.5" />
        </Button>

        {/* 插入网络图片 */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          title="插入网络图片"
          disabled={disabled || isMarkdownMode}
          onClick={handleOpenImageDialog}
        >
          <ImageIcon className="size-3.5" />
        </Button>

        {/* 表格 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={disabled || isMarkdownMode}>
            <Button
              type="button"
              variant={editor.isActive('table') ? 'secondary' : 'ghost'}
              size="sm"
              className="h-8 w-8 p-0"
              title="表格管理"
            >
              <TableIcon className="size-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="text-xs">
            <DropdownMenuItem
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                  .run()
              }
            >
              <Plus className="text-primary mr-2 size-3.5" />
              <span>插入 3x3 表格</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              disabled={!editor.isActive('table')}
              onClick={() => editor.chain().focus().addRowAfter().run()}
            >
              在下方插入一行
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={!editor.isActive('table')}
              onClick={() => editor.chain().focus().deleteRow().run()}
            >
              删除当前行
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={!editor.isActive('table')}
              onClick={() => editor.chain().focus().addColumnAfter().run()}
            >
              在右侧插入一列
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={!editor.isActive('table')}
              onClick={() => editor.chain().focus().deleteColumn().run()}
            >
              删除当前列
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              disabled={!editor.isActive('table')}
              className="text-destructive"
              onClick={() => editor.chain().focus().deleteTable().run()}
            >
              <Trash2 className="mr-2 size-3.5" />
              删除整个表格
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 水平线 */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          title="插入水平分割线"
          disabled={disabled || isMarkdownMode}
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <Minus className="size-3.5" />
        </Button>

        {/* 清除格式 */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          title="清除所选格式"
          disabled={disabled || isMarkdownMode}
          onClick={() =>
            editor.chain().focus().unsetAllMarks().clearNodes().run()
          }
        >
          <RemoveFormatting className="size-3.5" />
        </Button>

        <div className="bg-border/60 mx-1 h-4 w-px" />

        {/* 撤销 / 重做 */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          title="撤销 (Ctrl+Z)"
          disabled={disabled || isMarkdownMode || !editor.can().undo()}
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo className="size-3.5" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          title="重做 (Ctrl+Y)"
          disabled={disabled || isMarkdownMode || !editor.can().redo()}
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo className="size-3.5" />
        </Button>

        {/* 右侧：Markdown 切换模式（替代先前的 HTML 源码） */}
        <div className="ml-auto flex items-center gap-1.5">
          <Button
            type="button"
            variant={isMarkdownMode ? 'default' : 'outline'}
            size="sm"
            className="h-7 cursor-pointer gap-1.5 px-2.5 font-mono text-xs transition-colors"
            onClick={handleToggleMarkdownMode}
            title={
              isMarkdownMode
                ? '返回所见即所得可视化模式'
                : '切换到 Markdown 代码模式'
            }
          >
            <FileText className="size-3.5" />
            <span>{isMarkdownMode ? '所见即所得模式' : 'Markdown 模式'}</span>
          </Button>
        </div>
      </div>

      {/* 编辑主体区域：全域点击聚焦支持 (Full-area Click-to-focus) */}
      <div
        ref={canvasRef}
        onClick={handleCanvasClick}
        style={{ minHeight }}
        className="bg-background relative flex flex-1 cursor-text flex-col"
      >
        {isMarkdownMode ? (
          <textarea
            value={markdownContent}
            onChange={handleMarkdownTextareaChange}
            disabled={disabled}
            placeholder="使用标准 Markdown 语法撰写正文（如 # 大标题，**粗体**，- 列表，| 表格 | 等）..."
            style={{ minHeight }}
            className="text-foreground w-full flex-1 resize-y border-0 bg-transparent p-4 font-mono text-xs leading-relaxed focus:outline-none"
          />
        ) : (
          <div
            className="flex w-full flex-1 flex-col"
            onClick={() => {
              if (editor && !editor.isFocused) {
                editor.commands.focus('end')
              }
            }}
          >
            <EditorContent
              editor={editor}
              className="flex h-full w-full flex-1 flex-col [&_.ProseMirror]:min-h-[320px] [&_.ProseMirror]:flex-1 [&_.ProseMirror]:outline-none"
            />
          </div>
        )}
      </div>

      {/* 底部状态栏 */}
      <div className="bg-muted/20 text-muted-foreground flex items-center justify-between border-t px-3 py-1.5 text-[11px]">
        <div className="flex items-center gap-2">
          <span className="text-foreground font-semibold">TipTap</span>
          <span>·</span>
          <span>{isMarkdownMode ? 'Markdown 模式' : '所见即所得排版'}</span>
          <span>·</span>
          <span>
            统计：{charCount} 字符 ({wordCount} 词)
          </span>
        </div>
        <div className="text-[10px] opacity-75">
          {isMarkdownMode
            ? '支持标准 Markdown 语法，保存时自动解析为富文本'
            : '点击任意区域即可编辑，支持键盘快捷键'}
        </div>
      </div>

      {/* 插入/编辑超链接弹窗 */}
      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-sm font-semibold">
              <LinkIcon className="text-primary size-4" />
              插入/编辑超链接
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div className="space-y-1">
              <Label htmlFor="link-text">显示文本</Label>
              <Input
                id="link-text"
                placeholder="例如：了解平台更新日志"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="link-url">目标链接 (URL)</Label>
              <Input
                id="link-url"
                placeholder="https://... 或 /about"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="link-newtab"
                checked={linkNewTab}
                onChange={(e) => setLinkNewTab(e.target.checked)}
                className="border-border text-primary focus:ring-primary rounded"
              />
              <Label
                htmlFor="link-newtab"
                className="cursor-pointer text-xs font-normal"
              >
                在新标签页中打开 (_blank)
              </Label>
            </div>
          </div>
          <DialogFooter className="flex items-center justify-between pt-2 sm:justify-between">
            {editor.isActive('link') ? (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="h-8 gap-1 text-xs"
                onClick={handleRemoveLink}
              >
                <Unlink className="size-3.5" />
                移除链接
              </Button>
            ) : (
              <div />
            )}
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setLinkDialogOpen(false)}
              >
                取消
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleApplyLink}
                disabled={!linkUrl.trim()}
              >
                <Check className="mr-1 size-3.5" />
                应用链接
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 插入网络图片弹窗 */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-sm font-semibold">
              <ImageIcon className="text-primary size-4" />
              插入网络图片
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            {/* 从媒体库快速选用 */}
            <div className="bg-muted/40 flex items-center justify-between gap-2 rounded-lg border border-dashed p-2.5">
              <div>
                <div className="text-foreground text-xs font-medium">
                  从系统媒体库选取
                </div>
                <div className="text-muted-foreground text-[11px]">
                  一键选用已上传的高清插图或海报
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-primary border-primary/30 hover:bg-primary/5 h-7 shrink-0 gap-1 text-xs"
                onClick={() => setMediaPickerOpen(true)}
              >
                <FolderOpen className="size-3.5" />
                打开媒体库
              </Button>
            </div>

            <div className="relative flex items-center py-0.5">
              <div className="border-border/60 flex-grow border-t"></div>
              <span className="text-muted-foreground mx-2 flex-shrink text-[10px]">
                或输入外链地址
              </span>
              <div className="border-border/60 flex-grow border-t"></div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="img-url">图片网址 (URL)</Label>
              <Input
                id="img-url"
                placeholder="https://images.unsplash.com/..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="img-alt">图片替代描述 (Alt)</Label>
              <Input
                id="img-alt"
                placeholder="例如：系统拓扑全景图"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
          </div>
          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setImageDialogOpen(false)}
            >
              取消
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleApplyImage}
              disabled={!imageUrl.trim()}
            >
              <Check className="mr-1 size-3.5" />
              插入图片
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 媒体库选择器弹窗 */}
      <MediaPickerModal
        open={mediaPickerOpen}
        onOpenChange={setMediaPickerOpen}
        allowedTypes={['image']}
        title="从媒体库选择图片插入正文"
        onSelect={(item) => {
          if (editor) {
            editor
              .chain()
              .focus()
              .setImage({
                src: item.url,
                alt: item.name,
              })
              .run()
            setImageDialogOpen(false)
            setMediaPickerOpen(false)
          }
        }}
      />
    </div>
  )
}
