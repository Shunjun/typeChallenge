/*
  645 - Diff
  -------
  by ZYSzys (@ZYSzys) #中等 #object
  
  ### 题目
  
  获取两个接口类型中的差值属性。
  
  ```ts
  type Foo = {
    a: string;
    b: number;
  }
  type Bar = {
    a: string;
    c: boolean
  }
  
  type Result1 = Diff<Foo,Bar> // { b: number, c: boolean }
  type Result2 = Diff<Bar,Foo> // { b: number, c: boolean }
  
  ```
  
  > 在 Github 上查看：https://tsch.js.org/645/zh-CN
*/

/* _____________ 你的代码 _____________ */

type DiffUnion<U, U1> =
  | (U extends U1 ? never : U)
  | (U1 extends U ? never : U1);

type Diff<O, O1> = {
  [K in DiffUnion<keyof O, keyof O1>]: K extends keyof O
    ? O[K]
    : K extends keyof O1
    ? O1[K]
    : never;
};

type test2 = DiffUnion<keyof Foo, keyof Bar>;

/* _____________ 测试用例 _____________ */
import type { Equal, Expect } from "@type-challenges/utils";

type Foo = {
  name: string;
  age: string;
};
type Bar = {
  name: string;
  age: string;
  gender: number;
};
type Coo = {
  name: string;
  gender: number;
};

type test = Diff<Foo, Bar>;

type cases = [
  Expect<Equal<Diff<Foo, Bar>, { gender: number }>>,
  Expect<Equal<Diff<Bar, Foo>, { gender: number }>>,
  Expect<Equal<Diff<Foo, Coo>, { age: string; gender: number }>>,
  Expect<Equal<Diff<Coo, Foo>, { age: string; gender: number }>>
];

/* _____________ 下一步 _____________ */
/*
  > 分享你的解答：https://tsch.js.org/645/answer/zh-CN
  > 查看解答：https://tsch.js.org/645/solutions
  > 更多题目：https://tsch.js.org/zh-CN
*/
