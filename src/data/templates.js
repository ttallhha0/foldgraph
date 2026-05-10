/*
 * Hazır şablonlar — tree formatında (App state ile doğrudan uyumlu).
 * computeTreeLayout pozisyonları otomatik hesaplar.
 */

function f(id, label, children = []) {
  return { id, type: 'folder', label, isNew: false, children };
}
function file(id, label) {
  return { id, type: 'file', label, isNew: false };
}

// ─── 1. React + Vite ──────────────────────────────────────────────────────────
const reactVite = {
  id: 'tpl-react-vite',
  label: 'React + Vite',
  description: 'Vite tabanlı modern React projesi',
  emoji: '⚛️',
  tree: f('root', 'react-app', [
    f('public', 'public', [
      file('public-vite', 'vite.svg'),
    ]),
    f('src', 'src', [
      f('src-assets', 'assets', [
        file('src-assets-react', 'react.svg'),
      ]),
      f('src-components', 'components', [
        file('src-components-button', 'Button.jsx'),
        file('src-components-navbar', 'Navbar.jsx'),
      ]),
      f('src-hooks', 'hooks', [
        file('src-hooks-use', 'useLocalStorage.js'),
      ]),
      file('src-app', 'App.jsx'),
      file('src-appcss', 'App.css'),
      file('src-main', 'main.jsx'),
      file('src-index', 'index.css'),
    ]),
    file('root-index', 'index.html'),
    file('root-pkg', 'package.json'),
    file('root-vite', 'vite.config.js'),
    file('root-eslint', '.eslintrc.cjs'),
    file('root-gitignore', '.gitignore'),
    file('root-readme', 'README.md'),
  ]),
};

// ─── 2. Next.js App Router ───────────────────────────────────────────────────
const nextjsApp = {
  id: 'tpl-nextjs',
  label: 'Next.js App Router',
  description: 'Next.js 14+ App Router yapısı',
  emoji: '▲',
  tree: f('root', 'nextjs-app', [
    f('app', 'app', [
      f('app-api', 'api', [
        f('app-api-users', 'users', [
          file('app-api-users-route', 'route.js'),
        ]),
      ]),
      f('app-dashboard', 'dashboard', [
        file('app-dashboard-page', 'page.jsx'),
        file('app-dashboard-layout', 'layout.jsx'),
      ]),
      file('app-layout', 'layout.jsx'),
      file('app-page', 'page.jsx'),
      file('app-globals', 'globals.css'),
      file('app-error', 'error.jsx'),
      file('app-loading', 'loading.jsx'),
    ]),
    f('components', 'components', [
      f('components-ui', 'ui', [
        file('components-ui-button', 'Button.jsx'),
        file('components-ui-card', 'Card.jsx'),
        file('components-ui-modal', 'Modal.jsx'),
      ]),
      file('components-navbar', 'Navbar.jsx'),
      file('components-footer', 'Footer.jsx'),
    ]),
    f('lib', 'lib', [
      file('lib-utils', 'utils.js'),
      file('lib-db', 'db.js'),
    ]),
    f('public', 'public', [
      file('public-logo', 'logo.svg'),
    ]),
    file('root-next', 'next.config.js'),
    file('root-pkg', 'package.json'),
    file('root-tailwind', 'tailwind.config.js'),
    file('root-env', '.env.local'),
    file('root-gitignore', '.gitignore'),
  ]),
};

