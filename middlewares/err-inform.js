import Rollbar from 'rollbar';

const rollbar = new Rollbar({
  accessToken: '9503ea12eb0147d893f555285c1e837d', // process.env.ROLLBAR_ACCESS_TOKEN,
  captureUncaught: true,
  captureUnhandledRejections: true,
});

export default ({ logger }) => async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    err.status = err.statusCode || err.status || 500;
    rollbar.log(err);
    logger(err);
    throw err;
  }
};
