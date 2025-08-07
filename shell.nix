{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = (with pkgs; [
    corepack
    nodejs_24

  ]) ++ (
    with pkgs.nodePackages; [
      ts-node
      typescript
    ]
  );
}