// ─── 3. Node.js Express MVC ───────────────────────────────────────────────────
const expressMvc = {
  id: 'tpl-express-mvc',
  label: 'Node.js Express MVC',
  description: 'REST API için MVC mimarisi',
  emoji: '🟢',
  tree: f('root', 'express-api', [
    f('controllers', 'controllers', [
      file('ctrl-user', 'userController.js'),
      file('ctrl-auth', 'authController.js'),
      file('ctrl-product', 'productController.js'),
    ]),
    f('models', 'models', [
      file('model-user', 'User.js'),
      file('model-product', 'Product.js'),
    ]),
    f('routes', 'routes', [
      file('route-user', 'userRoutes.js'),
      file('route-auth', 'authRoutes.js'),
      file('route-product', 'productRoutes.js'),
    ]),
    f('middleware', 'middleware', [
      file('mw-auth', 'auth.js'),
      file('mw-error', 'errorHandler.js'),
      file('mw-validate', 'validate.js'),
    ]),
    f('config', 'config', [
      file('cfg-db', 'db.js'),
      file('cfg-app', 'app.js'),
    ]),
    f('utils', 'utils', [
      file('util-logger', 'logger.js'),
      file('util-response', 'response.js'),
    ]),
    file('root-server', 'server.js'),
    file('root-pkg', 'package.json'),
    file('root-env', '.env'),
    file('root-gitignore', '.gitignore'),
    file('root-readme', 'README.md'),
  ]),
};

// ─── 4. Python Flask ─────────────────────────────────────────────────────────
const pythonFlask = {
  id: 'tpl-flask',
  label: 'Python Flask',
  description: 'Flask web uygulaması',
  emoji: '🐍',
  tree: f('root', 'flask-app', [
    f('app', 'app', [
      f('app-templates', 'templates', [
        file('tpl-base', 'base.html'),
        file('tpl-index', 'index.html'),
        file('tpl-login', 'login.html'),
      ]),
      f('app-static', 'static', [
        f('static-css', 'css', [
          file('static-css-style', 'style.css'),
        ]),
        f('static-js', 'js', [
          file('static-js-main', 'main.js'),
        ]),
      ]),
      f('app-models', 'models', [
        file('model-user', 'user.py'),
      ]),
      f('app-routes', 'routes', [
        file('route-main', 'main.py'),
        file('route-auth', 'auth.py'),
      ]),
      file('app-init', '__init__.py'),
      file('app-forms', 'forms.py'),
    ]),
    f('migrations', 'migrations'),
    f('tests', 'tests', [
      file('test-init', '__init__.py'),
      file('test-app', 'test_app.py'),
    ]),
    file('root-run', 'run.py'),
    file('root-config', 'config.py'),
    file('root-requirements', 'requirements.txt'),
    file('root-env', '.env'),
    file('root-gitignore', '.gitignore'),
  ]),
};

// ─── 5. Vue + Vite ───────────────────────────────────────────────────────────
const vueVite = {
  id: 'tpl-vue',
  label: 'Vue 3 + Vite',
  description: 'Vue 3 Composition API projesi',
  emoji: '💚',
  tree: f('root', 'vue-app', [
    f('src', 'src', [
      f('src-components', 'components', [
        file('src-comp-navbar', 'TheNavbar.vue'),
        file('src-comp-footer', 'TheFooter.vue'),
        file('src-comp-base-button', 'BaseButton.vue'),
      ]),
      f('src-views', 'views', [
        file('src-view-home', 'HomeView.vue'),
        file('src-view-about', 'AboutView.vue'),
      ]),
      f('src-router', 'router', [
        file('src-router-index', 'index.js'),
      ]),
      f('src-stores', 'stores', [
        file('src-store-user', 'userStore.js'),
        file('src-store-counter', 'counterStore.js'),
      ]),
      f('src-composables', 'composables', [
        file('src-comp-use-fetch', 'useFetch.js'),
      ]),
      f('src-assets', 'assets', [
        file('src-assets-main', 'main.css'),
        file('src-assets-logo', 'logo.svg'),
      ]),
      file('src-app', 'App.vue'),
      file('src-main', 'main.js'),
    ]),
    f('public', 'public'),
    file('root-index', 'index.html'),
    file('root-vite', 'vite.config.js'),
    file('root-pkg', 'package.json'),
    file('root-gitignore', '.gitignore'),
  ]),
};

