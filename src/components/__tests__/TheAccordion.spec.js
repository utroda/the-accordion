import { describe, it, expect, beforeEach } from 'vitest'

import { shallowMount } from '@vue/test-utils'
import TheAccordion from '../TheAccordion.vue'

const defaultProps = () => ({
  sections: [
    { slug: 's1', heading: 'Section 1', content: 'Content 1' },
    { slug: 's2', heading: 'Section 2', content: 'Content 2' },
    { slug: 's3', heading: 'Section 3', content: 'Content 3' },
  ],
});

describe('TheAccordion', () => {
  let wrapper;
  let vm;

  const render = (props = {}) => {
    wrapper = shallowMount(TheAccordion, {
      attachTo: document.body, // Needed with shallowMount
      propsData: { ...defaultProps(), ...props },
    });
    vm = wrapper.vm;
  };

  beforeEach(() => {
    render();
  });

  describe('Rendering', () => {
    it('renders properly', () => {
      const group = wrapper.find('[data-test-id="accordion-group"]');
      const sections = wrapper.findAll('.accordion');

      expect(group.exists()).toBe(true);
      expect(sections.length).toBe(3);
    })

    it('should have the correct number of panels', () => {
      const panels = wrapper.findAll('.accordion-panel');
      expect(panels.length).toBe(3);
    })

    it('should have the correct number of buttons', () => {
      const buttons = wrapper.findAll('.accordion-button');
      expect(buttons.length).toBe(3);
    })

    it('should render the correct heading element', () => {
      render({ headingAs: 'h2' });

      const headings = wrapper.findAll('h2');
      expect(headings.length).toBe(3);
    })

    it('should render with an initial opened section', async () => {
      render({ initialOpen: 's2' });

      await vm.$nextTick();

      const panels = wrapper.findAll('.accordion-panel');
      expect(panels.at(1).isVisible()).toBe(true);
    })
  })

  describe('Behavior', () => {
    let panel;
    let button;

    beforeEach(() => {
      panel = wrapper.find('.accordion-panel');
      button = wrapper.find('.accordion-button');
    });

    
    describe('Mouse Interactions', () => {
      it('should show the panel when a button is clicked', async () => {
        expect(panel.isVisible()).toBe(false);

        await button.trigger('pointerup');

        expect(panel.isVisible()).toBe(true);
      })

      it('should close an opened panel when their respective button is clicked', async () => {
        await button.trigger('pointerup');

        expect(panel.isVisible()).toBe(true);

        await button.trigger('pointerup');

        expect(panel.isVisible()).toBe(false);
      })
    })

    describe('Keyboard Navigation', () => {
      describe('Space Key', () => {
        it('should be possible to show a panel when the Space key is pressed on the respective button', async () => {
          expect(panel.isVisible()).toBe(false);

          await button.trigger('focus');
          await button.trigger('keydown', { code: 'Space' });

          expect(panel.isVisible()).toBe(true);
        })

        it('should be possible to close an already opened panel when the Space key is pressed on the respective button', async () => {
          await button.trigger('pointerup');

          expect(panel.isVisible()).toBe(true);

          await button.trigger('focus');
          await button.trigger('keydown', { code: 'Space' });

          expect(panel.isVisible()).toBe(false);
        })
      })

      describe('Enter Key', () => {
        it('should be possible to show a panel when the Enter key is pressed on the respective button', async () => {
          expect(panel.isVisible()).toBe(false);

          await button.trigger('focus');
          await button.trigger('keydown', { code: 'Enter' });

          expect(panel.isVisible()).toBe(true);
        })

        it('should be possible to close an already opened panel when the Enter key is pressed on the respective button', async () => {
          await button.trigger('pointerup');

          expect(panel.isVisible()).toBe(true);

          await button.trigger('focus');
          await button.trigger('keydown', { code: 'Enter' });

          expect(panel.isVisible()).toBe(false);
        })
      })

      describe('Focus Movement', () => {
        it('should move focus to the last button when "End" is pressed', async () => {
          const lastButton = wrapper.findAll('.accordion-button').at(2);

          await button.trigger('focus');
          await button.trigger('keydown', { code: 'End' });

          expect(lastButton.element).toBe(document.activeElement);
        })

        it('should move focus to the first button when "Home" is pressed', async () => {
          const lastButton = wrapper.findAll('.accordion-button').at(2);

          await lastButton.trigger('focus');
          await lastButton.trigger('keydown', { code: 'Home' });

          expect(button.element).toBe(document.activeElement);
        })

        it('should move focus to the next button when "ArrowDown" is pressed', async () => {

          const secondButton = wrapper.findAll('.accordion-button').at(1);

          await button.trigger('focus');
          await button.trigger('keydown', { code: 'ArrowDown' });

          expect(secondButton.element).toBe(document.activeElement);
        })

        it('should move focus to the previous button when "ArrowUp" is pressed', async () => {
          const secondButton = wrapper.findAll('.accordion-button').at(1);

          await secondButton.trigger('focus');
          await secondButton.trigger('keydown', { code: 'ArrowUp' });

          expect(button.element).toBe(document.activeElement);
        })
      })
    })

    describe('a11y', () => {
      it('should have the correct aria attributes', () => {
        expect(button.attributes('aria-expanded')).toBe('false');
        expect(panel.attributes('hidden')).toBeDefined();
      })

      it('should update the aria attributes when the panel is shown', async () => {
        await button.trigger('pointerup');

        expect(button.attributes('aria-expanded')).toBe('true');
        expect(panel.attributes('hidden')).not.toBeDefined();
      })
    })
  })
})
