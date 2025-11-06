import 'dotenv/config';

import { seedAuth } from './auth';

async function main() {
    await seedAuth();
    console.log('Database seeded successfully');
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
