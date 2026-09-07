import { CheckCheck, XCircle } from 'lucide-react'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { Checkbox } from '~/components/ui/checkbox'
import { Label } from '~/components/ui/label'
import { ALL_PERMISSION_CODES, SYSTEM_PERMISSION_GROUPS } from '../permissions'

export interface PermissionMatrixProps {
  selectedPermissions: string[]
  onChange: (permissions: string[]) => void
  disabled?: boolean
}

export function PermissionMatrix({
  selectedPermissions,
  onChange,
  disabled = false,
}: PermissionMatrixProps) {
  const isSuperAdmin = selectedPermissions.includes('*')

  const togglePermission = (code: string) => {
    if (disabled) return
    if (isSuperAdmin) {
      // 从超级权限展开成常规权限
      const allCodes = [...ALL_PERMISSION_CODES].filter((c) => c !== code)
      onChange(allCodes)
      return
    }

    if (selectedPermissions.includes(code)) {
      onChange(selectedPermissions.filter((c) => c !== code))
    } else {
      onChange([...selectedPermissions, code])
    }
  }

  const toggleGroup = (moduleKey: string) => {
    if (disabled) return
    const group = SYSTEM_PERMISSION_GROUPS.find((g) => g.module === moduleKey)
    if (!group) return

    const groupCodes = group.permissions.map((p) => p.code)
    const currentCodes = isSuperAdmin
      ? [...ALL_PERMISSION_CODES]
      : [...selectedPermissions]
    const allGroupSelected = groupCodes.every((code) =>
      currentCodes.includes(code),
    )

    if (allGroupSelected) {
      // 反选本组
      onChange(currentCodes.filter((code) => !groupCodes.includes(code)))
    } else {
      // 全选本组
      const newCodes = Array.from(new Set([...currentCodes, ...groupCodes]))
      onChange(newCodes)
    }
  }

  const selectAll = () => {
    if (disabled) return
    onChange(ALL_PERMISSION_CODES)
  }

  const clearAll = () => {
    if (disabled) return
    onChange([])
  }

  const effectivePermissions = isSuperAdmin
    ? ALL_PERMISSION_CODES
    : selectedPermissions

  return (
    <div className="space-y-4">
      <div className="bg-muted/50 flex flex-col justify-between gap-2 rounded-lg border p-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <span className="text-foreground text-sm font-medium">
            权限分配矩阵
          </span>
          {isSuperAdmin ? (
            <Badge
              variant="default"
              className="bg-amber-600 text-white hover:bg-amber-700"
            >
              超级特权 (*)
            </Badge>
          ) : (
            <Badge variant="secondary">
              已选 {effectivePermissions.length} / {ALL_PERMISSION_CODES.length}{' '}
              项
            </Badge>
          )}
        </div>

        {!disabled && (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={selectAll}
              className="h-8 text-xs"
            >
              <CheckCheck className="mr-1 size-3.5" />
              全部勾选
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="text-muted-foreground hover:text-destructive h-8 text-xs"
            >
              <XCircle className="mr-1 size-3.5" />
              清空重置
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {SYSTEM_PERMISSION_GROUPS.map((group) => {
          const groupCodes = group.permissions.map((p) => p.code)
          const allSelected =
            isSuperAdmin ||
            groupCodes.every((code) => selectedPermissions.includes(code))

          return (
            <Card key={group.module} className="shadow-xs">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b p-4 pb-3">
                <div>
                  <CardTitle className="text-sm font-semibold">
                    {group.title}
                  </CardTitle>
                  {group.description && (
                    <CardDescription className="mt-0.5 text-xs">
                      {group.description}
                    </CardDescription>
                  )}
                </div>

                {!disabled && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleGroup(group.module)}
                    className="text-primary h-7 px-2 text-xs font-normal"
                  >
                    {allSelected ? '取消全选' : '全选本组'}
                  </Button>
                )}
              </CardHeader>

              <CardContent className="space-y-3 p-4">
                {group.permissions.map((perm) => {
                  const isChecked =
                    isSuperAdmin || selectedPermissions.includes(perm.code)

                  return (
                    <div
                      key={perm.code}
                      className="hover:bg-accent/40 flex items-start space-x-2.5 rounded-md p-1.5 transition-colors"
                    >
                      <Checkbox
                        id={`perm-${perm.code}`}
                        checked={isChecked}
                        disabled={disabled}
                        onCheckedChange={() => togglePermission(perm.code)}
                        className="mt-0.5"
                      />
                      <div className="grid gap-0.5 leading-none">
                        <Label
                          htmlFor={`perm-${perm.code}`}
                          className="cursor-pointer text-xs font-medium"
                        >
                          {perm.name}
                          <span className="text-muted-foreground ml-1.5 font-mono text-[11px] font-normal">
                            ({perm.code})
                          </span>
                        </Label>
                        {perm.description && (
                          <p className="text-muted-foreground line-clamp-1 text-[11px]">
                            {perm.description}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
