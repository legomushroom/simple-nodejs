import { Event } from 'vscode-jsonrpc';

export interface IDisposable {
    readonly dispose: () => void;
};


export interface IDisposableClass extends IDisposable {
    readonly addToDisposables: (disposable: IDisposable) => this;
    readonly isDisposed: boolean;
    readonly onDispose: Event<IDisposable>;
    readonly dispose: () => this;
};
