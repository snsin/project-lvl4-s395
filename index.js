import Koa from 'koa';
import Pug from 'koa-pug';
import Router from 'koa-router';
import koaWebpack from 'koa-webpack';
import serve from 'koa-static';
import bodyParser from 'koa-bodyparser';
import session from 'koa-generic-session';
import flash from 'koa-flash-simple';
import methodOverride from 'koa-methodoverride';
import path from 'path';
import _ from 'lodash';
import container from './container';
import middlevares from './middlewares';
import addRoutes from './routes';
import webpackConfig from './webpack.config';

export default () => {
  const app = new Koa();
  const { errInform, logger, sessionHelper } = middlevares;
  app.keys = [process.env.APP_SESSIONS_KEY1, process.env.APP_SESSIONS_KEY2];
  app.use(session(app));
  app.use(flash());
  app.use(sessionHelper);
  app.use(logger(container));
  app.use(errInform(container));
  app.use(bodyParser());
  app.use(methodOverride((req) => {
    // return req?.body?._method;
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      return req.body._method; // eslint-disable-line
    }
    return null;
  }));
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
