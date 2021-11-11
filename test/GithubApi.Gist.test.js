const agent = require('superagent');
const statusCode = require('http-status-codes');
const chai = require('chai');
const chaiSubset = require('chai-subset');

chai.use(chaiSubset);
const { expect } = chai;

const urlBase = 'https://api.github.com';
let gistURL = '';
const data = {
  description: 'This gist will be deleted',
  files: {
    file: {
      content: 'let promise = new Promise((resolve, reject) => {resolve("Success")});\n'
    }
  },
  public: true
};

describe('Github DELETE Test', () => {
  describe('Gist', () => {
    it('Consume POST to create a new gist', async () => {
      const response = await agent.post(`${urlBase}/gists`)
        .auth('token', process.env.ACCESS_TOKEN)
        .send(data)
        .set('User-Agent', 'agent');

      expect(response.status).to.equal(statusCode.CREATED);
      expect(response.body.description).to.be.equal(data.description);
      expect(response.body.public).to.be.equal(data.public);
      expect(response.body.files.file.content).to.be.eql(data.files.file.content);
      gistURL = response.body.url;
    });
  });

  describe('Find Gist', () => {
    it('Consume GET to find gist', async () => {
      const response = await agent.get(gistURL)
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'agent');

      expect(response.status).to.equal(statusCode.OK);
      expect(response.body).containSubset(data);
    });
  });

  describe('Find Gist', () => {
    it('Consume DELETE to delete gist', async () => {
      const response = await agent.delete(gistURL)
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'agent');

      expect(response.status).to.equal(statusCode.NO_CONTENT);
    });
  });

  describe('Find Gist', () => {
    it('Consume GET to try find the deleted gist', async () => {
      let response;
      try {
        response = await agent.get(gistURL)
          .auth('token', process.env.ACCESS_TOKEN)
          .set('User-Agent', 'agent');
      } catch (error) {
        response = error;
      }
      expect(response.status).to.equal(statusCode.NOT_FOUND);
    });
  });
});
