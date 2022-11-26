## `Vite Issues`

1. Internal server error: No files matching '../../@react-refresh' were found.

   `version` : "3.2.4"</br>
   `cause` : extending @rollup/plugin-eslint in vite config plugins</br>
   `effect` : reports no file matching '../../@react-refresh' error in vite dev and build</br>
   `alt` : set fast-refresh to _false_ in react plugin options or use _vite-plugin-eslint_ package if you want to have fast refresh.

   **Error Code**

   ```ts
   import {defineConfig} from 'vite';
   import react from '@vitejs/plugin-react';
   import eslint from '@rollup/plugin-eslint';

   // https://vitejs.dev/config/
   export default defineConfig({
     plugins: [eslint(), react()],
   });
   ```

   **Solution**

   ```diff
   - import eslint from '@rollup/plugin-eslint';
   + import eslint from 'vite-plugin-eslint';

   (or)

   - plugins: [eslint(), react()],
   + plugins: [eslint(), react({fast-refresh: false})],
   ```
