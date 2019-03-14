import { encrypt } from '../lib/sequre';

export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    passwordDigest: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      },
    },
    passworg: {
      type: DataTypes.VIRTUAL,
      set(value) {
        this.setDataValule('passwordDigest', encrypt(value));
        this.setDataValule('password', value);
        return value;
      },
    },
  }, {
    getterMethods: {
      fullName() {
        return `${this.firstName} ${this.lastName}`;
      },
    },
  });
  /* User.associate = function(models) {
    // associations can be defined here
  }; */
  return User;
};
