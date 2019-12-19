import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';

import { ChatRoom } from '../../../models';
import { t, roomTypes } from '../../../utils';
import resetSelection from '../resetSelection';
import { fireGlobalEvent } from '../../../ui-utils';

Template.createActivityInstructions.helpers({
	roomName() {
		const room = ChatRoom.findOne(Session.get('openedRoom'));
		return room && roomTypes.getRoomName(room.t, room);
	},
	selectedMessages() {
		return Template.instance().selectedMessages.get();
	},
	errorMessage() {
		return Template.instance().errorMessage.get();
	},
});

Template.createActivityInstructions.events({
	'click .js-cancel, click .mail-messages__instructions--selected'(e, t) {
		t.reset(true);
	},
	'click .js-send'(e, instance) {
		const { selectedMessages, selectedMessagesHtml } = instance;
		const subject = instance.$('[name="subject"]').val();

		if (!selectedMessages.get().length) {
			instance.errorMessage.set(t('Mail_Message_No_messages_selected_select_all'));
			return false;
		}

		const messages = Object.values(selectedMessagesHtml);
		const sortedByDate = messages.sort((a, b) => a.timestamp - b.timestamp);

		const renderMessage = function(message) {
			return `
				<tr>
					<td>${ message.time }</td>
					<td>${ message.wholeName }</td>
					<td>${ message.body }</td>
				</tr>
			`;
		};

		const html = `
		<br />
			<table  style='border:none' cellspacing='5' cellpadding='5' border='0'>
			 ${ sortedByDate.map(renderMessage).join('') }
			</table>
			<span></span>
		`;
		const elem = document.createElement('div');
		elem.innerHTML = html;
		elem.querySelectorAll('.copyonly').forEach((r) => r.remove());
		const body = elem.innerHTML;
		
		fireGlobalEvent('create-activity', { subject, body });
		instance.reset(true);
	},
});

Template.createActivityInstructions.onRendered(function() {
	const { selectedMessages, selectedMessagesHtml } = this;
	$('.messages-box .message').on('click', function() {
		const { id } = this;
		const messages = selectedMessages.get();
		if ($(this).hasClass('selected')) {
			delete selectedMessagesHtml[id];
			selectedMessages.set(messages.filter((message) => message !== id));
		} else {
			const wholeName = this.querySelector('.user').innerText;
			const time = this.querySelector('time').getAttribute('title');
			const timestamp = +this.getAttribute('data-timestamp');
			const body = this.querySelector('.body').innerHTML;
			selectedMessagesHtml[id] = { wholeName, time, timestamp, body };
			selectedMessages.set(messages.concat(id));
		}
	});
});

Template.createActivityInstructions.onCreated(function() {
	resetSelection(true);

	this.selectedMessages = new ReactiveVar([]);
	this.selectedMessagesHtml = {};
	this.errorMessage = new ReactiveVar('');

	this.reset = (bool) => {
		this.selectedMessages.set([]);
		this.selectedMessagesHtml = {};
		this.errorMessage.set('');
		resetSelection(bool);
	};
});

Template.createActivityInstructions.onDestroyed(function() {
	Template.instance().reset(false);
});
