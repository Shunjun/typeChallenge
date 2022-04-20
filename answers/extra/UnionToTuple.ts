/*
  62 - Type Lookup
  -------
  by Anthony Fu (@antfu) #中等 #union #map
  
  ### 题目
  
  有时，您可能希望根据其属性在并集中查找类型。
  
  在此挑战中，我们想通过在联合`Cat | Dog`中搜索公共`type`字段来获取相应的类型。换句话说，在以下示例中，我们期望`LookUp<Dog | Cat, 'dog'>`获得`Dog`，`LookUp<Dog | Cat, 'cat'>`获得`Cat`。
  
  ```ts
  type SourceUnion = "key1" | "key2" | "key3";
  
  type MyTuple = UnionToTuple<SourceUnion> // expected to be ["key1", "key2", "key3"]
  ```

*/

/* _____________ 你的代码 _____________ */

type UnionInterFunction<U> = (
  U extends any ? (k: () => U) => void : never
) extends (k: infer T) => void
  ? T
  : never;

type LastOfUnion<U> = UnionInterFunction<U> extends { (): infer I } ? I : never;

type UnionToTuple<U, T extends any[] = [], Last = LastOfUnion<U>> = {
  0: T;
  1: UnionToTuple<Exclude<U, Last>, [Last, ...T]>;
}[[U] extends [never] ? 0 : 1];

/* _____________ 测试用例 _____________ */
import type { Equal, Expect } from "@type-challenges/utils";

type SourceUnion = "key1" | "key2" | "key3";

type cases = [
  Expect<Equal<UnionToTuple<SourceUnion>, ["key1", "key2", "key3"]>>
];
