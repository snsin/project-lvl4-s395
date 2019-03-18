import welcome from './welcome';
import error from './throw-err';
import users from './users';
import sessions from './sessions';

const controllers = [welcome, error, users, sessions];

export default (router, container) => controllers.forEach(f => f(router, container));
