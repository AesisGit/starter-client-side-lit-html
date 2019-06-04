# @rxdi/starter-client-lit-html
## Starter project with graphql, lit-html, apollo-boost, @vaadin/router, @webcomponents/custom-elements based on @rxdi/core
## Powerful Dependency Injection inside Browser and Node using Typescript and RXJS 6
***
> The idea behind [@rxdi](https://github.com/rxdi) is to create independent, dependency injection that can be used everywhere,
> Node and Browser with purpose also to share the same code without chainging nothing!
> First steps where with platform called [@gapi](https://github.com/Stradivario/gapi) you can check repository [@gapi/core](https://github.com/Stradivario/gapi-core).
> Then because of the needs of the platform i decided to develop this Reactive Dependency Injection container helping me build progressive applications.
> Hope you like my journey!
> Any help and suggestions are appreciated!
Main repository [@rxdi/core](https://github.com/rxdi/core) 
***
### Installation and basic examples:

##### To start developing, run:

```bash
git clone https://github.com/rxdi/starter-client-lit-html
```
##### Install modules:

```bash
npm install
```

##### Optional
Using VSCode there are extensions helping productivity with lit-html

[lit-plugin](https://marketplace.visualstudio.com/items?itemName=runem.lit-plugin)
```bash
code --install-extension runem.lit-plugin
```

[lit-html](https://marketplace.visualstudio.com/items?itemName=bierner.lit-html)
```bash
code --install-extension bierner.lit-html
```


##### Using `@gapi/cli` schematics

```bash
npm i -g @gapi/cli
```

`gapi generate [name]` generates the specified schematic


## Available Schematics:
* controller
* type
* directive
* guard
* module
* provide
* service

## Options
`--dry-run (alias: -d)` 

`--force (alias: -f)`




##### Running App

For starting and building application we will use Parcel a new configuration-less web bundler [ParcelJS](https://parceljs.org/)

To install parcel type:

```bash
npm install -g parcel-bundler
```

##### Start App
```bash
parcel ./src/index.html
```

##### Build App
```bash
parcel build ./src/index.html
```

## Simplest app



#### Main starting point

src/main.ts
```typescript
import { Bootstrap } from '@rxdi/core';
import { AppModule } from './app/app.module';

window.addEventListener('load', () => {
  Bootstrap(AppModule, {
    init: false,
  }).subscribe(() => console.log('App Started!'), err => console.error(err));
});

if (module['hot']) {
  module['hot'].dispose(() => (document.body.innerHTML = ''));
}
```

#### App Module

src/app/app.module.ts

```typescript
import { Module } from '@rxdi/core';
import { GraphqlModule } from '@rxdi/graphql-client';
import { RouterModule } from '@rxdi/router';
import { DOCUMENTS } from './@introspection/documents';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { Components } from './shared/components';
import { State } from './app.state';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';

@Module({
  components: [
    NavbarComponent,
    HomeComponent,
    FooterComponent
  ],
  imports: [
    GraphqlModule.forRoot(
      {
        uri: 'https://questups.com/api/graphql'
      },
      DOCUMENTS
    ),
    RouterModule.forRoot<Components>([
      {
        path: '/',
        component: 'home-component'
      },
      {
        path: '/about',
        component: 'about-component',
        action: () => import('./about/about.component')
      },
      {
        path: '(.*)',
        component: 'not-found-component',
        action: () => import('./not-found/not-found.component')
      }
      //   { path: '/users/:user', component: 'x-user-profile' },
    ], { log: true })
  ],
  bootstrap: [AppComponent],
  providers: [State],
})
export class AppModule {}

```


#### Base component

```typescript
import { GraphqlElement } from './graphql.component';

export class BaseComponent extends GraphqlElement {
  createRenderRoot() {
    return this;
  }
}

```


#### index.html shoud have defined `body` tag since `app-component` will be rendered inside

```html
<body></body>
```


#### When RouterModule is set we can put our component `<router-component></router-component>` inside `AppComponent`
Inside `header` and `footer` you can insert component which will be rendered with `unsafeHTML(html'<navbar-component></navbar-component>')` after the Router is initialized.

```html
<router-outlet
  header="<navbar-component></navbar-component>"
  footer="<footer-component></footer-component>"
>
</router-outlet>
```

> Note! Components needs to be bootstraped inside `AppModule` before using them or nothing will be rendered

> Another way of importing modules is directly inside the Component `import './your.component.ts';`;

```typescript
@Module({
  components: [
    NavbarComponent,
    FooterComponent,
    HomeComponent,
  ],
})
export class AppModule {}
```

#### App Component
src/app/app.component.tsx

```typescript
import { html, render } from 'lit-html';
import { customElement } from '@rxdi/lit-html';
import { State } from './app.state';
import { Inject } from '@rxdi/core';

import '@rxdi/router';
import './footer/footer.component';
import './navbar/navbar.component';

@customElement('app-component')
export class AppComponent extends HTMLElement {
  @Inject(State) private state: State;

  OnInit() {
    render(
      html`
        <navbar-component></navbar-component>
        <router-outlet></router-outlet>
        <footer-component></footer-component>
      `,
      document.body
    );
  }
}
```


#### Navbar component
```typescript
import { html, property, eventOptions, css, LitElement } from 'lit-element';
import { Router, Outlet } from '@rxdi/router';
import { customElement } from '@rxdi/lit-html';

@customElement('navbar-component', {
  style: css`
    .spacer {
      flex: 1 3 auto;
    }
    .container {
      display: flex;
    }
    ul {
      list-style-type: none;
      margin: 0;
      padding: 0;
      overflow: hidden;
      background-color: #f3f3f3;
      cursor: pointer;
    }

    li {
      float: left;
    }

    li a {
      display: block;
      color: #666;
      text-align: center;
      padding: 14px 16px;
      text-decoration: none;
    }

    li a:hover:not(.active) {
      background-color: #ddd;
    }

    li a.active {
      color: white;
      background-color: #4caf50;
    }
  `,
  template(this: NavbarComponent) {
    return html`
      <ul class="container">
        <li><a @click=${() => this.router.go('/')}>Home</a></li>
        <li><a @click=${() => this.router.go('/about')}>About</a></li>
        <span class="spacer"></span>
        <li><a @click=${this.onIncrement}>Increment</a></li>
        <li><a @click=${this.onDecrement}>Decrement</a></li>
        <li><a>${this.counter}</a></li>
      </ul>
    `;
  }
})
export class NavbarComponent extends LitElement {
  @property() counter = 0;

  @Router() router: Outlet;

  @eventOptions({ capture: true })
  onIncrement(e: Event) {
    this.counter++;
  }

  @eventOptions({ capture: true })
  onDecrement(e: Event) {
    this.counter--;
  }
}
```


#### About Component
src/app/app.component.tsx

```typescript
import { html } from 'lit-element';
import { customElement } from '@rxdi/lit-html';
import { timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { subscribe } from 'lit-rx';

@customElement('about-component', {
  template(this: AboutComponent) {
    return html`
    <header>
      <h1>About</h1>
    </header>
     ${subscribe(this.timer)}
    <p>
    <img src="https://www.w3schools.com/html/pic_trulli.jpg" alt="Italian Trulli">
    </p>
    `;
  }
})
export class AboutComponent extends HTMLElement {
  private timer = timer(1, 1000).pipe(map(v => v));

  OnInit() {
    console.log('About component init');
  }

  OnDestroy() {
    console.log('About component destroyed');
  }

}
```


#### Home Component
src/app/home/home.component.tsx

```typescript
import { html } from 'lit-element';
import { BaseComponent } from '../shared/base.component';
import { customElement, OnInit, OnDestroy, OnUpdate } from '@rxdi/lit-html';
import { timer, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { subscribe } from 'lit-rx';

@customElement('home-component', {
  template(this: HomeComponent) {
    return html`
      <header>
        <h1>Hello world</h1>
      </header>
      <img
        src="https://www.w3schools.com/html/img_girl.jpg"
        alt="Italian Trulli"
      />
      <p>
        Server status
        ${subscribe(this.getServerStatus().pipe(map(res => res.status.status)))}
      </p>
      <p>${subscribe(timer(100, 1000).pipe(map(() => new Date())))}</p>
      <p>
        Crowdsale info
        ${subscribe(
          from(this.getServerStatus()).pipe(
            map(res => JSON.stringify(res.getCrowdsaleInfo, null, 4))
          )
        )}
      </p>
    `;
  }
})
export class HomeComponent extends BaseComponent implements OnInit, OnDestroy, OnUpdate {
  OnInit() {
    console.log('Home component init');
  }

  OnDestroy() {
    console.log('Home component destroyed');
  }

  OnUpdate() {
    console.log('Home component updated');
  }

  subscription() {
    return this.subscribe({ query: 'home.subscription.graphql' });
  }

  getServerStatus() {
    return this.query({ query: 'home.query.graphql' }).pipe(
      map(res => res.data)
    );
  }
}

```


#### Home Graphql queries
Batch of `getCrowdsaleInfo` and `status` queries
```graphql
query {
  status {
    status
  }
  getCrowdsaleInfo {
    startTime
    endTime
    hasEnded
    token
    weiRaised
    wallet
  }
}
```
subscribeToUserMessagesBasic
```graphql
subscription {
  subscribeToUserMessagesBasic {
    message
  }
}
```



#### Footer component

```typescript
import { html, css } from 'lit-element';
import { customElement } from '@rxdi/lit-html';

@customElement('footer-component', {
  useShadow: true,
  style: css`
    .footer {
      position: fixed;
      left: 0;
      bottom: 0;
      width: 100%;
      background-color: #03a9f4;
      color: white;
      text-align: center;
    }
  `,
  template() {
    return html`
      <div class="footer">
        <p>Footer</p>
      </div>
    `;
  }
})
export class FooterComponent extends HTMLElement {}
```

#### Not fund component

```typescript
import { html } from 'lit-element';
import { customElement } from '@rxdi/lit-html';

@customElement('not-found-component', {
  template: () => html`
    <h1>Not found component!</h1>
    <p>Please check your URL.</p>
  `
})
export class NotFoundComponent extends HTMLElement {}
```

#### Graphql Component

```typescript
import { Injector } from '@rxdi/core';
import { LitElement } from 'lit-element';
import { GraphqlClient } from '@rxdi/graphql-client';
import {
  QueryOptions,
  MutationOptions,
  SubscriptionOptions
} from 'apollo-boost';
import { importQuery } from '@rxdi/graphql-client/dist/graphql-helpers';
import { DocumentTypes } from '../@introspection/documentTypes';
import { from, Observable } from 'rxjs';
import { IQuery, IMutation, ISubscription } from '../@introspection';

interface ImportQueryMixin extends QueryOptions {
  query: DocumentTypes;
}

interface ImportSubscriptionMixin extends SubscriptionOptions {
  query: DocumentTypes;
}

interface ImportMutationMixin extends MutationOptions {
  mutation: DocumentTypes;
}

export class GraphqlComponent extends LitElement {

  @Injector(GraphqlClient) public graphql: GraphqlClient;

  query<T = IQuery>(options: ImportQueryMixin) {
    options.query = importQuery(options.query);
    return from((this.graphql.query.bind(this.graphql)(options) as any)) as Observable<{ data: T }>;
  }

  mutate<T = IMutation>(options: ImportMutationMixin) {
    options.mutation = importQuery(options.mutation);
    return from((this.graphql.mutate.bind(this.graphql)(options) as any)) as Observable<{ data: T }>;
  }

  subscribe<T = ISubscription>(options: ImportSubscriptionMixin) {
    options.query = importQuery(options.query);
    return from((this.graphql.subscribe.bind(this.graphql)(options) as any)) as Observable<{ data: T }>;
  }
}
```



#### Components.ts 
List of all components inside the platform.

```typescript

function strEnum<T extends string>(o: Array<T>): {[K in T]: K} {
    return o.reduce((res, key) => {
        res[key] = key;
        return res;
    }, Object.create(null));
}
export const Components = strEnum([
    'app-component',
    'not-found-component',
    'navbar-component',
    'home-component',
    'about-component'
]);
export type Components = keyof typeof Components;

```
