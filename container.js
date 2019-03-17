import dotenv from 'dotenv';

import logger from './lib/logger';
import { encrypt, verify } from './lib/secure';

dotenv.config();

export default { logger, secure: { encrypt, verify } };
