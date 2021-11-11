const agent = require('superagent');
const statusCode = require('http-status-codes');
const chai = require('chai');
const chaiSubset = require('chai-subset');

chai.use(chaiSubset);
const { expect } = chai;

const urlBase = 'https://api.github.com';
let githubUserName = '';
let repository = '';
let issue = '';

describe('Github POST and PATCH Test', () => {
  describe('Get auth user', () => {
    it('Consume GET Service to get authenticated user', async () => {
      const response = await agent.post(`${urlBase}/user`)
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'agent');

      expect(response.status).to.equal(statusCode.OK);
      expect(response.body.public_repos).to.greaterThan(0);
      githubUserName = response.body.login;
    });
  });

  describe('Get public reposirory', () => {
    it('Consume GET Service to get authenticated user', async () => {
      const response = await agent.get(`${urlBase}/users/${githubUserName}/repos`)
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'agent');

      expect(response.status).to.equal(statusCode.OK);
      expect(response.body).containSubset([{ visibility: 'public' }]);
      repository = response.body.find((repo) => repo.visibility === 'public').name;
    });
  });

  describe('Create ISSUE in repository', () => {
    const data = {
      title: 'Title'
    };
    it('Consume POST Service for create an Issue', async () => {
      const response = await agent.post(`${urlBase}/repos/${githubUserName}/${repository}/issues`)
        .auth('token', process.env.ACCESS_TOKEN)
        .send(data)
        .set('User-Agent', 'agent');

      expect(response.status).to.equal(statusCode.CREATED);
      expect(response.body.title).to.equal(data.title);
      expect(response.body.body).to.be.equal(null);
      issue = response.body.number;
    });
  });

  describe('Update ISSUE in repository', () => {
    const data = {
      body: 'This is an issue'
    };
    it('Consume POST Service for create an Issue', async () => {
      const response = await agent.patch(`${urlBase}/repos/${githubUserName}/${repository}/issues/${issue}`)
        .auth('token', process.env.ACCESS_TOKEN)
        .send(data)
        .set('User-Agent', 'agent');

      expect(response.status).to.equal(statusCode.OK);
      expect(response.body.title).to.equal('Title');
      expect(response.body.body).to.be.equal(data.body);
    });
  });
});
