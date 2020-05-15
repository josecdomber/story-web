import { LitElement, html, css } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';
import '../node_modules/hammerjs/hammer.js';

/**
 * `LowerCaseDashedName` Description
 *
 * StoryViewer
 * @polymer
 * @demo
 * 
 */
export class StoryViewer extends LitElement {
  static get properties() {
    return {
      _index: { type: Number },
      _panData: { type: Object }
    }
  }

  /**
   * Instance of the element is created/upgraded. Use: initializing state,
   * set up event listeners, create shadow dom.
   * @constructor
   */
  constructor() {
    super();
    this._index = 0;
    this._panData = {
      isFinal: Boolean,
      deltaX: Number
    };
    new Hammer(this).on('pan', e => this._panData = e);
  }

  get index() {
    return this._index
  }
  set index(value) {
    this.children[this._index].dispatchEvent(new CustomEvent('exited'));
    this.children[value].dispatchEvent(new CustomEvent('entered'));
    this._index = value
  }


  static get styles() {
    return [
      css`
      :host {
        display: block;
        position: relative;
        align-items: center;
        width: 300px;
        height: 800px;
      }
      ::slotted(*) {
        position: absolute;
        width: 100%;
        height: calc(100% - 20px);
        transition: transform 0.35s ease-out;
      }
  
      svg {
        position: absolute;
        top: calc(50% - 25px);
        height: 50px;
        cursor: pointer;
      }
      #next {
        right: 0;
      }
  
      #progress {
        position: relative;
        top: calc(100% - 20px);
        height: 20px;
        width: 50%;
        margin: 0 auto;
        display: grid;
        grid-auto-flow: column;
        grid-auto-columns: 1fr;
        grid-gap: 10px;
        align-content: center;
      }
      #progress > div {
        background: grey;
        height: 4px;
        transition: background 0.3s linear;
        cursor: pointer;
      }
      #progress > div.watched {
        background: white;
      }
      `,
    ];
  }

  /**
   * Implement to describe the element's DOM using lit-html.
   * Use the element current props to return a lit-html template result
   * to render into the element.
   */
  render() {
    return html`
      <slot></slot>
      <svg id="prev" viewBox="0 0 10 10" @click=${e => this.previous()}>
        <path d="M 6 2 L 4 5 L 6 8" stroke="#fff" fill="none" />
      </svg>
      <svg id="next" viewBox="0 0 10 10" @click=${e => this.next()}>
        <path d="M 4 2 L 6 5 L 4 8" stroke="#fff" fill="none" />
      </svg>
      <div id="progress">
          ${Array.from(this.children).map((_, i) => html`
            <div
              class=${classMap({ watched: i <= this.index })}
              @click=${_ => this.index = i}
            ></div>`
    )}
      </div>
      `;
  }

  firstUpdated() {
    this.children[this._index].dispatchEvent(new CustomEvent('entered'));
  }

  // Update is called whenever an observed property changes.
  update(changedProperties) {
    // deltaX is the distance of the current pan gesture.
    // isFinal is whether the pan gesture is ending.
    let { deltaX = 0, isFinal = false } = this._panData;
    // When the pan gesture finishes, navigate.
    if (!changedProperties.has("_index") && isFinal) {
      deltaX > 0 ? this.previous() : this.next()
    }
    // We don't want any deltaX when releasing a pan.
    deltaX = (isFinal ? 0 : deltaX)
    const width = this.clientWidth

    const minScale = 0.8;

    Array.from(this.children).forEach((el, i) => {
      // Updated this line to utilize deltaX.
      const x = (i - this.index) * width + deltaX;

      // Piecewise scale(deltaX), looks like: __/\__
      const u = deltaX / width + (i - this.index);
      const v = -Math.abs(u * (1 - minScale)) + 1;
      const scale = Math.max(v, minScale);
      // Include the scale transform
      el.style.transform = `translate3d(${x}px,0,0)`
    });

    // Don't forget to call super!
    super.update(changedProperties)
  }

  /** Advance to the next story card if possible **/
  next() {
    this.index = Math.max(0, Math.min(this.children.length - 1, this.index + 1));
  }

  /** Go back to the previous story card if possible **/
  previous() {
    this.index = Math.max(0, Math.min(this.children.length - 1, this.index - 1));
  }

}

customElements.define('story-viewer', StoryViewer);