// ─── 6. HTML / CSS / JS ───────────────────────────────────────────────────────
const staticSite = {
  id: 'tpl-static',
  label: 'HTML / CSS / JS',
  description: 'Vanilla JS statik web sitesi',
  emoji: '🌐',
  tree: f('root', 'static-site', [
    f('assets', 'assets', [
      f('assets-images', 'images'),
      f('assets-fonts', 'fonts'),
      f('assets-icons', 'icons'),
    ]),
    f('css', 'css', [
      file('css-reset', 'reset.css'),
      file('css-style', 'style.css'),
      file('css-responsive', 'responsive.css'),
    ]),
    f('js', 'js', [
      file('js-main', 'main.js'),
      file('js-utils', 'utils.js'),
    ]),
    file('root-index', 'index.html'),
    file('root-readme', 'README.md'),
  ]),
};

// ─── 7. MERN Full-Stack ───────────────────────────────────────────────────────
const mernStack = {
  id: 'tpl-mern',
  label: 'MERN Full-Stack',
  description: 'MongoDB + Express + React + Node',
  emoji: '🔷',
  tree: f('root', 'mern-app', [
    f('client', 'client', [
      f('client-src', 'src', [
        f('client-components', 'components', [
          file('cl-comp-nav', 'Navbar.jsx'),
          file('cl-comp-form', 'Form.jsx'),
        ]),
        f('client-pages', 'pages', [
          file('cl-page-home', 'Home.jsx'),
          file('cl-page-login', 'Login.jsx'),
        ]),
        f('client-context', 'context', [
          file('cl-ctx-auth', 'AuthContext.jsx'),
        ]),
        file('cl-app', 'App.jsx'),
        file('cl-main', 'main.jsx'),
      ]),
      file('cl-index', 'index.html'),
      file('cl-pkg', 'package.json'),
      file('cl-vite', 'vite.config.js'),
    ]),
    f('server', 'server', [
      f('sv-controllers', 'controllers', [
        file('sv-ctrl-user', 'userController.js'),
        file('sv-ctrl-auth', 'authController.js'),
      ]),
      f('sv-models', 'models', [
        file('sv-model-user', 'User.js'),
      ]),
      f('sv-routes', 'routes', [
        file('sv-route-user', 'userRoutes.js'),
        file('sv-route-auth', 'authRoutes.js'),
      ]),
      f('sv-middleware', 'middleware', [
        file('sv-mw-auth', 'authMiddleware.js'),
      ]),
      file('sv-index', 'index.js'),
      file('sv-env', '.env'),
    ]),
    file('root-pkg', 'package.json'),
    file('root-gitignore', '.gitignore'),
    file('root-readme', 'README.md'),
  ]),
};

// ─── 8. Django ────────────────────────────────────────────────────────────────
const django = {
  id: 'tpl-django',
  label: 'Django',
  description: 'Django MVC web uygulaması',
  emoji: '🎸',
  tree: f('root', 'django-project', [
    f('project', 'project', [
      file('proj-init', '__init__.py'),
      file('proj-settings', 'settings.py'),
      file('proj-urls', 'urls.py'),
      file('proj-wsgi', 'wsgi.py'),
      file('proj-asgi', 'asgi.py'),
    ]),
    f('core', 'core', [
      f('core-templates', 'templates', [
        f('core-tpl-core', 'core', [
          file('core-tpl-base', 'base.html'),
          file('core-tpl-home', 'home.html'),
        ]),
      ]),
      f('core-migrations', 'migrations', [
        file('core-mig-init', '__init__.py'),
      ]),
      file('core-models', 'models.py'),
      file('core-views', 'views.py'),
      file('core-urls', 'urls.py'),
      file('core-admin', 'admin.py'),
      file('core-forms', 'forms.py'),
      file('core-init', '__init__.py'),
    ]),
    f('static', 'static', [
      f('static-css', 'css', [file('static-style', 'style.css')]),
      f('static-js', 'js', [file('static-main', 'main.js')]),
    ]),
    f('media', 'media'),
    file('root-manage', 'manage.py'),
    file('root-requirements', 'requirements.txt'),
    file('root-env', '.env'),
    file('root-gitignore', '.gitignore'),
  ]),
};

