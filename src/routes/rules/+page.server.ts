import { readFile, stat } from 'fs/promises';
import { marked } from 'marked';
import { join } from 'path';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {
	try {
		const rulesPath = join(process.cwd(), 'RULES.md');
		
		// Read the markdown file and get file stats, and get user session
		const [markdownContent, fileStats, { user }] = await Promise.all([
			readFile(rulesPath, 'utf-8'),
			stat(rulesPath),
			safeGetSession()
		]);

		// Convert markdown to HTML
		const htmlContent = marked(markdownContent);
		
		// Get last modified date
		const lastUpdated = fileStats.mtime;

		return {
			htmlContent,
			lastUpdated: lastUpdated.toISOString(),
			user
		};
	} catch (err) {
		console.error('Error loading rules:', err);
		throw error(500, 'Failed to load rules content');
	}
};