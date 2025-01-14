import { test, expect } from '../../fixtures.js';
import { openForm } from '../../utils.js';

const emoji = ['😢', '😊'];
let rating = null;
let requestPayload = null;

const selector = {
  ratingComponent: '.rating.hover',
  ratingStar: '.rating.hover span[class*=star]',
  emoji: '.rating.hover span.emoji',
};

const starsSelected = 'star hover selected';

test.describe('custom component validation', () => {
  // const testURL = '/drafts/tests/x-walk/ratingvalidation';
  const testURL = 'https://main--aem-boilerplate-forms--adobe-rnd.aem.live/content/aem-boilerplate-forms-xwalk-collaterals/rating-component';

  test('rating custom component validation @chromium-only', async ({ page }) => {
    await openForm(page, testURL);

    await page.evaluate(async () => {
      // eslint-disable-next-line no-undef,no-underscore-dangle
      myForm._jsonModel.action = 'https://main--aem-boilerplate-forms--adobe-rnd.aem.live/adobe/forms/af/submit/L2NvbnRlbnQvYWVtLWJvaWxlcnBsYXRlLWZvcm1zLXh3YWxrLWNvbGxhdGVyYWxzL3JhdGluZy1jb21wb25lbnQvamNyOmNvbnRlbnQvcm9vdC9zZWN0aW9uXzAvZm9ybQ==';
    });

    // listeners to fetch payload form submission.
    page.on('request', async (request) => {
      requestPayload = request.postData();
    });

    const ratingLocator = page.locator(selector.ratingComponent);
    await expect(ratingLocator).toBeVisible();
    await ratingLocator.hover();
    const elements = await page.$$(selector.ratingStar);

    // eslint-disable-next-line no-restricted-syntax
    for (const [index, element] of elements.entries()) {
      // eslint-disable-next-line no-await-in-loop
      await element.click();
      // eslint-disable-next-line no-await-in-loop
      const className = await element.getAttribute('class');
      // eslint-disable-next-line no-await-in-loop
      await expect(className).toBe(starsSelected);
      // eslint-disable-next-line no-await-in-loop
      const emojiValue = await page.locator(selector.emoji).textContent();
      // eslint-disable-next-line no-await-in-loop
      await expect(emojiValue).toBe(index < 3 ? emoji[0] : emoji[1]);
      rating = index + 1;
    }
    await page.getByRole('button', { name: 'Submit' }).click();
    expect(requestPayload.includes(rating)).toBeTruthy();
  });
});
