import { Request, Response, Router } from 'express';
import seedDatabase from '../seed/seed';
import { logger, logWithFile } from '../services/logger';

const router = Router();
const log = logWithFile(logger, __filename);

router.get('/seed', async (_req: Request, res: Response): Promise<void> => {
  try {
    await seedDatabase();
    res.status(200).json({ message: 'Database seeded successfully' });
  } catch (error) {
    log.error('Database seeding failed', error);
    res.status(500).json({ message: 'Database seeding failed' });
  }
});

export default router;
