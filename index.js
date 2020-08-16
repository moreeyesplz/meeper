const core = require('@actions/core');
const github = require('@actions/github');

async function create_meep() {
    const { id, message, owner, repo, user } = github.context.payload.inputs;

    const token = core.getInput('bot_token');
    const octokit = github.getOctokit(token);

    console.log(`Creating commit comment for ${owner}/${repo}/${id}`);

    await octokit.repos.createCommitComment({
        owner,
        repo,
        commit_sha: id,
        body: `Hey there :) This commit has been indexed in the MEEPs database. \n\nFor those who are here and interested in providing critique, feedback, and suggestions, thanks! Please be respectful and humble in doing so, you are appreciated!`
    });
    const topics = await octokit.repos.getAllTopics({ owner, repo });
    const labels = topics.data ? topics.data.names : [];
    const commit_url = `https://github.com/${owner}/${repo}/commit/${id}`;
    const response = await octokit.issues.create({
        owner: 'moreeyesplz',
        repo: 'meeps',
        title: commit_url,
        body: `${user}\n${commit_url}\n${message}`,
        labels
    });
    console.log('Issue created: ', response);
}

try {
    create_meep();
} catch (e) {
    core.setFailed(e.message);
}