import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Authentication (e2e)', () => {
  let app: INestApplication;
  const createUserData = { email: 'test1@test.com', password: 'qwerty' };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

  });

  it('/auth/signUp (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/signUp')
      .send(createUserData)
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;

        expect(id).toBeDefined();
        expect(email).toEqual(createUserData.email);
      });
  });

  it('signup as a new user and return current user', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/signUp')
      .send(createUserData)
      .expect(201);
    const cookie = res.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .get('/auth/whoAmI')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.email).toEqual(createUserData.email);
  });
});
