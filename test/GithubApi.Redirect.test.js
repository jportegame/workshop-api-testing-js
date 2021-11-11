const agent = require('superagent');
const statusCode = require('http-status-codes');
const chai = require('chai');
const chaiSubset = require('chai-subset');

chai.use(chaiSubset);
const { expect } = chai;

describe('Github HEAD Test', () => {
  describe('Redirect', () => {
    it('Consume HEAD to consult the redirect', async () => {
      let response;
      try {
        response = await agent.head('https://github.com/aperdomob/redirect-test')
          .auth('token', process.env.ACCESS_TOKEN)
          .set('User-Agent', 'agent');
      } catch (error) {
        response = error;
      }
      expect(response.status).to.equal(statusCode.MOVED_PERMANENTLY);
      expect(response.response.headers.location).to.equal('https://github.com/aperdomob/new-redirect-test');
    });
  });

  describe('Verify redirect', () => {
    it('Consume GET to test the redirect', async () => {
      let response;
      try {
        response = await agent.get('https://github.com/aperdomob/redirect-test')
          .auth('token', process.env.ACCESS_TOKEN)
          .set('User-Agent', 'agent');
      } catch (error) {
        response = error;
      }
      expect(response.status).to.equal(statusCode.OK);
      expect(response.redirects[0]).to.equal('https://github.com/aperdomob/new-redirect-test');
    });
  });
});
