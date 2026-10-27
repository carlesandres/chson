import type { ServerCreate } from 'fumadocs-mdx/runtime/server';
import type { InternalTypeConfig } from 'fumadocs-mdx/runtime/types';
import type * as Config from '../source.config';

declare const create: ServerCreate<
  typeof Config,
  InternalTypeConfig & { DocData: {} }
>;

export declare const docs: Awaited<ReturnType<typeof create.docs<'docs'>>>;
