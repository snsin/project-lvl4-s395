import Rollbar from 'rollbar';

const rollbar = new Rollbar({
  accessToken: process.env.ROLLBAR_ACCESS_TOKEN,
  captureUncaught: true,
  captureUnhandledRejections: true,
});

export default ({ logger: log }) => async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    err.status = err.statusCode || err.status || 500;
    rollbar.error(err);
    log(err);
    ctx.flash.set('Something went wrong');
    ctx.render('welcome');
  }
};
