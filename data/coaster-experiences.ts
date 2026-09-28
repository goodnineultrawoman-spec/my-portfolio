export type ExperienceSection = {
  number: string;
  title: string;
  paragraphs?: string[];
  emphasis?: string[];
  links?: { label: string; href: string }[];
};

export type CoasterExperience = {
  id: 'pixel-punk' | 'baidu';
  number: string;
  company: string;
  role: string;
  period: string;
  summary: string;
  summaryEmphasis: string[];
  introduction: string;
  sections: ExperienceSection[];
  point: { x: number; y: number };
};

// Both stops use the original 1448 × 1086 track coordinate system.
export const coasterExperiences: CoasterExperience[] = [
  {
    id: 'baidu',
    number: '01',
    company: 'Baidu · Keevx',
    role: '海外产品运营 / 用户增长',
    period: '2025.05 – 2025.09',
    summary: '参与海外 AI 视频 SaaS 产品的冷启动与增长，覆盖渠道验证、用户洞察、产品迭代及西语市场拓展；实习期间产品累计注册用户超过 34K，西语用户占比从 0 增长至 10%。',
    summaryEmphasis: ['34K', '0 增长至 10%'],
    introduction: 'Keevx 是一款面向海外市场的 AI 数字人视频工具。在产品早期阶段，我参与海外增长渠道验证、用户反馈与产品迭代，并独立推进西语市场从 0 到 1。',
    point: { x: 500, y: 179 },
    sections: [
      {
        number: '01',
        title: '海外渠道验证与获客',
        paragraphs: [
          '冷启动期平行测试广告投放、Reddit、社媒运营、Medium、AI 工具站等渠道，通过获客成本与投入产出比对比验证渠道效率。',
          '增长期识别出 AI 工具站获客成本优于 SEM（$0.7 vs $2.1 / 注册用户），推动资源向该渠道倾斜，并规模化拓展至 14 个站点挂链。实习期间产品累计注册用户超过 34,000。',
        ],
        emphasis: ['$0.7 vs $2.1 / 注册用户', '14 个站点挂链', '34,000'],
      },
      {
        number: '02',
        title: '用户反馈与产品迭代',
        paragraphs: [
          '搭建海外用户反馈收集、去重与分析流程，处理近千条用户反馈及百余份问卷，每周向产品团队输出迭代需求清单。',
          '推动支付宝支付、首页入口改版、视频生成邮件通知、西语页面、社媒与 Discord 入口等 6 项需求上线，其中首页入口改版带动转化率 +5.25pp；另有人像音色克隆、图生视频等 3 项需求被采纳并进入排期。',
        ],
        emphasis: ['近千条用户反馈', '百余份问卷', '6 项需求', '+5.25pp', '3 项需求'],
      },
      {
        number: '03',
        title: '西语市场 0 → 1',
        paragraphs: [
          '推动 Keevx 西语市场落地，完成产品界面及官网西语本地化；通过墨西哥头部创作者深访，识别拉美用户对剪辑自动化、本地口音等需求，并转化为产品输入。',
          '同期西语用户占比从 0 增长至 10%。',
        ],
        emphasis: ['0 增长至 10%'],
      },
      {
        number: '04',
        title: '达人营销与 B2B',
        paragraphs: [
          '参与 TikTok、YouTube、X 平台的海外达人营销，从创作者筛选、合作需求与素材支持，到投放后的评论及数据反馈分析；参与内容累计获得 110 万播放、4.7 万互动。',
          '同时参与企业客户商务会议，负责演示材料制作、全英文产品讲解及现场答疑，并在会后整理客户需求与会议复盘。',
        ],
        emphasis: ['110 万播放', '4.7 万互动'],
      },
    ],
  },
  {
    id: 'pixel-punk',
    number: '02',
    company: 'Pixel Punk · 像素朋克',
    role: '海外用户增长',
    period: '2024.06 – 2024.09',
    summary: '负责 Loficam、减法相册面向英语及西语市场的达人营销，独立推进创作者合作全流程；累计推动上线 27 支推广视频，投放期间墨西哥市场下载量增长约 3 倍。',
    summaryEmphasis: ['27 支推广视频', '约 3 倍'],
    introduction: '负责 Loficam、减法相册面向英语及西语市场的 TikTok 达人营销，从市场趋势研究、达人筛选到内容合作与投放复盘，独立推进达人营销全流程。',
    point: { x: 1252, y: 328 },
    sections: [
      {
        number: '01',
        title: '达人营销',
        paragraphs: [
          '持续跟踪英语及西语市场的内容趋势与流行文化，结合产品定位及目标用户画像筛选匹配达人，独立负责达人建联、报价谈判、脚本定制及投放跟进。',
          '累计推动上线 27 支推广视频，实现单赞成本 < ¥0.5、爆文率 25%，其中 3 支破万赞、1 支破 10 万赞。',
        ],
        emphasis: ['27 支推广视频', '< ¥0.5', '25%', '3 支破万赞', '1 支破 10 万赞'],
      },
      {
        number: '02',
        title: '数据复盘与市场增长',
        paragraphs: [
          '持续复盘不同市场、达人类型及内容形式的投放表现，识别西语区转化效率更高的达人类型，并据此调整筛选策略、集中追加投放资源。',
          '投放期间，墨西哥市场下载量增长约 3 倍。',
        ],
        emphasis: ['约 3 倍'],
      },
      {
        number: '03',
        title: '产品本地化',
        paragraphs: ['负责 Loficam、减法相册的西语本地化，根据目标市场的语言及文化习惯调整产品术语与界面文案。'],
      },
      {
        number: '04',
        title: '精选达人内容',
        links: [
          { label: '教程类内容', href: 'https://www.tiktok.com/@noeliameendezz/video/7405947400503790881?_r=1&_t=8p5JybbMSoK' },
          { label: 'K-pop 仿拍类内容', href: 'https://www.tiktok.com/@cherrieslibra/video/7410566314617474310' },
        ],
      },
    ],
  },
];
