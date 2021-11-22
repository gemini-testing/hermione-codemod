class Foo {
    browser: any;

    async fn() {
        await this.browser.foo();
        await this.browser.bar();
    }
}
