import cron from "node-cron";
import { Client } from "discord.js";
import { getCheckInterval } from "./database.js";
import { sendNotifications } from "./notification.js";

let scheduledTask: cron.ScheduledTask | null = null;

// Start the RSS check scheduler
export async function startScheduler(client: Client): Promise<void> {
  // Get the check interval from the database
  const checkInterval = await getCheckInterval();
  
  // Schedule the task to run at the specified interval
  const cronExpression = `*/${checkInterval} * * * *`;
  
  // Stop any existing scheduled task
  if (scheduledTask) {
    scheduledTask.stop();
  }
  
  // Create a new scheduled task
  scheduledTask = cron.schedule(cronExpression, async () => {
    console.log(`Running scheduled RSS check (interval: ${checkInterval} minutes)`);
    await sendNotifications(client);
  });
  
  console.log(`RSS checker scheduled to run every ${checkInterval} minutes`);
  
  // Run an initial check immediately
  await sendNotifications(client);
}

// Update the scheduler with a new interval
export async function updateScheduler(client: Client): Promise<void> {
  await startScheduler(client);
}