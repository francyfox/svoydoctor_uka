import type { Component } from 'svelte';
import MediaCardBlock from './blocks/media-card-block.svelte';
import IconLabelBlock from './blocks/icon-label-block.svelte';
import LinkBlock from './blocks/link-block.svelte';
import ListBlock from './blocks/list-block.svelte';
import type { BlockEntry } from '$lib/types/content';

// BlockEntry.collection -> renderer. A lookup, not a chain of ifs: adding a 5th block
// primitive later means adding one entry here, not touching section-blocks.svelte.
// `data: any` (not a per-key mapped type): the registry is indexed dynamically at the call
// site, where TS can't re-correlate a narrowed `collection` back to its matching `data` shape.
export const blockRegistry: Record<BlockEntry['collection'], Component<{ data: any }>> = {
	block_media_card: MediaCardBlock,
	block_icon_label: IconLabelBlock,
	block_link: LinkBlock,
	block_list: ListBlock
};