// ─── 9. Flutter ───────────────────────────────────────────────────────────────
const flutter = {
  id: 'tpl-flutter',
  label: 'Flutter',
  description: 'Flutter mobil uygulama yapısı',
  emoji: '🐦',
  tree: f('root', 'flutter_app', [
    f('lib', 'lib', [
      f('lib-screens', 'screens', [
        file('scr-home', 'home_screen.dart'),
        file('scr-login', 'login_screen.dart'),
        file('scr-profile', 'profile_screen.dart'),
      ]),
      f('lib-widgets', 'widgets', [
        file('wgt-button', 'custom_button.dart'),
        file('wgt-card', 'info_card.dart'),
        file('wgt-appbar', 'custom_app_bar.dart'),
      ]),
      f('lib-models', 'models', [
        file('mdl-user', 'user.dart'),
        file('mdl-product', 'product.dart'),
      ]),
      f('lib-services', 'services', [
        file('svc-api', 'api_service.dart'),
        file('svc-auth', 'auth_service.dart'),
        file('svc-storage', 'storage_service.dart'),
      ]),
      f('lib-providers', 'providers', [
        file('prv-auth', 'auth_provider.dart'),
        file('prv-theme', 'theme_provider.dart'),
      ]),
      f('lib-utils', 'utils', [
        file('utl-constants', 'constants.dart'),
        file('utl-helpers', 'helpers.dart'),
      ]),
      f('lib-theme', 'theme', [
        file('thm-colors', 'app_colors.dart'),
        file('thm-text', 'text_styles.dart'),
      ]),
      file('lib-main', 'main.dart'),
    ]),
    f('assets', 'assets', [
      f('assets-images', 'images'),
      f('assets-fonts', 'fonts'),
      f('assets-icons', 'icons'),
    ]),
    f('test', 'test', [
      file('test-widget', 'widget_test.dart'),
    ]),
    file('root-pubspec', 'pubspec.yaml'),
    file('root-gitignore', '.gitignore'),
    file('root-readme', 'README.md'),
  ]),
};

// ─── 10. React Native ─────────────────────────────────────────────────────────
const reactNative = {
  id: 'tpl-react-native',
  label: 'React Native',
  description: 'React Native mobil uygulama',
  emoji: '📱',
  tree: f('root', 'RNApp', [
    f('src', 'src', [
      f('rn-screens', 'screens', [
        file('rn-scr-home', 'HomeScreen.tsx'),
        file('rn-scr-login', 'LoginScreen.tsx'),
        file('rn-scr-profile', 'ProfileScreen.tsx'),
      ]),
      f('rn-components', 'components', [
        file('rn-cmp-button', 'Button.tsx'),
        file('rn-cmp-card', 'Card.tsx'),
        file('rn-cmp-header', 'Header.tsx'),
      ]),
      f('rn-navigation', 'navigation', [
        file('rn-nav-root', 'RootNavigator.tsx'),
        file('rn-nav-auth', 'AuthNavigator.tsx'),
        file('rn-nav-tab', 'TabNavigator.tsx'),
      ]),
      f('rn-store', 'store', [
        file('rn-store-index', 'index.ts'),
        file('rn-store-auth', 'authSlice.ts'),
        file('rn-store-user', 'userSlice.ts'),
      ]),
      f('rn-hooks', 'hooks', [
        file('rn-hook-auth', 'useAuth.ts'),
        file('rn-hook-fetch', 'useFetch.ts'),
      ]),
      f('rn-services', 'services', [
        file('rn-svc-api', 'api.ts'),
      ]),
      f('rn-utils', 'utils', [
        file('rn-utl-colors', 'colors.ts'),
        file('rn-utl-helpers', 'helpers.ts'),
      ]),
      file('rn-app', 'App.tsx'),
    ]),
    f('android', 'android'),
    f('ios', 'ios'),
    f('assets', 'assets', [
      f('rn-assets-img', 'images'),
      f('rn-assets-fnt', 'fonts'),
    ]),
    file('root-pkg', 'package.json'),
    file('root-tsconfig', 'tsconfig.json'),
    file('root-metro', 'metro.config.js'),
    file('root-gitignore', '.gitignore'),
  ]),
};

