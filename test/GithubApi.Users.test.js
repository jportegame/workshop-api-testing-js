const agent = require('superagent');
const statusCode = require('http-status-codes');
const chai = require('chai');
const chaiSubset = require('chai-subset');

chai.use(chaiSubset);
const { expect } = chai;

const urlBase = 'https://api.github.com';

describe('Query Parameters', () => {
  describe('Get all users from github', () => {
    it('Consume GET users list', async () => {
      const response = await agent.get(`${urlBase}/users`)
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'agent');
      expect(response.status).to.equal(statusCode.OK);
      expect(response.body.length).equal(30);
    });
  });
  describe('Get 10 users from github', () => {
    it('Consume GET users list', async () => {
      const response = await agent.get(`${urlBase}/users`)
        .auth('token', process.env.ACCESS_TOKEN)
        .query({
          per_page: 10
        })
        .set('User-Agent', 'agent');
      expect(response.status).to.equal(statusCode.OK);
      expect(response.body.length).equal(10);
    });
  });
  describe('Get 50 users from github', () => {
    it('Consume GET users list', async () => {
      const response = await agent.get(`${urlBase}/users`)
        .auth('token', process.env.ACCESS_TOKEN)
        .query({
          per_page: 50
        })
        .set('User-Agent', 'agent');
      expect(response.status).to.equal(statusCode.OK);
      expect(response.body.length).equal(50);
    });
  });
});
