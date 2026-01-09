#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../global_variables.sh"
source "$NEONSIGNAL_LOGGING_LIB_SCRIPT"

NEONJSX_TSCONFIG="$NEONSIGNAL_ROOT_DIR/tsconfig.json"

print_header "NeonJSX Build"

if [[ ! -f "$NEONJSX_TSCONFIG" ]]; then
  print_error "Missing tsconfig: ${NEONJSX_TSCONFIG}"
  exit 1
fi

print_step "Transpiling with TypeScript"
print_substep "Config: ${NEONJSX_TSCONFIG}"
print_substep "Output: index.js, lib/*.js, types/"
npx tsc --project "$NEONJSX_TSCONFIG"
print_success "TypeScript build complete"

print_success "NeonJSX build complete"
