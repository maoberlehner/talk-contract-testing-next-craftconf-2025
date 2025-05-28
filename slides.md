---
theme: apple-basic
layout: statement
colorSchema: light
highlighter: shiki
drawings:
  persist: false
---

# Stop <span class="accent">E2E Testing</span><br>Your <span class="accent">Next.js</span> App!

<div class="leading-12">
Write Better Tests with Contract Tests
</div>

<!--
There are two common styles of writing tests for microservices-based applications:

1. Mock everything.
2. Mock nothing.

Both methodologies lead to suboptimal tests. In this talk, we explore how we can use OpenAPI specifications to create more reliable tests in sync with our microservices. At the same time, tests relying on OpenAPI specifications are less brittle than classic E2E tests.

First, we'll learn why we must adapt our strategies to the particular type of application we build. Then, we'll look into a concrete example of using contract testing and OpenAPI specifications to ensure we can effectively test our microservices and web applications. -->

<!--
- At my previous job we started building a new application based on SPAs and Microservices
-->

---
layout: intro
---

<ol class="leading-17">
  <li>Recognize the <strong>limits of mocking</strong> for production confidence.</li>
  <li v-click>Understand the crucial role of <strong>contracts in microservices</strong>.</li>
  <li v-click>Learn to <strong>apply contract testing principles to Next.js</strong>. </li>
</ol>

---
layout: statement
---

<h1><span class="accent">E2E Testing</span><br>is Fine!<span v-click>*</span></h1>
<div class="leading-12" style="font-size:0.65em;" v-after>
*When working on a <strong>monolithic</strong> application.
</div>

---
layout: statement
---

<img src="/images/monolithic-architecture.png" style="width:440px">

<!--
The monolith contains the schema so our tests that ensure production readiness
must test the whole application including the schema / DB and UI.
-->

---
layout: statement
---

<img src="/images/monolithic-architecture-test.png" style="width:620px">

---
layout: statement
---

<h1><span class="accent">Microservices</span><br>Change Everything!</h1>

---
layout: statement
---

<img src="/images/microservices-architecture.png" style="width:630px">

---
layout: statement
---

<div class="flex flex-col items-center justify-center gap-4">
  <iframe src='https://app.sli.do/event/uxaS7eopszBrQkPY1tLfFh/embed/polls/1f3ff64e-1cc7-40cb-9529-2e1ed7e1f2b3' width='400' height='260'></iframe>
  <img src="/images/qr-poll-microservices.svg" width="230">
</div>

---
layout: statement
---

<h1>Don't Do E2E Testing<br>with <span class="accent">Microservices!</span></h1>

---
layout: statement
---

<h1>But What To<br>Do <span class="accent">Instead?</span></h1>

---
layout: statement
---

<h1>How to Test<br><span class="accent">Microservice-Driven</span><br>Frontend Apps?</h1>

---
layout: statement
---

<h1>What About <span class="accent">Mocks?</span></h1>

---
layout: statement
---

<img src="/images/microservices-architecture-test-mocks.png" style="width:600px">

---
layout: intro
---

```ts {all|3-9}
// Mocking with Playwright
it('should be possible to remove an item', () => [
  await page.route('https://items.xyz.com/items', async route => {
    const json = [
      { name: 'Bread', id: 1 },
      { name: 'Butter', id: 2 },
    ];
    await route.fulfill({ json });
  });

  // ...
]);
```

---
layout: statement
---

<div class="flex flex-col items-center justify-center gap-4">
  <iframe src='https://app.sli.do/event/uxaS7eopszBrQkPY1tLfFh/embed/polls/bf81a329-d5ed-4eb1-8e25-5ec5d513675b' width='400' height='260'></iframe>
  <img src="/images/qr-poll-mocking.svg" width="230">
</div>

---
layout: statement
---

<img src="/images/green-tests.avif" style="width:600px">

---
layout: intro
---

```ts
app.get('/items', (c) => {
  return c.json([
    {
      name: 'Bread', // [!code --]
      title: 'Bread', // [!code ++]
      id: 1,
    },
  ]);
});
```

---
layout: statement
---

<img src="/images/green-tests.avif" style="width:600px">

---
layout: statement
---

