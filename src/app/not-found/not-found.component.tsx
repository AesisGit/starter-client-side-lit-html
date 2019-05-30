import { html, customElement } from 'lit-element';
import { BaseComponent } from '../shared/base.component';
import { Component } from '@rxdi/core';

@customElement('not-found-component')
@Component()
class NotFoundComponent extends BaseComponent {
  render() {
    return html`
      <h1>Not found component!</h1>
      <p>
        Please check your URL.
      </p>
    `;
  }
}