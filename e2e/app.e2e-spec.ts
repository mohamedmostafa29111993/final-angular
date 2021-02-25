import { PlanningTemplatePage } from './app.po';

describe('Planning App', function() {
  let page: PlanningTemplatePage;

  beforeEach(() => {
    page = new PlanningTemplatePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
