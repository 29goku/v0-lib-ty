import { flag } from 'flags/next';
import { vercelAdapter } from '@flags-sdk/vercel';

export const myFirstFlag = flag({
  key: 'my-first-flag',
  description: 'test',
  adapter: vercelAdapter(),
});
