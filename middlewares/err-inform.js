import Rollbar from 'rollbar';

const rollbar = new Rollbar({
  accessToken: process.env.ROLLBAR_ACCESS_TOKEN,
  captureUncaught: true,
  captureUnhandledRejections: true,
});

export default ({ logger }) => async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    err.status = err.statusCode || err.status || 500;
    rollbar.log(err);
    console.log(`${typeof process.env.ROLLBAR_ACCESS_TOKEN} ${process.env.ROLLBAR_ACCESS_TOKEN}`);
    logger(err);
    throw err;
  }
};
