---
name: typescript
type: knowledge
agent: CodeActAgent
keywords: [typescript, ts, type, interface]
---

# TypeScript の使用方法

このリポジトリは TypeScript で開発されています。TypeScript は JavaScript に静的型付けを追加した言語で、コードの品質と保守性を向上させます。

## プロジェクト構成

* 各パッケージには独自の `tsconfig.json` ファイルがあります。
* ビルドプロセスは TypeScript コードを JavaScript にコンパイルします。

## 型定義

* 型定義は明示的に行い、`any` 型の使用は避けてください。
* インターフェースや型エイリアスを使用して、複雑な型を定義してください。

```typescript
// 良い例
interface User {
  id: string;
  name: string;
  age?: number;
}

// 避けるべき例
const user: any = { id: '1', name: 'User' };
```

## 非同期処理

* Promise や async/await を使用して非同期処理を行います。
* エラーハンドリングは try/catch ブロックで適切に行ってください。

```typescript
async function fetchData(): Promise<Data> {
  try {
    const response = await fetch('https://api.example.com/data');
    return await response.json();
  } catch (error) {
    console.error('データの取得に失敗しました:', error);
    throw error;
  }
}
```

## ビルドプロセス

各パッケージのビルドは以下のコマンドで実行できます：

```bash
pnpm --filter discordbot-<機能名> run build
```

これにより、TypeScript コードが JavaScript にコンパイルされ、実行可能な状態になります。
