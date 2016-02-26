/**
 * External Dependencies
 */
import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import omit from 'lodash/omit';

/**
 * Internal Dependencies
 */
import SingleSiteComponent from 'my-sites/themes/single-site';
import MultiSiteComponent from 'my-sites/themes/multi-site';
import LoggedOutComponent from 'my-sites/themes/logged-out';
import { ThemeSheet as ThemeSheetComponent } from 'my-sites/themes/sheet';
import analytics from 'analytics';
import i18n from 'lib/mixins/i18n';
import trackScrollPage from 'lib/track-scroll-page';
import buildTitle from 'lib/screen-title/utils';
import { getAnalyticsData } from './helpers';
import { getCurrentUser } from 'state/current-user/selectors';
import { setSection } from 'state/ui/actions';
import ClientSideEffects from 'components/client-side-effects';
import LayoutLoggedOut from 'layout/logged-out';
import DefaultHead from 'layout/head';
import ThemesHead from 'head';

function runClientAnalytics( context ) {
	const { tier, site_id: siteId } = context.params;
	const { basePath, analyticsPageTitle } = getAnalyticsData(
		context.path,
		tier,
		siteId
	);
	analytics.pageView.record( basePath, analyticsPageTitle );
};

function getMultiSiteProps( context ) {
	const { tier, site_id: siteId } = context.params;

	const { basePath, analyticsPageTitle } = getAnalyticsData(
		context.path,
		tier,
		siteId
	);

	const boundTrackScrollPage = function() {
		trackScrollPage(
			basePath,
			analyticsPageTitle,
			'Themes'
		);
	};

	return {
		tier,
		search: context.query.s,
		trackScrollPage: boundTrackScrollPage
	};
};

function getSingleSiteProps( context ) {
	const { site_id: siteId } = context.params;

	const props = getMultiSiteProps( context );

	props.key = siteId;
	props.siteId = siteId;

	return props;
}

function getDetailsProps( context ) {
	const { slug, section } = context.params;
	const user = getCurrentUser( context.store.getState() );

	return {
		themeSlug: slug,
		contentSection: section,
		title: buildTitle(
			i18n.translate( 'Theme Details', { textOnly: true } )
		),
		isLoggedIn: !! user
	};
}

const LoggedInHead = ( { children, context: { params: { tier, site_id: siteID } } } ) => (
	<DefaultHead
		title={ buildTitle(
			i18n.translate( 'Themes', { textOnly: true } ),
			{ siteID }
		) }
		tier={ tier || 'all' }>
		{ children }
	</DefaultHead>
);

const LoggedOutHead = ( { children, context: { params: { tier, site_id: siteID } } } ) => (
	<ThemesHead
		title={ buildTitle(
			i18n.translate( 'Themes', { textOnly: true } ),
			{ siteID }
		) }
		tier={ tier || 'all' }>
		{ children }
	</ThemesHead>
);

// This is generic -- nothing themes-specific in here!
function makeElement( Component, getProps, Head, action = {}, sideEffects = function() {} ) {
	return ( context, next ) => {
		const boundSideEffects = sideEffects.bind( null, context );
		context.store.dispatch( action );

		context.primary = <ReduxProvider store={ context.store }>
			<Head context={ context }>
				<Component { ...getProps( context ) } />
				<ClientSideEffects>
					{ boundSideEffects }
				</ClientSideEffects>
			</Head>
		</ReduxProvider>;
		next();
	}
};

// Usage:
const setLoggedInDesignSection = setSection( 'design', {
	hasSidebar: true,
	isFullScreen: false
} );

const setLoggedOutDesignSection = setSection( 'design', {
	hasSidebar: false,
	isFullScreen: false
} );

const setThemesSection = setSection( 'themes', {
	hasSidebar: false,
	isFullScreen: true
} );

export const singleSite = makeElement(
	SingleSiteComponent,
	getSingleSiteProps,
	LoggedInHead,
	setLoggedInDesignSection,
	runClientAnalytics
);

export const multiSite = makeElement(
	MultiSiteComponent,
	getMultiSiteProps,
	LoggedInHead,
	setLoggedInDesignSection,
	runClientAnalytics
);

export const loggedOut = makeElement(
	LoggedOutComponent,
	getMultiSiteProps,
	LoggedOutHead,
	setLoggedOutDesignSection,
	runClientAnalytics
);

// context.secondary = null; // !!!!
export const details = makeElement(
	ThemeSheetComponent,
	getDetailsProps,
	LoggedOutHead, // logged-in ? LoggedInHead : LoggedOutHead
	setThemesSection,
	runClientAnalytics
);

// Where do we put this? It's client/server-agnostic, so not in client/controller,
// which requires ReactDom... Maybe in lib/react-helpers?
export function makeLoggedOutLayout( context, next ) {
	const { store, primary, secondary, tertiary } = context;
	context.layout = (
		<ReduxProvider store={ store }>
			<LayoutLoggedOut primary={ primary }
				secondary={ secondary }
				tertiary={ tertiary } />
		</ReduxProvider>
	);
	next();
};
