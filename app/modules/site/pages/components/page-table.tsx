import type { ColumnDef } from '@tanstack/react-table'
import { ExternalLink, Eye, FileText } from 'lucide-react'
import { useNavigate } from 'react-router'
import {
  AdminBadge,
  DataTable,
  DeleteAction,
  EditAction,
  ViewAction,
  notify,
} from '~/admin/ui'
import { siteService } from '../../service'
import type { SitePage } from '../../types'

export interface PageTableProps {
  data: SitePage[]
  loading?: boolean
  onDataChange?: () => void
}

export function PageTable({ data, loading, onDataChange }: PageTableProps) {
  const navigate = useNavigate()

  const handleDelete = async (page: SitePage) => {
    try {
      await siteService.deletePage(page.id)
      notify.success(`页面「${page.title}」已删除`)
      if (onDataChange) onDataChange()
    } catch (e: unknown) {
      const err = e as Error
      notify.error(err?.message || '删除失败')
    }
  }

  const columns: ColumnDef<SitePage>[] = [
    {
      accessorKey: 'title',
      header: '页面标题与路径',
      cell: ({ row }) => {
        const page = row.original
        return (
          <div className="flex items-center gap-2.5">
            <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-lg">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <div className="text-foreground font-medium">{page.title}</div>
              <div className="text-muted-foreground flex items-center gap-1 font-mono text-xs">
                <span>/{page.slug}</span>
                <a
                  href={`/${page.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary inline-flex items-center"
                >
                  <ExternalLink className="ml-0.5 size-3" />
                </a>
              </div>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'status',
      header: '发布状态',
      cell: ({ row }) => {
        const status = row.original.status
        return (
          <AdminBadge status={status === 'published' ? 'success' : 'warning'}>
            {status === 'published' ? '已发布上线' : '草稿暂存'}
          </AdminBadge>
        )
      },
    },
    {
      accessorKey: 'views',
      header: '浏览量',
      cell: ({ row }) => (
        <span className="text-muted-foreground flex items-center gap-1 font-mono text-xs">
          <Eye className="size-3" />
          {row.original.views.toLocaleString()}
        </span>
      ),
    },
    {
      accessorKey: 'updatedAt',
      header: '最后更新',
      cell: ({ row }) => {
        const dateStr = row.getValue('updatedAt') as string
        return (
          <span className="text-muted-foreground font-mono text-xs">
            {dateStr ? dateStr.slice(0, 10) : '-'}
          </span>
        )
      },
    },
    {
      id: 'actions',
      header: () => <div className="text-right">操作</div>,
      cell: ({ row }) => {
        const page = row.original

        return (
          <div className="flex items-center justify-end gap-1">
            <ViewAction
              onClick={() => window.open(`/${page.slug}`, '_blank')}
            />
            <EditAction
              permission="site.pages"
              onClick={() =>
                navigate(
                  `/admin/pages/${page.slug || page.id.replace(/^page-/, '')}/edit`,
                )
              }
            />
            <DeleteAction
              permission="site.pages"
              itemTitle={page.title}
              confirmDescription={`确定要删除单页面「${page.title}」吗？已配置的前台链接访问将变为 404。`}
              onAction={() => handleDelete(page)}
            />
          </div>
        )
      },
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={loading}
      searchKey="title"
      searchPlaceholder="输入页面标题或路径搜索..."
    />
  )
}