// ─── 11. SvelteKit ───────────────────────────────────────────────────────────
const svelteKit = {
  id: 'tpl-sveltekit',
  label: 'SvelteKit',
  description: 'SvelteKit full-stack framework',
  emoji: '🧡',
  tree: f('root', 'sveltekit-app', [
    f('src', 'src', [
      f('sk-routes', 'routes', [
        f('sk-route-about', 'about', [
          file('sk-about-page', '+page.svelte'),
        ]),
        f('sk-route-api', 'api', [
          f('sk-api-users', 'users', [
            file('sk-api-users-srv', '+server.ts'),
          ]),
        ]),
        file('sk-root-page', '+page.svelte'),
        file('sk-root-layout', '+layout.svelte'),
        file('sk-root-error', '+error.svelte'),
      ]),
      f('sk-lib', 'lib', [
        f('sk-lib-components', 'components', [
          file('sk-lib-nav', 'Navbar.svelte'),
          file('sk-lib-footer', 'Footer.svelte'),
        ]),
        f('sk-lib-stores', 'stores', [
          file('sk-store-user', 'user.ts'),
        ]),
        file('sk-lib-utils', 'utils.ts'),
        file('sk-lib-index', 'index.ts'),
      ]),
      file('sk-app-css', 'app.css'),
      file('sk-app-html', 'app.html'),
    ]),
    f('static', 'static', [
      file('sk-static-favicon', 'favicon.png'),
    ]),
    file('root-svelte', 'svelte.config.js'),
    file('root-vite', 'vite.config.ts'),
    file('root-tsconfig', 'tsconfig.json'),
    file('root-pkg', 'package.json'),
    file('root-gitignore', '.gitignore'),
  ]),
};

// ─── 12. Angular ─────────────────────────────────────────────────────────────
const angular = {
  id: 'tpl-angular',
  label: 'Angular',
  description: 'Angular enterprise uygulama',
  emoji: '🔴',
  tree: f('root', 'angular-app', [
    f('src', 'src', [
      f('ng-app', 'app', [
        f('ng-core', 'core', [
          f('ng-core-guards', 'guards', [
            file('ng-guard-auth', 'auth.guard.ts'),
          ]),
          f('ng-core-interceptors', 'interceptors', [
            file('ng-int-http', 'http.interceptor.ts'),
          ]),
          f('ng-core-services', 'services', [
            file('ng-svc-auth', 'auth.service.ts'),
            file('ng-svc-api', 'api.service.ts'),
          ]),
          file('ng-core-module', 'core.module.ts'),
        ]),
        f('ng-shared', 'shared', [
          f('ng-shared-components', 'components', [
            file('ng-shared-btn', 'button.component.ts'),
            file('ng-shared-card', 'card.component.ts'),
          ]),
          f('ng-shared-pipes', 'pipes', [
            file('ng-pipe-date', 'date.pipe.ts'),
          ]),
          file('ng-shared-module', 'shared.module.ts'),
        ]),
        f('ng-features', 'features', [
          f('ng-feat-home', 'home', [
            file('ng-home-comp', 'home.component.ts'),
            file('ng-home-html', 'home.component.html'),
            file('ng-home-scss', 'home.component.scss'),
          ]),
          f('ng-feat-auth', 'auth', [
            file('ng-auth-comp', 'login.component.ts'),
            file('ng-auth-html', 'login.component.html'),
          ]),
        ]),
        file('ng-app-comp', 'app.component.ts'),
        file('ng-app-html', 'app.component.html'),
        file('ng-app-module', 'app.module.ts'),
        file('ng-app-routes', 'app-routing.module.ts'),
      ]),
      f('ng-assets', 'assets'),
      f('ng-environments', 'environments', [
        file('ng-env-prod', 'environment.prod.ts'),
        file('ng-env-dev', 'environment.ts'),
      ]),
      file('ng-main', 'main.ts'),
      file('ng-styles', 'styles.scss'),
      file('ng-index', 'index.html'),
    ]),
    file('root-angular', 'angular.json'),
    file('root-tsconfig', 'tsconfig.json'),
    file('root-pkg', 'package.json'),
    file('root-gitignore', '.gitignore'),
  ]),
};

