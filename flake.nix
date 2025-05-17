{
  description = "React Game with Bun";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = [
            pkgs.bun
            pkgs.just
            pkgs.nodejs_20
            pkgs.nodePackages.typescript
            pkgs.nodePackages.typescript-language-server
            pkgs.git
          ];
          
          shellHook = ''
            echo "Welcome to React Game development environment!"
            echo "Using Bun $(bun --version)"
            
            # Set up environment variables if needed
            export LANG=en_US.UTF-8
          '';
        };
      }
    );
}
