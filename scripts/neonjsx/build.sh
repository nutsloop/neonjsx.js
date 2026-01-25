#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../global_variables.sh"
source "$NEONSIGNAL_LOGGING_LIB_SCRIPT"

# Check for --release flag
RELEASE_MODE=false
for arg in "$@"; do
  if [[ "$arg" == "--release" ]]; then
    RELEASE_MODE=true
    break
  fi
done

if [[ "$RELEASE_MODE" == true ]]; then
  NEONJSX_TSCONFIG="$NEONSIGNAL_ROOT_DIR/tsconfig.release.json"
  print_header "NeonJSX Release Build"
else
  NEONJSX_TSCONFIG="$NEONSIGNAL_ROOT_DIR/tsconfig.json"
  print_header "NeonJSX Build"
fi

if [[ ! -f "$NEONJSX_TSCONFIG" ]]; then
  print_error "Missing tsconfig: ${NEONJSX_TSCONFIG}"
  exit 1
fi

print_step "Transpiling with TypeScript"
print_substep "Config: ${NEONJSX_TSCONFIG}"
print_substep "Output: index.js, lib/*.js, types/"
npx tsc --project "$NEONJSX_TSCONFIG"
print_success "TypeScript build complete"

if [[ "$RELEASE_MODE" == true ]]; then
  print_success "NeonJSX release build complete (no source maps)"
else
  print_success "NeonJSX build complete"
fi