// ─── 13. Go (Gin) ────────────────────────────────────────────────────────────
const goGin = {
  id: 'tpl-go-gin',
  label: 'Go + Gin',
  description: 'Go dili ile Gin web framework',
  emoji: '🐹',
  tree: f('root', 'go-api', [
    f('cmd', 'cmd', [
      f('cmd-api', 'api', [
        file('cmd-main', 'main.go'),
      ]),
    ]),
    f('internal', 'internal', [
      f('int-handlers', 'handlers', [
        file('hdl-user', 'user.go'),
        file('hdl-auth', 'auth.go'),
        file('hdl-health', 'health.go'),
      ]),
      f('int-models', 'models', [
        file('mdl-user', 'user.go'),
      ]),
      f('int-repository', 'repository', [
        file('repo-user', 'user_repo.go'),
      ]),
      f('int-middleware', 'middleware', [
        file('mw-auth', 'auth.go'),
        file('mw-cors', 'cors.go'),
        file('mw-logger', 'logger.go'),
      ]),
      f('int-config', 'config', [
        file('cfg-config', 'config.go'),
      ]),
    ]),
    f('pkg', 'pkg', [
      f('pkg-logger', 'logger', [
        file('pkg-log', 'logger.go'),
      ]),
      f('pkg-database', 'database', [
        file('pkg-db', 'postgres.go'),
      ]),
    ]),
    f('migrations', 'migrations', [
      file('mig-001', '001_init.sql'),
    ]),
    file('root-go-mod', 'go.mod'),
    file('root-go-sum', 'go.sum'),
    file('root-makefile', 'Makefile'),
    file('root-env', '.env'),
    file('root-gitignore', '.gitignore'),
    file('root-readme', 'README.md'),
  ]),
};

// ─── 14. Spring Boot (Java) ───────────────────────────────────────────────────
const springBoot = {
  id: 'tpl-spring-boot',
  label: 'Spring Boot',
  description: 'Java Spring Boot REST API',
  emoji: '🍃',
  tree: f('root', 'spring-api', [
    f('src', 'src', [
      f('sb-main', 'main', [
        f('sb-java', 'java', [
          f('sb-com', 'com', [
            f('sb-example', 'example', [
              f('sb-controllers', 'controllers', [
                file('sb-ctrl-user', 'UserController.java'),
                file('sb-ctrl-auth', 'AuthController.java'),
              ]),
              f('sb-services', 'services', [
                file('sb-svc-user', 'UserService.java'),
                file('sb-svc-auth', 'AuthService.java'),
              ]),
              f('sb-repositories', 'repositories', [
                file('sb-repo-user', 'UserRepository.java'),
              ]),
              f('sb-models', 'models', [
                file('sb-mdl-user', 'User.java'),
              ]),
              f('sb-dto', 'dto', [
                file('sb-dto-user', 'UserDto.java'),
                file('sb-dto-auth', 'LoginRequest.java'),
              ]),
              f('sb-config', 'config', [
                file('sb-cfg-security', 'SecurityConfig.java'),
                file('sb-cfg-jwt', 'JwtConfig.java'),
              ]),
              file('sb-main-class', 'Application.java'),
            ]),
          ]),
        ]),
        f('sb-resources', 'resources', [
          file('sb-app-props', 'application.properties'),
          file('sb-app-dev', 'application-dev.properties'),
        ]),
      ]),
      f('sb-test', 'test', [
        f('sb-test-java', 'java', [
          f('sb-test-com', 'com', [
            f('sb-test-example', 'example', [
              file('sb-test-app', 'ApplicationTests.java'),
            ]),
          ]),
        ]),
      ]),
    ]),
    file('root-pom', 'pom.xml'),
    file('root-mvnw', 'mvnw'),
    file('root-gitignore', '.gitignore'),
    file('root-readme', 'README.md'),
  ]),
};

