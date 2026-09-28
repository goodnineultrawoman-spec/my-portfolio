export const contactHotspots = [
  { id: 'phone', objectLabel: '电话', href: 'tel:15588838977', actionLabel: '拨打 15588838977' },
  { id: 'mailbox', objectLabel: '邮筒', href: 'mailto:violeta_hao@163.com', actionLabel: '发送邮件至 violeta_hao@163.com' },
] as const;

export const contactMethods = [
  { id: 'phone', label: 'Phone', value: '15588838977', href: 'tel:15588838977', copyLabel: '复制电话号码' },
  { id: 'wechat', label: 'WeChat', value: 'goodnineultrawoman', href: null, copyLabel: '复制微信号' },
  { id: 'email', label: 'Email', value: 'violeta_hao@163.com', href: 'mailto:violeta_hao@163.com', copyLabel: '复制邮箱地址' },
] as const;
