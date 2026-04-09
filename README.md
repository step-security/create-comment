[![StepSecurity Maintained Action](https://raw.githubusercontent.com/step-security/maintained-actions-assets/main/assets/maintained-action-banner.png)](https://docs.stepsecurity.io/actions/stepsecurity-maintained-actions)

# Create Comment
[![CI](https://github.com/step-security/create-comment/workflows/build-test/badge.svg)](https://github.com/step-security/create-comment/actions?query=workflow%3Abuild-test)

A GitHub Action that post comment on a GitHub Issue or Pull Request.
If the same content is posted before, this action will delete the existing one and post a new one.

This action extract the number from an issue or a pull request which has triggered this by default. You don't need to specify the issue number by `${{ github.event.issue.number }}` or `${{ github.event.pull_request.number }}` if you want to post to its issue or pull request.

## Usage

```yml
      - name: Create Comment
        uses: step-security/create-comment@v1
        with:
          number: 1
          comment: Comment for Issue or GitHub Pull Request
```

### Post a comment and close the previous same comment

This is just an example to show one way in which this action can be used.

```yml
on: pull_request
jobs:
  commit-message-check:
    runs-on: ubuntu-latest
    steps:
      - name: Post comment
        uses: step-security/create-comment@v1
        with:
          comment: |
            Issue title must start with 'ABC-'.
            Auto-closing this issue.
```

### Action inputs

| Name | Description | Default |
| --- | --- | --- |
| `check-only-first-line` | If `true`, If the first line is same, it is considered to be the same post. It works when `unique` is `true`. | `false` |  
| `comment` | Comment to post. | - (Required) |
| `unique` | If `true`, existing comment with same body will be deleted. | `true` |
| `number` | The number of the issue to post. | `github.event.issue.number` |
| `repository` | The GitHub repository containing the issue or pr. | Current repository |
| `token` | `GITHUB_TOKEN` or a `repo` scoped [PAT](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token). | `GITHUB_TOKEN` |

### Action outputs

| Name | Description |
| --- | --- |
| `deleted-comment` | If there was existing same comments or not that was deleted |
| `deleted-comment-id` | The deleted comment ID | 
| `comment-id` | The posted comment ID | 
| `match-first-line` | If match first line or not | 

### Accessing issues in other repositories

You can close issues in another repository by using a [PAT](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token) instead of `GITHUB_TOKEN`.
The user associated with the PAT must have write access to the repository.

## License

[MIT](LICENSE)
