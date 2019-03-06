import Koa from 'koa';
import Pug from 'koa-pug';
import Router from 'koa-router';
import path from 'path';
import container from './container';
import middlevares from './middlewares';
import addRoutes from './routes';

const app = new Koa();
const PORT = process.env.PORT || 3000;


const { errInform, logger } = middlevares;
app.use(logger(container));
app.use(errInform(container));
const router = new Router();
addRoutes(router, container);
app.use(router.allowedMethods());
app.use(router.routes());
const pug = new Pug({
  viewPath: path.join(__dirname, 'views'),
  // noCache: process.env.NODE_ENV === 'development',
  debug: true,
  pretty: true,
  compileDebug: true,
  locals: [],
  basedir: path.join(__dirname, 'views'),
  /* helperPath: [
    { _ },
    { urlFor: (...args) => router.url(...args) },
  ], */
});
pug.use(app);
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
