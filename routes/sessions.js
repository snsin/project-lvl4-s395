import buildFormObj from '../lib/formObjectBuilder';
import { User } from '../models';

export default (router, { logger: log, secure: { verify } }) => {
  router
    .get('newSession', '/session/new', async (ctx) => {
      const data = {};
      ctx.render('sessions/new', { f: buildFormObj(data) });
    })
    .post('logIn', '/session', async (ctx) => {
      const { email, password } = ctx.request.body.form;
      const user = await User.findOne({ where: { email } });
      if (verify(password, user.passwordDigest)) {
        ctx.session.userId = user.id;
        ctx.redirect(router.url('root'));
        return;
      }
      log('unsuccessful login attempt %o', ctx.request);
      ctx.flash.set('email or password were wrong');
      ctx.render('sessions/new', { f: buildFormObj({ email }) });
    })
    .delete('logOut', '/session', (ctx) => {
      ctx.session = {};
      ctx.redirect(router.url('root'));
    });
};
