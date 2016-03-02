/**
 * External Dependencies
 */
import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import omit from 'lodash/omit';

/**
 * Internal Dependencies
 */
import { ThemeSheet as ThemeSheetComponent } from 'my-sites/themes/sheet';
import i18n from 'lib/mixins/i18n';
//import buildTitle from 'lib/screen-title/utils';
import { getCurrentUser } from 'state/current-user/selectors';
import { setSection } from 'state/ui/actions';
import ClientSideEffects from 'components/client-side-effects';

export function makeElement( ThemesComponent, Head, store, props ) {
	return(
		<ReduxProvider store={ store }>
			<Head title={ props.title } tier={ props.tier || 'all' }>
				<ThemesComponent { ...omit( props, [ 'title', 'runClientAnalytics' ] ) } />
				<ClientSideEffects>
					{ props.runClientAnalytics }
				</ClientSideEffects>
			</Head>
		</ReduxProvider>
	);
};

export function details( context, next ) {
	const user = getCurrentUser( context.store.getState() );
	const Head = user
		? require( 'layout/head' )
		: require( 'my-sites/themes/head' );
	const props = {
		themeSlug: context.params.slug,
		contentSection: context.params.section,
		title: //buildTitle(
			i18n.translate( 'Theme Details', { textOnly: true } ),
		//),
		isLoggedIn: !! user
	};

	context.store.dispatch( setSection( 'themes', {
		hasSidebar: false,
		isFullScreen: true
	} ) );

	context.primary = makeElement( ThemeSheetComponent, Head, context.store, props );
	context.secondary = null; // When we're logged in, we need to remove the sidebar.
	next();
}