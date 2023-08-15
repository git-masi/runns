# Run Node Script (runns)

## About

A collection of useful scripts that automate tedious tasks.

## Use the scripts

Be sure to add an alias for "runns" to your .zshrc file like so:

```
alias runns="cd \"$HOME/runns\" && npm run start -- \"--targetdir=$(pwd)\" && cd -"
```

Then in the terminal you can just execute `runns` to start the CLI app.
