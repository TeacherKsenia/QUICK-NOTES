(function (global) {
  'use strict';

  function createViewRouter({ dashboard, appShell, onDashboard, onWorkspace }) {
    const routes = new Map();
    let current = dashboard.hidden ? 'workspace' : 'dashboard';

    function register(name, route) {
      routes.set(name, route);
      return api;
    }

    function show(view) {
      const next = routes.has(view) ? view : 'workspace';
      routes.forEach((route, name) => {
        const active = name === next;
        if (route.element) route.element.hidden = !active;
        route.element?.setAttribute('aria-hidden', String(!active));
      });
      current = next;
      document.body.classList.toggle('dashboard-open', current === 'dashboard');
      if (appShell) appShell.setAttribute('aria-hidden', String(current !== 'workspace'));
      routes.get(current)?.onEnter?.();
      window.scrollTo(0, 0);
    }

    const api = { register, show, get current() { return current; } };
    register('dashboard', { element: dashboard, onEnter: onDashboard });
    register('workspace', { element: appShell, onEnter: onWorkspace });
    return api;
  }

  global.QuickNotesRouter = { createViewRouter };
})(window);
