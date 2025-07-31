{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = (with pkgs; [
    yarn
    nodejs_20

  ]) ++ (
    with pkgs.nodePackages; [
      ts-node
      typescript
    ]
  );
}
