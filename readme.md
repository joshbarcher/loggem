# 📢 Loggem – Custom Logging Made Easy

**Loggem** is a drop-in logging enhancement for Node.js that adds styled output, structured formatting, and live configurability — all powered by [`tracer`](https://www.npmjs.com/package/tracer) and monkey-patched `console` functions.

> ⚡ Built by [Josh Archer](https://github.com/joshbarcher) with 💛 for CLI tools, APIs, and backend dev workflows.

---

## ✨ Features

- ✅ Colorful, styled terminal output
- ✅ Smart monkey-patching of `console.log`, `warn`, `error`, etc.
- ✅ Dynamic config: enable/disable timestamps, file info at runtime
- ✅ Automatic file logging (with color stripping)
- ✅ Prints clean blank lines even when monkey-patched
- ✅ Supports both `logger` and `console` as interfaces

---

## 🚀 Installation

### From Verdaccio (local registry)
```bash
npm install @jarcher/loggem --registry http://localhost:4873
```

### Or from npm
```bash
npm install @jarcher/loggem
```

---

## 📖 Usage

### Basic Setup (Auto-monkey-patching)
```js
import '@jarcher/loggem';

console.log("Hello world");           // Styled + timestamp + file info
console.warn("Careful!");             // Styled + yellow
console.log("");                      // Blank line (no formatting)

console.config({ includeTimestamp: false });
console.log("No timestamp!");

console.config({ includeFileInfo: false });
console.log("Just the message!");

console.config({ includeTimestamp: true, includeFileInfo: true });
console.log("Back to full formatting!");
```

### Optional: Import the `logger` object directly
```js
import { logger } from '@jarcher/loggem';

logger.info("Info level");
logger.warn("Warning!");
logger.error("Oops");
logger.blank(); // Prints a blank line

logger.config({ includeTimestamp: false });
logger.log("Logging with timestamp disabled");
```

---

## ⚙️ Configuration Options

You can update config at runtime via:
```js
console.config({ ... });
// or
logger.config({ ... });
```

### Available Options
| Option              | Type    | Default             | Description                          |
|---------------------|---------|----------------------|--------------------------------------|
| `includeTimestamp`  | boolean | `true`               | Show formatted timestamp             |
| `includeFileInfo`   | boolean | `true`               | Show file:line in output             |
| `logToFile`         | boolean | `true`               | Enable file logging to `server.log`  |
| `logFilePath`       | string  | `'server.log'`       | File path for writing logs           |
| `timestampFormat`   | string  | `'YYYY-MM-DD HH:mm:ss'` | Moment.js format string         |

---

## 📃 Log File Output

Loggem writes output to a file (default: `server.log`) **without color codes**, so logs are easy to parse and store.

Blank lines are preserved, and formatting follows the active config.

---

## 🛠️ Troubleshooting

- **Blank lines print extra info?** Use `console.log("")` or `logger.blank()` to print a clean line.
- **Logger not respecting config?** Make sure you call `console.config()` *before* logging.
- **Log file missing?** Check `logToFile` is enabled and the path is writable.

---

## 🧪 Example: Minimal Output
```js
console.config({ includeTimestamp: false, includeFileInfo: false });
console.log("Simple message");
```
**Output:**
```
LOG: Simple message
```

---

## 📜 License

This package is licensed under **AGPL-3.0**.

