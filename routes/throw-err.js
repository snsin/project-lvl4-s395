export default (router) => {
  router.get('error', '/error', async (ctx) => {
    ctx.throw(400, 'Booom');
  });
};
