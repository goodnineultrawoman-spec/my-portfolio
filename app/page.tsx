import { HomeMap } from '@/components/home-map';
import './interests/interests.css';

export default function Home() {
  return <>
    <script dangerouslySetInnerHTML={{ __html: `
      try {
        if (!window.__homepageIntroCheckedInDocument) {
          window.__homepageIntroCheckedInDocument = true;
          if (sessionStorage.getItem('openingPlayed') !== 'true' && window.matchMedia('(min-width: 701px)').matches) {
            document.documentElement.classList.add('homepage-intro-play');
          }
        }
      } catch (_) { /* The map remains immediately usable if navigation timing is unavailable. */ }
    ` }} />
    <HomeMap />
  </>;
}
