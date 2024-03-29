import React, { PropTypes } from 'react';
import data from 'decorators/data';

const PostComment = ({ comment, data: author }) => (
	<div>
		<header>
			Comment by: {author.username}
		</header>

		{comment.content}
	</div>
);

PostComment.propTypes = {
	data: PropTypes.object.isRequired,
	comment: PropTypes.object.isRequired
};

export default data(({ comment }) => `users/${comment.uid}`)(PostComment);
