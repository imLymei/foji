#!/usr/bin/env node

import program from './command';
import { createConfig, HAS_CONFIGURATION } from './lib/utils';

if (!HAS_CONFIGURATION) createConfig();

program.parse();
