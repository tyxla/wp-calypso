/**
 * External dependencies
 */
import React from 'react';
import page from 'page';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import toggle from '../mixin-toggle';
import skeleton from '../mixin-skeleton';
import observe from 'lib/mixins/data-observe';
import ErrorPanel from '../stats-error';
import StatsList from '../stats-list';
import StatsListLegend from '../stats-list/legend';
import DownloadCsv from '../stats-download-csv';
import DatePicker from '../stats-date-picker';
import Card from 'components/card';
import StatsModulePlaceholder from './placeholder';
import Gridicon from 'components/gridicon';
import SectionHeader from 'components/section-header';
import Button from 'components/button';

export default React.createClass( {
	displayName: 'StatModule',

	mixins: [ toggle(), skeleton( 'data' ), observe( 'dataList' ) ],

	data() {
		return this.props.dataList.response.data;
	},

	getDefaultProps() {
		return{
			showPeriodDetail: false
		}
	},

	getInitialState() {
		return { noData: this.props.dataList.isEmpty() };
	},

	componentWillReceiveProps: function( nextProps ) {
		this.setState( { noData: nextProps.dataList.isEmpty() } );
	},

	viewAllHandler( event ) {
		var summaryPageLink = '/stats/' + this.props.period.period + '/' + this.props.path + '/' + this.props.site.slug + '?startDate=' + this.props.date;

		event.preventDefault();

		if ( this.props.beforeNavigate ) {
			this.props.beforeNavigate();
		}
		page( summaryPageLink );
	},

	getModuleLabel() {
		if ( ! this.props.summary ) {
			return this.props.moduleStrings.title;
		}

		return ( <DatePicker period={ this.props.period.period } date={ this.props.period.startOf } summary={ true } /> );
	},

	render() {
		var data = this.data(),
			noData = this.props.dataList.isEmpty(),
			hasError = this.props.dataList.isError(),
			isLoading = this.props.dataList.isLoading(),
			statsList,
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
