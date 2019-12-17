import { Meteor } from 'meteor/meteor';

import { TabBar } from '../../../ui-utils';
import { hasAllPermission } from '../../../authorization';

Meteor.startup(() => {
	TabBar.addButton({
		groups: ['channel', 'group', 'direct'],
		id: 'create-activity',
		anonymous: true,
		i18nTitle: 'Create_Activity',
		icon: 'mail',
		template: 'createActivityInstructions',
		order: 10,
		condition: () => hasAllPermission('mail-messages'),
	});
});
