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
- [x] Can run commands directly
- [x] Configuration can be saved on cloud
- [x] Configuration can be downloaded from cloud
- [x] Local configuration can be synced from cloud

## Installation

Before installing Foji, make sure you have [Node.js](https://nodejs.org/) installed on your machine.

To install Foji globally, run the following command:

```shell
npm i foji -g
```

## Usage

Foji saves your commands and your configuration url at it's configuration file (`~/.config/foji.json`). You can access the `.config` directory using `foji config` or open the file directly using `foji config -f` command.

### Running a Command

To run a `command` just use:

```shell
foji [command name] [...command args]
```
Simple as that.

If you don't provide a valid command name Foji will list all available commands, it includes default commands (eg.: `add`, `remove` and `sync`) and your own commands.

### Skipping a Argument

You also can skip a (optional) argument using "_":

```shell
foji [command name] [argument one] _ [argument three]
```

## Creating and Updating the Configuration

Foji provides easy ways to add `commands` to the configuration file (or create it if it does not exist):

### Creating a New Command

To add a new `command` to the configuration file you can use the `add` command:

```shell
foji add [command name] [command]
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

### Remove a Command

To remove a `command` you can use the `remove` command

```shell
foji remove [command name] [command]
```

### Configuration File Format

Foji's configuration manage your `commands` and it's `url`:

```json
{
  "gistUrl": "https://gist.github.com/.../...",
  "commands": {
    "next:create": "npx create-next-app@latest <dir ?? . >",
    "build": "npm run build:local",
    "next:dev": "npm run dev"
  }
}
```

### Upload Your Configuration File

To Upload your configuration to your gist (or create one if your configuration do not have yet) just run:

```shell
foji upload
```

### Download Your Configuration File

To download a configuration file from someone else just run this command:

```shell
foji download [gist url]
```

### Sync Your Configuration File

Update you configuration file from it's url

```shell
foji sync
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

3. Build and install the project:

```shell
npm run build:local
```

## License

Foji is licensed under the MIT License. See the LICENSE file for more information.
