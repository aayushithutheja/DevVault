# DevVault — Developer Resource Finder

DevVault is a responsive, dark-themed directory of programming resources. It helps students discover documentation, coding practice websites, project tools, and AI/data science platforms in one searchable library.

## Features

- Curated directory of 18 developer resources
- Live search across resource names, descriptions, categories, and tags
- Category filters: Learn, Practice, Build, AI & Data, and Tools
- Sort resources alphabetically
- Toggle between grid and list layouts
- Bookmark resources and save them in browser localStorage
- Responsive design for desktop and mobile
- Keyboard shortcut: `Ctrl + K` or `Cmd + K` focuses the search box
- External links open in a new tab
- No framework, backend, or paid API required

## Tech stack

- HTML5
- CSS3
- Vanilla JavaScript
- Browser localStorage

## Run locally

1. Download or clone this repository.
2. Keep `index.html`, `style.css`, and `script.js` in the same folder.
3. Open `index.html` in your browser, or use VS Code with the Live Server extension.

## Project structure

```text
DevVault/
├── index.html
├── style.css
├── script.js
├── README.md
└── LICENSE
```

## How it works

1. Resource details are stored in a JavaScript array.
2. Search and category filters create a filtered list of resources.
3. JavaScript builds resource cards using DOM methods.
4. Bookmarks are saved as JSON in localStorage.
5. Grid/list buttons switch the layout using CSS classes.

## Limitations

- Bookmarks are stored locally in the current browser and do not sync across devices.
- The resource list is curated in the source code and is not updated automatically.
- This project does not scrape websites or guarantee external resources remain available.

## Future improvements

- Add resource submission and review
- Add tags and difficulty filters
- Add a backend and user accounts
- Add custom collections
- Add an optional light theme
- Add automated link checking

## License

MIT License. See [LICENSE](LICENSE).
