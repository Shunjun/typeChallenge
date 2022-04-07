/*
  9 - 深度 Readonly
  -------
  by Anthony Fu (@antfu) #中等 #readonly #object-keys #deep
  
  ### 题目
  
  > 由谷歌自动翻译，欢迎 PR 改进翻译质量。
  
  实现一个通用的`DeepReadonly<T>`，它将对象的每个参数及其子对象递归地设为只读。
  
  您可以假设在此挑战中我们仅处理对象。数组，函数，类等都无需考虑。但是，您仍然可以通过覆盖尽可能多的不同案例来挑战自己。
  
  例如
  
  ```ts
  type X = { 
    x: { 
      a: 1
      b: 'hi'
    }
    y: 'hey'
  }
  
  type Expected = { 
    readonly x: { 
      readonly a: 1
      readonly b: 'hi'
    }
    readonly y: 'hey' 
  }
  
  type Todo = DeepReadonly<X> // should be same as `Expected`
  ```
  
  > 在 Github 上查看：https://tsch.js.org/9/zh-CN
*/

/* _____________ 你的代码 _____________ */

type DeepReadonly<T extends object> = {
  readonly [U in keyof T]: T[U] extends Record<string, unknown>
    ? DeepReadonly<T[U]>
    : T[U];
};

// 关于 Record<string, any> ，官方给出的解答：
// https://github.com/microsoft/TypeScript/issues/41746
// 所有的引用数据类型都可以通过类型检查
const a1: Record<string, any> = [22];
const a2: Record<string, any> = /\d/;
const a3: Record<string, any> = {};
let a4: Record<string, any> = { name: "张三" };
a4 = [];
const a5: Record<string, any> = new Map();
const a6: Record<string, any> = new Set();
const a7: Record<string, any> = class Person {};
const a8: Record<string, any> = new Promise(() => {});

// Record<string, unknown> 只有"对象" 才能通过类型检查
// const b: Record<string, unknown> = () => 22; // error
// const b1: Record<string, unknown> = [22]; // error
// const b2: Record<string, unknown> = /\d/; // error
const b3: Record<string, unknown> = {};
let b4: Record<string, unknown> = { name: "张三" };
// b4 = []; // error
// const b5: Record<string, unknown> = new Map(); // error
// const b6: Record<string, unknown> = new Set(); // error
// const b7: Record<string, unknown> = class Person {}; // error
// const b8: Record<string, unknown> = new Promise(() => {}); // error

/* _____________ 测试用例 _____________ */
import { Equal, Expect } from "@type-challenges/utils";

type cases = [Expect<Equal<DeepReadonly<X>, Expected>>];

type X = {
  a: () => 22;
  b: string;
  c: {
    d: boolean;
    e: {
      g: {
        h: {
          i: true;
          j: "string";
        };
        k: "hello";
      };
    };
  };
};

type Expected = {
  readonly a: () => 22;
  readonly b: string;
  readonly c: {
    readonly d: boolean;
    readonly e: {
      readonly g: {
        readonly h: {
          readonly i: true;
          readonly j: "string";
        };
        readonly k: "hello";
      };
    };
  };
};

/* _____________ 下一步 _____________ */
/*
  > 分享你的解答：https://tsch.js.org/9/answer/zh-CN
  > 查看解答：https://tsch.js.org/9/solutions
  > 更多题目：https://tsch.js.org/zh-CN
*/
