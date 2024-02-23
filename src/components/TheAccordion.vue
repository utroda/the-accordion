<template>
  <div 
    class="accordion-group"
    ref="accordionGroupEl"
    data-test-id="accordion-group"
  >
    <div 
      class="accordion"
      v-for="(section, index) in sections"
      :key="section.slug"
    >
      <component
        class="accordion-heading"
        :is="headingAs"
      >
        <button 
          class="accordion-button"
          type="button"
          :id="`${section.slug}-heading`"
          :aria-expanded="currentExpandedIndex === index"
          :aria-controls="section.slug"
          @keydown="handleKeyUp"
          @focus="handleFocusIn"
          @pointerup="toggleSelectedPanel(index)"
        >
          <slot :name="`${section.slug}-heading`">
            {{ section.heading }}
          </slot>
        </button>
      </component>

      <div 
        class="accordion-panel"
        role="region"
        :aria-labelledby="`${section.slug}-heading`"
        :hidden="currentExpandedIndex !== index" 
        :id="section.slug"
        v-show="currentExpandedIndex === index"
      >
        <slot :name="`${section.slug}-content`">
          {{ section.content }}
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue'

  const props = defineProps({
    sections: { type: Array, required: true },
    headingAs: { type: String, default: 'h3' },
    initialOpen: { type: String },
  })

  const accordionGroupEl = ref(null)
  const buttonArray = ref([]) // Nodelist
  const currentFocusedIndex = ref(0)
  const currentExpandedIndex = ref(-1)

  const nextIndex = computed(() => {
    return currentFocusedIndex.value === buttonArray.value.length - 1
      ? 0
      : currentFocusedIndex.value + 1
  });

  const prevIndex = computed(() => {
    return currentFocusedIndex.value === 0
      ? buttonArray.value.length - 1
      : currentFocusedIndex.value - 1
  });

  const handleFocusIn = (event) => {
    currentFocusedIndex.value = Array.prototype.indexOf.call(buttonArray.value, event.target);
  }

  const toggleSelectedPanel = (index) => {
    currentExpandedIndex.value = currentExpandedIndex.value === index ? -1 : index;
  }

  const handleKeyUp = (event) => {
    if (currentFocusedIndex.value === -1) return;

    const { code } = event;

    switch (code) {
      case 'Home':
        event.preventDefault();
        buttonArray.value[0].focus();
        currentFocusedIndex.value = 0;
      break;
      case 'End':
        event.preventDefault();
        buttonArray.value[buttonArray.value.length - 1].focus();
        currentFocusedIndex.value = buttonArray.value.length - 1;
      break;
      case 'ArrowUp':
      case 'Up':
        event.preventDefault();
        buttonArray.value[prevIndex.value].focus();
      break;
      case 'ArrowDown':
      case 'Down':
        event.preventDefault();
        buttonArray.value[nextIndex.value].focus();
      break;
      case 'Space':
      case 'Enter':
        event.preventDefault();
        toggleSelectedPanel(currentFocusedIndex.value);
    }
  }

  onMounted(() => {
    buttonArray.value = accordionGroupEl.value?.querySelectorAll('.accordion-button')

    if(props.initialOpen !== undefined) {
      const index = props.sections.findIndex(section => section.slug === props.initialOpen)
      if(index !== -1) {
        toggleSelectedPanel(index)
      }
    }
  });
</script>
