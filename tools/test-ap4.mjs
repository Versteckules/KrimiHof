global.window = { location: { search: '' } };
import { getTimelockInfoForDate, getCurrentTimelockStatus, getNext7DaysPreview } from '../js/timelock.js';
import { getCurrentTime } from '../js/clock.js';

console.log('--- AP4 TIMELOCK TESTS ---');
const now = getCurrentTime();
console.log(`Current Time: ${now.toLocaleString('de-DE')}`);

const status = getCurrentTimelockStatus();
console.log(`isPlayable: ${status.isPlayable}`);
console.log(`startTime: ${status.startTime.toLocaleString('de-DE')}`);
console.log(`endTime: ${status.endTime ? status.endTime.toLocaleString('de-DE') : 'none'}`);
console.log(`nextStartTime: ${status.nextStartTime.toLocaleString('de-DE')}`);

console.log('\n7-Day Preview:');
const preview = getNext7DaysPreview();
preview.forEach((p, i) => {
  console.log(`Day ${i}: ${p.date.toLocaleDateString('de-DE')} - Start: ${p.startTime.toLocaleString('de-DE')}`);
});
console.log('\nSUCCESS: Test script executed without errors.');
