/*
  8 - Readonly 2
  -------
  by Anthony Fu (@antfu) #中等 #readonly #object-keys
  
  ### 题目
  
  > 由谷歌自动翻译，欢迎 PR 改进翻译质量。
  
  实现一个通用`MyReadonly2<T, K>`，它带有两种类型的参数`T`和`K`。
  
  `K`指定应设置为Readonly的`T`的属性集。如果未提供`K`，则应使所有属性都变为只读，就像普通的`Readonly<T>`一样。
  
  例如
  
  ```ts
  interface Todo {
    title: string
    description: string
    completed: boolean
  }
  
  const todo: MyReadonly2<Todo, 'title' | 'description'> = {
    title: "Hey",
    description: "foobar",
    completed: false,
  }
  
  todo.title = "Hello" // Error: cannot reassign a readonly property
  todo.description = "barFoo" // Error: cannot reassign a readonly property
  todo.completed = true // OK
  ```
  
  > 在 Github 上查看：https://tsch.js.org/8/zh-CN
*/

/* _____________ 你的代码 _____________ */

type MyExclude<T, E> = T extends E ? never : T;
type MyReadonly2<T, K extends keyof T = never> = [K] extends [never]
  ? { readonly [U in keyof T]: T[U] }
  : { readonly [U in K]: T[U] } & {
      [U in MyExclude<keyof T, K>]: T[U];
    };

type MyReadonly21<T, K extends keyof T = keyof T> = {
  [U in keyof T as U extends K ? never : U]: T[U];
} & {
  readonly [U in keyof T as U extends K ? U : never]: T[U];
};

/* _____________ 测试用例 _____________ */
import { Alike, Expect } from "@type-challenges/utils";

type cases1 = [
  Expect<Alike<MyReadonly2<Todo1>, Readonly<Todo1>>>,
  Expect<Alike<MyReadonly2<Todo1, "title" | "description">, Expected>>,
  Expect<Alike<MyReadonly2<Todo2, "title" | "description">, Expected>>
];

type cases2 = [
  Expect<Alike<MyReadonly21<Todo1>, Readonly<Todo1>>>,
  Expect<Alike<MyReadonly21<Todo1, "title" | "description">, Expected>>,
  Expect<Alike<MyReadonly21<Todo2, "title" | "description">, Expected>>
];

let a: MyReadonly2<Todo1>;

interface Todo1 {
  title: string;
  description?: string;
  completed: boolean;
}

interface Todo2 {
  readonly title: string;
  description?: string;
  completed: boolean;
}

interface Expected {
  readonly title: string;
  readonly description?: string;
  completed: boolean;
}

/* _____________ 下一步 _____________ */
/*
  > 分享你的解答：https://tsch.js.org/8/answer/zh-CN
  > 查看解答：https://tsch.js.org/8/solutions
  > 更多题目：https://tsch.js.org/zh-CN
*/
