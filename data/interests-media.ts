type PhotoFile = readonly [name: string, width: number, height: number];

function webPhotoPath(folder: string, version: 'preview' | 'full', filename: string) {
  const stem = filename.replace(/\.[^.]+$/, '');
  return `/assets/interests/${folder}/${version}/${encodeURIComponent(stem)}.webp`;
}

function photoPaths(folder: 'travel' | 'exhibitions', files: readonly PhotoFile[]) {
  return files.map(([name, width, height], index) => ({
    src: webPhotoPath(folder, 'full', name),
    previewSrc: webPhotoPath(folder, 'preview', name),
    width,
    height,
    alt: `${folder === 'travel' ? '旅途' : '看展'}照片 ${index + 1}`,
  }));
}

// Every valid photograph supplied in the two source folders is represented here.
export const travelPhotos = photoPaths('travel', [
  ['2f58afcc47bf66446b7de303f3b5e58f.jpg', 1333, 2000],
  ['56b8d366428e643210cbd9cd447e18c1.jpg', 1307, 2000],
  ['5f3e0c408fad3868c3c2f93c680bcd0c.jpg', 1333, 2000],
  ['new-1.jpg', 2200, 1467],
  ['65c1532bb6be70b001edf5ff1f172071.jpg', 2000, 1333],
  ['781fb76adec13fabb28d70e5f51e2fb4.jpg', 1333, 2000],
  ['8810f7d0c4e4138930faf09e6e49eb83.jpg', 1500, 2000],
  ['c7b11dcd787e107446734f7a774f0d54.jpg', 1333, 2000],
  ['e0d626523ae9b9a3c8f0e7b81d738329.jpg', 1333, 2000],
  ['new-2.jpg', 2200, 1467],
  ['e4a32bb326f964cd273e95711b1954a0.jpg', 2000, 1333],
  ['ff30ff498c7e5a8f7a6524af5c78e1ee.jpg', 1333, 2000],
]);

export const exhibitionPhotos = photoPaths('exhibitions', [
  ['033ef5b4a3df054e05501431a640e89c.jpg', 1500, 2000],
  ['25bbb8948fcd723118168cdbfd713084.jpg', 1500, 2000],
  ['27ccfcef4909b79fef7d79f69c3aa79b.jpg', 1500, 2000],
  ['4bfdddcbaf4b20ef2297e2f4aa57ba58.jpg', 2000, 1500],
  ['5c77be8b60d371e21883a949deb8e8ce.jpg', 1500, 2000],
  ['6b329c4ea2d3474f702ea8eb0026e6f4.jpg', 2000, 1500],
  ['832382c6b6320e978d49350db67a1f02.jpg', 1751, 2000],
  ['85106610449d752d7239aa73db14aaa9.jpg', 1500, 2000],
  ['958f8c46ee1714e1c5dcd685b50db6c3.jpg', 1702, 1276],
  ['ba4d0ed9ee5112954c3c5c917ddd59c7.jpg', 1500, 2000],
  ['bf75611ff1c8e7c6b1c07275ecd642fc.jpg', 1500, 2000],
  ['d514aa9c37f847ba308a16d223e292ab.jpg', 2000, 1500],
  ['d5295afa6cb3384c3b31f5b9cc1542ea.jpg', 1500, 2000],
  ['d9620e239c967bcd10ef2b1e10e46cb2.jpg', 1500, 2000],
]);

type TheaterPhotoFile = readonly [id: number, title: string, place: string, width: number, height: number, foreign: boolean];

