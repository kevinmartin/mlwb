import React from 'react';
import { IndexRoute, Route } from 'react-router';
import {
	App,
	AuthenticatedRoute,
	CreatePost,
	DeletePost,
	EditPost,
	Home,
	NotFound,
	ViewPost
} from 'containers';

export default () => (
	<Route path="/" component={App}>
		<IndexRoute component={Home} />

		<Route component={AuthenticatedRoute}>
			<Route path="posts/create" component={CreatePost} />
			<Route path="posts/:id/edit" component={EditPost} />
			<Route path="posts/:id/delete" component={DeletePost} />
		</Route>

		<Route path="posts/:id" component={ViewPost} />
		<Route path="*" component={NotFound} />
	</Route>
);
