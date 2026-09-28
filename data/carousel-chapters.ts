export type EducationEntry = {
  school: string;
  degree: string;
  period: string;
  description: string;
  logo: { src: string; alt: string };
  highlights?: string[];
};

export type LanguageEntry = { name: string; level: string };
export type InternationalEntry = {
  place: string;
  period: string;
  body: string[];
  image: { src: string; alt: string };
};

export type CarouselChapter = {
  id: 'education' | 'languages' | 'international' | 'note-from-me';
  number: string;
  englishTitle: string;
  chineseTitle: string;
  summary: string;
  body: string[];
  education?: EducationEntry[];
  languages?: LanguageEntry[];
  international?: InternationalEntry[];
  facts?: string[];
  image?: { src: string; alt: string };
  externalLink?: { label: string; href: string };
};

export const carouselChapters: CarouselChapter[] = [
  {
    id: 'education',
    number: '01',
    englishTitle: 'Education',
    chineseTitle: '教育背景',
    summary: 'UCL · UCM · 南开大学',
    body: [],
    education: [
      {
        school: 'UCL · University College London',
        degree: 'MA Creative and Collaborative Enterprise',
        period: '2025.09 – 2026.12',
        description: '用人类学的视角研究商业路径，从真实的人和场景里理解用户，再用人文视角将创意、产品和商业连接。',
        logo: { src: '/assets/education/ucl-logo-transparent.png', alt: 'UCL 标志' },
      },
      {
        school: 'Universidad Complutense de Madrid · 马德里康普顿斯大学',
        degree: 'Exchange Student · 交换生',
        period: '2023.09 – 2024.06',
        description: '在西班牙语母语环境中进一步提升语言能力，也借此更深入地了解当地文化，期间取得马德里康普顿斯大学 C1 级别语言证书。',
        logo: { src: '/assets/education/complutense.png', alt: '马德里康普顿斯大学校徽' },
      },
      {
        school: 'Nankai University · 南开大学',
        degree: 'BA Spanish · Minor in Network & New Media',
        period: '2021.09 – 2025.06',
        description: '西班牙语帮我推开了通向更广阔世界的大门，网络与新媒体则让我开始关注人们如何表达、传播，又如何理解彼此。',
        logo: { src: '/assets/education/nankai-logo-transparent.png', alt: '南开大学标志' },
        highlights: ['GPA 3.86 / 4', '专业排名 2 / 11', '校级一等奖学金'],
      },
    ],
  },
  {
    id: 'languages',
    number: '02',
    englishTitle: 'Languages',
    chineseTitle: '语言能力',
    summary: '中文 · English · Español',
    body: [],
    languages: [
      { name: '中文 · Chinese', level: '母语' },
      { name: '英语 · English', level: 'IELTS 7.5' },
      { name: '西班牙语 · Español', level: 'DELE B2｜专八优秀' },
    ],
  },
  {
    id: 'international',
    number: '03',
    englishTitle: 'International Experience',
    chineseTitle: '国际经历',
    summary: 'London · Madrid',
    body: [],
    international: [
      {
        place: 'London · UCL',
        period: '2025.09 – 2026.12',
        body: [
          '在伦敦生活了一年。日子是琐碎的，但探索一座新城市的新鲜和自由、触手可及的文艺资源，还有这座城市多元包容的气质，还是让鸡毛蒜皮之外，多了一些闪闪发光的小幸福。',
          '和来自不同地方的人一起学习、讨论和做项目，也让我越来越习惯那些和自己不太一样的想法。',
        ],
        image: { src: '/assets/about/international-london.jpg', alt: '伦敦生活照片' },
      },
      {
        place: 'Madrid · Universidad Complutense de Madrid',
        period: '2023.09 – 2024.06',
        body: [
          '马德里有点像住在一个能微微晒到阳光的房顶上。第一次在国外长居的新鲜和激动，慢慢变成了生活本身：逛小小的咖啡店，在街边晒太阳，去随处可见的快时尚商店，坐上火车去西班牙的其他城市，也开始真正用另一种语言认识这里的人。',
          '慢慢地，适应不同的语言、文化和生活方式，也变成了一件很自然的事。',
        ],
        image: { src: '/assets/about/international-madrid.jpg', alt: '马德里生活照片' },
      },
    ],
  },
  {
    id: 'note-from-me',
    number: '04',
    englishTitle: 'A few facts about me',
    chineseTitle: '关于我的一些小事实',
    summary: '',
    body: [],
    facts: [
      '收集了很多明信片和冰箱贴',
      '很会帮别人拍照',
      '好奇所有还不了解的事物',
      '喜欢圆滚滚的东西',
      '出门一定要带耳机',
      '很会吹口哨',
      '过山车狂热爱好者',
      '爱看空难纪录片、医疗剧和动画电影',
      '喜欢学习和捣鼓没试过的新东西',
    ],
  },
];
