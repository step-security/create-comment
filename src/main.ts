import * as core from '@actions/core'
import * as github from '@actions/github'
import {inspect} from 'util'
import {Inputs, Reposter} from './repost-comment'
import axios, {isAxiosError} from 'axios'
import * as fs from 'fs'

async function validateSubscription(): Promise<void> {
  const eventPath = process.env.GITHUB_EVENT_PATH
  let repoPrivate: boolean | undefined

  if (eventPath && fs.existsSync(eventPath)) {
    const eventData = JSON.parse(fs.readFileSync(eventPath, 'utf8'))
    repoPrivate = eventData?.repository?.private
  }

  const upstream = 'keisukeyamashita/create-comment'
  const action = process.env.GITHUB_ACTION_REPOSITORY
  const docsUrl =
    'https://docs.stepsecurity.io/actions/stepsecurity-maintained-actions'

  core.info('')
  core.info('\u001b[1;36mStepSecurity Maintained Action\u001b[0m')
  core.info(`Secure drop-in replacement for ${upstream}`)
  if (repoPrivate === false)
    core.info('\u001b[32m\u2713 Free for public repositories\u001b[0m')
  core.info(`\u001b[36mLearn more:\u001b[0m ${docsUrl}`)
  core.info('')

  if (repoPrivate === false) return

  const serverUrl = process.env.GITHUB_SERVER_URL || 'https://github.com'
  const body: Record<string, string> = {action: action || ''}
  if (serverUrl !== 'https://github.com') body.ghes_server = serverUrl
  try {
    await axios.post(
      `https://agent.api.stepsecurity.io/v1/github/${process.env.GITHUB_REPOSITORY}/actions/maintained-actions-subscription`,
      body,
      {timeout: 3000}
    )
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 403) {
      core.error(
        `\u001b[1;31mThis action requires a StepSecurity subscription for private repositories.\u001b[0m`
      )
      core.error(
        `\u001b[31mLearn how to enable a subscription: ${docsUrl}\u001b[0m`
      )
      process.exit(1)
    }
    core.info('Timeout or API not reachable. Continuing to next step.')
  }
}

async function run(): Promise<void> {
  try {
    await validateSubscription()

    const inputs: Inputs = {
      checkOnlyFirstLine: core.getInput('check-only-first-line') === 'true',
      comment: core.getInput('comment', {required: true}),
      unique: core.getInput('unique') === 'true',
      number:
        core.getInput('number') === ''
          ? github.context.issue.number
          : Number(core.getInput('number')),
      repository: core.getInput('repository', {required: true}),
      token: core.getInput('token', {required: true})
    }

    core.debug(`Inputs: ${inspect(inputs)}`)

    const reposter = new Reposter(inputs)
    await reposter.repostComment()
  } catch (error) {
    core.setFailed((error as Error).message)
  }
}

run()
