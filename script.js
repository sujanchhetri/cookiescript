const puppeteer = require("puppeteer");
const fs = require("fs");
const config = require("./config.json");
const { Interface } = require("readline");

async function loginUser(options) {
  try {
    //* start puppeteer and creates a new page
    let browser = await puppeteer.launch({
      args: ["--start-maximized"],
      headless: false,
    });
    let page = await browser.newPage();

    await page.setViewport({ width: 1366, height: 768 });

    await page.goto("https://sentinel.zerodha.com/", {
      waitUntil: "networkidle0",
    });

    //* brings login page
    await page.click('a[href="/login"]', { delay: 30 });

    //* brings google login page
    await page.click('a[href="/api/accounts/google/login/"]', { delay: 30 });

    //* adds email
    await page.waitForSelector('input[id="identifierId"]');
    await page.type('input[id="identifierId"]', options.mail, {
      delay: 30,
    });

    await page.click("#identifierNext");

    //* adds password
    await page.waitForSelector('input[type="password"]', { visible: true });
    await page.type('input[type="password"]', options.password);

    await page.waitForSelector("#passwordNext", { visible: true });
    await page.click("#passwordNext");

    //* wait for dashboard to complete
    await page.waitForSelector(".trigger-dashboard", { visible: true });

    //* get the current browser page session
    let currentCookies = await page._client.send("Network.getAllCookies");

    //* creates a cookie file to store the session
    fs.writeFileSync(`./cookies/cookies-${options.index}.json`, JSON.stringify(currentCookies));

    //* close the browser
    await browser.close();
    
  } catch (e) {
    console.log(e);
  }
}


let main = async () => {
  user1 = loginUser({mail : config.mail1, password: config.password, index: 1});
  user2 = loginUser({mail : config.mail2, password: config.password, index: 2});
  user3 = loginUser({mail : config.mail3, password: config.password, index: 3});
  await Promise.all([user1, user2, user3]);
}

main().then(()=> {
  console.log("Successfull!");
}).catch((e)=>{
  console.log(`Failed due to exception - ${e}`);
})