# $1: repo name (required)
# $2: --dev flag (optional)
function NGINE_INIT_REPO {
  if [[ -z "$1" ]]; then
    echo "Usage: NGINE_INIT_REPO <name>"
    echo "Please provide a repo name to run in the ngine container."
    return 1
  fi

  docker run --rm -it -v "$PWD":/workspace ngacademy/ngine:latest "$1" "$2"
}

function NGINE_RESET_DEV_REPO {
  REPO="${1:-test}"
  cd ..
  rm -rf "$REPO" && NGINE_INIT_REPO "$REPO" --dev
  cd "$REPO"
}

function NGINE_REINSTALL_PLUGINS {
  cd $PATH_NGINE
  zsh bin/install-plugins.zsh
}
