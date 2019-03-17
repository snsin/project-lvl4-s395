import bcrypt from 'bcrypt';

export const encrypt = value => bcrypt.hashSync(value, Number(process.env.SALT_ROUNDS));
export const verify = (pass, digest) => bcrypt.compareSync(pass, digest);
