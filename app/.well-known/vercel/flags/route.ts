import { createFlagsDiscoveryEndpoint } from 'flags/next';
import { getProviderData } from '@flags-sdk/vercel';
import * as flags from '@/lib/flags';

// Never statically generate — requires FLAGS secret at runtime only
export const dynamic = 'force-dynamic';

export const GET = createFlagsDiscoveryEndpoint(async () => {
  return getProviderData(flags);
});
