import Express from "./providers/Express";
import { Database } from "./providers/Database";
import Logger from "./providers/Logger";
const app = new Express();
Database.init();
app.init();
const logger = new Logger().logger;

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: any) => {
    logger.info('UNHANDLED REJECTION! 💥 Shutting down...');
    logger.debug(err.name, err.message);
    process.exit(1);
});
  
  // Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    logger.info('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    logger.debug(err.name, err.message);
    process.exit(1);
});

export { logger };