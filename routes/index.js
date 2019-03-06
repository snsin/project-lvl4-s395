import welcome from './welcome';
import error from './throw-err';

const controllers = [welcome, error];

export default (router, container) => controllers.forEach(f => f(router, container));
