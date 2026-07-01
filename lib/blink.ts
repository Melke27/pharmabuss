// Placeholder client to keep project buildable when Blink SDK is not installed.
// Replace this with the real SDK client when Blink dependencies are added.

type UnsupportedAction = (...args: unknown[]) => never;

const notConfigured: UnsupportedAction = () => {
  throw new Error('Blink SDK is not configured in this project.');
};

export const blink = {
  db: {
    tasks: { list: notConfigured, create: notConfigured, update: notConfigured, delete: notConfigured },
    habits: { list: notConfigured, create: notConfigured, update: notConfigured, delete: notConfigured },
    goals: { list: notConfigured, create: notConfigured, update: notConfigured, delete: notConfigured },
    habitLogs: { create: notConfigured, exists: notConfigured },
  },
};
