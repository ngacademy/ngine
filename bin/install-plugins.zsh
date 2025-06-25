# Add 'ngine-dev' to the plugins list in your .zshrc, e.g.:
# plugins=(git ... ngine-dev)

# Run [chmod +x bin/install-plugins.zsh] initially

rm -rf ~/.oh-my-zsh/custom/plugins/ngine-dev
mkdir -p ~/.oh-my-zsh/custom/plugins/ngine-dev
cp bin/ngine-dev.plugin.zsh ~/.oh-my-zsh/custom/plugins/ngine-dev/ngine-dev.plugin.zsh
source ~/.zshrc
