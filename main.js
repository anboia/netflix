var fs = require('fs');
var webdriver = require('selenium-webdriver'),
    by = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until;
var FakeGenerator = require('./fake');

const url = "https://www.netflix.com/getstarted";

var fake;

var driver = new webdriver.Builder()
    .forBrowser('firefox')
    .build();

driver.manage().deleteAllCookies()

driver.get(url);

driver.findElement(by.css('button'))
.click()
.then( () => FakeGenerator.getFakeData() )
.then(
  function(val){
    // {cpf, cc, ag, email}
    fake = val;
    console.log(fake);
    driver.findElement(by.css('input[name=email]')).sendKeys(fake.email);
    driver.findElement(by.css('input[name=password]')).sendKeys('asdf');
    // driver.executeScript("document.querySelector('input[name=planChoice]').setAttribute('value', '10338')");
    return driver.findElement(by.css('button')).click()

  })
.then(function () {
    return driver.findElement(by.css('.paymentExpandoHd[data-mop-type=directDebitOption]')).click();
  })
.then(function () {
    driver.findElement(by.css('input[name=firstName]')).sendKeys('Walter');
    driver.findElement(by.css('input[name=lastName]')).sendKeys('White');
    driver.findElement(by.css('input[name=customerIdentification]')).sendKeys(fake.cpf);
    driver.findElement(by.css('select[name=bankChoice]')).sendKeys('bbb\n').then(function () {
        driver.findElement(by.css('input[name=branchCode]')).sendKeys(fake.ag);
        let cc = fake.cc.split('-');
        driver.findElement(by.css('input[name=accountNumber]')).sendKeys(cc[0]);
        driver.findElement(by.css('input[name=accountNumberCheckDigits]')).sendKeys(cc[1]);
        return driver.findElement(by.css('button')).click();
    });
  })
.then(function () {
  console.log("conta Criada! senha: asdf email: ", fake.email);

  setTimeout(
    function (){
      console.log("tchau");
      driver.quit();
    }, 180000
  );
})
.catch(function (e) {
  console.log(e);
});
