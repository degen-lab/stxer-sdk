import {
  contractPrincipalCV,
  principalCV,
  stringAsciiCV,
  tupleCV,
  uintCV,
} from '@stacks/transactions';
import { batchRead } from '../batch-api';

async function batchReadsExample() {
  const rs = await batchRead({
    // index_block_hash:
    //   'ce04817b9c6d90814ff9c06228d3a07d64335b1d9b01a233456fc304e34f7c0e', // block 373499
    variables: [
      {
        contract: contractPrincipalCV(
          'SP1Z92MPDQEWZXW36VX71Q25HKF5K2EPCJ304F275',
          'liquidity-token-v5kbe3oqvac'
        ),
        variableName: 'balance-x',
      },
      {
        contract: contractPrincipalCV(
          'SP1Z92MPDQEWZXW36VX71Q25HKF5K2EPCJ304F275',
          'liquidity-token-v5kbe3oqvac'
        ),
        variableName: 'balance-y',
      },
      {
        contract: contractPrincipalCV(
          'SP1Z92MPDQEWZXW36VX71Q25HKF5K2EPCJ304F275',
          'liquidity-token-v5kbe3oqvac'
        ),
        variableName: 'something-not-exists',
      },
    ],
    maps: [
      {
        contract: contractPrincipalCV(
          'SP102V8P0F7JX67ARQ77WEA3D3CFB5XW39REDT0AM',
          'amm-registry-v2-01'
        ),
        mapName: 'pools-data-map',
        mapKey: tupleCV({
          'token-x': principalCV(
            'SP102V8P0F7JX67ARQ77WEA3D3CFB5XW39REDT0AM.token-wstx-v2'
          ),
          'token-y': principalCV(
            'SP102V8P0F7JX67ARQ77WEA3D3CFB5XW39REDT0AM.token-alex'
          ),
          factor: uintCV(1e8),
        }),
      },
      {
        contract: contractPrincipalCV(
          'SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1',
          'univ2-core'
        ),
        mapName: 'pools',
        mapKey: uintCV(1),
      },
      {
        contract: contractPrincipalCV(
          'SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1',
          'contract-not-exists'
        ),
        mapName: 'pools',
        mapKey: uintCV(1),
      },
    ],
  });
  console.log(rs);
}

async function main() {
  await batchReadsExample();
  // await batchReadonlyExample();
}

if (require.main === module) {
  main().catch(console.error);
}
