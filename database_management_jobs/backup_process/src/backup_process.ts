import { CronJob } from "cron";
import path from "path";
import { exec } from "child_process";
import fs from "fs";

// ------------ Start of driver code ------------
// The validation function will exit the process if it fails, so no need to worry about thrown errors
validateCliArguments();

const CRON_SCHEDULE = process.argv[2].trim();
const job = new CronJob(CRON_SCHEDULE, backupJob);

job.start();

// ------------ End of driver code ------------


// Function declarations
// used for scoping instead of arrow functions little heavier weight, but easier to write at the moment
function backupJob(): void {
  const outputDirPath = generateOutputDirPath();
  const compressedFilename = `ChirpStackArchive_${new Date().toISOString()}_.backup.gz`;

  // Before we backup and compress the database file
  // the process needs to remove any old files
  // so we can properly backup the database

  // clear out any "old" files left behind
  removeOldCompressedFile(outputDirPath);

  // temporary command the password should be saved in a ~/.pgpass file but we have to decide on what we are doing with the home directories
  exec(
    `cd ${outputDirPath} && PGPASSWORD=\"dbpassword\" pg_dumpall -U postgres | gzip > ${compressedFilename} && echo "Backup completed at ${new Date().toISOString()}."`,
    (err, stdout, stderr) => {
      // There isn't any error handling at the moment, this will be fixed after the GoCreate server is functional so we know exactly
      // what we're allowed to do (logging, retrying the process, etc).
      if (err) console.dir(err, { depth: null });
      if (stdout) console.log(stdout);
      if (stderr) console.log(stderr);
    }
  );
}

function removeOldCompressedFile(outputDirPath: string): void {
  const existingFiles = fs.readdirSync(outputDirPath);

  if (existingFiles.length === 0) return;

  existingFiles.forEach((file: string) => {
    const filepath = path.join(outputDirPath, file);
    fs.unlinkSync(filepath);
  });
}
function generateOutputDirPath(): string {
  let outputDirPath = path.join("/", "opt", "ChirpStack-Database-Backups");

  if (!fs.existsSync(outputDirPath)) {
    fs.mkdirSync(outputDirPath);
  }

  return outputDirPath;
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
