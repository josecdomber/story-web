import { LitElement, html, css, } from 'lit-element';

/**
 * `LowerCaseDashedName` Description
 *
 * @customElement
 * story-card
 * 
 * 
 */
export class StoryCard extends LitElement {
  static get properties() {
    return {
      _mediaSlot: {type: Array}
    }
  }

  /**
   * Instance of the element is created/upgraded. Use: initializing state,
   * set up event listeners, create shadow dom.
   * @constructor
   */
  constructor() {
    super();
        
    this.addEventListener("entered", () => {
      if (this._slottedMedia) {
        this._slottedMedia.currentTime = 0;
        this._slottedMedia.play();
      }
    });

    this.addEventListener("exited", () => {
      if (this._slottedMedia) {
        this._slottedMedia.pause();
      }
    });
  }

  static get styles() {
    return [
      css`
      #media {
        height: 100%;
      }
      #media ::slotted(*) {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
  
      /* Default styles for content */
      #content {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        padding: 48px;
        font-family: sans-serif;
        color: white;
        font-size: 24px;
      }
      #content > slot::slotted(*) {
        margin: 0;
      }
      `,
    ];
  }

  firstUpdated() {
    this._mediaSlot = this.renderRoot.querySelector("slot[name=media]");
  }


  /**
  * The element in the "media" slot, ONLY if it is an
  * HTMLMediaElement, such as <video>.
  */
  get _slottedMedia() {
    const el = this._mediaSlot && this._mediaSlot.assignedNodes()[0];
    return el instanceof HTMLMediaElement ? el : null;
  }

  render() {
    return html`
      <div id="media">
        <slot name="media"></slot>
      </div>
      <div id="content">
        <slot></slot>
      </div>
    `;
  }

}

customElements.define('story-card', StoryCard);