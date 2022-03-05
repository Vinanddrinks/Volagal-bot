const fs = require('fs');
const chalk = require('chalk')

class Logger {
    info(message) {
        this.writeIntoFile(message, "INFO");
        console.log(chalk.blue(this.getDate()), message);
    }

    error(message) {
        this.writeIntoFile(message, "ERROR");
        console.log(chalk.red(this.getDate()), message);
    }

    success(message) {
        this.writeIntoFile(message, "SUCCESS");
        console.log(chalk.green(this.getDate()), message);
    }

    getDate() {
        const date = new Date();
        return (
            "[" +
            this.getUnitWithZero(date.getDate()) +
            "/" +
            this.getUnitWithZero(date.getMonth() + 1) +
            "/" +
            this.getUnitWithZero(date.getFullYear()) +
            "] [" +
            this.getUnitWithZero(date.getHours()) +
            ":" +
            this.getUnitWithZero(date.getMinutes()) +
            ":" +
            this.getUnitWithZero(date.getSeconds()) +
            "] "
        );
    }

    getUnitWithZero(unit) {
        return unit < 10 ? "0" + unit : unit.toString();
    }

    writeIntoFile(message, detail) {
        const date = new Date();

        const fileName =
            date.getFullYear() +
            "_" +
            this.getUnitWithZero(date.getMonth() + 1) +
            "_" +
            this.getUnitWithZero(date.getDate()) +
            "Volabot.log";

        fs.appendFile(
            "./logs/" + fileName,
            this.getDate() + " [" + detail + "] " + message + "\n",
            (err) => {
                if (err) {
                    console.log("Error writing file " + err);
                }
            }
        );
    }
}

module.exports = { Logger };
