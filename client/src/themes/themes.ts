
export interface Theme {
  name: string;
  displayName: string;
  colors: {
    bg: string;
    main: string;
    sub: string;
    text: string;
    error: string;
    errorBg: string;
    correct: string;
    caret: string;
    border: string;
    borderSub: string;
    box: string;
    menu: string;
  };
}

export const themes: Record<string, Theme> = {
  'serika-dark': {
    name: 'serika-dark',
    displayName: 'Serika Dark',
    colors: {
      bg: '#323437',
      main: '#50fa7b',
      sub: '#646669',
      text: '#d1d0c5',
      error: '#ca4754',
      errorBg: '#7e2a33',
      correct: '#50fa7b',
      caret: '#50fa7b',
      border: 'rgba(26, 26, 31, 0.5)',
      borderSub: 'rgba(32, 32, 37, 0.5)',
      box: 'rgba(20, 21, 23, 0.5)',
      menu: 'rgba(20, 21, 23, 0.5)'
    }
  },
  'dark': {
    name: 'dark',
    displayName: 'Dark',
    colors: {
      bg: '#111111',
      main: '#f0f0f0',
      sub: '#5c5c5c',
      text: '#f0f0f0',
      error: '#da3333',
      errorBg: '#750000',
      correct: '#4caf50',
      caret: '#f0f0f0',
      border: '#000000',
      borderSub: '#0a0a0a',
      box: '#1a1a1a',
      menu: '#1a1a1a'
    }
  },
  'light': {
    name: 'light',
    displayName: 'Light',
    colors: {
      bg: '#ffffff',
      main: '#303030',
      sub: '#a0a0a0',
      text: '#303030',
      error: '#da3333',
      errorBg: '#ffdddd',
      correct: '#4caf50',
      caret: '#303030',
      border: '#e0e0e0',
      borderSub: '#f0f0f0',
      box: '#f5f5f5',
      menu: '#f5f5f5'
    }
  },
  'nord': {
    name: 'nord',
    displayName: 'Nord',
    colors: {
      bg: '#2e3440',
      main: '#88c0d0',
      sub: '#4c566a',
      text: '#eceff4',
      error: '#bf616a',
      errorBg: '#3b2a2c',
      correct: '#a3be8c',
      caret: '#88c0d0',
      border: '#1e222a',
      borderSub: '#242831',
      box: '#242937',
      menu: '#242937'
    }
  },
  'dracula': {
    name: 'dracula',
    displayName: 'Dracula',
    colors: {
      bg: '#282a36',
      main: '#bd93f9',
      sub: '#6272a4',
      text: '#f8f8f2',
      error: '#ff5555',
      errorBg: '#4d2525',
      correct: '#50fa7b',
      caret: '#f8f8f2',
      border: '#181a26',
      borderSub: '#1e2029',
      box: '#1e2029',
      menu: '#1e2029'
    }
  },
  'monokai': {
    name: 'monokai',
    displayName: 'Monokai',
    colors: {
      bg: '#272822',
      main: '#e6db74',
      sub: '#75715e',
      text: '#f8f8f2',
      error: '#f92672',
      errorBg: '#5c2635',
      correct: '#a6e22e',
      caret: '#f8f8f2',
      border: '#171812',
      borderSub: '#1d1e19',
      box: '#1d1e19',
      menu: '#1d1e19'
    }
  },
  'solarized-dark': {
    name: 'solarized-dark',
    displayName: 'Solarized Dark',
    colors: {
      bg: '#002b36',
      main: '#268bd2',
      sub: '#586e75',
      text: '#839496',
      error: '#dc322f',
      errorBg: '#4a1414',
      correct: '#859900',
      caret: '#268bd2',
      border: '#001b26',
      borderSub: '#00212c',
      box: '#00212c',
      menu: '#00212c'
    }
  },
  'solarized-light': {
    name: 'solarized-light',
    displayName: 'Solarized Light',
    colors: {
      bg: '#fdf6e3',
      main: '#268bd2',
      sub: '#93a1a1',
      text: '#657b83',
      error: '#dc322f',
      errorBg: '#ffeaea',
      correct: '#859900',
      caret: '#268bd2',
      border: '#ede6d3',
      borderSub: '#f5eed9',
      box: '#f5eed9',
      menu: '#f5eed9'
    }
  }
};