<h1><span class="accent">Contract Testing</span><br>to the Rescue!</h1>

---
layout: statement
---

<img src="/images/contract-as-test.png" style="width:660px">

---
layout: statement
---

<h1><span class="accent">Contract Testing</span><br>For Microservices<br>is a Must!</h1>

---
layout: intro
---

<ul class="leading-17">
  <li>Microservices must be independently deployable.</li>
  <li v-click>E2E tests hinder independent deployments.</li>
  <li v-click>Without contracts, we can't deploy with confidence.</li>
</ul>

---
layout: statement
---

<h1>Demo</h1>

---
layout: statement
---

<img src="/images/shopping-list-architecture.svg" style="width:900px">

---
layout: statement
---

<h1>Using <span class="accent">Contracts</span><br>to Test Client Apps</h1>

---
layout: intro
---

<ul class="leading-17">
  <li style="text-decoration: line-through;">❌ E2E Tests</li>
  <li v-click>✅ Application Tests</li>
</ul>

---
layout: intro
---

<ul class="leading-17">
  <li>Run in a real browser.</li>
  <li v-click>Interact with the app like a real user.</li>
  <li v-click>Test the entire app, making real requests...</li>
  <li v-click>... but <strong>not</strong> to real services (but stubs)!</li> 
</ul>

---
layout: statement
---

<h1>Demo</h1>

---
layout: statement
---

<img src="/images/shopping-list-architecture.svg" style="width:900px">

---
layout: statement
---

<img src="/images/contract.svg" style="width:300px">

---
layout: statement
---

<img src="/images/contract-repository.svg" style="width:600px">

---
layout: statement
---

<img src="/images/contract-push.svg" style="width:900px">

---
layout: statement
---

<img src="/images/contract-pull.svg" style="width:900px">

---
layout: statement
---

<img src="/images/shopping-list-test-stub.svg" style="width:900px">

---
layout: statement
---

<h1>How Many Tests?<br><span class="accent">Which Types?</Span></h1>

---
layout: statement
---

<img src="/images/test-pyramid.png" style="width:600px">

<p class="footnote">The Practical Test Pyramid, Ham Vocke<br>https://martinfowler.com/articles/practical-test-pyramid.html</p>

---
layout: statement
---

<h1><span class="accent">Write Tests.</span><br>Not Too Many.<br>Mostly Integration.</h1>

<p class="footnote">Guillermo Rauch<br>https://kentcdodds.com/blog/write-tests</p>

---
layout: statement
---

<h1><span class="accent">Write Tests.</span><br>Not Too Many.<br><span class="line-through">Mostly Integration</span>.<br>Mostly Application.</h1>

---
layout: statement
---

<img src="/images/testing-trophy.jpg" style="width:380px">

<p class="footnote">The Testing Trophy, Kent C. Dodds<br>https://x.com/kentcdodds/status/960723172591992832</p>

---
layout: statement
---

<img src="/images/ui-testing-pyramid.png" style="width:520px">

---
layout: statement
---

<h1><span class="accent">Mocking</span> Creates<br>False Confidence!</h1>

---
layout: statement
---

<h1>Don't Do E2E Testing<br>with <span class="accent">Microservices!</span></h1>

---
layout: statement
---

<h1>Use <span class="accent">Contract-Based Stubs</span><br>to Test Next.js Apps!</h1>

---
layout: statement
---

<h1><span class="accent">Write Tests.</span><br>Not Too Many.<br>Mostly Application.</h1>

---
layout: intro
---

<div class="leading-8">
  <span class="font-extrabold">Markus Oberlehner</span><br>
  <span style="font-size:0.5em;">Software Engineer @ Austrian Federal Computing Centre</span>
</div>

<img src="/images/qr.svg" style="width:280px;position:absolute;top:36px;right:36px;">

<div class="leading-17 mt-10">
  🦋 <a href="https://bsky.app/profile/markus.oberlehner.net">@markus.oberlehner.net</a><br>
  📚 <a href="https://goodvuetests.com">goodvuetests.com</a><br><br>
  <small><a href="https://github.com/maoberlehner/talk-contract-testing-next-craftconf-2025">github.com/maoberlehner/talk-contract-testing-next-craftconf-2025</a></small>
</div>
