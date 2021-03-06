/* eslint-env browser */
/* global chrome */

import render from '../../common/popup/render';
import '../../common/popup/popup.scss';

const { extension } = chrome;
const background = extension.getBackgroundPage();

function pbcopy(text) {
  const input = document.createElement('textarea');
  input.textContent = text;
  document.body.appendChild(input);
  input.select();
  document.execCommand('copy');
  document.body.removeChild(input);
}

function close() {
  window.close();
}

function grab(text) {
  pbcopy(text);
  close();
}

function openext() {
  return true;
}

function load() {
  background.getTickets((tickets) => {
    render(tickets, { grab, openext });
  });
}

window.onload = load;
