import { Theme } from './settings/types';
import { PeekLandingPage } from './components/generated/PeekLandingPage';

let theme: Theme = 'light';

function App() {
  function setTheme(theme: Theme) {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  setTheme(theme);

  return (
    <>
      <PeekLandingPage />
    </>);
  // %EXPORT_STATEMENT%
}

export default App;