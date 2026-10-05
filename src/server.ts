import { createApp } from './app.js';
import { config } from './config';
import { seed } from './data/seed.js';

const start = async (): Promise<void> => {
    await seed();
    const app = createApp();
    app.listen(config.port, () => {
        console.log(`PlantKeeper API listening on http://localhost:${config.port}/api/v1`);
    });
};

start().catch((err: unknown) => {
    console.error(err);
    process.exit(1);
});