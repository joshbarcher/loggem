# 📢 Loggem - Custom Logging Made Easy

**Loggem** is a simple yet powerful logging package designed to provide structured and customizable logging for Node.js applications.

> ⚡ **Built by [Josh Archer](https://github.com/joshbarcher)** and powered by [`tracer`](https://www.npmjs.com/package/tracer), Loggem makes logging effortless.

---

## 🚀 Installation

To install **Loggem**, use npm:

```sh
npm install @jarcher/loggem --registry http://localhost:4873
```

Or install from npm:

```sh
npm install @jarcher/loggem
```

---

## 📖 Usage

### 1️⃣ **Importing Loggem**

Loggem is an ES module. Import it into your project like this:

```js
import createLogger from "@jarcher/loggem";
```

### 2️⃣ **Configuring the Logger**

You can pass a configuration object to customize the logger:

```js
const logger = createLogger({
    level: "info", // Options: trace, debug, info, warn, error
    format: "{{timestamp}} <{{title}}> {{message}}",
    dateformat: "HH:MM:ss.L",
    transports: ["console"] // Future support for file logging
});
```

### 3️⃣ **Basic Logging**

Once configured, you can start logging:

```js
logger.info("This is an info message");
logger.warn("This is a warning message");
logger.error("This is an error message");
logger.debug("This is a debug message");
```

### 4️⃣ **Logging with Objects & Data**

You can pass objects, arrays, and additional metadata into Loggem:

```js
const user = { name: "Alice", role: "Admin" };
logger.info("User details:", user);
```

### 5️⃣ **Using Loggem in Express.js**

Loggem works seamlessly with Express.js:

```js
import express from "express";
import createLogger from "@jarcher/loggem";

const logger = createLogger({ level: "info" });
const app = express();

app.use((req, res, next) => {
    logger.info(`Incoming request: ${req.method} ${req.url}`);
    next();
});

app.listen(3000, () => logger.info("Server running on port 3000"));
```

---

## 🛠 Configuration

Loggem is built on `tracer`, so you can configure different log outputs:

- **Console Logging** (default)
- **File Logging** (future support)
- **JSON Logging** (future support)

Example:

```js
import createLogger from "@jarcher/loggem";

const fileLogger = createLogger({
    level: "info",
    format: "{{timestamp}} <{{title}}> {{message}}",
    dateformat: "HH:MM:ss.L",
    transports: ["file"], // Future support
    logFilePath: "./logs/app.log" // Future support
});

fileLogger.info("This will be logged to a file!");
```

---

## 📜 License

This package is licensed under **AGPL-3.0**.

For more details, visit the [GitHub repository](https://github.com/joshbarcher/loggem).

---

## ⭐ Contributions

Want to improve Loggem? Fork the repo and submit a pull request!

---

## 🛠️ Troubleshooting

- Ensure you're using **Node.js 14+**.
- If logging doesn’t appear, check your console output settings.

🚀 **Happy logging with Loggem!**

