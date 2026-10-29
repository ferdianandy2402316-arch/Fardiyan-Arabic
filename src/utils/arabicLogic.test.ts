import test from 'node:test';
import assert from 'node:assert/strict';
import { checkNaatAgreement, calculateQuizScore, filterMufrodat, MufrodatItem } from './arabicLogic';

test('checkNaatAgreement accepts matching mudzakkar nakirah', () => {
  const result = checkNaatAgreement('mudzakkar', 'mudzakkar', false, false);
  assert.equal(result.isValid, true);
});

test('checkNaatAgreement rejects gender mismatch', () => {
  const result = checkNaatAgreement('mudzakkar', 'muannats', false, false);
  assert.equal(result.isValid, false);
  assert.match(result.message, /jenis/);
});

test('checkNaatAgreement rejects definiteness mismatch', () => {
  const result = checkNaatAgreement('muannats', 'muannats', true, false);
  assert.equal(result.isValid, false);
  assert.match(result.message, /alif-lam/);
});

test('calculateQuizScore awards Mumtaz for >= 90%', () => {
  const result = calculateQuizScore(10, 10);
  assert.equal(result.score, 100);
  assert.equal(result.passed, true);
  assert.match(result.arabicPraise, /مُمْتَازٌ/);
});

test('calculateQuizScore awards Jayyid Jiddan for 80%', () => {
  const result = calculateQuizScore(5, 4);
  assert.equal(result.score, 80);
  assert.equal(result.passed, true);
  assert.match(result.arabicPraise, /جَيِّدٌ جِدًّا/);
});

test('filterMufrodat matches Indonesian and Latin terms', () => {
  const sampleData: MufrodatItem[] = [
    {
      id: '1',
      arabic: 'جَبَلٌ',
      latin: 'Jabalun',
      indonesian: 'Gunung',
      category: 'gunung',
      gender: 'mudzakkar',
      sampleSentence: 'هَذَا جَبَلٌ عَالٍ',
      sentenceTranslation: 'Ini adalah gunung yang tinggi',
      iconName: 'Mountain',
    },
    {
      id: '2',
      arabic: 'بَحْرٌ',
      latin: 'Bahrun',
      indonesian: 'Laut',
      category: 'pantai',
      gender: 'mudzakkar',
      sampleSentence: 'الْبَحْرُ وَاسِعٌ',
      sentenceTranslation: 'Laut itu luas',
      iconName: 'Waves',
    },
  ];

  const res1 = filterMufrodat(sampleData, 'gunung');
  assert.equal(res1.length, 1);
  assert.equal(res1[0].id, '1');

  const res2 = filterMufrodat(sampleData, 'Bahrun');
  assert.equal(res2.length, 1);
  assert.equal(res2[0].id, '2');
});