// ─── 15. Laravel ─────────────────────────────────────────────────────────────
const laravel = {
  id: 'tpl-laravel',
  label: 'Laravel',
  description: 'PHP Laravel MVC framework',
  emoji: '🎯',
  tree: f('root', 'laravel-app', [
    f('app', 'app', [
      f('lv-http', 'Http', [
        f('lv-controllers', 'Controllers', [
          file('lv-ctrl-user', 'UserController.php'),
          file('lv-ctrl-auth', 'AuthController.php'),
        ]),
        f('lv-middleware', 'Middleware', [
          file('lv-mw-auth', 'Authenticate.php'),
        ]),
        f('lv-requests', 'Requests', [
          file('lv-req-store', 'StoreUserRequest.php'),
        ]),
      ]),
      f('lv-models', 'Models', [
        file('lv-mdl-user', 'User.php'),
        file('lv-mdl-post', 'Post.php'),
      ]),
      f('lv-services', 'Services', [
        file('lv-svc-user', 'UserService.php'),
      ]),
    ]),
    f('config', 'config', [
      file('lv-cfg-app', 'app.php'),
      file('lv-cfg-db', 'database.php'),
      file('lv-cfg-auth', 'auth.php'),
    ]),
    f('database', 'database', [
      f('lv-migrations', 'migrations', [
        file('lv-mig-users', 'create_users_table.php'),
      ]),
      f('lv-seeders', 'seeders', [
        file('lv-seed-db', 'DatabaseSeeder.php'),
      ]),
    ]),
    f('resources', 'resources', [
      f('lv-views', 'views', [
        f('lv-layouts', 'layouts', [
          file('lv-layout-app', 'app.blade.php'),
        ]),
        file('lv-view-welcome', 'welcome.blade.php'),
      ]),
    ]),
    f('routes', 'routes', [
      file('lv-route-web', 'web.php'),
      file('lv-route-api', 'api.php'),
    ]),
    f('public', 'public', [
      file('lv-pub-index', 'index.php'),
    ]),
    file('root-artisan', 'artisan'),
    file('root-composer', 'composer.json'),
    file('root-env', '.env'),
    file('root-gitignore', '.gitignore'),
  ]),
};

// ─── 16. FastAPI ─────────────────────────────────────────────────────────────
const fastApi = {
  id: 'tpl-fastapi',
  label: 'FastAPI',
  description: 'Python FastAPI modern REST API',
  emoji: '⚡',
  tree: f('root', 'fastapi-app', [
    f('app', 'app', [
      f('fa-api', 'api', [
        f('fa-api-v1', 'v1', [
          f('fa-endpoints', 'endpoints', [
            file('fa-ep-users', 'users.py'),
            file('fa-ep-auth', 'auth.py'),
            file('fa-ep-items', 'items.py'),
          ]),
          file('fa-v1-api', 'api.py'),
        ]),
      ]),
      f('fa-core', 'core', [
        file('fa-core-config', 'config.py'),
        file('fa-core-security', 'security.py'),
        file('fa-core-deps', 'deps.py'),
      ]),
      f('fa-models', 'models', [
        file('fa-mdl-user', 'user.py'),
        file('fa-mdl-item', 'item.py'),
      ]),
      f('fa-schemas', 'schemas', [
        file('fa-sch-user', 'user.py'),
        file('fa-sch-token', 'token.py'),
      ]),
      f('fa-crud', 'crud', [
        file('fa-crud-user', 'crud_user.py'),
        file('fa-crud-base', 'base.py'),
      ]),
      f('fa-db', 'db', [
        file('fa-db-session', 'session.py'),
        file('fa-db-base', 'base.py'),
      ]),
      file('fa-main', 'main.py'),
      file('fa-init', '__init__.py'),
    ]),
    f('tests', 'tests', [
      file('tst-init', '__init__.py'),
      file('tst-users', 'test_users.py'),
    ]),
    f('alembic', 'alembic', [
      f('alembic-versions', 'versions'),
      file('alembic-env', 'env.py'),
    ]),
    file('root-requirements', 'requirements.txt'),
    file('root-env', '.env'),
    file('root-gitignore', '.gitignore'),
    file('root-readme', 'README.md'),
  ]),
};

