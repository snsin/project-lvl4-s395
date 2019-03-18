import request from 'supertest';
import faker from 'faker';
import matchers from 'jest-supertest-matchers';
import db from '../models';

import app from '..';

const createFakeUser = () => ({
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  email: faker.internet.email(),
  password: faker.internet.password(10),
});

describe('tm-requests', () => {
  let server;

  beforeAll(() => {
    expect.extend(matchers);
    db.sequelize.sync();
  });

  beforeEach(() => {
    server = app().listen();
  });

  test('GET / (welcome)', async () => {
    const res = await request.agent(server)
      .get('/');
    expect(res).toHaveHTTPStatus(200);
  });

  test('not found', async () => {
    const res = await request.agent(server)
      .get('/wrong-path');
    expect(res).toHaveHTTPStatus(404);
  });

  test('GET /error (bad request)', async () => {
    const res = await request.agent(server)
      .get('/error');
    expect(res).toHaveHTTPStatus(400);
  });

  test('GET /users (users list)', async () => {
    const res = await request.agent(server)
      .get('/users');
    expect(res).toHaveHTTPStatus(200);
  });

  test('POST /users (create user)', async () => {
    const fakeUser = createFakeUser();
    const res = await request.agent(server)
      .post('/users')
      .type('form')
      .send({ form: fakeUser });
    expect(res).toHaveHTTPStatus(302);
  });

  describe('logged user', () => {
    let logged;
    beforeEach(async (done) => {
      const user = createFakeUser();
      const { email, password } = user;
      logged = request.agent(server);
      await logged
        .post('/users')
        .type('form')
        .send({ form: user });
      await logged
        .post('/session')
        .type('form')
        .send({ form: { email, password } });
      done();
    });

    test('DELETE /users (delete logged user)', async () => {
      const res = await logged
        .delete('/users');
      expect(res).toHaveHTTPStatus(302);
    });

    test('PUT /users (update logged user)', async () => {
      const res = await logged
        .put('/users')
        .send({ form: { email: faker.internet.email() } });
      expect(res).toHaveHTTPStatus(302);
    });

    test('DELETE /users (try to delete user when not logged)', async () => {
      const res = await request.agent(server)
        .delete('/users');
      expect(res).toHaveHTTPStatus(200);
    });

    test('UPDATE /users (try to update user when not logged)', async () => {
      const res = await request.agent(server)
        .put('/users')
        .send({ form: { email: faker.internet.email() } });
      expect(res).toHaveHTTPStatus(200);
    });
  });

  afterEach((done) => {
    server.close();
    done();
  });

  afterAll(async (done) => {
    await db.sequelize.drop();
    done();
  });
});
