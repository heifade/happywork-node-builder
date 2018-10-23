import commander from "commander";

import { addBuildCommand } from "./build";
import { addUnitTestCommand } from "./test";

addBuildCommand();
addUnitTestCommand();

commander.parse(process.argv);
