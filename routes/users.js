import { User } from '../models';
import buildFormObj from '../lib/formObjectBuilder';

export default (router, { logger: log }) => {
  router
    .get('listUsers', '/users', async (ctx) => {
      const users = await User.findAll();
      ctx.render('users', { users });
    })
    .get('newUser', '/users/new', (ctx) => {
      const user = User.build();
      ctx.render('users/new', { f: buildFormObj(user) });
    })
    .get('userSettings', '/users/settings', async (ctx) => {
      const { session: { userId: id } } = ctx;
      try {
        const user = await User.findByPk(id);
        ctx.render('users/edit', { f: buildFormObj(user) });
      } catch (e) {
        log(e);
        ctx.flash.set('Something went wrong');
        ctx.redirect(router.url('root'));
      }
    })
    .post('createUser', '/users', async (ctx) => {
      const { request: { body: { form } } } = ctx;
      const user = User.build(form);
      try {
        await user.save();
        ctx.flash.set('User has been created');
        ctx.redirect(router.url('root'));
      } catch (e) {
        log(e);
        ctx.render('users/new', { f: buildFormObj(user, e) });
      }
    })
    .put('updateUser', '/users', async (ctx) => {
      const { request: { body: { form } }, session: { userId: id } } = ctx;
      const { newPassword, confirmPassword } = form;
      let user;
      if (newPassword !== confirmPassword) {
        const err = { errors: [{ message: 'Passwords don\'t match', path: 'newPassword' }] };
        ctx.render('users/edit', { f: buildFormObj(form, err) });
        return;
      }
      if (newPassword) {
        form.password = newPassword;
      }
      try {
        user = await User.findByPk(id);
        await user.update(form);
        ctx.flash.set('User has been updated');
        ctx.redirect(router.url('root'));
      } catch (e) {
        log(e);
        ctx.render('users/edit', { f: buildFormObj(user || {}, e) });
      }
    })
    .del('deleteUser', '/users', async (ctx) => {
      const { session: { userId: id } } = ctx;
      try {
        const user = await User.findByPk(id);
        await user.destroy();
        ctx.session = {};
        ctx.flash.set('Your account has been successfully deleted');
        ctx.redirect(router.url('root'));
      } catch (e) {
        log(e);
        ctx.flash.set('Something went wrong');
        ctx.render('welcome');
      }
    });
};
