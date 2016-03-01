/**
 * Internal dependencies
 */
var UserSignupComponent = require( 'signup/steps/user' ),
	SiteComponent = require( 'signup/steps/site' ),
	ThemeSelectionComponent = require( 'signup/steps/theme-selection' ),
	PaidPlansOnly = require( 'signup/steps/paid-plans-only' ),
	PaidPlansWithSkip = require( 'signup/steps/paid-plans-with-skip' ),
	PlansStepComponent = require( 'signup/steps/plans' ),
	DomainsStepComponent = require( 'signup/steps/domains' ),
	DesignTypeComponent = require( 'signup/steps/design-type' ),
	SurveyStepComponent = require( 'signup/steps/survey' ),
	MlbThemeSelectionComponent = require( 'signup/steps/mlb-theme-selection' ),
	MlbDomainsStepComponent = require( 'signup/steps/mlb-domains' ),
	config = require( 'config' );

module.exports = {
	themes: ThemeSelectionComponent,
	site: SiteComponent,
	user: UserSignupComponent,
	test: config( 'env' ) === 'development' ? require( 'signup/steps/test-step' ) : undefined,
	plans: PlansStepComponent,
	'select-plan': PaidPlansOnly,
	'select-plan-or-skip': PaidPlansWithSkip,
	domains: DomainsStepComponent,
	survey: SurveyStepComponent,
	'survey-user': UserSignupComponent,
	'design-type': DesignTypeComponent,
	'themes-headstart': ThemeSelectionComponent,
	altthemes: ThemeSelectionComponent,
	'domains-with-theme': DomainsStepComponent,
	'jetpack-user': UserSignupComponent,
	'mlb-themes': MlbThemeSelectionComponent,
	'mlb-domains': MlbDomainsStepComponent
};
