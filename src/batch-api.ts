import {
    type ClarityValue,
    type ContractPrincipalCV,
    deserializeCV,
    type OptionalCV,
    serializeCV,
  } from '@stacks/transactions';
  
  export interface BatchReads {
    variables?: {
      contract: ContractPrincipalCV;
      variableName: string;
    }[];
    maps?: {
      contract: ContractPrincipalCV;
      mapName: string;
      mapKey: ClarityValue;
    }[];
    index_block_hash?: string;
  }
  
  export interface BatchReadsResult {
    variables: (ClarityValue | Error)[];
    maps: (OptionalCV | Error)[];
  }
  
  export interface BatchApiOptions {
    stxerApi?: string;
  }
  
  const DEFAULT_STXER_API = 'https://api.stxer.xyz';
  
  export async function batchRead(
    reads: BatchReads,
    options: BatchApiOptions = {}
  ): Promise<BatchReadsResult> {
    const payload: string[][] = [];
    if (reads.variables != null) {
      for (const variable of reads.variables) {
        payload.push([serializeCV(variable.contract), variable.variableName]);
      }
    }
    if (reads.maps != null) {
      for (const map of reads.maps) {
        payload.push([
          serializeCV(map.contract),
          map.mapName,
          serializeCV(map.mapKey),
        ]);
      }
    }
  
    const ibh =
      reads.index_block_hash == null
        ? null
        : reads.index_block_hash.startsWith('0x')
        ? reads.index_block_hash.substring(2)
        : reads.index_block_hash;
  
    const url = `${options.stxerApi ?? DEFAULT_STXER_API}/sidecar/v2/batch-reads${
      ibh == null ? '' : `?tip=${ibh}`
    }`;
    const data = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    const text = await data.text();
    if (!text.includes('Ok') && !text.includes('Err')) {
      throw new Error(
        `Requesting batch reads failed: ${text}, url: ${url}, payload: ${JSON.stringify(
          payload
        )}`
      );
    }
    const results = JSON.parse(text) as [{ Ok: string } | { Err: string }];
    const rs: BatchReadsResult = {
      variables: [],
      maps: [],
    };
    let variablesLength = 0;
    if (reads.variables != null) {
      variablesLength = reads.variables.length;
      for (let i = 0; i < variablesLength; i++) {
        const result = results[i];
        if ('Ok' in result) {
          rs.variables.push(deserializeCV(result.Ok));
        } else {
          rs.variables.push(new Error(result.Err));
        }
      }
    }
    if (reads.maps != null) {
      for (let i = 0; i < reads.maps.length; i++) {
        const result = results[i + variablesLength];
        if ('Ok' in result) {
          rs.maps.push(deserializeCV(result.Ok) as OptionalCV);
        } else {
          rs.maps.push(new Error(result.Err));
        }
      }
    }
    return rs;
  }
  
  export interface BatchReadonlyRequest {
    readonly: {
      contract: ContractPrincipalCV;
      functionName: string;
      functionArgs: ClarityValue[];
    }[];
    index_block_hash?: string;
  }
  
  export async function batchReadonly(
    req: BatchReadonlyRequest,
    options: BatchApiOptions = {}
  ): Promise<(ClarityValue | Error)[]> {
    const payload = req.readonly.map((r) => [
      serializeCV(r.contract),
      r.functionName,
      ...r.functionArgs.map((arg) => serializeCV(arg)),
    ]);
  
    const ibh =
      req.index_block_hash == null
        ? null
        : req.index_block_hash.startsWith('0x')
        ? req.index_block_hash.substring(2)
        : req.index_block_hash;
  
    const url = `${options.stxerApi ?? DEFAULT_STXER_API}/sidecar/v2/batch-readonly${
      ibh == null ? '' : `?tip=${ibh}`
    }`;
    const data = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    const text = await data.text();
    if (!text.includes('Ok') && !text.includes('Err')) {
      throw new Error(
        `Requesting batch readonly failed: ${text}, url: ${url}, payload: ${JSON.stringify(
          payload
        )}`
      );
    }
    const results = JSON.parse(text) as [{ Ok: string } | { Err: string }];
    const rs: (ClarityValue | Error)[] = [];
    for (const result of results) {
      if ('Ok' in result) {
        rs.push(deserializeCV(result.Ok));
      } else {
        rs.push(new Error(result.Err));
      }
    }
    return rs;
  }
  