#!/bin/bash

set -ex
git config --global user.email "spain+circleci@livesafemobile.com"
git config --global user.name "Circle CI"
git config --global push.default simple

LAST_COMMIT_MSG="$(git log -1 --pretty=%B)"
SEMVER_BUMP_TYPE="$(echo ${LAST_COMMIT_MSG} | sed -n 's/^.*[rR]elease v+\([a-z]\+\).*$/\1/p')"

if [ -n "${SEMVER_BUMP_TYPE}" ]; then
    npm version ${SEMVER_BUMP_TYPE} -m ":arrow_up: CircleCI: Releasing %s"
    git push
    git push --tags
fi
