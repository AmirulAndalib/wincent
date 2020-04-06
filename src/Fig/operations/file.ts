import ErrorWithMetadata from '../../ErrorWithMetadata';
import {log} from '../../console';
import chown from '../../fs/chown';
import cp from '../../fs/cp';
import mkdir from '../../fs/mkdir';
import tempfile from '../../fs/tempfile';
import expand from '../../path/expand';
import Context from '../Context';
import compare from '../compare';

export default async function file({
    contents,
    force,
    group,
    mode,
    owner,
    path,
    src,
    state,
}: {
    contents?: string;
    force?: boolean;
    group?: string;
    path: string;
    mode?: Mode;
    owner?: string;
    src?: string;
    state: 'directory' | 'file' | 'link' | 'touch';
}): Promise<void> {
    if (state !== 'file' && (contents !== undefined || src !== undefined)) {
        throw new ErrorWithMetadata(
            `A file-system object cannot have "contents" or "src" unless its state is \`file\``
        );
    }

    if (contents !== undefined && src !== undefined) {
        throw new ErrorWithMetadata(
            `Cannot populate a file-system object with both "contents" and from "src"`
        );
    }

    const target = expand(path);

    if (src) {
        // TODO: read and feed that into contents
    }

    const diff = await compare({
        contents,
        force,
        group,
        mode,
        owner,
        path: target,
        state,
    });

    if (diff.error) {
        // TODO: maybe wrap this to make it more specific
        throw diff.error;
    }

    if (state === 'directory') {
        if (diff.state === 'directory') {
            // TODO: if force in effect, that means we have to remove file/link
            // first.
            const sudo = !!(diff.owner || diff.group);
            const result = await mkdir(target, {mode, sudo});

            if (result instanceof Error) {
                throw result;
            }

            Context.informChanged(`directory ${path}`);
        } else {
            // Already a directory.
            Context.informOk(`directory ${path}`);
            // TODO still check ownership, perms etc
        }
    } else if (state === 'file') {
        if (diff.state === 'file') {
            // TODO: file does not exist — have to create it
            // if contents, use that
            // if src, copy that
            // if neither, create empty
        }

        if (diff.owner || diff.group) {
            const result = await chown(target, {group, owner, sudo: true});

            if (result instanceof Error) {
                throw result;
            }
        }

        if (diff.contents) {
            // log.info('change!');
            let from;

            if (src) {
                from = src;
            } else {
                from = await tempfile('file', diff.contents);
            }

            log.debug(`Copying form ${from}`);

            const result = await cp(from, target);

            if (result instanceof Error) {
                throw result;
            }

            Context.informChanged(`file ${path}`);
            return;
        }

        // BUG: we use "template" here; not distinguishing between
        // "template" and "file"
        Context.informOk(`file ${path}`);
    } else if (state === 'link') {
        // TODO
    } else if (state === 'touch') {
        // TODO
    } else {
        throw new Error('Unreachable');
    }

    // TODO: probably refactor this to use compare.ts
    if (0) {
        // In the meantime, silence unused parameter warnings.
        console.log(force, mode, src);
    }
}
