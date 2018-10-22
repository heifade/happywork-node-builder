import commander from "commander";

import { addBuildCommand } from "./build";
import { addUnitTestCommand } from "./unitTest";

addBuildCommand();
addUnitTestCommand();

commander.parse(process.argv);
