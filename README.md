# stxer SDK

A powerful SDK for Stacks blockchain that provides batch operations and transaction simulation capabilities.

## Installation

```bash
npm install stxer
# or
yarn add stxer
```

## Features

### 1. Transaction Simulation

Simulate complex transaction sequences before executing them on-chain:

```typescript
import { SimulationBuilder } from 'stxer';

const simulationId = await SimulationBuilder.new({
  network: 'mainnet', // or 'testnet'
})
  .withSender('ST...') // Set default sender
  .addContractCall({
    contract_id: 'ST...contract-name',
    function_name: 'my-function',
    function_args: [/* clarity values */]
  })
  .addSTXTransfer({
    recipient: 'ST...',
    amount: 1000000 // in microSTX
  })
  .addContractDeploy({
    contract_name: 'my-contract',
    source_code: '(define-public (hello) (ok "world"))'
  })
  .run();

// View simulation results at: https://stxer.xyz/simulations/{network}/{simulationId}
```

### 2. Batch Operations

The SDK provides two approaches for efficient batch reading from the Stacks blockchain:

#### Direct Batch Reading

```typescript
import { batchRead } from 'stxer';

// Batch read variables and maps
const result = await batchRead({
  variables: [{
    contract: contractPrincipalCV(...),
    variableName: 'my-var'
  }],
  maps: [{
    contract: contractPrincipalCV(...),
    mapName: 'my-map',
    mapKey: someCV
  }],
  readonly: [{
    contract: contractPrincipalCV(...),
    functionName: 'my-function',
    functionArgs: [/* clarity values */]
  }]
});
```

#### BatchProcessor for Queue-based Operations

The BatchProcessor allows you to queue multiple read operations and automatically batch them together after a specified delay:

```typescript
import { BatchProcessor } from 'stxer';

const processor = new BatchProcessor({
  stxerAPIEndpoint: 'https://api.stxer.xyz', // optional
  batchDelayMs: 1000, // delay before processing batch
});

// Queue multiple operations that will be batched together
const [resultA, resultB] = await Promise.all([
  new Promise((resolve, reject) => {
    processor.enqueue({
      request: {
        mode: 'variable',
        contractAddress: 'SP...',
        contractName: 'my-contract',
        variableName: 'variable-a'
      },
      resolve,
      reject
    });
  }),
  new Promise((resolve, reject) => {
    processor.enqueue({
      request: {
        mode: 'variable',
        contractAddress: 'SP...',
        contractName: 'my-contract',
        variableName: 'variable-b'
      },
      resolve,
      reject
    });
  })
]);

// You can also queue different types of operations
processor.enqueue({
  request: {
    mode: 'readonly',
    contractAddress: 'SP...',
    contractName: 'my-contract',
    functionName: 'get-value',
    functionArgs: []
  },
  resolve: (value) => console.log('Function result:', value),
  reject: (error) => console.error('Error:', error)
});

processor.enqueue({
  request: {
    mode: 'mapEntry',
    contractAddress: 'SP...',
    contractName: 'my-contract',
    mapName: 'my-map',
    mapKey: someKey
  },
  resolve: (value) => console.log('Map entry:', value),
  reject: (error) => console.error('Error:', error)
});
```

The BatchProcessor automatically:
- Queues read operations
- Batches them together after the specified delay
- Makes a single API call for all queued operations
- Distributes results back to the respective promises

This is particularly useful when you need to make multiple blockchain reads and want to optimize network calls.

### 3. Clarity API Utilities

The SDK provides convenient utilities for reading data from Clarity contracts:

```typescript
import { callReadonly, readVariable, readMap } from 'stxer';
import { SIP010TraitABI } from 'clarity-abi/abis';
import { unwrapResponse } from 'ts-clarity';

// Read from a contract function
const supply = await callReadonly({
  abi: SIP010TraitABI.functions,
  functionName: 'get-total-supply',
  contract: 'SP102V8P0F7JX67ARQ77WEA3D3CFB5XW39REDT0AM.token-alex',
}).then(unwrapResponse);

// Read a contract variable
const paused = await readVariable({
  abi: [{ name: 'paused', type: 'bool', access: 'variable' }],
  variableName: 'paused',
  contract: 'SP102V8P0F7JX67ARQ77WEA3D3CFB5XW39REDT0AM.amm-vault-v2-01',
});

// Read from a contract map
const approved = await readMap({
  abi: [{ key: 'principal', name: 'approved-tokens', value: 'bool' }],
  mapName: 'approved-tokens',
  key: 'SP102V8P0F7JX67ARQ77WEA3D3CFB5XW39REDT0AM.token-alex',
  contract: 'SP102V8P0F7JX67ARQ77WEA3D3CFB5XW39REDT0AM.amm-vault-v2-01',
});
```

These utilities provide type-safe ways to interact with Clarity contracts, with built-in ABI support and response unwrapping.

## Configuration

You can customize the API endpoints:

```typescript
const builder = SimulationBuilder.new({
  apiEndpoint: 'https://api.stxer.xyz', // Default stxer API endpoint
  stacksNodeAPI: 'https://api.hiro.so', // Default Stacks API endpoint
  network: 'mainnet' // or 'testnet'
});
```

## Support

This product is made possible through community support. Consider supporting the development:

```
SP212Y5JKN59YP3GYG07K3S8W5SSGE4KH6B5STXER
```

For feedback and feature requests, contact: contact@stxer.xyz

## License

MIT
