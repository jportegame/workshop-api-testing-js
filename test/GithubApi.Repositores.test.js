const agent = require('superagent');
const statusCode = require('http-status-codes');
const crypto = require('crypto');

const chai = require('chai');
const chaiSubset = require('chai-subset');

chai.use(chaiSubset);
const { expect } = chai;

const urlBase = 'https://api.github.com';
const githubUserName = 'aperdomob';
const repository = 'jasmine-awesome-report';
let reposUrl = '';
let fileUrl = '';

const md5Hash = (input) => crypto.createHash('md5').update(input).digest('hex');

describe('Github GET Test', () => {
  describe('User', () => {
    it('Consume GET Service to find user', async () => {
      const name = 'Alejandro Perdomo';
      const company = 'Perficient Latam';
      const location = 'Colombia';

      const response = await agent.get(`${urlBase}/users/${githubUserName}`)
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'agent');

      expect(response.status).to.equal(statusCode.OK);
      expect(response.body.name).to.equal(name);
      expect(response.body.company).to.equal(company);
      expect(response.body.location).to.equal(location);

      reposUrl = response.body.repos_url;
    });
  });

  describe('Repositories', () => {
    it('Consume GET Service to find repository', async () => {
      const privatity = false;
      const description = 'An awesome html report for Jasmine';

      const response = await agent.get(reposUrl)
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'agent');

      expect(response.status).to.equal(statusCode.OK);
      const currentRepository = response.body.find((repo) => repo.name === repository);
      expect(currentRepository.full_name).to.equal(`${githubUserName}/${repository}`);
      expect(currentRepository).to.be.an('object');
      expect(currentRepository.private).to.equal(privatity);
      expect(currentRepository.description).to.equal(description);
    });
  });

  describe('Download repository', () => {
    it('GET to download repository', async () => {
      const response = await agent.get(`${urlBase}/repos/${githubUserName}/${repository}/zipball/master`)
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'agent');

      expect(response.status).to.equal(statusCode.OK);
      expect(md5Hash(response.body)).to.equal(
        'df39e5cda0f48ae13a5c5fe432d2aefa'
      );
    });
  });

  describe('README.md', () => {
    const infoReadme = {
      name: 'README.md',
      path: 'README.md',
      sha: '1eb7c4c6f8746fcb3d8767eca780d4f6c393c484'
    };
    it('GET to find the README.md on the repository', async () => {
      const response = await agent.get(`${urlBase}/repos/${githubUserName}/${repository}/contents`)
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'agent');

      expect(response.status).to.equal(statusCode.OK);
      expect(response.body).to.be.an('array');
      expect(response.body).containSubset([infoReadme]);

      fileUrl = response.body.find((element) => element.name === 'README.md').download_url;
    });
  });

  describe('Download README.md', () => {
    it('GET to download README.md file', async () => {
      const response = await agent.get(fileUrl)
        .set('User-Agent', 'agent');

      expect(response.status).to.equal(statusCode.OK);
      expect(md5Hash(response.text)).to.equal(
        '97ee7616a991aa6535f24053957596b1'
      );
    });
  });
});
