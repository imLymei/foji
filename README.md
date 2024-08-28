# Foji

Foji is a command-line interface (CLI) tool designed to help you automate and manage your coding tasks. It allows you to run custom codes and handle custom parameters.

## Features

- [x] Run custom codes
- [x] Handle custom parameters
- [x] Conditional handler for arguments
- [x] Support for default arguments
- [x] Support for optional arguments
- [x] Add commands to configuration file
- [x] Remove commands from the configuration file
- [ ] Commands can be saved without scopes
- [ ] Can run commands directly

## Installation

Before using Foji, make sure you have [Node.js](https://nodejs.org/) installed on your machine.

To install Foji globally, run the following command:

```shell
npm i foji -g
```

## Usage

Foji works based on `scopes` and `commands`. A scope is a context in which a set of commands can be run. You can define your scopes and commands in the Foji configuration file (`~/.config/foji.json`) or using the `foji config` command.

### Running a Command

To run a `command`, use the `foji run` command followed by the `scope`, the command, and any `arguments` for the command:

```shell
foji run <scope> <command> <args...>
```

If you don't provide a `scope`, Foji will list all available scopes. If you provide a scope but no `command`, Foji will list all commands available in that scope.

### Creating and Updating the Configuration

Foji provides easy ways to add `commands` to the configuration file (or create it if it does not exist):

To add a new command to the configuration file you can use the `add` command:

```shell
foji add <scope> <command name> <command>
```

To remove a command of a specified scope you can use the `remove` command

```shell
foji remove <scope> <command name>
```

## Configuration file

Foji configuration uses `scopes` to manage `commands` you can create any amount of commands inside a scope:

```json
{
  "core": {
    "rm": "rm -fr <dir>",
    "echo": "echo <arg??no arg was provided but the echo worked>"
  }
}
```

All `commands` can have four types of `arguments`:

1. Required arguments:

- These arguments **must** be provided for the command to run:

```json
"command":"echo <requiredArgumentOne> <requiredArgumentTwo>"
```

2. Optional arguments:

- These arguments **are not** mandatory. If not provided, they will add nothing to the command.

```json
"command":"echo <requiredArgumentOne> <optionalArgumentOne?>"
```

3. Optional arguments with default values:

- Similar to optional arguments, but if not provided, they will add a default value. `<options??--ts --tailwind --src>`

```json
"command":"echo <requiredArgumentOne> <optionalArgumentOne??My Default Value>"
```

4. Ternaries:

- These arguments function like boolean arguments. Any value passed will be ignored by the CLI; it only checks **whether the argument was passed or not**.

```json
"command":"echo i want pizza of <requiredArgumentOne> with <hasCheese?cheese:no cheese>"
```

Note that all `Required arguments` must be provided **BEFORE** any of the other arguments

incorrect:

```json
"command": "do command <argOne?> <argTwo>"
```

correct:

```json
"command": "do command <argOne> <argTwo?>"
```

## Development

If you want to contribute to Foji or customize it to your needs, you can clone the repository and build it yourself:

1. Clone the repository:

```shell
git clone https://github.com/imLymei/foji.git
cd foji
```

2. Install the dependencies:

```shell
npm install
```

3. Build the project:

```shell
npm run build
```

## License

Foji is licensed under the MIT License. See the LICENSE file for more information.
