#!/bin/sh
npx babel --config-file=../../../babel.config.js src --ignore="src/**/__tests__/**" --out-dir lib --extensions '.ts,.tsx' &
npx tsc &
wait