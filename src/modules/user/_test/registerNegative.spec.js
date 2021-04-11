import { expect } from 'chai';
import { userRegisterAction } from './_actions';
import { testUser } from './_data';
import User from '../userModel';

describe('USER REGISTER NEGATIVE', () => {
  before(() => {
    return User.deleteOne({ email: testUser.email });
  });
  it('should NOT register new user with empty email input', (done) => {
    userRegisterAction({ ...testUser, email: '' })
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('should NOT register new user without `@` email input', (done) => {
    userRegisterAction({ ...testUser, email: 'supermangmail.com' })
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('should NOT register new user with not latin characters email input', (done) => {
    userRegisterAction({ ...testUser, email: 'supermanУА@gmail.com' })
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('should NOT register new user with double `@` email input', (done) => {
    userRegisterAction({ ...testUser, email: 'superman@@gmail.com' })
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('should NOT register new user without `.` email input', (done) => {
    userRegisterAction({ ...testUser, email: 'superman@gmailcom' })
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('should NOT register new user with double `.` email input', (done) => {
    userRegisterAction({ ...testUser, email: 'superman@gmail..com' })
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('should NOT register new user with empty password input', (done) => {
    userRegisterAction({ ...testUser, password: '' })
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('should NOT register new user with password less the 5 length input', (done) => {
    userRegisterAction({ ...testUser, password: '1234' })
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('should NOT register new user with empty First Name input', (done) => {
    userRegisterAction({ ...testUser, firstName: '' })
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('should NOT register new user with more the 20 length First Name input', (done) => {
    userRegisterAction({ ...testUser, firstName: 'SuperNameWithToLongLength' })
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('should NOT register new user with number in First Name input', (done) => {
    userRegisterAction({ ...testUser, firstName: 'Super0123456789' })
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('should NOT register new user with `@!#$%&*+/=?^_{|}~` symbols in First Name input', (done) => {
    userRegisterAction({ ...testUser, firstName: 'Super@!#$%&*+/=?^_`{|}~' })
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('should NOT register new user with spaces in First Name input', (done) => {
    userRegisterAction({ ...testUser, firstName: 'Sup Er' })
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('should NOT register new user with empty Last Name input', (done) => {
    userRegisterAction({ ...testUser, lastName: '' })
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('should NOT register new user with more the 20 length Last Name input', (done) => {
    userRegisterAction({ ...testUser, lastName: 'ManNameWithToLongLength' })
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('should NOT register new user with numbers in Last Name input', (done) => {
    userRegisterAction({ ...testUser, lastName: 'Man0123456789' })
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('should NOT register new user with `!#$%&*+/=?^_{|}~` symbols in Last Name input', (done) => {
    userRegisterAction({ ...testUser, lastName: 'Man@!#$%&*+/=?^_{|}~' })
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('should NOT register new user with spaces in Last Name input', (done) => {
    userRegisterAction({ ...testUser, lastName: 'Ma N' })
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('should NOT register new user with empty phone input', (done) => {
    userRegisterAction({ ...testUser, phone: '' })
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('should NOT register new user with empty About input', (done) => {
    userRegisterAction({ ...testUser, about: '' })
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('should NOT register new user with empty Goals input', (done) => {
    userRegisterAction({ ...testUser, goals: '' })
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('should NOT register new user with empty English Level input', (done) => {
    userRegisterAction({ ...testUser, englishLevel: '' })
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('should NOT register new user with empty Country Name input', (done) => {
    userRegisterAction({ ...testUser, countryName: '' })
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });
});
