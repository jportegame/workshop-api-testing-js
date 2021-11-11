const agent = require('superagent');
const statusCode = require('http-status-codes');
const { expect } = require('chai');

const urlBase = 'https://api.github.com';
const githubUserName = 'aperdomob';

describe('Github PUT Test', () => {
  describe('Follow User', () => {
    it('Consume PUT Service to follow user', async () => {
      const response = await agent.put(`${urlBase}/user/following/${githubUserName}`)
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'agent');

      expect(response.status).to.equal(statusCode.NO_CONTENT);
      expect(response.body).to.eql({});
    });
  });

  describe('Check follow user', () => {
    it('Consume PUT Service to verify follow user', async () => {
      const response = await agent.get(`${urlBase}/user/following`)
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'agent');

      expect(response.status).to.equal(statusCode.OK);
      expect(response.body).to.be.an('array');
      const user = response.body.find((githubUser) => githubUser.login === githubUserName);
      expect(user).to.be.an('object');
      expect(user.login).to.equal(githubUserName);
    });
  });

  describe('Check idenpotent PUT follow User', () => {
    it('Consume PUT Service to follow user', async () => {
      const response = await agent.put(`${urlBase}/user/following/${githubUserName}`)
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'agent');

      expect(response.status).to.equal(statusCode.NO_CONTENT);
      expect(response.body).to.eql({});
    });
  });
});