// The filename number is only for matching the supplied image to its caption.
export const theaterPhotos = ([
  [1, 'Hamilton', '伦敦', 1500, 2000, true],
  [2, 'CABARET', '伦敦', 1500, 2000, true],
  [3, 'Matilda The Musical', '伦敦', 2000, 1500, true],
  [4, 'Les Misérables', '伦敦', 2000, 1500, true],
  [5, 'Stranger Things: The First Shadow', '伦敦', 2000, 1500, true],
  [6, 'My Neighbour Totoro', '伦敦', 2000, 1500, true],
  [7, 'Back to the Future: The Musical', '伦敦', 2000, 1500, true],
  [8, 'Eugene Onegin', '巴黎', 1500, 2000, true],
  [9, 'Ride the Cyclone', '伦敦', 2000, 1500, true],
  [10, 'SIX', '伦敦', 1500, 2000, true],
  [11, '《猫》', '天津', 2000, 1500, false],
  [12, '《罗密欧与朱丽叶》', '北京', 2000, 1500, false],
  [13, '《隐秘的角落》', '天津', 2000, 1125, false],
  [14, '《近乎正常》', '北京', 2000, 1500, false],
  [15, '《也许美好结局》', '天津', 2000, 1500, false],
  [16, '《粉丝来信》', '天津', 1206, 670, false],
  [17, 'El Fantasma de la Ópera', '马德里', 2000, 1500, true],
  [18, 'Chicago', '马德里', 2000, 1191, true],
] satisfies readonly TheaterPhotoFile[]).map(([id, title, place, width, height, foreign]) => ({
  id,
  src: webPhotoPath('theater', 'full', `${id}.jpg`),
  previewSrc: webPhotoPath('theater', 'preview', `${id}.jpg`),
  title,
  place,
  foreign,
  width,
  height,
  alt: `${title} / ${place}`,
}));

// Every valid photograph in the supplied concerts folder is shown without a caption.
export const concertPhotos = ([
  ['0bab37925c931f3b5247ef21bbe5de1e.jpg', 1650, 2200],
  ['146dcf45968ff517f85cc32004a7dc75.jpg', 1650, 2200],
  ['23fcd04df54ce8c303849a227fb45724.jpg', 1650, 2200],
  ['286bc9479e90ba817ee5805ebafcc487.jpg', 2200, 1238],
  ['508b7e1134bb81dd275207318b3213d1.jpg', 2200, 1650],
  ['7e1ed34b4be4dfca30f13656f36c760b.jpg', 2200, 1650],
  ['8eaf6c76f8b746e78aae209ce8105481.jpg', 1650, 2200],
  ['9fa12e5898a4314a8fa1016d88bf42cf.jpg', 2200, 1650],
  ['ce4135963d9ded522a2c9eb78275fe6e.jpg', 1650, 2200],
  ['f0fa62f0470ca0a125cac3bb8190ebe1.jpg', 2200, 1650],
  ['f6a8cf8feed7eafd851ed3aa29360c62.jpg', 1630, 1133],
] as const).map(([filename, width, height]) => ({
  src: webPhotoPath('concerts', 'full', filename),
  previewSrc: webPhotoPath('concerts', 'preview', filename),
  width,
  height,
  alt: '演唱会现场照片',
}));

// Each activity owns its photos. The two whale-watching images share one label.
// Activity order follows the composition rather than source file numbers.
export const newThingsActivities = ([
  ['skydiving', '跳伞', [['3.jpg', 2200, 1650]]],
  ['pottery', '做陶艺', [['4.jpg', 1650, 2200]]],
  ['whale', '冲锋艇观鲸', [['1 (2).jpg', 1206, 622], ['1.jpg', 1650, 2200]]],
  ['hiking', '一个人徒步', [['5.jpg', 1650, 2200]]],
  ['dogs', '极光下狗拉雪橇', [['2.jpg', 2200, 1650]]],
  ['kayaking', '皮划艇', [['7.jpg', 1650, 2200]]],
  ['bread', '做烟囱面包', [['6.jpg', 1650, 2200]]],
  ['snorkeling', '裂缝浮潜', [['8.jpg', 1925, 2200]]],
] as const).map(([id, label, photos]) => ({
  id,
  label,
  photos: photos.map(([filename, width, height]) => ({
    src: webPhotoPath('new-things', 'full', filename),
    previewSrc: webPhotoPath('new-things', 'preview', filename),
    width,
    height,
    alt: label,
  })),
}));
