# Auto-run test if specified in config
if [ -f "$ROOT_DIR/.setup/configs/debug.yaml" ]; then
    TEST_SUITE=$(grep "test-suite:" "$ROOT_DIR/.setup/configs/debug.yaml" | cut -d: -f2 | xargs)
    if [ -n "$TEST_SUITE" ]; then
        echo "Running test suite: $TEST_SUITE"
        /ngine/tests/${TEST_SUITE}.test.zsh
    fi
fi