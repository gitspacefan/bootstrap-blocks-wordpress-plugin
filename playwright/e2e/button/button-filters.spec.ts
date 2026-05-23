import { editorSettingsSelectOption } from '../../commands/editor-settings-select-option';

import { test, expect, Editor } from '@wordpress/e2e-test-utils-playwright';

test.describe( 'Button Block', () => {
	test.use( {
		editor: async ( { page }, use ) => {
			await use( new Editor( { page } ) );
		},
	} );

	test.beforeAll( async ( { requestUtils } ) => {
		await requestUtils.activatePlugin(
			'wp-bootstrap-blocks-test-button-filters'
		);
	} );

	test.afterAll( async ( { requestUtils } ) => {
		await requestUtils.deactivatePlugin(
			'wp-bootstrap-blocks-test-button-filters'
		);
	} );

	test.beforeEach( async ( { admin, editor } ) => {
		await admin.createNewPost();
		await editor.insertBlock( {
			name: 'wp-bootstrap-blocks/button',
		} );
	} );

	test( 'wpBootstrapBlocks.button.styleOptions adds style option', async ( {
		editor,
		page,
	} ) => {
		await editorSettingsSelectOption( editor, page, 'Style', 'brand' );

		expect(
			await editor.canvas
				.locator( '.wp-block-wp-bootstrap-blocks-text-input' )
				.getAttribute( 'style' )
		).toEqual(
			'background-color: rgb(255, 0, 0); color: rgb(255, 255, 255); white-space: pre-wrap;'
		);

		expect( await editor.getEditedPostContent() ).toMatchSnapshot(
			'wpBootstrapBlocks.button.styleOptions-adds-style-option.txt'
		);
	} );

	test( 'Deprecated color attribute is visible in UI', async ( {
		editor,
		page,
	} ) => {
		await editorSettingsSelectOption(
			editor,
			page,
			'Style',
			'brand-deprecated-color'
		);

		expect(
			await editor.canvas
				.locator( '.wp-block-wp-bootstrap-blocks-text-input' )
				.getAttribute( 'style' )
		).toEqual(
			'background-color: rgb(255, 0, 0); color: rgb(255, 255, 255); white-space: pre-wrap;'
		);

		expect( await editor.getEditedPostContent() ).toMatchSnapshot(
			'deprecated-color-attribute-is-visible-in-ui.txt'
		);
	} );

	test( 'Uses default colors if textColor or bgColor attributes are missing in styleOption', async ( {
		editor,
		page,
	} ) => {
		await editorSettingsSelectOption(
			editor,
			page,
			'Style',
			'missing-colors'
		);

		expect(
			await editor.canvas
				.locator( '.wp-block-wp-bootstrap-blocks-text-input' )
				.getAttribute( 'style' )
		).toEqual(
			'background-color: rgb(0, 123, 255); color: rgb(255, 255, 255); white-space: pre-wrap;'
		);

		expect( await editor.getEditedPostContent() ).toMatchSnapshot(
			'uses-default-colors-if-textColor-or-bgColor-attributes-are-missing-in-styleOption.txt'
		);
	} );

	test( 'wp_bootstrap_blocks_button_default_attributes should override default attributes', async ( {
		editor,
		page,
	} ) => {
		// Alignment should be set
		await editor.clickBlockToolbarButton( 'Change button alignment' );
		await expect(
			await page.locator( 'button.is-active:text("Align text center")' )
		).toBeVisible();

		// Text should be set
		await expect(
			await editor.canvas.locator(
				'[aria-label="Add text..."].block-editor-rich-text__editable'
			)
		).toContainText( 'Jürg Hunziker' );

		// URL should be set
		await expect(
			await page.locator( '[aria-label="URL"]' ).inputValue()
		).toBe( 'https://juerghunziker.ch' );

		// Style should be selected
		await editor.openDocumentSettingsSidebar();
		expect(
			await page
				.getByRole( 'region', {
					name: 'Editor settings',
				} )
				.getByLabel( 'Style' )
				.inputValue()
		).toBe( 'secondary' );

		// Open in new tab is enabled
		expect(
			await page
				.getByRole( 'region', {
					name: 'Editor settings',
				} )
				.getByLabel( 'Open in new tab' )
				.isChecked()
		).toBeTruthy();

		// Rel should be set
		expect(
			await page
				.getByRole( 'region', {
					name: 'Editor settings',
				} )
				.getByLabel( 'Link rel' )
				.inputValue()
		).toBe( 'custom rel' );

		expect( await editor.getEditedPostContent() ).toMatchSnapshot(
			'wp_bootstrap_blocks_button_default_attributes-should-override-default-attributes.txt'
		);
	} );
} );
