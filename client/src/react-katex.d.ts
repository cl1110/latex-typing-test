declare module 'react-katex' {
  import { ComponentType } from 'react';

  interface KatexOptions {
    displayMode?: boolean;
    throwOnError?: boolean;
    errorColor?: string;
    macros?: any;
    colorIsTextColor?: boolean;
    maxSize?: number;
    maxExpand?: number;
    allowedProtocols?: string[];
    strict?: boolean | string | Function;
    trust?: boolean | Function;
    fleqn?: boolean;
    leqno?: boolean;
    output?: string;
  }

  interface InlineMathProps {
    math: string;
    settings?: KatexOptions;
    renderError?: (error: Error) => JSX.Element;
  }

  interface BlockMathProps {
    math: string;
    settings?: KatexOptions;
    renderError?: (error: Error) => JSX.Element;
  }

  export const InlineMath: ComponentType<InlineMathProps>;
  export const BlockMath: ComponentType<BlockMathProps>;
}
