/**
 * This file re-exports all exports from twinkle-core.
 * This is a separate file to easily facilitate switching between
 * different ways in which twinkle-core can be loaded.
 *
 * If you are using plain JavaScript in your project, note that all source
 * files should end .js extension. The contents of this file are valid in
 * both JS and TS.
 *
 * Only ONE of the export statements below should be activated. Keep the rest
 * commented out.
 */

// For use with TypeScript
export * from 'twinkle-core/src/index';

// For use with JavaScript
// export * from 'twinkle-core/js/src/index';

/*
 For testing changes to twinkle-core:
 This assumes that twinkle-core is cloned with its parent directory
 same as that of this project. If not, adjust the path accordingly.
*/
/* when using TS in your project */
// export * from '../../twinkle-core/src/index';

/* when using JS in your project */
// export * from '../../twinkle-core/js/src/index';
