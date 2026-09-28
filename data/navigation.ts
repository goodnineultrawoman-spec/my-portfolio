export const destinations = [
 {id:'about', title:'ABOUT ME', chinese:'关于我', facility:'旋转木马', number:'01'},
 {id:'experience', title:'EXPERIENCE', chinese:'实习经历', facility:'过山车', number:'02'},
 {id:'work', title:'MY WORK', chinese:'我的作品', facility:'摩天轮', number:'03'},
 {id:'interests', title:'INTERESTS', chinese:'兴趣爱好', facility:'零食铺', number:'04'},
 {id:'contact', title:'CONTACT', chinese:'联系方式', facility:'小亭子', number:'05'},
] as const;
export type DestinationId = typeof destinations[number]['id'];
