/*
  6228 - JSON Parser
  -------
  by Hydrogen (@hyroge) #extreme #template-literal #json
  
  ### Question
  
  You're required to implement a type-level partly parser to parse JSON string into a object literal type.
  
  Requirements:
   - `Numbers` and `Unicode escape (\uxxxx)` in JSON can be ignored. You needn't to parse them.
  
  > View on GitHub: https://tsch.js.org/6228
*/

/* _____________ Your Code Here _____________ */

type Pure<T> = {
  [P in keyof T]: T[P] extends object ? Pure<T[P]> : T[P];
};

type SetProperty<T, K extends PropertyKey, V> = {
  [P in keyof T | K]: P extends K ? V : P extends keyof T ? T[P] : never;
};

type Token =
  | "|"
  | "{"
  | "}"
  | "["
  | "]"
  | ":"
  | ","
  | `"${string}"`
  | null
  | true
  | false;

type Stringflag = `"` | `'` | "`";

type ParseResult<T extends Token[]> = T extends [
  infer FirstToken,
  ...infer RestTokens extends Token[]
]
  ? FirstToken extends "{"
    ? ParseObjectResult<RestTokens>
    : FirstToken extends "["
    ? ParseArrayResult<RestTokens>
    : never
  : never;

type Tokenize<
  S,
  T extends Token[] = []
> = S extends `${infer First}${infer Rest}`
  ? First extends "|" | "{" | "}" | "[" | "]" | ":" | ","
    ? Tokenize<Rest, [...T, First]>
    : First extends Stringflag
    ? ParseStringResult<Rest, [First]> extends [
        infer Rest,
        infer Token extends `"${string}"`
      ]
      ? Tokenize<Rest, [...T, Token]>
      : never
    : First extends `t` | `f` | `n`
    ? ParsePrimitiveResult<S> extends [
        infer Rest,
        infer Token extends `"${string}"` | null | true | false
      ]
      ? Tokenize<Rest, [...T, Token]>
      : never
    : First extends
        | `0`
        | `1`
        | `2`
        | `3`
        | `4`
        | `5`
        | `6`
        | `7`
        | `8`
        | `9`
        | `-`
    ? ParseNumberResult<Rest, First> extends [
        infer Rest,
        infer Token extends `"${string}"`
      ]
      ? // Tokenize<Rest, [...T, Token]>
        never
      : never
    : First extends ` ` | `\t` | `\n`
    ? Tokenize<Rest, T>
    : never
  : T;

type test = Tokenize<"true false">;

type ParseLiteral<T extends Token[]> = T extends [
  `"${string}"` | null | true | false
]
  ? [ParseLiteralResult<T[0]>]
  : ParseResult<T>;

// 1. Tokenize: {"F": {"true": false}} >> [`{`, `"F"`, `:`, `{`, "true", `:`, `false`, `}`, `}`]
// 2. ParseLiteral: [`{`, "F", `:`, `{`, `"true"`, `:`, `false` `}`, `}`] >> [`{`, `F`, `:`, `{`, true, `:`, false, `}`, `}`]
// 3. ParseResult: [`{`, `F`, `:`, `{`, true, `:`, false, `}`, `}`] >> [{F:{true:false}]
type Parse<T extends string> = Pure<ParseLiteral<Tokenize<T>>[0]>;

type ParseLiteralResult<T extends `"${string}"` | null | true | false> =
  T extends `"${infer StringContent}"` ? UnescapeString<StringContent> : T;

type UnescapeString<S extends string> =
  S extends `${infer First}${infer Second}${infer Rest}`
    ? `${First}${Second}` extends `\\n`
      ? `\n${UnescapeString<Rest>}`
      : `${First}${Second}` extends `\\r`
      ? `\r${UnescapeString<Rest>}`
      : `${First}${Second}` extends `\\f`
      ? `\f${UnescapeString<Rest>}`
      : `${First}${Second}` extends `\\b`
      ? `\b${UnescapeString<Rest>}`
      : `${First}${Second}` extends `\\t`
      ? `\t${UnescapeString<Rest>}`
      : `${First}${Second}${UnescapeString<Rest>}`
    : S;

type EscapeCharactor<S extends string> = S extends `n`
  ? `\n`
  : S extends `r`
  ? `\r`
  : S extends `f`
  ? `\f`
  : S extends `b`
  ? `\b`
  : S extends `t`
  ? `\t`
  : S;

// 取数组的最后一个元素
type StringArrayLast<Arr extends string[]> = Arr extends [
  ...infer First,
  infer Last
]
  ? Last extends string
    ? Last
    : never
  : never;

type StringflagArrayPop<Arr extends Stringflag[]> = Arr extends [
  ...infer First,
  infer Last
]
  ? First extends Stringflag[]
    ? First
    : []
  : never;

type StringflagArrayPush<Arr extends Stringflag[], Item extends Stringflag> = [
  ...Arr,
  Item
];

type ParseStringResult<
  S extends string,
  Flags extends Stringflag[] = [],
  Result extends string = ``
> = S extends `\\${infer First}${infer Rest}`
  ? ParseStringResult<Rest, Flags, `${Result}${EscapeCharactor<First>}`>
  : S extends `${infer First}${infer Rest}`
  ? First extends StringArrayLast<Flags>
    ? Flags["length"] extends 1
      ? [Rest, `"${Result}"`]
      : ParseStringResult<Rest, StringflagArrayPop<Flags>, `${Result}${First}`>
    : First extends Stringflag
    ? ParseStringResult<
        Rest,
        StringflagArrayPush<Flags, First>,
        `${Result}${First}`
      >
    : First extends "\n"
    ? never
    : ParseStringResult<Rest, Flags, `${Result}${First} `>
  : never;

