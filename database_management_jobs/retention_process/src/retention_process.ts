import { CronJob } from "cron";
import { Op } from "sequelize";
import { DeviceError } from "./models";

// ------------ Start of driver code ------------
// The validation function will exit the process if it fails, so no need to worry about thrown errors
validateCliArguments();

const CRON_SCHEDULE = process.argv[2].trim();
const job = new CronJob(CRON_SCHEDULE, backupJob);

job.start();

// ------------ End of driver code ------------

// Function declarations
function backupJob(): void {

  // This is some arbitrary value this can be set to whatever desired
  let twoWeeksAgoDate = new Date();
  twoWeeksAgoDate.setDate(twoWeeksAgoDate.getDate() - 14);

  DeviceError.destroy({
    where: {
      received_at: {
        [Op.lte]: twoWeeksAgoDate,
      },
    },
  });
}
function validateCliArguments(): void {
  if (process.argv.length !== 3) {
    // Let the user know that this process needs an argument
    console.log("\nMissing command line argument");
    console.log(
      "Must provide a complete/full cron schedule that conforms to the cron npm package"
    );
    console.log("Usage example: $ node application.js '0 * * * * *'");
    console.log(
      "Notice: The use of single or double quotes is needed around the cron schedule!"
    );
    console.log(
      "The above example will run the backup job every minute at the 00 second"
    );
    console.log(
      "Cron schedule positions: Seconds (0-59) Minutes (0-59) Hours (0-23) Day of Month (1-31) Months (0-11)(Jan-Dec) Day of Week (0-6)(Sun-Sat)\n"
    );
    process.exit(-1);
  }
}
