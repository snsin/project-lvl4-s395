import Koa from 'koa';
import Pug from 'koa-pug';
import Router from 'koa-router';
import koaWebpack from 'koa-webpack';
import serve from 'koa-static';
import path from 'path';
import _ from 'lodash';
import container from './container';
import middlevares from './middlewares';
import addRoutes from './routes';
import webpackConfig from './webpack.config';

export default () => {
  const app = new Koa();
  const { errInform, logger } = middlevares;
  app.use(logger(container));
  app.use(errInform(container));
  app.use(serve(path.join(__dirname, 'public')));
  if (process.env.NODE_ENV === 'development') {
    koaWebpack({
      config: webpackConfig,
    }).then(m => app.use(m));
  }

  const router = new Router();
  addRoutes(router, container);
  app.use(router.allowedMethods());
  app.use(router.routes());
  const pug = new Pug({
    viewPath: path.join(__dirname, 'views'),
    noCache: process.env.NODE_ENV === 'development',
    debug: true,
    pretty: true,
    compileDebug: true,
    locals: [],
    basedir: path.join(__dirname, 'views'),
    helperPath: [
      { _ },
      { urlFor: (...args) => router.url(...args) },
    ],
  });
  pug.use(app);
  return app;
};
