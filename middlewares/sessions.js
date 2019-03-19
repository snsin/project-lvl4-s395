export default async (ctx, next) => {
  ctx.state = {
    flash: ctx.flash,
    userName: ctx.session.userName,
    isSignedIn: () => ctx.session.userId !== undefined,
  };
  await next();
};
