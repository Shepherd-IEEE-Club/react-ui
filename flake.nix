{
  description = "React.js + Storybook Dev Environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = { self, nixpkgs }: {
    devShells.x86_64-linux.default = nixpkgs.legacyPackages.x86_64-linux.mkShell {
      buildInputs = [
        nixpkgs.nodejs_20
        nixpkgs.yarn
      ];


        # FIXME this looks stupid
      shellHook = ''
        echo "🚀 React + Storybook environment ready!"
        echo "Run 'yarn' to install dependencies"
        echo "Run 'yarn dev' to start React"
        echo "Run 'yarn storybook' to start Storybook"
      '';
    };
  };
}
