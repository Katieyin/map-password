import { PasswordSystemPage } from './app.po';

describe('password-system App', () => {
  let page: PasswordSystemPage;

  beforeEach(() => {
    page = new PasswordSystemPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
