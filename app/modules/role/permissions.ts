import type { PermissionDefinition, PermissionGroup } from './types'

export const SYSTEM_PERMISSION_GROUPS: PermissionGroup[] = [
  {
    module: 'users',
    title: '用户管理 (Users)',
    description: '前后台账户、个人信息与状态管理权限',
    permissions: [
      {
        code: 'users.view',
        name: '查看用户',
        description: '允许浏览用户列表、检索用户及查看用户个人详情',
        module: 'users',
      },
      {
        code: 'users.create',
        name: '新建用户',
        description: '允许录入新用户账户并设置初始密码和角色',
        module: 'users',
      },
      {
        code: 'users.update',
        name: '编辑用户',
        description: '允许修改用户的基本信息、绑定邮箱及切换在职/激活状态',
        module: 'users',
      },
      {
        code: 'users.delete',
        name: '删除用户',
        description: '允许注销或彻底移除用户数据',
        module: 'users',
      },
    ],
  },
  {
    module: 'roles',
    title: '角色与权限 (Roles)',
    description: 'RBAC 访问控制、权限矩阵与岗位权限分配',
    permissions: [
      {
        code: 'roles.view',
        name: '查看角色',
        description: '允许查看系统现有角色列表及其拥有的权限集合',
        module: 'roles',
      },
      {
        code: 'roles.create',
        name: '新建角色',
        description: '允许新增角色定义并赋予初始权限集合',
        module: 'roles',
      },
      {
        code: 'roles.update',
        name: '编辑角色',
        description: '允许修改角色名称、说明以及重新分配权限项',
        module: 'roles',
      },
      {
        code: 'roles.delete',
        name: '删除角色',
        description: '允许删除自定义角色（系统内置保护角色除外）',
        module: 'roles',
      },
    ],
  },
  {
    module: 'site',
    title: '站点与门户 (Site & Portal)',
    description: '单页面管理、页眉页脚导航、卡片小工具及运营通告广告位',
    permissions: [
      {
        code: 'site.view',
        name: '查看站点配置',
        description: '允许查看单页面、导航菜单、小工具及运营通告',
        module: 'site',
      },
      {
        code: 'site.pages',
        name: '管理单页面',
        description: '允许创建、编辑和删除隐私政策、服务条款等单页面',
        module: 'site',
      },
      {
        code: 'site.navigation',
        name: '管理导航菜单',
        description: '允许调整前台页眉 Header 与页脚 Footer 菜单项',
        module: 'site',
      },
      {
        code: 'site.widgets',
        name: '管理卡片小工具',
        description: '允许启用/禁用和配置小工具卡片排序',
        module: 'site',
      },
      {
        code: 'site.operations',
        name: '管理运营与广告',
        description: '允许发布弹窗、Banner通告、右下角通知、跑马灯及推广位',
        module: 'site',
      },
      {
        code: 'site.links',
        name: '管理友情链接',
        description: '允许审核通过、驳回、添加、编辑或删除友情链接申请',
        module: 'site',
      },
    ],
  },
  {
    module: 'articles',
    title: '内容管理 (CMS/Blog)',
    description: '文章发布、专栏分类与前台资讯内容管控',
    permissions: [
      {
        code: 'articles.view',
        name: '查看内容',
        description: '允许查看文章列表、草稿箱及阅读统计',
        module: 'articles',
      },
      {
        code: 'articles.create',
        name: '撰写文章',
        description: '允许撰写与上传新文章或资讯草稿',
        module: 'articles',
      },
      {
        code: 'articles.update',
        name: '编辑与审核',
        description: '允许编辑已有文章、调整分类标签及发布上线',
        module: 'articles',
      },
      {
        code: 'articles.delete',
        name: '删除内容',
        description: '允许下架并删除已发布文章或草稿',
        module: 'articles',
      },
    ],
  },
  {
    module: 'settings',
    title: '系统配置 (Settings)',
    description: '全局面板、视觉主题、安全策略及外部接口参数',
    permissions: [
      {
        code: 'settings.view',
        name: '查看设置',
        description: '允许查看站点基本信息、设计预设与基础配置项',
        module: 'settings',
      },
      {
        code: 'settings.update',
        name: '修改设置',
        description: '允许保存系统全局配置、切换设计预设与安全规则',
        module: 'settings',
      },
    ],
  },
]

// 展平的所有权限字典列表
export const ALL_PERMISSIONS: PermissionDefinition[] =
  SYSTEM_PERMISSION_GROUPS.flatMap((group) => group.permissions)

// 全量权限代码数组
export const ALL_PERMISSION_CODES: string[] = ALL_PERMISSIONS.map((p) => p.code)