type ParseNumberResult<
  S extends string,
  Result extends string
> = S extends `.${infer Rest} `
  ? Result extends `${string}.${string} `
    ? never
    : ParseNumberResult<Rest, `${Result}.`>
  : S extends `${infer First}${infer Rest} `
  ? First extends `0` | `1` | `2` | `3` | `4` | `5` | `6` | `7` | `8` | `9`
    ? ParseNumberResult<Rest, `${Result}${First} `>
    : Result extends "-"
    ? never
    : [S, `"${Result}"`]
  : Result extends "-" | `${string}.`
  ? never
  : [S, `"${Result}"`];

type ParsePrimitiveResult<S extends string> = S extends `true${infer Rest} `
  ? [Rest, true]
  : S extends `false${infer Rest} `
  ? [Rest, false]
  : S extends `null${infer Rest} `
  ? [Rest, null]
  : never;

type ParseArrayResult<
  T extends Token[],
  Result extends unknown[] = [],
  Expected extends Token = `"${string}"` | null | true | false | "]" | "[" | "{"
> = T extends [infer FirstToken, ...infer RestTokens extends Token[]]
  ? FirstToken extends Expected
    ? FirstToken extends "]"
      ? [Result, RestTokens]
      : FirstToken extends "["
      ? ParseArrayResult<RestTokens> extends [
          infer ArrayResult,
          infer RestTokens extends Token[]
        ]
        ? ParseArrayResult<RestTokens, [...Result, ArrayResult], "," | "]">
        : never
      : FirstToken extends "{"
      ? ParseObjectResult<RestTokens> extends [
          infer ObjectResult,
          infer RestTokens extends Token[]
        ]
        ? ParseArrayResult<RestTokens, [...Result, ObjectResult], "," | "]">
        : never
      : FirstToken extends ","
      ? ParseArrayResult<
          RestTokens,
          Result,
          `"${string}"` | null | true | false | "[" | "{"
        >
      : FirstToken extends `"${string}"` | null | true | false
      ? ParseArrayResult<
          RestTokens,
          [...Result, ParseLiteralResult<FirstToken>],
          "," | "]"
        >
      : never
    : never
  : never;

type ParseObjectResult<
  T extends Token[],
  Result extends object = {},
  Expected extends Token = "}" | `"${string}"`,
  Key extends string = ``
> = T extends [infer FirstToken, ...infer RestTokens extends Token[]]
  ? FirstToken extends Expected
    ? Key extends `"${string}"`
      ? FirstToken extends ":"
        ? ParseObjectResult<
            RestTokens,
            Result,
            `"${string}"` | null | true | false | "[" | "{",
            Key
          >
        : FirstToken extends `"${string}"` | null | true | false
        ? ParseObjectResult<
            RestTokens,
            SetProperty<
              Result,
              ParseLiteralResult<Key>,
              ParseLiteralResult<FirstToken>
            >,
            "," | "}"
          >
        : FirstToken extends "["
        ? ParseArrayResult<RestTokens> extends [
            infer ArrayResult,
            infer RestTokens extends Token[]
          ]
          ? ParseObjectResult<
              RestTokens,
              SetProperty<Result, ParseLiteralResult<Key>, ArrayResult>,
              "," | "}"
            >
          : never
        : FirstToken extends "{"
        ? ParseObjectResult<RestTokens> extends [
            infer ObjectResult,
            infer RestTokens extends Token[]
          ]
          ? ParseObjectResult<
              RestTokens,
              SetProperty<Result, ParseLiteralResult<Key>, ObjectResult>,
              "," | "}"
            >
          : never
        : never
      : FirstToken extends ","
      ? ParseObjectResult<RestTokens, Result, `"${string}"`, ``>
      : FirstToken extends `"${string}"`
      ? ParseObjectResult<RestTokens, Result, ":", FirstToken>
      : FirstToken extends "}"
      ? [Result, RestTokens]
      : never
    : never
  : never;

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from "@type-challenges/utils";

type cases = [
  Expect<
    Equal<
      Parse<`
{
  a: "b",
    b: false,
      c: [true, false, "hello", {
        a: "b",
        b: false
      }],
        nil: null
}
`>,
      {
        nil: null;
        c: [
          true,
          false,
          "hello",
          {
            a: "b";
            b: false;
          }
        ];
        b: false;
        a: "b";
      }
    >
  >,
  Expect<Equal<Parse<'"{}"'>, "{}">>,

  Expect<Equal<Parse<"[]">, []>>,

  Expect<Equal<Parse<"[1]">, never>>,

  Expect<Equal<Parse<"true">, true>>,

  Expect<Equal<Parse<'"STRING"'>, "STRING">>,

  Expect<Equal<Parse<"string">, string>>,

  Expect<
    Equal<Parse<'["Hello", true, false, null]'>, ["Hello", true, false, null]>
  >,

  Expect<
    Equal<
      Parse<`
{
  "hello\\r\\n\\b\\f": "world"
} `>,
      {
        "hello\r\n\b\f": "world";
      }
    >
  >,

  Expect<Equal<Parse<'{ 1: "world" }'>, never>>,

  Expect<
    Equal<
      Parse<`{
  "hello
  
  world": 123 }`>,
      never
    >
  >
];

/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/6228/answer
  > View solutions: https://tsch.js.org/6228/solutions
  > More Challenges: https://tsch.js.org
*/
