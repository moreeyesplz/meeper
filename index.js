const core = require('@actions/core');
const github = require('@actions/github');
const { Octokit } = require('@octokit/rest');
const { createAppAuth } = require('@octokit/auth-app');

async function create_meep() {
    const { id, message, owner, repo, user } = github.context.payload.inputs;

    const bot_id = parseInt(core.getInput('bot_id'));
    const install_id = parseInt(core.getInput('bot_install_id'));
    const pkey = core.getInput('bot_key');
    const octokit = new Octokit({
        authStrategy: createAppAuth,
        auth: {
            id: bot_id,
            privateKey: pkey,
            installationId: install_id,
        }
    });
    await octokit.auth({ type: 'app' });

    console.log(`Creating commit comment for ${owner}/${repo}/${id}`);

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
    if (response.status !== 201) {
        core.error(`Failed to create meep for ${owner}/${repo}/${id}`);
        return;
    }
    const issue_no = response.data.number;

    await octokit.repos.createCommitComment({
        owner,
        repo,
        commit_sha: id,
        body: `### :eyes: More Eyes, Plz! :eyes:
Hey there @${user} :smile: This commit has been indexed in the [moreeyesplz](https://moreeyesplz.com) database. Feel free to add additional context about what you'd like others to provide feedback or insight on.

For those who are here and interested in providing critique, feedback, and suggestions, thanks! Please be respectful and humble in doing so - you are appreciated! :hugs:

---
#### Available commands

Commands can be typed anywhere in the message body.

\`[meep close]\` (original meeper only) indicate that the request has been fulfilled and can be removed from the meeps database.

More commands coming soon!

*meep no. ${issue_no}*`
    });
}

try {
    create_meep();
} catch (e) {
    core.setFailed(e.message);
}