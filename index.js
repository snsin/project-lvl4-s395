import Koa from 'koa';
import Pug from 'koa-pug';
import path from 'path';

const app = new Koa();

// response
app.use((ctx) => {
  // ctx.body = 'Hello Koa';
  ctx.render('welcome/index');
});
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
app.listen(3000);
