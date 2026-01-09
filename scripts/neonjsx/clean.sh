#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../global_variables.sh"
source "$NEONSIGNAL_LOGGING_LIB_SCRIPT"

print_header "NeonJSX Clean"

print_step "Removing build artifacts"
REMOVE_PATHS=(
  "$NEONSIGNAL_NEONJSX_BUILD_DIR"
  "$NEONSIGNAL_ROOT_DIR/types"
  "$NEONSIGNAL_ROOT_DIR/.tsbuildinfo"
  "$NEONSIGNAL_ROOT_DIR/index.js"
  "$NEONSIGNAL_ROOT_DIR/index.js.map"
  "$NEONSIGNAL_ROOT_DIR/lib/runtime.js"
  "$NEONSIGNAL_ROOT_DIR/lib/runtime.js.map"
)

removed_any=false
for path in "${REMOVE_PATHS[@]}"; do
  if [[ -e "$path" ]]; then
    rm -rf "$path"
    print_substep "Removed: ${path}"
    removed_any=true
  fi
done

if [[ "$removed_any" == false ]]; then
  print_substep "No build artifacts found"
fi

print_success "NeonJSX clean complete"