// ─── 17. Electron ────────────────────────────────────────────────────────────
const electron = {
  id: 'tpl-electron',
  label: 'Electron',
  description: 'Electron masaüstü uygulaması',
  emoji: '🖥️',
  tree: f('root', 'electron-app', [
    f('src', 'src', [
      f('el-main', 'main', [
        file('el-main-index', 'index.js'),
        file('el-main-menu', 'menu.js'),
        file('el-main-ipc', 'ipcHandlers.js'),
      ]),
      f('el-renderer', 'renderer', [
        f('el-rnd-components', 'components', [
          file('el-cmp-titlebar', 'TitleBar.jsx'),
          file('el-cmp-sidebar', 'Sidebar.jsx'),
        ]),
        f('el-rnd-pages', 'pages', [
          file('el-pg-home', 'Home.jsx'),
          file('el-pg-settings', 'Settings.jsx'),
        ]),
        f('el-rnd-styles', 'styles', [
          file('el-style-global', 'global.css'),
        ]),
        file('el-rnd-app', 'App.jsx'),
        file('el-rnd-index', 'index.jsx'),
      ]),
      f('el-preload', 'preload', [
        file('el-preload-index', 'index.js'),
      ]),
    ]),
    f('assets', 'assets', [
      f('el-assets-icons', 'icons', [
        file('el-icon-png', 'icon.png'),
        file('el-icon-ico', 'icon.ico'),
      ]),
    ]),
    file('root-pkg', 'package.json'),
    file('root-vite', 'vite.config.js'),
    file('root-forge', 'forge.config.js'),
    file('root-gitignore', '.gitignore'),
  ]),
};

// ─── 18. T3 Stack ────────────────────────────────────────────────────────────
const t3Stack = {
  id: 'tpl-t3',
  label: 'T3 Stack',
  description: 'Next.js + tRPC + Prisma + Tailwind',
  emoji: '🔺',
  tree: f('root', 't3-app', [
    f('src', 'src', [
      f('t3-server', 'server', [
        f('t3-api', 'api', [
          f('t3-routers', 'routers', [
            file('t3-router-user', 'user.ts'),
            file('t3-router-post', 'post.ts'),
          ]),
          file('t3-trpc', 'trpc.ts'),
          file('t3-root', 'root.ts'),
        ]),
        f('t3-db', 'db', [
          file('t3-db-index', 'index.ts'),
        ]),
      ]),
      f('t3-app', 'app', [
        f('t3-app-api', 'api', [
          f('t3-app-trpc', 'trpc', [
            file('t3-trpc-route', '[trpc].ts'),
          ]),
        ]),
        file('t3-app-layout', 'layout.tsx'),
        file('t3-app-page', 'page.tsx'),
      ]),
      f('t3-components', 'components', [
        file('t3-cmp-nav', 'Navbar.tsx'),
        file('t3-cmp-btn', 'Button.tsx'),
      ]),
      f('t3-styles', 'styles', [
        file('t3-styles-global', 'globals.css'),
      ]),
      file('t3-env', 'env.js'),
    ]),
    f('prisma', 'prisma', [
      file('prisma-schema', 'schema.prisma'),
    ]),
    f('public', 'public'),
    file('root-next', 'next.config.js'),
    file('root-tailwind', 'tailwind.config.ts'),
    file('root-tsconfig', 'tsconfig.json'),
    file('root-pkg', 'package.json'),
    file('root-env', '.env'),
    file('root-gitignore', '.gitignore'),
  ]),
};

// ─── Export ───────────────────────────────────────────────────────────────────
export const templates = [
  reactVite,
  nextjsApp,
  t3Stack,
  vueVite,
  svelteKit,
  angular,
  expressMvc,
  mernStack,
  goGin,
  springBoot,
  laravel,
  pythonFlask,
  fastApi,
  django,
  flutter,
  reactNative,
  electron,
  staticSite,
];
