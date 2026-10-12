import { HomeMap } from '@/components/home-map';
import './interests/interests.css';

export default function Home() {
  return <>
    <script dangerouslySetInnerHTML={{ __html: `
      try {
        if (!window.__homepageIntroCheckedInDocument) {
          window.__homepageIntroCheckedInDocument = true;
          // A new document opened on Home (including refresh) gets a new opening.
          // Client-side returns retain the completed state within this document.
          const entry = performance.getEntriesByType('navigation')[0];
          const initialPath = entry ? new URL(entry.name).pathname : window.location.pathname;
          const enteredThroughHome = initialPath.replace(/\\/$/, '') === window.location.pathname.replace(/\\/$/, '');
          if (enteredThroughHome) sessionStorage.removeItem('openingPlayed');
          else sessionStorage.setItem('openingPlayed', 'true');
          if (sessionStorage.getItem('openingPlayed') !== 'true' && window.matchMedia('(min-width: 701px)').matches) {
            document.documentElement.classList.add('homepage-intro-play');
          }
        }
      } catch (_) { /* The map remains immediately usable if navigation timing is unavailable. */ }
    ` }} />
    <HomeMap />
  </>;
}
