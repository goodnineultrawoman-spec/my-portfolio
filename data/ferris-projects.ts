export type FerrisProjectId = 'archiv' | 'research' | 'advertising' | 'photography';

export type FerrisProject = {
  id: FerrisProjectId;
  cabinIndex: number;
  number: string;
  overviewTitle: string;
  overviewSkills: string;
  overviewYear: string;
  title: string;
  subtitle?: string;
  tagline?: string;
  body: string[];
  image?: { src: string; alt: string };
  video?: { src: string; poster: string };
};

const assetRoot = '/assets/my-work';

export const ferrisProjects: FerrisProject[] = [
  {
    id: 'archiv', cabinIndex: 0, number: '01',
    overviewTitle: 'Archiv — AI 看展日记', overviewSkills: 'AI Product Development · User Research', overviewYear: '2025–2026', title: 'Archiv', subtitle: 'AI 看展日记',
    image: { src: assetRoot + '/archiv-prototype-new.png', alt: 'Archiv 产品概念原型图' },
    body: [
      '我很喜欢一个人看展，但每次想认真记录点什么，就很容易从“看展”变成“做笔记”：拍展签、查资料、翻译看不懂的专业词，再记下刚刚冒出来的想法。等这一套做完，原本连续的观看体验也被打断了。',
      '所以我开始想，能不能让“记录”这件事尽量不打扰“看展”本身？Archiv 就从这个问题开始：用 AI 自动识别作品、补充背景信息、翻译展签，再把一路留下的照片和感受整理成一份可以长期保存和回看的看展日记。',
      '在真正做原型之前，我先用三轮小规模实验验证这个想法。我访谈了有独自看展习惯的用户，了解他们真实的记录方式；再用人工模拟 AI 的方式生成看展日记，测试他们是否真的需要自动整理；最后比较不同的原型方案，观察用户愿意为个性化编辑付出多少时间。',
      '这些测试也不断改变着最初的产品设想：记录越轻，越不容易破坏看展的沉浸感；比起复杂的自定义，用户更需要一个足够好的默认结果；而保存下来，也不意味着还会重新打开。因此，Archiv 不应该只负责生成一篇日记，也需要让那些已经被记录下来的内容，有机会重新回到用户的生活里。',
      '最终，我制作了 Archiv 的概念原型：用户只需拍下展品，AI 就可以自动识别并结构化整理作品信息，生成具有较高视觉完成度的默认日记模板；同时通过定期推送等方式，让已经沉淀下来的看展记录重新被看见。',
      '在产品原型之外，我也进一步完成了 Archiv 的 Pitch Deck，从目标用户与竞争定位，到订阅制、票务及艺术衍生品佣金等商业化路径，再到欧洲市场的增长策略与财务预测，对这个产品从概念走向商业化的可能性进行了完整推演。',
    ],
  },
  {
    id: 'research', cabinIndex: 1, number: '02',
    overviewTitle: '中国耽美文学的海外传播研究', overviewSkills: 'Data Analysis · Cross-cultural Communication', overviewYear: '2024–2025', title: '中国耽美文学的海外传播研究',
    image: { src: assetRoot + '/research-visual.png', alt: '中国耽美文学海外传播研究配图' },
    body: [
      '本项目围绕中国耽美文学的海外传播展开。我以《魔道祖师》英文版为案例，采集 Goodreads 第一至第五卷共 5,573 条用户评论，使用 Python 进行文本清洗，并通过 TF-IDF、情感分析与点赞量加权，分析海外读者的关注重点与接受情况。',
      '研究发现，人物塑造与情感叙事是最主要的吸引力，“角色与人物”和“主题与情节”的正向情感比例分别达到 84.40% 和 84.17%；而“翻译与语言”的负向情感达到 18.31%，反映出翻译质量与文化适配仍是跨文化传播中的重要障碍。在此基础上，我进一步梳理了 IP 改编、海外出版、社交媒体、粉丝二创与粉丝翻译等传播路径。',
      '结合数据与传播机制研究，我提出了几项优化方向：建立更规范的粉丝翻译授权与反馈机制，探索“AI 初翻 + 人工校审”；完善正版海外阅读与版权合作渠道；同时利用人物关系和情感叙事的跨文化吸引力，通过社交媒体、粉丝共创及影视、动画、漫画等多模态 IP 开发扩大海外传播。',
    ],
  },
  {
    id: 'advertising', cabinIndex: 2, number: '03',
    overviewTitle: '无穷鹌鹑蛋广告｜大学生广告大赛', overviewSkills: 'Creative Storytelling · Video Production', overviewYear: '2022', title: '无穷鹌鹑蛋广告',
    subtitle: '大学生广告大赛', tagline: '无穷快乐，无穷 EGGNERGY',
    video: { src: assetRoot + '/quail-ad-web.mp4', poster: assetRoot + '/quail-poster.png' },
    body: [
      '这是一次以无穷鹌鹑蛋为品牌对象的广告创意实践。围绕 Z 世代年轻消费者，我提出了「二次元 × 定格动画 × 三次元」的核心创意，希望不直接展示产品功能，而是把“补充能量”转化成一个轻松、有记忆点的小故事。',
      '我们为一颗鹌鹑蛋创造了角色“无小穷”：它出生在二维动画世界，在鹌鹑蛋学校成长为“蛋内优等生”，随后接到任务——前往三次元世界拯救失去能量的学生。故事最关键的转场发生在两个世界的交界处：无小穷从动画中“掉进”真实画面，砸醒趴在桌上睡着的学生；学生吃下鹌鹑蛋后重新获得 e(gg)nergy，戴上奋斗发带继续学习。',
      '整个创意因此把产品、角色和媒介形式串在了一起：鹌鹑蛋不再只是被展示的商品，而成为推动故事发生的主角；动画与真人影像的切换本身，也成为剧情的一部分。',
      '最终，我们将这个想法制作成一支 1 分钟竖屏广告，从脚本、动画、真人拍摄到后期剪辑共同完成，并作为学院公众号首个竖屏广告作品发布。',
    ],
  },
  {
    id: 'photography', cabinIndex: 3, number: '04',
    overviewTitle: '摄影作品', overviewSkills: 'Photography · Visual Diary', overviewYear: '2021–Now', title: '摄影作品',
    body: ['我喜欢用相机记录身边的人和去过的地方。大学期间，我为二十多位客人完成过付费人像拍摄，也习惯在旅行中捕捉那些被光线、构图或偶然瞬间吸引的画面。'],
  },
];

// The selected photographs are already numbered in the requested viewing order.
export const photographyAlbums = {
  portraits: {
    english: 'PORTRAITS', chinese: '人像',
    images: Array.from({ length: 12 }, (_, index) => assetRoot + '/portraits-web/' + (index + 1) + '.webp'),
  },
  landscapes: {
    english: 'LANDSCAPES', chinese: '风景',
    images: Array.from({ length: 12 }, (_, index) => assetRoot + '/landscapes-web/' + (index + 1) + '.webp'),
  },
} as const;

export type PhotographyAlbumId = keyof typeof photographyAlbums;
