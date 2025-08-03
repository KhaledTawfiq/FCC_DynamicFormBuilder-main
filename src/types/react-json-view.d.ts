declare module 'react-json-view' {
  import { Component } from 'react';

  export interface ReactJsonViewProps {
    src: any;
    name?: string | false;
    theme?: string;
    style?: React.CSSProperties;
    iconStyle?: 'circle' | 'triangle' | 'square';
    indentWidth?: number;
    collapsed?: boolean | number;
    collapseStringsAfterLength?: number;
    shouldCollapse?: (field: any) => boolean;
    groupArraysAfterLength?: number;
    enableClipboard?: boolean;
    displayObjectSize?: boolean;
    displayDataTypes?: boolean;
    onEdit?: (edit: any) => boolean | Promise<boolean>;
    onAdd?: (add: any) => boolean | Promise<boolean>;
    onDelete?: (del: any) => boolean | Promise<boolean>;
    onSelect?: (select: any) => void;
    sortKeys?: boolean;
    quotesOnKeys?: boolean;
    validationMessage?: string;
    defaultValue?: any;
  }

  export default class ReactJson extends Component<ReactJsonViewProps> {}
}
