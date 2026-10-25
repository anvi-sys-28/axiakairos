export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/')) {
      const targetUrl = 'https://axiakairos-backend-production.up.railway.app' + url.pathname + url.search;
      return fetch(new Request(targetUrl, request));
    }
    return env.ASSETS.fetch(request);
  },
};
