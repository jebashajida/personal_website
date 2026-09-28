# Optional integration into an existing Vite/React project

The root website does not require React. These files are an optional adapter
for the `main.jsx` entry point originally supplied by the user.

1. Copy the root website's `src/` into `YOUR-REACT-PROJECT/src/portfolio/`.
2. Copy this directory's `App.jsx`, `main.jsx` and `index.css` into that React
   project's `src/`, replacing the sample application files after a backup.
3. Copy the **contents** of the root website's `public/` into the React
   project's `public/`. Do not nest an extra public directory.
4. Use that project's existing Vite commands and deployment configuration.
   For a project Pages URL, set the Vite base path for that repository.

The adapter supplies `import.meta.env.BASE_URL` so Vite public assets are
served without a `/public` URL prefix. It returns the cleanup function to
React's useEffect, supporting StrictMode's mount/unmount/remount sequence.
Do not copy the standalone Node build script into a Vite app without adapting
its workflow; use the Vite project's own build output.

The core mount/cleanup sequence was tested, but this optional Vite/React
integration was not separately executed in a React runtime here.
