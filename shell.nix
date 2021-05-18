let
  pkgs = import (import ./nix/sources.nix).nixpkgs {};
in pkgs.mkShell {
  buildInputs = with pkgs; [
    tree-sitter
    bashInteractive
  ];
}
