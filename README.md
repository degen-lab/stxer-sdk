# stxer SDK

A powerful SDK for Stacks blockchain that provides batch operations and transaction simulation capabilities.

## Installation

```bash
npm install stxer
# or
yarn add stxer
```

## Features

### 1. Batch Operations

The SDK provides efficient batch reading capabilities for Stacks blockchain:

```typescript
import { batchRead, batchReadonly } from 'stxer';

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
  }]
});

// Batch readonly function calls
const readonlyResult = await batchReadonly({
  readonly: [{
    contract: contractPrincipalCV(...),
    functionName: 'my-function',
    functionArgs: [/* clarity values */]
  }]
});
```

### 2. Transaction Simulation

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
