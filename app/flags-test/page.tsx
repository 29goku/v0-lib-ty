import { myFirstFlag } from '@/lib/flags';

export default async function FlagsTestPage() {
  const isEnabled = await myFirstFlag();

  console.log('🚩 my-first-flag is', isEnabled ? 'ON' : 'OFF');

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Flag Status</h1>
      <p className="text-lg">
        my-first-flag is <span className={isEnabled ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
          {isEnabled ? 'ON ✅' : 'OFF ❌'}
        </span>
      </p>
      <p className="text-sm text-gray-600 mt-4">Check the server logs for the console.log output</p>
    </div>
  );
}
