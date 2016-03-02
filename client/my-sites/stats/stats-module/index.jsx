/**
 * External dependencies
 */
var React = require( 'react' ),
	page = require( 'page' ),
	classNames = require( 'classnames' );

/**
 * Internal dependencies
 */
var toggle = require( '../mixin-toggle' ),
	skeleton = require( '../mixin-skeleton' ),
	observe = require( 'lib/mixins/data-observe' ),
	ErrorPanel = require( '../stats-error' ),
	InfoPanel = require( '../info-panel' ),
	StatsList = require( '../stats-list' ),
	StatsListLegend = require( '../stats-list/legend' ),
	DownloadCsv = require( '../stats-download-csv' ),
	DatePicker = require( '../stats-date-picker' ),
	Card = require( 'components/card' ),
	StatsModulePlaceholder = require( './placeholder' ),
	Gridicon = require( 'components/gridicon' ),
	SectionHeader = require( 'components/section-header' ),
	Button = require( 'components/button' );

module.exports = React.createClass( {
	displayName: 'StatModule',

	mixins: [ toggle(), skeleton( 'data' ), observe( 'dataList' ) ],

	data: function() {
		return this.props.dataList.response.data;
	},

	getDefaultProps: function() {
		return{
			showPeriodDetail: false
		}
	},

	getInitialState: function() {
		return { noData: this.props.dataList.isEmpty() };
	},

	componentWillReceiveProps: function( nextProps ) {
		this.setState( { noData: nextProps.dataList.isEmpty() } );
	},

	viewAllHandler: function( event ) {
		var summaryPageLink = '/stats/' + this.props.period.period + '/' + this.props.path + '/' + this.props.site.slug + '?startDate=' + this.props.date;

		event.preventDefault();

		if ( this.props.beforeNavigate ) {
			this.props.beforeNavigate();
		}
		page( summaryPageLink );
	},

	getModuleLabel: function() {
		if( ! this.props.summary ) {
			return this.props.moduleStrings.title;
		} else {
			return ( <DatePicker period={ this.props.period.period } date={ this.props.period.startOf } summary={ true } /> );
		}
	},

	render: function() {
		var data = this.data(),
			noData = this.props.dataList.isEmpty(),
			hasError = this.props.dataList.isError(),
			headerLink = this.props.moduleStrings.title,
			isLoading = this.props.dataList.isLoading(),
			moduleHeaderTitle,
			statsList,
			moduleToggle,
			classes;

		classes = classNames(
			'stats-module',
			{
				'is-expanded': this.state.showModule,
				'is-loading': isLoading,
				'is-showing-info': this.state.showInfo,
				'has-no-data': noData,
				'is-showing-error': hasError || noData
			}
		);

		statsList = <StatsList moduleName={ this.props.path } data={ data } followList={ this.props.followList } />;

		return (
			<div>

				<SectionHeader label={ this.getModuleLabel() }>
					{ ! this.props.summary
					 	? ( <Button
								compact
								borderless
								onClick={ this.viewAllHandler }
								>
								<Gridicon icon="stats-alt" />
							</Button> )
					 	: ( <DownloadCsv period={ this.props.period } path={ this.props.path } site={ this.props.site } dataList={ this.props.dataList } /> ) }
				</SectionHeader>
				<Card compact className={ classes }>
					<div className={ this.props.className }>
						<div className="module-content">
							{ ( noData && ! hasError ) ? <ErrorPanel className="is-empty-message" message={ this.props.moduleStrings.empty } /> : null }
							{ hasError ? <ErrorPanel className={ 'network-error' } /> : null }
							<StatsListLegend value={ this.props.moduleStrings.value } label={ this.props.moduleStrings.item } />
							<StatsModulePlaceholder isLoading={ isLoading } />
							{ statsList }
						</div>
					</div>
				</Card>
			</div>

		);
	}
} );
