---
name: vitest
type: knowledge
agent: CodeActAgent
keywords: [vitest, test, testing, unit test, jest]
---

# Vitest テストフレームワーク

このリポジトリでは、テストフレームワークとして Vitest を使用しています。Vitest は Vite ベースの高速な JavaScript/TypeScript テストフレームワークで、Jest と互換性のある API を提供します。

## テストの実行

特定のパッケージのテストを実行するには、以下のコマンドを使用します：

```bash
pnpm --filter discordbot-<機能名> run test
```

## テストファイルの配置

テストファイルは通常、以下のいずれかの場所に配置されます：

* `packages/<機能名>/tests/` ディレクトリ
* `packages/<機能名>/src/**/__tests__/` ディレクトリ
* `packages/<機能名>/src/**/*.test.ts` または `*.spec.ts` ファイル

ユニットテストについてはテスト対象と同じディレクトリにテストファイルを作成してください。

## テストの書き方

Vitest は Jest と互換性のある API を提供しているため、以下のような形式でテストを記述できます：

```typescript
import { describe, it, expect } from 'vitest';
import { myFunction } from '../src/myModule';

describe('myFunction', () => {
  it('正しい結果を返すこと', () => {
    const result = myFunction(1, 2);
    expect(result).toBe(3);
  });

  it('エラーケースを適切に処理すること', () => {
    expect(() => myFunction(-1, 2)).toThrow();
  });
});
```

## モック

関数やモジュールをモックするには、以下のような方法を使用します：

```typescript
import { vi, describe, it, expect } from 'vitest';
import { processData } from '../src/dataProcessor';
import * as api from '../src/api';

// 関数のモック
vi.spyOn(api, 'fetchData').mockResolvedValue({ id: 1, name: 'Test' });

describe('processData', () => {
  it('データを正しく処理すること', async () => {
    const result = await processData(1);
    expect(api.fetchData).toHaveBeenCalledWith(1);
    expect(result).toEqual({ id: 1, name: 'TEST' });
  });
});
```

## 非同期テスト

非同期関数のテストは、async/await を使用して記述できます：

```typescript
import { describe, it, expect } from 'vitest';
import { fetchUserData } from '../src/api';

describe('fetchUserData', () => {
  it('ユーザーデータを取得できること', async () => {
    const userData = await fetchUserData(1);
    expect(userData).toHaveProperty('id');
    expect(userData).toHaveProperty('name');
  });
});
