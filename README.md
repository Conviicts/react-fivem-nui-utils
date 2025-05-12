# react-fivem-nui-utils

Utilities for integrating React with FiveM NUI resources.

## Installation

```bash
npm install react-fivem-nui-utils
```

## Usage

### NuiProvider

Wrap your application with `NuiProvider` to initialize the NUI context.

```tsx
import { NuiProvider } from 'react-fivem-nui-utils';

function App() {
  return (
    <NuiProvider resource="myResource">
      <MyComponent />
    </NuiProvider>
  );
}
```

### Hooks

#### useNuiEvent

Listen for NUI events.

```tsx
import { useNuiEvent } from 'react-fivem-nui-utils';

function MyComponent() {
  useNuiEvent('myApp', 'myMethod', (data) => {
    console.log(data);
  });

  return <div>Listening for events...</div>;
}
```

#### useNuiRequest

Send requests to the NUI.

```tsx
import { useNuiRequest } from 'react-fivem-nui-utils';

function MyComponent() {
  const { send } = useNuiRequest();

  const handleClick = async () => {
    const response = await send('myMethod', { key: 'value' });
    console.log(response);
  };

  return <button onClick={handleClick}>Send Request</button>;
}
```

#### useNuiCallback

Handle NUI callbacks.

```tsx
import { useNuiCallback } from 'react-fivem-nui-utils';

function MyComponent() {
  useNuiCallback(
    'myApp',
    'myMethod',
    (data) => console.log('Success:', data),
    (err) => console.error('Error:', err)
  );

  return <div>Handling callbacks...</div>;
}
```

### Utility Functions

#### safeFetch

Fetch data safely, falling back to mock data in a browser environment. This function uses `customFetchNui` if available in the in-game environment and gracefully falls back to `mockData` in a browser environment.

```tsx
import { safeFetch } from 'react-fivem-nui-utils';

async function fetchData() {
  const data = await safeFetch('myMethod', { key: 'value' }, 'mockData');
  console.log(data);
}
```

### Debugging in Browser Mode

#### debugData

Use `debugData` to define test data for specific methods in browser mode.

```tsx
import { debugData } from 'react-fivem-nui-utils';

debugData('login', { username: 'testUser', password: 'testPass' });
```

#### debugEvent

Use `debugEvent` to simulate NUI events in browser mode.

```tsx
import { debugEvent } from 'react-fivem-nui-utils';

debugEvent({
  app: 'myApp',
  method: 'onLogin',
  data: { success: true },
});
```

These utilities allow you to test your React application in a browser environment without requiring the in-game NUI context.

### Testing

This project does not include tests as they have been removed. You can still use the provided utilities and hooks in your application as described above.

## Development

### Start Dev Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Run Tests

```bash
npm test
```

## License

MIT
