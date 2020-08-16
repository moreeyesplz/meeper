const core = require('@actions/core');
const github = require('@actions/github');

const { id, message, owner, repo, user } = github.context.payload.inputs;

const token = core.getInput('bot_token');
const octokit = github.getOctokit(token);

const decoded = Buffer.from(message, 'base64').toString('utf8');

octokit.issues.create({
    owner,
    repo,
    title: 'More eyes, plz!',
    body: decoded,
}).then(value => {
    console.log('Issue created: ', value.data);
    octokit.repos.getAllTopics({
        owner,
        repo
    }).then((value) => {
        const labels = value.names;
        const commit_url = `https://github.com/${owner}/${repo}/commit/${id}`;
        octokit.issues.create({
            owner: 'moreeyesplz',
            repo: 'meeps',
            title: commit_url,
            body: `${user} has requested more eyes [here](${commit_url}).\n\n${decoded}`,
            labels,
        }).catch((e) => {
            console.log('Failed to make meeper issue: ', e);
        });
    }).catch((e) => {
        console.log('Failed to fetch repo topics: ', e);
    });
}).catch(e => {
    console.log('Failed to make user issue: ', e);
});