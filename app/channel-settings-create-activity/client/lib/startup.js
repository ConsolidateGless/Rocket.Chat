import { Meteor } from 'meteor/meteor';

import { TabBar } from '../../../ui-utils';

Meteor.startup(() => {
	TabBar.addButton({
		groups: ['channel', 'group', 'direct'],
		id: 'create-activity',
		anonymous: true,
		i18nTitle: 'Create_Activity',
		icon: 'mail',
		template: 'createActivityInstructions',
		order: 10,
	});
});
