import app from './app'
import { logger, logWithFile } from "./services/logger";
const log = logWithFile(logger, __filename);
import seed from './seed/seed';

const PORT = process.env.PORT || 3000;
const runSeed = false;

async function startServer() {
  if (runSeed) await seed();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${ PORT }`);
  });

  if (!runSeed) setInterval(() => { }, 1000 * 60 * 60);
}

startServer().catch((err) => {
  log.error('Error starting server: ', err)
})