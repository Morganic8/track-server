const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

//this runs just before 'save()' in app
//not using arrow func because we want instance of 'this', not context of this file
userSchema.pre('save', function (next) {
  const user = this;
  if (!user.isModified('password')) {
    return next()
  }

  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next();

      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function (candidatePassword) {
  //user context
  const user = this;
  return new Promise((resolve, reject) => {
    /**
     * @function bcrypt.compare - compare user input and mongoDB passwords
     * @param candidatePassword - user input of password
     * @param user.password - mongoDB stored password
     * @param callback func - err, isMatch
     */
    bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
      if (err) return reject(err);
      if (!isMatch) return reject(false);

      resolve(true);
    })
  });
}

mongoose.model('User', userSchema);