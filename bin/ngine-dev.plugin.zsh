function NGINE_INIT_REPO {
  if [[ -z "$1" ]]; then
    echo "Usage: NGINE_INIT_REPO <name>"
    echo "Please provide a repo name to run in the ngine container."
    return 1
  fi

  docker run --rm -it -v "$PWD":/workspace ngacademy/ngine:latest "$1"
}

function NGINE_RESET_TEST_REPO {
  cd .. && rm -rf test && NGINE_INIT_REPO test
}

function NGINE_REINSTALL_PLUGINS {
  cd $PATH_NGINE
  zsh bin/install-plugins.zsh
}