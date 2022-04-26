import React from "react";
import { Route, Redirect, withRouter } from "react-router-dom";
import * as storageUtils from '../../Utils/storageUtils'

const Authmiddleware = ({ component: Component, layout: Layout }) => (
	<Route
		render={props => {
			if (!storageUtils.getAuthenticatedUser()) {
				return (
					<Redirect to={{ pathname: "/login", state: { from: props.location } }} />
				);
			}
			return (
				<Layout><Component {...props} /></Layout>
			);
		}}
	/>
);

export default withRouter(Authmiddleware);

