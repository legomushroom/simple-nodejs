import { Emitter } from 'vscode-jsonrpc';

import { createTrace, Trace } from './createTrace';
import { IDisposable, IDisposableClass } from '../interfaces/IDisposableClass';

export class DisposableClass implements IDisposableClass {
    protected readonly disposables: IDisposable[] = [];
    private isDisposedReference: boolean = false;
    public readonly trace: Trace;

    private readonly onDisposeEmitter: Emitter<IDisposable> = new Emitter();
    public readonly onDispose = this.onDisposeEmitter.event;

    constructor(
        traceRaw: string | Trace,
    ) {
        this.trace = (typeof traceRaw === 'string')
            ? createTrace(traceRaw)
            : traceRaw;
    }

    public get isDisposed() {
        return this.isDisposedReference;
    }

    public dispose(): this {
        if (this.isDisposed) {
            this.trace.verbose('already disposed');
            return this;
        }

        this.isDisposedReference = true;

        try {
            this.trace.verbose(`disposing ${this.disposables.length} objects`);

            this.disposables.forEach((disposable: IDisposableClass) => {
                try {
                    disposable.dispose();
                } catch (e) {
                    return this.trace.warn('Error from disposable', disposable, e);
                }
            });

            this.disposables.length = 0;
            delete (this as any)['disposables'];
        } catch (e) {
            this.trace.warn(`error while disposing an object`, e);
        }

        this.onDisposeEmitter.fire(this);
        this.onDisposeEmitter.dispose();

        return this;
    };

    public addToDisposables = (...disposables: IDisposable[]) => {
        this.disposables.push(...disposables);
        return this;
    }

    protected removeFromDisposables = (disposable: IDisposable) => {
        const index = this.disposables.indexOf(disposable);
        if (index < 0) {
            return this;
        }

        this.disposables.splice(index, 1);

        return this;
    }
}
