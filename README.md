# Foji ⚒️

Foji is a powerful command-line interface (CLI) tool designed to streamline and automate long or repetitive commands in your daily workflow. With Foji, you can define and execute custom commands, integrate custom parameters, and simplify complex processes, reducing the need to repeatedly type lengthy commands.

## 🚀 Features

- [x] Run custom codes
- [x] Handle custom parameters
- [x] Conditional handler for arguments
- [x] Support for default arguments
- [x] Support for optional arguments
- [x] Support for options as arguments
- [x] Add commands to a configuration file
- [x] Remove commands from the configuration file
- [x] Can run commands directly
- [x] Configuration can be saved on the cloud
- [x] Configuration can be downloaded from the cloud
- [x] Local configuration can be synced from the cloud

## 📦 Installation

> [!IMPORTANT]
> Foji requires [Node.js](https://nodejs.org/) to be installed on your system. Make sure you have it installed before proceeding.

To install Foji, run the following command:

```bash
npm i foji -g
```

## 🚦 Usage

Foji stores your commands and configurations in its configuration file (`~/.config/foji.json`). You can access it using:

```bash
foji config
```

Or open it directly:

```bash
foji config -f
```

### Running a Command

To execute a saved `command`:

```bash
foji [command name] [...command args]
```

> [!TIP]
> If you don’t provide a valid command name, Foji will list all available commands, including default commands like `add`, `remove`, and `sync`, along with any custom commands you've added.

### Skipping an Argument

If you want to skip an optional argument, use the `_` symbol:

```bash
foji [command name] [arg1] _ [arg3]
```

## ⚙️ Configuration Management

Foji allows you to easily create and update your command configurations.

### Adding a New Command

To add a new command to the configuration:

```bash
foji add [command name] [command]
```

Supported argument types:

1. **Required Arguments**:  
   These arguments **must** be provided for the command to run.

   ```json
   "command": "echo <requiredArgumentOne> <requiredArgumentTwo>"
   ```

2. **Optional Arguments**:  
   These arguments **are not mandatory**. If not provided, they will be skipped.

   ```json
   "command": "echo <requiredArgumentOne> <optionalArgumentOne?>"
   ```

3. **Optional Arguments with Default Values**:  
   If not provided, a default value will be used.

   ```json
   "command": "echo <requiredArgumentOne> <optionalArgumentOne ?? My Default Value>"
   ```

4. **Ternary Arguments**:  
   Works as a boolean argument, only checking whether it was passed.

   ```json
   "command": "echo i want pizza of <requiredArgumentOne> with <hasCheese ? cheese : no cheese>"
   ```

5. **Spread Argument**:  
   Catches all the remaining arguments.

   ```json
   "command": "echo [<argOne>] {<argTwo...>}"
   ```

Example of usage:

```bash
foji command "my arg one" one two three --my --options
```

The resulting final command would be:

```bash
echo [my arg one] {one two three --my --options}
```

> [!IMPORTANT] > **Always** provide required arguments **before** any optional ones.

### Removing a Command

To remove a command:

```bash
foji remove [command name]
```

## 🌐 Cloud Sync

You can easily sync your configurations using cloud services.

> [!NOTE]
> Foji uses [Github CLI](https://cli.github.com/) to create, read and update your configuration gist.

### Upload Configuration

To upload your configuration to a gist (or create a new gist if one doesn’t exist):

```bash
foji upload
```

### Download Configuration

To download a configuration file from a gist:

```bash
foji download [gist url]
```

### Sync Configuration

To sync your local configuration with its URL:

```bash
foji sync
```

> [!CAUTION]
> Be careful when syncing from external sources. Always verify the origin of the gist to avoid overriding your custom commands.

## 🛠️ Development

If you want to contribute or customize Foji, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/imLymei/foji.git
   cd foji
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Build the project:

   ```bash
   npm run build:local
   ```

## 📜 Credits

This project makes use of several open-source libraries and tools. Special thanks to the following:

- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript.
- [Commander](https://www.npmjs.com/package/commander) - CLI framework.
- [@inquirer/prompts](https://www.npmjs.com/package/@inquirer/prompts) - Command-line prompts.
- [semantic-release](https://www.npmjs.com/package/semantic-release) - Automates versioning and package publishing.
- [fast-levenshtein](https://www.npmjs.com/package/fast-levenshtein) - Fast string distance algorithm.

## 📄 License

Foji is licensed under the MIT License.

See the [LICENSE](https://github.com/imLymei/foji/blob/master/LICENSE) file for more information.
