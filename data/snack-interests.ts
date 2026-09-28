export type SnackInterest = {
  id: 'balloon' | 'popcorn' | 'soda' | 'ice-cream' | 'hotdog';
  number: string;
  englishTitle: string;
  chineseTitle: string;
  illustration: string;
  personalText?: string;
};

export const snackInterests: SnackInterest[] = [
  {
    id: 'balloon', number: '01', englishTitle: 'Travel', chineseTitle: '到处逛逛',
    illustration: '/assets/snack-detail/snack-balloons.png',
    personalText: '旅行对我来说，更多是到处走走带来的新鲜感。因为好奇，所以总想去看看不同地方的风景和气质，再观察那里的人怎样生活。',
  },
  {
    id: 'popcorn', number: '02', englishTitle: 'Exhibitions', chineseTitle: '看展',
    illustration: '/assets/illustrations/popcorn.png',
    personalText: '我喜欢看美丽的画，那些光影、颜色，和被留下来的动人瞬间。也喜欢现当代艺术里那些意想不到的表达：一个从没想过的载体，却可以如此准确地承载一种情绪或观念。',
  },
  {
    id: 'soda', number: '03', englishTitle: 'Concerts', chineseTitle: '看演唱会',
    illustration: '/assets/illustrations/soda.png',
    personalText: '我喜欢去看演唱会。台下那么多人因为同一种音乐聚在一起，现场的声音也比耳机里更有颗粒感、更真实。',
  },
  {
    id: 'ice-cream', number: '04', englishTitle: 'Theater', chineseTitle: '去看剧',
    illustration: '/assets/illustrations/ice-cream.png',
    personalText: '我喜欢现场舞台带来的沉浸感。坐进剧院以后，外界都暂时被放在一边，眼前原本虚构的世界也会一点点变得真实。',
  },
  {
    id: 'hotdog', number: '05', englishTitle: 'Try something new', chineseTitle: '尝试新鲜事',
    illustration: '/assets/illustrations/hot-dog.png',
    personalText: '我对没试过的事情总是有点好奇，看到好玩的事，就想去试试看。',
  },
];
