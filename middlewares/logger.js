
export default ({ logger }) => async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  logger(`${ctx.method} ${ctx.url} - ${ms}`);
};
