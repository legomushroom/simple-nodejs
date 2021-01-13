import * as debug from 'debug';

const PACKAGE_NAME = 'socket-server';

export const mainTrace = debug.default(PACKAGE_NAME);
debug.enable('socket-server:*');

// tslint:disable:no-console
export const createTrace = (name: string) => {
    const verbose = mainTrace.extend(`${name}:trace`);
    verbose.log =
        // tslint:disable-next-line: no-console
        typeof console.debug === 'function'
            ? console.debug.bind(console)
            : console.log.bind(console);

    const info = mainTrace.extend(`${name}:info`);
    info.log =
        // tslint:disable-next-line: no-console
        console.info.bind(console);

    const warn = mainTrace.extend(`${name}:warn`);
    warn.log =
        // tslint:disable-next-line: no-console
        console.warn.bind(console);

    const error = mainTrace.extend(`${name}:error`);
    error.log =
        // tslint:disable-next-line: no-console
        console.error.bind(console);

    // function to create a child trace
    const childName = (traceName: string) => {
        return `${name}:${traceName}`;
    };

    // function to create a child trace
    const create = (traceName: string) => {
        return createTrace(childName(traceName));
    };

    return {
        verbose,
        info,
        warn,
        error,
        childName,
        create,
        name,
    };
};

export type Trace = ReturnType<typeof createTrace>;
